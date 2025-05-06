import requests
import json

# Make the API call
response = requests.get("https://db.ygoprodeck.com/api/v7/cardinfo.php?id=12341234")

# Check if the response is OK
if response.status_code == 200:
    data = response.json()  # Parse response as JSON

    # Save to a .json file
    with open("output.json", "w") as f:
        json.dump(data, f, indent=4)
else:
    print("Failed to retrieve data:", response.status_code)