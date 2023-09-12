import express from "express";
import csvParser from "csv-parser";
import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from 'stream';
import dotenv from 'dotenv';


dotenv.config();

const router = express.Router();

router.get("/data", async (req, res) => {
  const data = {
    id: [],
    keywords: [],
    dates: [],
    country: [],
    vl_value: [],
    gt_category: [],
  };

  const connectionString = process.env.AZURE_CONNECTION_STRING;
  const containerName = process.env.AZURE_CONTAINER_NAME;
  const blobName = process.env.AZURE_BLOB_NAME;

  // // Replace with your actual connection string
  // const connectionString = "DefaultEndpointsProtocol=https;AccountName=digitaldemand;AccountKey=2nTzl2aQPbBPYPzvJTZ6mQ392zRLpqSEjMfENUwCY+9qfsztpticZZIGEMLkpaemufyJbu1mvm1x+AStl/++/A==;EndpointSuffix=core.windows.net";

  // // Replace with your actual container name
  // const containerName = "dashboard";
  // const blobName = "digital_demand.csv";  // Replace with the name of the file you want to download

  try {
    // Create a BlobServiceClient using the connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Get the container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get the blob client for the file you want to download
    const blobClient = containerClient.getBlobClient(blobName);

    // Download the blob to a local file
    const downloadBlockBlobResponse = await blobClient.download(0);
    const blobData = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

    // Convert blobData to a stream
    const blobDataStream = Readable.from(blobData.toString());

    blobDataStream
      .pipe(csvParser())
      .on("data", (row) => {
        data.id.push(row.id);
        data.keywords.push(row.keyword);
        data.dates.push(row.date);
        data.country.push(row.country);
        data.vl_value.push(row.vl_value);
        data.gt_category.push(row.gt_category);
      })
      .on("end", () => {
        res.json({
          totalItems: data.id.length,
          data,
        });
      })
      .on("error", (err) => {
        // Handle any errors during CSV parsing or reading
        console.error("Error reading CSV:", err);
        res.status(500).json({ error: "Failed to read CSV data" });
      });

  } catch (ex) {
    console.log(`An error occurred: ${ex}`);
    res.status(500).json({ error: "Failed to download blob data" });
  }
});

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

export default router;



// import express from "express";
// import fs from "fs";
// import csvParser from "csv-parser";

// const router = express.Router();

// router.get("/data", (req, res) => {
//   const data = {
//     id: [],
//     keywords: [],
//     dates: [],
//     country: [],
//     vl_value: [],
//     gt_category: [],
//   };

//   fs.createReadStream("dd.csv")
//     .pipe(csvParser())
//     .on("data", (row) => {
//       data.id.push(row.id);
//       data.keywords.push(row.keyword);
//       data.dates.push(row.date);
//       data.country.push(row.country);
//       data.vl_value.push(row.vl_value);
//       data.gt_category.push(row.gt_category);
//     })
//     .on("end", () => {
//       res.json({
//         totalItems: data.id.length,
//         data,
//       });
//     })
//     .on("error", (err) => {
//       // Handle any errors during CSV parsing or reading
//       console.error("Error reading CSV:", err);
//       res.status(500).json({ error: "Failed to read CSV data" });
//     });
// });

// export default router;
