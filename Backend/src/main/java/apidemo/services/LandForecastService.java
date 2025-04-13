package apidemo.services;

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

@Service
@Slf4j
public class LandForecastService {

  private MinMaxParams scalerParams;
  private final Set<String> availableDistricts = new HashSet<>();
  private final String scalerPath = "predict_scaler_params.csv";
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

  public ForecastResponse generateForecast(String district, int periodDays) {
    log.info("Generating forecast for district={}, periodDays={}", district, periodDays);

    if (!isDistrictAvailable(district)) {
      log.warn("District not available: {}", district);
      throw new IllegalArgumentException("District not available: " + district);
    }

    try {
      String minVal = String.valueOf(scalerParams.getMinValue());
      String maxVal = String.valueOf(scalerParams.getMaxValue());

      ProcessBuilder processBuilder = new ProcessBuilder(
          "python",
          pythonScriptPath,
          "--district", district,
          "--periods", String.valueOf(periodDays),
          "--min-val", minVal,
          "--max-val", maxVal);

      // Set working directory to script location
      Path scriptDir = Paths.get(pythonScriptPath).getParent();
      processBuilder.directory(scriptDir.toFile());

      processBuilder.redirectErrorStream(true);

      log.debug("Executing command: {}", processBuilder.command());

      Process process = processBuilder.start();

      // Read output
      StringBuilder output = new StringBuilder();
      try (BufferedReader reader = new BufferedReader(
          new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
          output.append(line);
        }
      }

      int exitCode = process.waitFor();
      if (exitCode != 0) {
        throw new RuntimeException("Python script failed with exit code: " + exitCode);
      }

      return parsePythonResponse(output.toString(), district, periodDays);

    } catch (Exception e) {
      log.error("Error executing Python forecast script", e);
      throw new RuntimeException("Error generating forecast", e);
    }
  }

  private ForecastResponse parsePythonResponse(String rawResponse, String district, int periodDays) {
    try {
      String jsonResponse = extractJsonPart(rawResponse);

      ObjectMapper mapper = new ObjectMapper();
      mapper.registerModule(new JavaTimeModule());
      JsonNode root = mapper.readTree(jsonResponse);

      String responseDistrict = root.get("district").asText();
      if (!district.equals(responseDistrict)) {
        throw new RuntimeException("District mismatch. Requested: " + district + ", Response: " + responseDistrict);
      }

      List<PricePrediction> predictions = new ArrayList<>();
      JsonNode predictionsNode = root.get("predictions");
      for (JsonNode node : predictionsNode) {
        PricePrediction prediction = PricePrediction.builder()
            .date(LocalDate.parse(node.get("date").asText()))
            .district(node.get("district").asText())
            .predictedPrice(node.get("predictedPrice").asDouble())
            .minPrice(node.get("minPrice").asDouble())
            .maxPrice(node.get("maxPrice").asDouble())
            .build();
        predictions.add(prediction);
      }

      return ForecastResponse.builder()
          .district(district)
          .periodDays(periodDays)
          .predictions(predictions)
          .build();

    } catch (Exception e) {
      log.error("Error parsing response: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to parse forecast response", e);
    }
  }

  private String extractJsonPart(String rawResponse) {
    int jsonStart = rawResponse.indexOf('{');
    int jsonEnd = rawResponse.lastIndexOf('}') + 1;

    if (jsonStart < 0 || jsonEnd <= jsonStart) {
      throw new RuntimeException("Invalid response format - JSON not found");
    }

    return rawResponse.substring(jsonStart, jsonEnd);
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