import requests

# URL of your n8n webhook
url = "http://localhost:5678/webhook-test/ui-sdlc"

# Data you want to send
payload = {
    "trigger": "start_ui_workflow",
    "notes": "Test for UI SDLC workflow"
}

# Make POST request
response = requests.post(url, json=payload)

# Print response from n8n
print("Status code:", response.status_code)
print("Response body:", response.text)
