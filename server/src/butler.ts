const fs = require('fs');
const dotenv = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');

import type { File, ExtractionResult } from './types';

const apiBaseUrl = 'https://app.butlerlabs.ai/api';
dotenv.config();
const apiKey = process.env.API_KEY;
const queueId = process.env.QUEUE_ID;
const authHeaders = {
  Authorization: `Bearer ${apiKey}`,
};
const queueUrl = `${apiBaseUrl}/queues/${queueId}`;
const uploadUrl = `${queueUrl}/uploads`;
const extractionResultsUrl = `${queueUrl}/extraction_results`;

const uploadFiles = async (file: File) => {
  const formData = new FormData();
  formData.append('files', fs.createReadStream(file.path), {
    contentType: file.mimetype,
    filename: file.originalname,
  });

  const uploadResponse = await axios
    .post(uploadUrl, formData, {
      headers: {
        ...authHeaders,
        ...formData.getHeaders(),
      },
    })
    .catch((err: any) => console.log(err));

  // Return the Upload ID
  return uploadResponse.data.uploadId;
};

const getExtractionResults = async (
  uploadId: string
): Promise<ExtractionResult | undefined> => {
  const requestParams = { uploadId };

  const sleep = (waitTimeInMs: number) =>
    new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

  let extractionResults = null;
  while (!extractionResults) {
    console.log('Fetching extraction results');
    const resultApiResponse = await axios.get(extractionResultsUrl, {
      headers: { ...authHeaders },
      params: requestParams,
    });

    const firstDocument = resultApiResponse.data.items[0];
    const extractionStatus = firstDocument.documentStatus;
    if (extractionStatus !== 'Completed') {
      const seconds = 5;
      console.log(`Extraction still in progress; trying again in ${seconds}`);
      await sleep(seconds * 1000);
    } else {
      console.log('Extraction results ready');
      return resultApiResponse.data as ExtractionResult;
    }
  }
};

const getPrediction = async (file: File) => {
  const accepted = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!accepted.includes(file.mimetype)) {
    return null;
  }
  const uploadId = await uploadFiles(file);
  console.log(`Upload id: ${uploadId}`);
  return await getExtractionResults(uploadId);
};

module.exports = { getPrediction };
