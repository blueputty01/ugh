import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import './index.css';

import Welcome from './Welcome';
import Camera from './Camera';
import Home from './Home';
import Feed from './Feed';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="home" element={<Home />} />
        <Route path="camera" element={<Camera />} />
        <Route path="profile" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
