import requests
import os
import json

def extract_ids_from_json(json_obj):
    """Extracts all 'id' values from the 'data' array in a JSON object."""
    return [item["id"] for item in json_obj.get("data", []) if "id" in item]

data_file = "my-app\cards_data\data_2025_05_02.json"
with open(data_file, "r") as f:
    data = json.load(f)
    ids = extract_ids_from_json(data)

output_file = "my-app/cards_data/ids_2025_05_02.txt"
with open(output_file, "w") as f:
    for card_id in ids:
        f.write(f"{card_id}\n")


