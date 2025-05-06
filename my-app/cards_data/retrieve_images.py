import requests

ids_path = "my-app/cards_data/ids_2025_05_02.txt"

with open(ids_path, "r") as file:
    for line in file:
        card_id = line.strip()
        response = requests.get(f"https://images.ygoprodeck.com/images/cards/{card_id}.jpg")

        if response.status_code == 200:
            with open(f"images/{card_id}.jpg", "wb") as f:
                f.write(response.content)
            print(f"Image for card ID {card_id} saved successfully.")
        else:
            print(f"Failed to download image for card ID {card_id}: {response.status_code}")