import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image, Group } from 'react-konva';

const CanvasBoard = ({ 
  strokeWidth, tool, color, bgColor, bgImageUrl, opacity, 
  layers, setLayers, activeLayerId, 
  isTracing, isGrid, stageRef, tracingImage,
  onDrawEnd,
  scale, setScale, stagePos, setStagePos,
  
  // 캔버스 사이즈 조절 Props
  canvasWidth, canvasHeight
}) => {
  const isDrawing = useRef(false);
  const containerRef = useRef(null);

  const [bgImageObj, setBgImageObj] = useState(null);
  const [tracingImageObj, setTracingImageObj] = useState(null);

  // 배경 이미지 로드
  useEffect(() => {
    if (bgImageUrl) {
      const img = new window.Image();
      img.src = bgImageUrl;
      img.onload = () => {
        setBgImageObj(img);
      };
    } else {
      setBgImageObj(null);
    }
  }, [bgImageUrl]);

  // 밑그림 이미지 로드
  useEffect(() => {
    if (tracingImage) {
      const img = new window.Image();
      img.src = tracingImage;
      img.onload = () => {
        setTracingImageObj(img);
      };
    } else {
      setTracingImageObj(null);
    }
  }, [tracingImage]);

  // 보조선 그리기 (고정된 캔버스 영역 내부로 제한)
  const gridSize = 40;
  const gridLines = [];
  if (isGrid) {
    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      gridLines.push(<Line key={`v${i}`} points={[Math.round(i * gridSize) + 0.5, 0, Math.round(i * gridSize) + 0.5, canvasHeight]} stroke="#dee2e6" strokeWidth={1} listening={false} />);
    }
    for (let j = 0; j <= canvasHeight / gridSize; j++) {
      gridLines.push(<Line key={`h${j}`} points={[0, Math.round(j * gridSize) + 0.5, canvasWidth, Math.round(j * gridSize) + 0.5]} stroke="#dee2e6" strokeWidth={1} listening={false} />);
    }
  }

  // 마우스 휠 확대/축소 (Stage scaleX, scaleY 기반 줌 연산)
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current || e.target.getStage();
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.08;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(10, newScale));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setScale(clampedScale);
    setStagePos(newPos);
  };

  // 손바닥 툴 화면 이동(Pan) 드래그 종료 연동
  const handleDragEnd = (e) => {
    if (e.target === stageRef.current || e.target === e.target.getStage()) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y()
      });
    }
  };

  const handleMouseDown = (e) => {
    if (tool === 'hand') return; // 화면 이동 모드일 경우 드로잉 무시
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    isDrawing.current = true;
    
    // 드로잉 좌표: 줌/이동이 반영된 내부 상대 좌표 계산
    const relativePos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };
    
    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          lines: [...layer.lines, { points: [relativePos.x, relativePos.y], strokeWidth: strokeWidth, tool: tool, color: color, opacity: opacity }]
        };
      }
      return layer;
    }));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || tool === 'hand') return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    // 드로잉 좌표: 줌/이동이 반영된 내부 상대 좌표 계산
    const relativePos = {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY()
    };

    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        if (layer.lines.length === 0) return layer;
        const lastLine = { ...layer.lines[layer.lines.length - 1] };
        lastLine.points = lastLine.points.concat([relativePos.x, relativePos.y]);
        const newLines = [...layer.lines];
        newLines[newLines.length - 1] = lastLine;
        return { ...layer, lines: newLines };
      }
      return layer;
    }));
  };

  const handleMouseUp = () => { 
    if (isDrawing.current) {
      isDrawing.current = false; 
      if (onDrawEnd) onDrawEnd();
    }
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#e9ecef', 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow: 'hidden' 
      }}
    >
      {/* 최상위 부모 <div> */}
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: `${canvasWidth}px`, 
          height: `${canvasHeight}px`,
          boxShadow: '0 4px 25px rgba(0,0,0,0.15)',
          backgroundColor: '#ffffff',
        }}
      >
        <Stage 
          width={canvasWidth} 
          height={canvasHeight} 
          ref={stageRef}
          onMouseDown={handleMouseDown} 
          onMousemove={handleMouseMove} 
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown} 
          onTouchMove={handleMouseMove} 
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
          onDragEnd={handleDragEnd}
          draggable={tool === 'hand'}
          scaleX={scale}
          scaleY={scale}
          x={stagePos.x}
          y={stagePos.y}
        >
          {/* 최하단 전용 Layer: 배경색, 배경 사진, 밑그림, 보조선 */}
          <Layer>
            {/* 1. 최하단: 배경색 */}
            {!isTracing && <Rect width={canvasWidth} height={canvasHeight} fill={bgColor} />}
            
            {/* 2. 중하단: 커스텀 배경 이미지 */}
            {!isTracing && bgImageObj && (
              <Image image={bgImageObj} width={canvasWidth} height={canvasHeight} />
            )}

            {/* 3. 중단: 밑그림 (스테이지 내부에 위치시켜 줌/팬에 완전 동기화) */}
            {isTracing && tracingImageObj && (
              <Image 
                id="tracingImage" 
                image={tracingImageObj} 
                width={canvasWidth} 
                height={canvasHeight} 
                opacity={0.5}
                listening={false}
              />
            )}

            {/* 4. 중상단: 보조선 */}
            {isGrid && <Group id="gridGroup" listening={false}>{gridLines}</Group>}
          </Layer>

          {/* 그 위로 사용자 layers 순회하며 각각의 Layer 컴포넌트로 분리하여 렌더링 */}
          {layers.map((layer) => (
            <Layer key={layer.id} visible={layer.visible}>
              {layer.lines.map((item, i) => (
                <Line
                  key={i} points={item.points} stroke={item.color} strokeWidth={item.strokeWidth} 
                  opacity={item.opacity !== undefined ? item.opacity : 1}
                  tension={0.5} lineCap="round" lineJoin="round"
                  globalCompositeOperation={item.tool === 'eraser' ? 'destination-out' : 'source-over'}
                />
              ))}
            </Layer>
          ))}
        </Stage>
      </div>
    </div>
  );
};

export default CanvasBoard;