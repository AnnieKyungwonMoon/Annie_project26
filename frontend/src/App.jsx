import React, { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import ToolBar from './components/ToolBar';

function App() {
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  
  // 캔버스의 선 데이터를 App 단위에서 관리
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);

  const handleUndo = () => {
    if (lines.length === 0) return;
    const newLines = [...lines];
    const poppedLine = newLines.pop(); // 마지막 선 빼기
    setRedoLines([...redoLines, poppedLine]); // 복구 배열에 넣기
    setLines(newLines);
  };

  const handleRedo = () => {
    if (redoLines.length === 0) return;
    const newRedo = [...redoLines];
    const poppedRedo = newRedo.pop(); // 복구 배열에서 빼기
    setLines([...lines, poppedRedo]); // 다시 선 배열에 넣기
    setRedoLines(newRedo);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} 
          lines={lines} setLines={setLines} setRedoLines={setRedoLines} 
        />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={lines.length > 0} canRedo={redoLines.length > 0}
      />
    </div>
  );
}

export default App;