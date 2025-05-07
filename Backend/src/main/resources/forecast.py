import argparse
import json
import pickle
import sys
import numpy as np
from datetime import datetime, timedelta

def log_message(message):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")
    sys.stdout.flush()

def convert_numpy(obj):
    if isinstance(obj, np.generic):
        return obj.item()  # convert float32/int32 -> float/int
    raise TypeError(f"Type {type(obj)} not serializable")

def get_mapping_value(mapping, id, default):
    return mapping.get(id, default)

def get_land_characteristics(ids):
    id_map = {
        1: "1 Part Residential",
        2: "All Residential",
        3: "Back Expansion",
        4: "Car Alley",
        5: "Frontage",
        6: "No Residential"
    }
    return {v: 1 if i in ids else 0 for i, v in id_map.items()}

def create_time_features(dates):
    return [{
        "year": d.year, "month": d.month, "day": d.day,
        "dayofweek": d.weekday(), "quarter": (d.month - 1)//3 + 1,
        "month_sin": np.sin(2 * np.pi * d.month/12),
        "month_cos": np.cos(2 * np.pi * d.month/12),
        "dayOfWeek_sin": np.sin(2 * np.pi * d.weekday()/7),
        "dayOfWeek_cos": np.cos(2 * np.pi * d.weekday()/7)
    } for d in dates]

def create_property_features(property_data, district):
    directions = ["EAST", "NORTH", "NORTHEAST", "NORTHWEST", "SOUTH", "SOUTHEAST", "SOUTHWEST", "WEST"]
    furnishing = ["HIGH_END_FURNITURE", "FULLY_FURNISHED", "BASIC_FINISHING", "RAW_HANDOVER"]
    landTypes = ["RESIDENTIAL_LAND", "PROJECT_LAND", "INDUSTRIAL_LAND", "AGRICULTURAL_LAND"]
    districts = ["Huyện Hòa Vang", "Quận Cẩm Lệ", "Quận Hải Châu", "Quận Liên Chiểu",
                "Quận Ngũ Hành Sơn", "Quận Sơn Trà", "Quận Thanh Khê"]
    
    feat = {
        "Width": property_data.get("width", 5),
        "Length": property_data.get("length", 20),
        "Floors": property_data.get("floors", 0),
        "Rooms": property_data.get("rooms", 0),
        "Toilets": property_data.get("toilets", 0),
        **get_land_characteristics(property_data.get("landCharacteristics", [])),
        "Category_HOUSE": 1 if property_data.get("categoryId", 2) == 1 else 0,
        "Category_LAND": 1 if property_data.get("categoryId", 2) == 2 else 0,
        **{f"District_{d}": 1 if d == district else 0 for d in districts},
        **{f"House Direction_{d}": 1 if d == directions[property_data.get("directionId", 3)-1] else 0
          for d in directions},
        **{f"Furnishing Sell_{f}": 1 if f == furnishing[property_data.get("furnishingId", 3)-1] else 0
          for f in furnishing},
        **{f"Land Type_{l}": 1 if l == landTypes[property_data.get("landTypeId", 3)-1] else 0
          for l in landTypes}
    }
    return feat

def generate_forecast(model, feature_columns, periods, property_data, district):
    dates = [datetime.now() + timedelta(days=i) for i in range(periods)]
    p_feats = create_property_features(property_data, district)
    
    Xf = []
    for tf in create_time_features(dates):
        feature_row = [tf.get(c, p_feats.get(c, 0)) for c in feature_columns]
        Xf.append(feature_row)
    
    preds = [round(np.expm1(p), 6) for p in model.predict(Xf)]
    return {"predictions": [{"date": d.strftime("%Y-%m-%d"), "predictedPrice": p} 
                          for d, p in zip(dates, preds)]}

def main():
    parser = argparse.ArgumentParser(description="Generate real-estate price forecast")
    parser.add_argument("--periods", type=int, required=True)
    parser.add_argument("--model", type=str, required=True)
    parser.add_argument("--district", type=str, required=True)
    parser.add_argument("--width", type=float, default=5.0)
    parser.add_argument("--length", type=float, default=20.0)
    parser.add_argument("--floors", type=int, default=0)
    parser.add_argument("--rooms", type=int, default=0)
    parser.add_argument("--toilets", type=int, default=0)
    parser.add_argument("--land-characteristics", type=str, default="")
    parser.add_argument("--category-id", type=int, default=2)
    parser.add_argument("--land-type-id", type=int, default=2)
    parser.add_argument("--direction-id", type=int, default=3)
    parser.add_argument("--furnishing-id", type=int, default=3)
    
    args = parser.parse_args()
    
    prop = {
        "width": args.width, "length": args.length, "floors": args.floors,
        "rooms": args.rooms, "toilets": args.toilets, "categoryId": args.category_id,
        "directionId": args.direction_id, "furnishingId": args.furnishing_id, "landTypeId": args.land_type_id,
        "landCharacteristics": [int(x) for x in args.land_characteristics.split(",") if x.strip()]
    }
    
    try:
        with open(args.model, "rb") as f:
            model_data = pickle.load(f)
            
        if isinstance(model_data, dict) and args.district in model_data:
            model_info = model_data[args.district]
            model, feature_columns = model_info["model"], model_info["feature_columns"]
        else:
            model = model_data
            feature_columns = ["Width", "Length", "Floors", "Rooms", "Toilets",
                "1 Part Residential", "All Residential", "Back Expansion", "Car Alley", "Frontage", "No Residential",
                "Category_HOUSE", "Category_LAND", *[f"District_{d}" for d in [
                    "Huyện Hòa Vang", "Quận Cẩm Lệ", "Quận Hải Châu", "Quận Liên Chiểu",
                    "Quận Ngũ Hành Sơn", "Quận Sơn Trà", "Quận Thanh Khê"]],
                *[f"House Direction_{d}" for d in [
                    "EAST", "NORTH", "NORTHEAST", "NORTHWEST", "SOUTH", "SOUTHEAST", "SOUTHWEST", "WEST"]],
                *[f"Furnishing Sell_{f}" for f in [
                    "BASIC_FINISHING", "FULLY_FURNISHED", "HIGH_END_FURNITURE", "RAW_HANDOVER"]],
                *[f"Land Type_{l}" for l in [
                    "AGRICULTURAL_LAND", "INDUSTRIAL_LAND", "PROJECT_LAND", "RESIDENTIAL_LAND"]],
                "year", "month", "day", "dayofweek", "quarter", "month_sin", "month_cos", "dayOfWeek_sin", "dayOfWeek_cos"]
            
        result = generate_forecast(model, feature_columns, args.periods, prop, args.district)
        print(json.dumps(result, ensure_ascii=False, default=convert_numpy))
        
    except Exception as e:
        log_message(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
