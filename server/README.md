# UGH Server

## ⚡ Setup

1. `npm install` to install dependencies
2. `npm run dev` to start server.

## ❓ General

## 📑 Documentation

Server starts on `localhost:5000`. Create .env file holding API_KEY and QUEUE_ID for ButlerLabs API

### Uploading receipt for OCR

`POST` request to `/api/upload` File in request body must be `file` and be accepted mimetype `['image/jpeg', 'image/png', 'application/pdf']`

### ⚙️ Technologies Used

- Express
- ButlerLabs API