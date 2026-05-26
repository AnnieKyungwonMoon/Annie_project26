import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasBoard from '../components/CanvasBoard';
import SidePanel from '../components/SidePanel';
import { STAGES } from './Home';

const DrawPage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState(null); // 커스텀 배경 이미지 URL
  const [opacity, setOpacity] = useState(1.0); // 브러시 투명도 상태 추가 (기본값: 1.0)
  
  // 다중 레이어 상태 추가
  const [layers, setLayers] = useState([
    { id: 1, name: '레이어 1', visible: true, lines: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState(1);
  
  const stageData = STAGES.find(s => s.id === stageId);
  const isFreeMode = stageId === 'free';
  
  const [isTracing, setIsTracing] = useState(!isFreeMode); 
  const [tracingImage, setTracingImage] = useState(stageData?.image || null);
  const [isGrid, setIsGrid] = useState(false); // 보조선 토글 상태 추가
  
  const stageRef = useRef(null);

  // Undo/Redo는 레이어 시스템 리팩토링 중 잠시 비활성화
  const handleUndo = () => {};
  const handleRedo = () => {};

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
      setLayers(layers.map(l => ({ ...l, lines: [] })));
    }
  };

  // 레이어 추가 핸들러
  const handleAddLayer = () => {
    const nextId = layers.length > 0 ? Math.max(...layers.map(l => l.id)) + 1 : 1;
    const newLayer = {
      id: nextId,
      name: `레이어 ${nextId}`,
      visible: true,
      lines: []
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(nextId);
  };

  // 레이어 가시성 토글 핸들러
  const handleToggleLayerVisibility = (id) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  // 레이어 삭제 핸들러
  const handleDeleteLayer = (id) => {
    if (layers.length <= 1) {
      alert("최소 하나의 레이어는 존재해야 합니다.");
      return;
    }
    if (window.confirm("선택하신 레이어를 삭제하시겠습니까?")) {
      const newLayers = layers.filter(l => l.id !== id);
      setLayers(newLayers);
      if (activeLayerId === id) {
        setActiveLayerId(newLayers[newLayers.length - 1].id);
      }
    }
  };

  // 레이어 선택 핸들러
  const handleSelectLayer = (id) => {
    setActiveLayerId(id);
  };

  // 레이어 이름 변경 핸들러
  const handleRenameLayer = (id) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    const newName = window.prompt("새로운 레이어 이름을 입력하세요:", layer.name);
    if (newName && newName.trim() !== "") {
      setLayers(layers.map(l => l.id === id ? { ...l, name: newName.trim() } : l));
    }
  };

  // 레이어 위로 이동 (배열에서 index -> index + 1)
  const handleMoveLayerUp = (index) => {
    if (index >= layers.length - 1) return; // 이미 맨 위
    const newLayers = [...layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index + 1];
    newLayers[index + 1] = temp;
    setLayers(newLayers);
  };

  // 레이어 아래로 이동 (배열에서 index -> index - 1)
  const handleMoveLayerDown = (index) => {
    if (index <= 0) return; // 이미 맨 아래
    const newLayers = [...layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index - 1];
    newLayers[index - 1] = temp;
    setLayers(newLayers);
  };

  const goHome = () => {
    navigate('/');
  };

  // 레이어에 그려진 선이 있는지 체크 (전체삭제 비활성화 제어용)
  const hasAnyLines = layers.some(l => l.lines.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1 }}>
        <CanvasBoard 
          strokeWidth={strokeWidth} tool={tool} color={color} bgColor={bgColor}
          bgImageUrl={bgImageUrl} opacity={opacity}
          layers={layers} setLayers={setLayers} activeLayerId={activeLayerId}
          isTracing={isTracing}
          isGrid={isGrid}
          stageRef={stageRef}
          tracingImage={tracingImage}
        />
      </div>
      <SidePanel 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        bgColor={bgColor} setBgColor={setBgColor}
        opacity={opacity} setOpacity={setOpacity}
        handleUndo={handleUndo} handleRedo={handleRedo}
        canUndo={false} canRedo={false} // Undo/Redo 임시 비활성화
        isTracing={isTracing} setIsTracing={setIsTracing}
        isGrid={isGrid} setIsGrid={setIsGrid}
        handleDownload={handleDownload}
        isFreeMode={isFreeMode}
        handleImageUpload={handleImageUpload}
        handleBgImageUpload={handleBgImageUpload}
        bgImageUrl={bgImageUrl}
        handleRemoveBgImage={handleRemoveBgImage}
        handleBgColorReset={handleBgColorReset}
        handleClearAll={handleClearAll}
        
        // 레이어 관련 상태 및 핸들러 전달
        layers={layers}
        activeLayerId={activeLayerId}
        handleAddLayer={handleAddLayer}
        handleToggleLayerVisibility={handleToggleLayerVisibility}
        handleDeleteLayer={handleDeleteLayer}
        handleSelectLayer={handleSelectLayer}
        handleRenameLayer={handleRenameLayer}
        handleMoveLayerUp={handleMoveLayerUp}
        handleMoveLayerDown={handleMoveLayerDown}
        hasAnyLines={hasAnyLines}
        
        goHome={goHome}
      />
    </div>
  );
};

export default DrawPage;
