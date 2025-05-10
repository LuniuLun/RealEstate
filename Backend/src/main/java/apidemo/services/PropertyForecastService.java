package apidemo.services;

import apidemo.models.ForecastRequest;
import apidemo.models.ForecastResponse;
import apidemo.models.PricePrediction;
import apidemo.utils.ForecastPropertyFieldConverter;
import apidemo.utils.LogTransform;
import org.jpmml.evaluator.Evaluator;
import org.jpmml.evaluator.LoadingModelEvaluatorBuilder;
import org.jpmml.evaluator.EvaluatorUtil;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.*;

@Service
public class PropertyForecastService {
  private final Evaluator modelEvaluator;
  private final LogTransform logTransform = new LogTransform();

  public PropertyForecastService() {
    try {
      File pmml = new File(getClass()
          .getClassLoader()
          .getResource("random_forest_final_model.pmml")
          .toURI());
      this.modelEvaluator = new LoadingModelEvaluatorBuilder()
          .load(pmml)
          .build();
      this.modelEvaluator.verify();
    } catch (Exception ex) {
      throw new RuntimeException("Initialization of PropertyForecastService failed", ex);
    }
  }

  public ForecastResponse generateForecast(ForecastRequest request) {
    List<Map<String, Object>> featureVectors = ForecastPropertyFieldConverter.createForecastFeatures(request,
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

    // if (y instanceof Map) {
    // @SuppressWarnings("unchecked")
    // Map<String, ?> m = (Map<String, ?>) y;
    // Object candidate = null;
    // if (m.containsKey("value")) {
    // candidate = m.get("value");
    // } else if (m.containsKey("result")) {
    // candidate = m.get("result");
    // }
    // if (candidate instanceof Number) {
    // return ((Number) candidate).doubleValue();
    // }
    // }

    throw new IllegalStateException("Không thể lấy được giá trị dự đoán từ: " + decoded);
  }

}
