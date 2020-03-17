# google-analaytics-and-ads-to-cloud-storage
This app gets data from Google Analytics API, writes it into NDJSON file and uploads to Google Cloud Storage. The Cloud Storage files are then connected to Google BigQuery as an external table and used in Google Data Studio for Reporting. The native Google Analytics connector in Data Studio does not support including data from more than one view. This app helps you look at all your Google Analytics and Google Ads views as one portfolio,