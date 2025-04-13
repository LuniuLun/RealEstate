import argparse
import json
import pickle
import os
import sys
import traceback
import time
from datetime import datetime, timedelta
import math

def log_message(message):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}", flush=True)

def create_time_features(dates):
    """Tạo các đặc trưng thời gian từ danh sách các ngày"""
    time_features = []
    for date in dates:
        year = date.year
        month = date.month
        day = date.day
        dayofweek = date.weekday()
        quarter = (month - 1) // 3 + 1
        dayofyear = date.timetuple().tm_yday
        is_weekend = 1 if dayofweek >= 5 else 0
        
        season_dict = {1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 3, 11: 3, 12: 3}
        season = season_dict.get(month, 0)
        
        min_date = datetime(2024, 1, 1)
        days_from_min = (date - min_date).days
        
        month_sin = math.sin(2 * math.pi * month / 12)
        month_cos = math.cos(2 * math.pi * month / 12)
        
        time_features.append({
            'year': year,
            'month': month,
            'day': day,
            'dayofweek': dayofweek,
            'quarter': quarter,
            'dayofyear': dayofyear,
            'is_weekend': is_weekend,
            'season': season,
            'days_from_min': days_from_min,
            'month_sin': month_sin,
            'month_cos': month_cos
        })
    
    return time_features

def create_lag_features(df):
    """Tạo các đặc trưng lag và rolling statistics"""
    lag_days = [7, 14, 30]
    rolling_windows = [7, 14, 30]
    lag_features = []
    
    for i in range(len(df)):
        features = {}
        for lag in lag_days:
            features[f'price_lag_{lag}'] = 0.0
        
        for window in rolling_windows:
            features[f'price_rolling_mean_{window}'] = 0.0
            features[f'price_rolling_std_{window}'] = 0.0
        
        features['price_diff_1'] = 0.0
        features['price_diff_7'] = 0.0
        features['price_pct_change_1'] = 0.0
        features['price_pct_change_7'] = 0.0
        
        lag_features.append(features)
    
    return lag_features

def inverse_min_max(predictions, min_val, max_val):
    """Chuyển đổi giá trị scale về giá gốc"""
    return [pred * (max_val - min_val) + min_val for pred in predictions]

def generate_forecast(model, feature_columns, district_name, periods, min_val, max_val):
    """Tạo dự báo cho số ngày cụ thể"""
    try:
        # Tạo danh sách ngày tương lai
        start_date = datetime.now()
        future_dates = [start_date + timedelta(days=i) for i in range(periods)]
        
        # Tạo các đặc trưng
        time_features = create_time_features(future_dates)
        lag_features = create_lag_features(time_features)
        
        # Kết hợp các đặc trưng
        X_future = []
        for i in range(len(future_dates)):
            feature_row = {**time_features[i], **lag_features[i]}
            X_future.append([feature_row[col] for col in feature_columns])
        
        # Dự báo
        predictions_scaled = model.predict(X_future)
        predictions = inverse_min_max(predictions_scaled, min_val, max_val)
        
        # Tạo kết quả
        result = {
            'district': district_name,
            'predictions': []
        }
        
        for date, pred in zip(future_dates, predictions):
            result['predictions'].append({
                'date': date.strftime('%Y-%m-%d'),
                'district': district_name,
                'predictedPrice': round(pred, 6),
                'minPrice': round(pred * 0.95, 6),
                'maxPrice': round(pred * 1.05, 6)
            })
        
        return result
    
    except Exception as e:
        log_message(f"ERROR in generate_forecast: {str(e)}")
        traceback.print_exc()
        return {"error": f"Forecast generation failed: {str(e)}"}

def main():
    log_message("Script started")
    
    try:
        # Xử lý tham số đầu vào
        parser = argparse.ArgumentParser(description='Dự báo giá bất động sản sử dụng XGBoost')
        parser.add_argument('--district', type=str, required=True, help='Tên quận cần dự báo')
        parser.add_argument('--periods', type=int, required=True, help='Số ngày dự báo')
        parser.add_argument('--model', type=str, default='district_xgboost_models.pkl', help='Đường dẫn đến file model')
        parser.add_argument('--min-val', type=float, required=True, help='Giá trị min scale')
        parser.add_argument('--max-val', type=float, required=True, help='Giá trị max scale')

        args = parser.parse_args()
        
        # Kiểm tra file tồn tại
        if not os.path.exists(args.model):
            raise FileNotFoundError(f"Model file not found: {args.model}")

        # Load model
        with open(args.model, 'rb') as f:
            district_models = pickle.load(f)
        
        if args.district not in district_models:
            raise ValueError(f"District not found: {args.district}")

        model_info = district_models[args.district]
        
        # Tạo dự báo
        forecast_result = generate_forecast(
            model_info['model'],
            model_info['feature_columns'],
            args.district,
            args.periods,
            args.min_val,
            args.max_val
        )
        
        print(json.dumps(forecast_result, ensure_ascii=False))


    except Exception as e:
        log_message(f"CRITICAL ERROR: {str(e)}")
        traceback.print_exc()
        print(json.dumps({"error": f"Critical error: {str(e)}"}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
