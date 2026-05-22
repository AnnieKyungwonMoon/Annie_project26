import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasBoard from '../components/CanvasBoard';
import ToolBar from '../components/ToolBar';
import { STAGES } from './Home';

const DrawPage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  
  const stageData = STAGES.find(s => s.id === stageId);
  const isFreeMode = stageId === 'free';
  
  const [isTracing, setIsTracing] = useState(!isFreeMode); 
  const [tracingImage, setTracingImage] = useState(stageData?.image || null);
  
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

  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 }); 
    const link = document.createElement('a');
    link.download = 'my_artwork.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setTracingImage(imageUrl);
    setIsTracing(true); 
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} 
          lines={lines} setLines={setLines} setRedoLines={setRedoLines} 
          isTracing={isTracing}
          stageRef={stageRef}
          tracingImage={tracingImage}
        />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={lines.length > 0} canRedo={redoLines.length > 0}
        isTracing={isTracing} setIsTracing={setIsTracing}
        handleDownload={handleDownload}
        isFreeMode={isFreeMode}
        handleImageUpload={handleImageUpload}
        goHome={goHome}
      />
    </div>
  );
};

export default DrawPage;
