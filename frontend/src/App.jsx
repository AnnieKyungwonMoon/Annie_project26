import React, { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import ToolBar from './components/ToolBar';

function App() {
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000'); // 색상 상태 추가

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard strokeWidth={strokeWidth} tool={tool} color={color} />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor} 
      />
    </div>
  );
}

export default App;