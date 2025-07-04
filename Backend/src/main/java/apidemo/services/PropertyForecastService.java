package apidemo.services;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.models.PricePrediction;
import apidemo.utils.PropertyFieldConverter;
import jakarta.annotation.PostConstruct;
import apidemo.utils.FeatureRootTransform;

import org.jpmml.evaluator.Evaluator;
import org.jpmml.evaluator.EvaluatorUtil;
import org.jpmml.evaluator.LoadingModelEvaluatorBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
public class PropertyForecastService {

  private static final String MODEL_FILENAME = "forecast_model.pmml";

  private Evaluator modelEvaluator;
  private final FeatureRootTransform rootTransform = new FeatureRootTransform();

  @PostConstruct
  public void init() {
    try {
      ClassPathResource resource = new ClassPathResource(MODEL_FILENAME);
      if (!resource.exists()) {
        throw new RuntimeException("PMML model file not found in resources: " + MODEL_FILENAME);
      }

      try (var modelStream = resource.getInputStream()) {
        modelEvaluator = new LoadingModelEvaluatorBuilder()
            .load(modelStream)
            .build();

        modelEvaluator.verify();
      }

    } catch (IOException ex) {
      throw new RuntimeException("Failed to read PMML model file: " + ex.getMessage(), ex);
    } catch (Exception ex) {
      throw new RuntimeException("Failed to initialize PropertyForecastService: " + ex.getMessage(), ex);
    }
  }

  public ForecastResponse generateForecast(ForecastRequest request) {
    if (modelEvaluator == null) {
      throw new IllegalStateException("Model evaluator not initialized");
    }

    List<Map<String, Object>> featureVectors = PropertyFieldConverter.createForecastFeatures(
        request.getProperty(), request.getPeriodDays());
    List<PricePrediction> predictions = new ArrayList<>();
    LocalDate date = LocalDate.now();

    for (int i = 0; i < request.getPeriodDays(); i++, date = date.plusDays(1)) {
      Map<String, Object> raw = featureVectors.get(i);
      Map<String, Object> features = new HashMap<>();

      raw.forEach((k, v) -> features.put(k, v instanceof Number
          ? ((Number) v).doubleValue()
          : v));

      Map<String, ?> decoded = EvaluatorUtil.decodeAll(modelEvaluator.evaluate(features));

      Object y = decoded.get("y");
      double normalized = extractPredictedValue(y, decoded);

      double price = rootTransform.inverseTransform(normalized, 2);

      predictions.add(new PricePrediction(date, price));

      features.clear();
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