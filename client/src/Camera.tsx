import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const videoConstraints = {
  width: 350,
  height: 550,
  facingMode: 'user',
};

const server = 'http://localhost:5000';

const DataURIToBlob = (dataURI: string) => {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
};

export default function Camera() {
  const [imgBase64, setImgBase64] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);
  const inputFileButton = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as Webcam).getScreenshot();
      setImgBase64(imageSrc ?? '');
    }
  }, [webcamRef]);

  const success = () => {
    nav('../home');
  };

  const sendImage = async () => {
    const file = DataURIToBlob(imgBase64);
    const data = new FormData();
    data.append('file', file, 'screenshot');
    const res = await axios.post(`${server}/api/upload`, data);
    if (res.status === 200) {
      setImgBase64('');
      console.log('Image uploaded successfully');
      success();
    }
  };

  const onFakeUploadClick = () => {
    (inputFileButton.current! as HTMLInputElement).click();
  };

  const onFileUpload = async (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files![0];

    const data = new FormData();
    data.append('file', selectedFile, selectedFile.name);

    const res = await axios.post(`${server}/api/upload`, data);
    success();
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {imgBase64 === '' ? (
          <Webcam
            audio={false}
            height={550}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={350}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={imgBase64} alt="" />
        )}
      </div>
      <div className="ImageCam">
        {imgBase64 !== '' ? (
          <div>
            <button
              type="submit"
              color="secondary"
              onClick={() => {
                setImgBase64('');
              }}
              className="webcam-btn"
            >
              Retake Image
            </button>
            <button onClick={sendImage} type="submit" className="webcam-btn">
              Submit Image
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              columnGap: '1rem',
            }}
          >
            <button
              type="submit"
              color="secondary"
              onClick={capture}
              className="webcam-btn"
            >
              Capture
            </button>
            <button
              type="submit"
              color="secondary"
              onClick={onFakeUploadClick}
              className="webcam-btn"
            >
              Upload
            </button>
            <input
              type="file"
              id="file"
              ref={inputFileButton}
              style={{ display: 'none' }}
              onChange={onFileUpload}
              accept=".jpeg,.jpg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
