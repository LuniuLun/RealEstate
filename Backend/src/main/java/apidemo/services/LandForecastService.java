package apidemo.services;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.models.PricePrediction;
import apidemo.models.MinMaxParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class LandForecastService {

  private MinMaxParams scalerParams;
  private final Set<String> availableDistricts = new HashSet<>();
  private final String scalerPath = "forecast_scaler_params.csv";
  private String pythonScriptPath;

  @PostConstruct
  public void init() {
    try {
      this.scalerParams = loadMinMaxParams();
      loadPythonScriptPath();
      loadDistrictsFromFile();
    } catch (Exception e) {
      log.error("Failed to initialize XGBoost service", e);
      throw new RuntimeException("Failed to initialize XGBoost service", e);
    }
  }

  private void loadDistrictsFromFile() throws Exception {
    ClassPathResource resource = new ClassPathResource("districts.txt");
    try (InputStream is = resource.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
      String line;
      while ((line = reader.readLine()) != null) {
        availableDistricts.add(line.trim());
      }
    }
  }

  private void loadPythonScriptPath() throws Exception {
    try {
      ClassPathResource resource = new ClassPathResource("forecast.py");
      File scriptFile = resource.getFile();
      this.pythonScriptPath = scriptFile.getAbsolutePath();

      if (!scriptFile.exists()) {
        throw new FileNotFoundException("Python script not found at: " + pythonScriptPath);
      }

      scriptFile.setExecutable(true);

    } catch (Exception e) {
      log.error("Failed to load Python script", e);
      throw new RuntimeException("Failed to load Python script", e);
    }
  }

  public ForecastResponse generateForecast(ForecastRequest request) {
    log.info("Generating forecast for periodDays={}, with property details including district={}",
        request.getPeriodDays(), request.getDistrict());

    if (!isDistrictAvailable(request.getDistrict())) {
      log.warn("District not available: {}", request.getDistrict());
      throw new IllegalArgumentException("District not available: " + request.getDistrict());
    }

    try {
      String minVal = String.valueOf(scalerParams.getMinValue());
      String maxVal = String.valueOf(scalerParams.getMaxValue());
      String modelPath = "xgboost_final_model.pkl";

      List<String> command = new ArrayList<>();
      command.add("python");
      command.add(pythonScriptPath);
      command.add("--periods");
      command.add(String.valueOf(request.getPeriodDays()));
      command.add("--model");
      command.add(modelPath);
      command.add("--min-val");
      command.add(minVal);
      command.add("--max-val");
      command.add(maxVal);
      command.add("--district");
      command.add(request.getDistrict());

      command.add("--width");
      command.add(String.valueOf(request.getWidth()));
      command.add("--length");
      command.add(String.valueOf(request.getLength()));
      command.add("--floors");
      command.add(String.valueOf(request.getFloors()));
      command.add("--rooms");
      command.add(String.valueOf(request.getRooms()));
      command.add("--toilets");
      command.add(String.valueOf(request.getToilets()));

      // Xử lý danh sách landCharacteristics
      if (request.getLandCharacteristics() != null && !request.getLandCharacteristics().isEmpty()) {
        command.add("--land-characteristics");
        command.add(request.getLandCharacteristics().stream()
            .map(String::valueOf)
            .collect(Collectors.joining(",")));
      }

      command.add("--category-id");
      command.add(String.valueOf(request.getCategoryId()));
      command.add("--land-type-id");
      command.add(String.valueOf(request.getLandTypeId()));
      command.add("--direction-id");
      command.add(String.valueOf(request.getDirectionId()));
      command.add("--furnishing-id");
      command.add(String.valueOf(request.getFurnishingId()));

      ProcessBuilder pb = new ProcessBuilder(command);

      // đặt thư mục chạy script
      Path scriptDir = Paths.get(pythonScriptPath).getParent();
      pb.directory(scriptDir.toFile());
      pb.redirectErrorStream(true);

      log.debug("Executing command: {}", pb.command());
      Process proc = pb.start();

      StringBuilder output = new StringBuilder();
      try (BufferedReader r = new BufferedReader(new InputStreamReader(proc.getInputStream()))) {
        String line;
        while ((line = r.readLine()) != null) {
          output.append(line);
        }
      }

      int exit = proc.waitFor();
      if (exit != 0) {
        throw new RuntimeException("Python script failed (exit " + exit + "): " + output);
      }

      return parsePythonResponse(output.toString(), request.getDistrict(), request.getPeriodDays());

    } catch (Exception ex) {
      log.error("Error executing Python forecast script", ex);
      throw new RuntimeException("Error generating forecast", ex);
    }
  }

  private ForecastResponse parsePythonResponse(String rawResponse, String district, int periodDays) {
    try {
      String response = rawResponse.replace("'", "\"");
      String jsonResponse = extractJsonPart(response);
      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new JavaTimeModule());
      JsonNode root = mapper.readTree(jsonResponse);

      List<PricePrediction> predictions = new ArrayList<>();
      JsonNode predictionsNode = root.get("predictions");
      for (JsonNode node : predictionsNode) {
        PricePrediction prediction = PricePrediction.builder()
            .date(LocalDate.parse(node.get("date").asText()))
            .predictedPrice(node.get("predictedPrice").asDouble())
            .build();
        predictions.add(prediction);
      }

      return ForecastResponse.builder()
          .periodDays(periodDays)
          .predictions(predictions)
          .build();

    } catch (Exception e) {
      log.error("Error parsing response: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to parse forecast response", e);
    }
  }

  private String extractJsonPart(String rawResponse) {
    int predictionsStart = rawResponse.indexOf("{\"predictions\":");
    if (predictionsStart >= 0) {
      int predictionsEnd = rawResponse.lastIndexOf("}");
      if (predictionsEnd > predictionsStart) {
        return rawResponse.substring(predictionsStart, predictionsEnd + 1);
      }
    }

    throw new RuntimeException("Invalid response format - JSON not found");
  }

  private MinMaxParams loadMinMaxParams() throws Exception {
    ClassPathResource resource = new ClassPathResource(scalerPath);
    try (InputStream is = resource.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {

      // Skip header
      reader.readLine();

      double minValue = 0.0;
      double maxValue = 0.0;

      String line;
      while ((line = reader.readLine()) != null) {
        String[] parts = line.split(",");
        if (parts[0].trim().equalsIgnoreCase("min")) {
          minValue = Double.parseDouble(parts[1].trim());
        } else if (parts[0].trim().equalsIgnoreCase("max")) {
          maxValue = Double.parseDouble(parts[1].trim());
        }
      }

      log.info("Loaded scaler params - min: {}, max: {}", minValue, maxValue);
      MinMaxParams params = new MinMaxParams();
      params.setMinValue(minValue);
      params.setMaxValue(maxValue);
      return params;
    }
  }

  public boolean isDistrictAvailable(String district) {
    return availableDistricts.contains(district);
  }
}