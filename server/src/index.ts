import express, { Request, Response } from 'express';
import path from 'path';
const fsExtra = require('fs-extra');
const cors = require('cors');
const multer = require('multer');

const butler = require('./butler');

import { File } from './types';
interface MulterRequest extends Request {
  file: File;
}

const port = process.env.PORT || 5000;
const tempDir = path.resolve(__dirname, '../temp');
fsExtra.emptyDirSync(tempDir);

const app = express();
const upload = multer({ dest: tempDir });

//Middleware
app.use(express.json());
app.use(cors());

const getPrediction = async (req: Request, res: Response) => {
  const file = (req as MulterRequest).file;
  console.log(`Received file: ${file.originalname}`);
  const prediction = await butler.getPrediction(file);
  if (prediction === null) {
    console.log('File type not supported');
  }
  console.log(prediction);
  res.send(prediction);
};

app.post(
  '/api/upload',
  upload.single('file'),
  function (req: Request, res: Response) {
    getPrediction(req, res);
  }
);

//handle production
if (process.env.NODE_ENV === 'production') {
  //static folder
  app.use(express.static(__dirname + '/public/'));
  //handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

app.listen(port, () => console.log(`server started on port ${port}`));
