import json

data_file = "my-app\cards_data\data_2025_05_02.json"
cards = []

with open(data_file, "r") as f:
    data = json.load(f)
    for card in data["data"]:
        cards.append({"id": card["id"], "name": card["name"], "type": card["frameType"]})

output_file = "my-app\cards_data\card_data.json"

with open(output_file, "w") as f:
    json.dump({"data": cards}, f, indent=4)