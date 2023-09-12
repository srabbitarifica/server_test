import os
from azure.storage.blob import BlobServiceClient

# Replace with your actual connection string
connection_string = "DefaultEndpointsProtocol=https;AccountName=digitaldemand;AccountKey=2nTzl2aQPbBPYPzvJTZ6mQ392zRLpqSEjMfENUwCY+9qfsztpticZZIGEMLkpaemufyJbu1mvm1x+AStl/++/A==;EndpointSuffix=core.windows.net"

# Replace with your actual container name
container_name = "dashboard"
blob_name = "digital_demand.csv"  # Replace with the name of the file you want to download

try:
    # Create a BlobServiceClient using the connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Get the container client
    container_client = blob_service_client.get_container_client(container_name)

    # Get the blob client for the file you want to download
    blob_client = container_client.get_blob_client(blob_name)

    # Download the blob to a local file
    local_file_name = "downloaded_sample_file.csv"  # Replace with the name you want for the downloaded file
    with open(local_file_name, "wb") as local_file:
        download_stream = blob_client.download_blob()
        local_file.write(download_stream.readall())

    print(f"File downloaded successfully to: {local_file_name}")

except Exception as ex:
    print(f"An error occurred: {ex}")