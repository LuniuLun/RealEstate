package apidemo.services;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.models.PricePrediction;
import apidemo.utils.PropertyFieldConverter;
import apidemo.utils.LogTransform;
import org.jpmml.evaluator.Evaluator;
import org.jpmml.evaluator.EvaluatorUtil;
import org.jpmml.evaluator.LoadingModelEvaluatorBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.*;

@Service
public class PropertyForecastService {
  private static final Logger logger = LoggerFactory.getLogger(PropertyForecastService.class);

  private Evaluator modelEvaluator;
  private final LogTransform logTransform = new LogTransform();

  @Value("${model.volume.folder:/tmp/models/}")
  private String modelFolder;
  @Value("${model.forecast.url}")
  private String modelUrl;
  @Value("${model.forecast.filename:RF_forecast_model.pmml}")
  private String modelFilename;

  @PostConstruct
  public void init() {
    try {
      if (!modelFolder.endsWith("/")) {
        modelFolder += "/";
      }
      String modelLocalPath = modelFolder + modelFilename;
      File modelFile = new File(modelLocalPath);

      if (!modelFile.exists()) {
        logger.info("PMML model file not found locally, downloading from: {}", modelUrl);
        modelFile.getParentFile().mkdirs();

        try (InputStream in = new URL(modelUrl).openStream()) {
          Files.copy(in, modelFile.toPath());
        }

        logger.info("PMML model downloaded to: {}", modelFile.getAbsolutePath());
      } else {
        logger.info("PMML model file found locally at: {}", modelFile.getAbsolutePath());
      }

      modelEvaluator = new LoadingModelEvaluatorBuilder()
          .load(modelFile)
          .build();

      modelEvaluator.verify();

      logger.info("PMML model loaded successfully");

    } catch (Exception ex) {
      logger.error("Initialization of PropertyForecastService failed", ex);
      throw new RuntimeException(ex);
    }
  }

  public ForecastResponse generateForecast(ForecastRequest request) {
    List<Map<String, Object>> featureVectors = PropertyFieldConverter.createForecastFeatures(request.getProperty(),
        request.getPeriodDays());
    List<PricePrediction> predictions = new ArrayList<>();
    LocalDate date = LocalDate.now();

    for (int i = 0; i < request.getPeriodDays(); i++, date = date.plusDays(1)) {
      Map<String, ?> raw = featureVectors.get(i);
      Map<String, Object> features = new HashMap<>();
      raw.forEach((k, v) -> features.put(k, v instanceof Number
          ? ((Number) v).doubleValue()
          : v));

      Map<String, ?> decoded = EvaluatorUtil.decodeAll(modelEvaluator.evaluate(features));

      Object y = decoded.get("y");
      double normalized = extractPredictedValue(y, decoded);

      double price = logTransform.inverseTransform(normalized);

      predictions.add(new PricePrediction(date, price));
    }

    return new ForecastResponse(request.getPeriodDays(), predictions);
  }

  private double extractPredictedValue(Object y, Map<String, ?> decoded) {
    if (y instanceof Number) {
      return ((Number) y).doubleValue();
    }
    throw new IllegalStateException("Cannot extract predicted value from: " + decoded);
  }
}
