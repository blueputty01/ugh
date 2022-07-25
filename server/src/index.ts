const { exec } = require('child_process');
import express, { Request, Response } from 'express';
import path from 'path';
const fsExtra = require('fs-extra');
const cors = require('cors');
const multer = require('multer');

const butler = require('./butler');

import { ExtractionResult, File } from './types';
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

const runPython = (arg: string, req?: Request, res?: Response) => {
  const command = `python dbConnection.py ${arg}`;
  console.log(command);

  exec(
    command,
    {
      cwd: __dirname,
    },
    function (error: string, stdout: string, stderr: string) {
      if (error || stderr) {
        console.log(`Python error: ${error}`);
        console.log(`Python stderr: ${stderr}`);
        console.log(stdout);

        process.exit(1);
      }
      res?.send(stdout);
    }
  );
};

const getPrediction = async (req: Request, res: Response) => {
  const file = (req as MulterRequest).file;
  console.log(`Received file: ${file.originalname}`);
  const prediction = await butler.getPrediction(file);
  if (prediction === null) {
    console.log('File type not supported');
  }

  console.log(prediction);
  res.send(prediction);

  const data: { name: string; price: string; quantity: string }[] = [];

  const items: ExtractionResult = prediction.items[0];

  items.tables[0].rows.forEach(({ cells }) => {
    const name = cells.find((cell) => cell.columnName === 'Item Name');
    const price = cells.find((cell) => cell.columnName === 'Unit Price');
    const quantity = cells.find((cell) => cell.columnName === 'Quantity');

    data.push({
      name: name?.value ?? '',
      price: price?.value ?? '',
      quantity: quantity?.value ?? '',
    });
  });

  data.forEach((item) => {
    runPython(`--addProd ${item.name} ${item.price}`);
  });
};

app.post(
  '/api/upload',
  upload.single('file'),
  function (req: Request, res: Response) {
    getPrediction(req, res);
  }
);

app.get('/api/data', upload.single('file'), (req: Request, res: Response) =>
  runPython('print', req, res)
);

//handle production
if (process.env.NODE_ENV === 'production') {
  //static folder
  app.use(express.static(__dirname + '/public/'));
  //handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

app.listen(port, () => console.log(`server started on port ${port}`));
