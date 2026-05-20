import React, { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import ToolBar from './components/ToolBar';

function App() {
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  
  // 트레이싱(밑그림) 모드 켜기/끄기 상태 추가
  const [isTracing, setIsTracing] = useState(false);

  const handleUndo = () => {
    if (lines.length === 0) return;
    const newLines = [...lines];
    const poppedLine = newLines.pop();
    setRedoLines([...redoLines, poppedLine]);
    setLines(newLines);
  };

  const handleRedo = () => {
    if (redoLines.length === 0) return;
    const newRedo = [...redoLines];
    const poppedRedo = newRedo.pop();
    setLines([...lines, poppedRedo]);
    setRedoLines(newRedo);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} 
          lines={lines} setLines={setLines} setRedoLines={setRedoLines} 
          isTracing={isTracing} // 캔버스에 상태 전달
        />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={lines.length > 0} canRedo={redoLines.length > 0}
        isTracing={isTracing} setIsTracing={setIsTracing} // 툴바에 상태 전달
      />
    </div>
  );
}

export default App;