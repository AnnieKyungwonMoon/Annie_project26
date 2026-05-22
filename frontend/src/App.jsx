import React, { useState, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import ToolBar from './components/ToolBar';

function App() {
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const [isTracing, setIsTracing] = useState(false);
  
  // 1. Konva Stage에 접근하기 위한 Ref 생성
  const stageRef = useRef(null);

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

  // 2. 다운로드 실행 함수 (고화질 pixelRatio 적용)
  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 }); 
    const link = document.createElement('a');
    link.download = 'my_artwork.png'; // 저장될 파일명
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} 
          lines={lines} setLines={setLines} setRedoLines={setRedoLines} 
          isTracing={isTracing}
          stageRef={stageRef} // 자식에게 Ref 전달
        />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={lines.length > 0} canRedo={redoLines.length > 0}
        isTracing={isTracing} setIsTracing={setIsTracing}
        handleDownload={handleDownload} // 다운로드 함수 전달
      />
    </div>
  );
}

export default App;