import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DrawPage from './pages/DrawPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw/:stageId" element={<DrawPage />} />
        <Route path="/draw/:stageId/:lectureId" element={<DrawPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;