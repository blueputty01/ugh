import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

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
  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as Webcam).getScreenshot();
      setImgBase64(imageSrc ?? '');
    }
  }, [webcamRef]);

  const sendImage = () => {
    const file = DataURIToBlob(imgBase64);
    const data = new FormData();
    data.append('file', file, 'screenshot');
    axios.post(`${server}/api/upload`, data);
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
          <button
            type="submit"
            color="secondary"
            onClick={capture}
            className="webcam-btn"
          >
            Capture
          </button>
        )}
      </div>
    </div>
  );
}
