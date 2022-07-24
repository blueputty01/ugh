import React, { useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 350,
  height: 550,
  facingMode: 'user',
};

export default function Camera() {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  });

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
