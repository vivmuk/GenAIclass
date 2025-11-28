import requests

# API URL and auth
url = "https://api.venice.ai/api/v1/models"
headers = {
    "Authorization": "Bearer ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC"
}

# Make the request
try:
    response = requests.get(url, headers=headers)
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}") 