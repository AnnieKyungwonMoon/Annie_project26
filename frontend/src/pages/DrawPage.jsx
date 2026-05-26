import React, { useState, useRef, useEffect } from 'react';
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
  
  // 다중 레이어 상태
  const [layers, setLayers] = useState([
    { id: 1, name: '레이어 1', visible: true, lines: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState(1);

  // 실행 취소/다시 실행을 위한 통합 스냅샷 히스토리 상태 (레이어 배열 + 활성 레이어 ID)
  const [historyState, setHistoryState] = useState({
    history: [{
      layers: [{ id: 1, name: '레이어 1', visible: true, lines: [] }],
      activeLayerId: 1
    }],
    step: 0
  });

  // 비동기 드로잉 이벤트 핸들러에서 stale closure 방지를 위한 Ref
  const layersRef = useRef(layers);
  layersRef.current = layers;
  
  const activeLayerIdRef = useRef(activeLayerId);
  activeLayerIdRef.current = activeLayerId;

  const stageData = STAGES.find(s => s.id === stageId);
  const isFreeMode = stageId === 'free';
  
  const [isTracing, setIsTracing] = useState(!isFreeMode); 
  const [tracingImage, setTracingImage] = useState(stageData?.image || null);
  const [isGrid, setIsGrid] = useState(false); // 보조선 토글 상태 추가
  
  const stageRef = useRef(null);

  // 스냅샷 기록용 공통 함수
  const commitSnapshot = (newLayers, currentActiveId) => {
    setHistoryState(prev => {
      const nextHistory = prev.history.slice(0, prev.step + 1);
      return {
        history: [
          ...nextHistory,
          {
            layers: structuredClone(newLayers),
            activeLayerId: currentActiveId
          }
        ],
        step: nextHistory.length
      };
    });
  };

  // Undo (실행 취소) 핸들러
  const handleUndo = () => {
    if (historyState.step > 0) {
      const nextStep = historyState.step - 1;
      const snapshot = historyState.history[nextStep];
      
      const clonedLayers = structuredClone(snapshot.layers);
      setLayers(clonedLayers);
      setActiveLayerId(snapshot.activeLayerId);
      
      setHistoryState(prev => ({ ...prev, step: nextStep }));
    }
  };

  // Redo (다시 실행) 핸들러
  const handleRedo = () => {
    if (historyState.step < historyState.history.length - 1) {
      const nextStep = historyState.step + 1;
      const snapshot = historyState.history[nextStep];
      
      const clonedLayers = structuredClone(snapshot.layers);
      setLayers(clonedLayers);
      setActiveLayerId(snapshot.activeLayerId);
      
      setHistoryState(prev => ({ ...prev, step: nextStep }));
    }
  };

  // 캔버스 드로잉이 완료되었을 때 (마우스 Up) 호출되는 콜백
  const handleDrawEnd = () => {
    commitSnapshot(layersRef.current, activeLayerIdRef.current);
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
      const nextLayers = layers.map(l => ({ ...l, lines: [] }));
      setLayers(nextLayers);
      commitSnapshot(nextLayers, activeLayerId);
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
    const nextLayers = [...layers, newLayer];
    setLayers(nextLayers);
    setActiveLayerId(nextId);
    commitSnapshot(nextLayers, nextId);
  };

  // 레이어 가시성 토글 핸들러
  const handleToggleLayerVisibility = (id) => {
    const nextLayers = layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
    setLayers(nextLayers);
    commitSnapshot(nextLayers, activeLayerId);
  };

  // 레이어 삭제 핸들러
  const handleDeleteLayer = (id) => {
    if (layers.length <= 1) {
      alert("최소 하나의 레이어는 존재해야 합니다.");
      return;
    }
    if (window.confirm("선택하신 레이어를 삭제하시겠습니까?")) {
      const nextLayers = layers.filter(l => l.id !== id);
      let nextActiveId = activeLayerId;
      if (activeLayerId === id) {
        nextActiveId = nextLayers[nextLayers.length - 1].id;
      }
      setLayers(nextLayers);
      setActiveLayerId(nextActiveId);
      commitSnapshot(nextLayers, nextActiveId);
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
      const nextLayers = layers.map(l => l.id === id ? { ...l, name: newName.trim() } : l);
      setLayers(nextLayers);
      commitSnapshot(nextLayers, activeLayerId);
    }
  };

  // 레이어 위로 이동 (배열에서 index -> index + 1)
  const handleMoveLayerUp = (index) => {
    if (index >= layers.length - 1) return; // 이미 맨 위
    const nextLayers = [...layers];
    const temp = nextLayers[index];
    nextLayers[index] = nextLayers[index + 1];
    nextLayers[index + 1] = temp;
    setLayers(nextLayers);
    commitSnapshot(nextLayers, activeLayerId);
  };

  // 레이어 아래로 이동 (배열에서 index -> index - 1)
  const handleMoveLayerDown = (index) => {
    if (index <= 0) return; // 이미 맨 아래
    const nextLayers = [...layers];
    const temp = nextLayers[index];
    nextLayers[index] = nextLayers[index - 1];
    nextLayers[index - 1] = temp;
    setLayers(nextLayers);
    commitSnapshot(nextLayers, activeLayerId);
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
          onDrawEnd={handleDrawEnd}
        />
      </div>
      <SidePanel 
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
        tool={tool} setTool={setTool} 
        color={color} setColor={setColor}
        bgColor={bgColor} setBgColor={setBgColor}
        opacity={opacity} setOpacity={setOpacity}
        
        handleUndo={handleUndo} 
        handleRedo={handleRedo}
        canUndo={historyState.step > 0} 
        canRedo={historyState.step < historyState.history.length - 1}
        
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
