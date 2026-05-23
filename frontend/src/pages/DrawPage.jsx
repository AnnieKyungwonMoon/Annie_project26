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
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState(null); // 커스텀 배경 이미지 URL
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  
  const stageData = STAGES.find(s => s.id === stageId);
  const isFreeMode = stageId === 'free';
  
  const [isTracing, setIsTracing] = useState(!isFreeMode); 
  const [tracingImage, setTracingImage] = useState(stageData?.image || null);
  const [isGrid, setIsGrid] = useState(false); // 보조선 토글 상태 추가
  
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
    
    const stage = stageRef.current;
    const gridGroup = stage.findOne('#gridGroup');
    if (gridGroup) gridGroup.hide();

    const uri = stage.toDataURL({ pixelRatio: 2 }); 

    if (gridGroup) gridGroup.show();

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

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setBgImageUrl(imageUrl);
  };

  const handleRemoveBgImage = () => {
    setBgImageUrl(null);
  };

  const handleBgColorReset = () => {
    setBgColor('#ffffff');
  };

  const handleClearAll = () => {
    if (window.confirm("그려진 모든 그림을 지우시겠습니까?")) {
      setLines([]);
      setRedoLines([]);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} bgColor={bgColor}
          bgImageUrl={bgImageUrl}
          lines={lines} setLines={setLines} setRedoLines={setRedoLines} 
          isTracing={isTracing}
          isGrid={isGrid} // 캔버스에 보조선 상태 전달
          stageRef={stageRef}
          tracingImage={tracingImage}
        />
      </div>
      <ToolBar 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        bgColor={bgColor} setBgColor={setBgColor}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={lines.length > 0} canRedo={redoLines.length > 0}
        isTracing={isTracing} setIsTracing={setIsTracing}
        isGrid={isGrid} setIsGrid={setIsGrid} // 툴바에 보조선 제어 전달
        handleDownload={handleDownload}
        isFreeMode={isFreeMode}
        handleImageUpload={handleImageUpload}
        handleBgImageUpload={handleBgImageUpload}
        bgImageUrl={bgImageUrl}
        handleRemoveBgImage={handleRemoveBgImage}
        handleBgColorReset={handleBgColorReset}
        handleClearAll={handleClearAll}
        goHome={goHome}
      />
    </div>
  );
};

export default DrawPage;
