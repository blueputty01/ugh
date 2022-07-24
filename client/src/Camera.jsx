import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios'

const videoConstraints = {
  width: 350,
  height: 550,
  facingMode: 'user',
};

export default function Camera() {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);
  let imageSrc = '';

  const capture = React.useCallback(() => {
    imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  });
  function sendImage() {
    axios.post("/api/upload", imageSrc);
  }

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image === '' ? (
          <Webcam
            audio={false}
            height={550}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={350}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} alt="" />
        )}
      </div>
      <div className="ImageCam">
        {image !== '' ? (
          <div >
            <button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setImage('');
              }}
              className="webcam-btn"
            >
              Retake Image
            </button>
            <button onClick={sendImage} type="submit" className="webcam-btn">Submit Image</button>
          </div>  
        ) : (
          <button
            type="submit"
            variant="contained"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="webcam-btn"
          >
            Capture
          </button>
        )}
      </div>
    </div>
  );
}
