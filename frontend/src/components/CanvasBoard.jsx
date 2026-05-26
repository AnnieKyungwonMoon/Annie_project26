import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image as KonvaImage, Group, Text } from 'react-konva';

const CanvasBoard = ({ 
  strokeWidth, tool, color, bgColor, bgImageUrl, opacity, 
  layers, setLayers, activeLayerId, 
  isTracing, isGrid, stageRef, tracingImage,
  onDrawEnd,
  scale, setScale, stagePos, setStagePos,
  
  // 캔버스 사이즈 조절 Props
  canvasWidth, canvasHeight,

  // 텍스트 관련 Props
  isTyping, setIsTyping,
  textInputPos, setTextInputPos,
  onTextSubmit
}) => {
  const isDrawing = useRef(false);
  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const [bgImageObj, setBgImageObj] = useState(null);
  const [tracingImageObj, setTracingImageObj] = useState(null);
  const [localInputValue, setLocalInputValue] = useState('');

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

  // 밑그림 이미지 로드 (스테이지 내에 렌더링하기 위해 이미지 객체 생성)
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

  // 마우스 휠 확대/축소 (CSS Transform 기반 줌 연산)
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleBy = 1.08;
    const oldScale = scale;
    const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(10, newScale));

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const dx = mouseX - stagePos.x;
    const dy = mouseY - stagePos.y;

    const newPos = {
      x: mouseX - dx * (clampedScale / oldScale),
      y: mouseY - dy * (clampedScale / oldScale)
    };

    setScale(clampedScale);
    setStagePos(newPos);
  };

  // 손바닥 툴 화면 이동(Pan) - 마우스 제어
  const handlePointerDown = (e) => {
    if (tool !== 'hand') return;
    isPanning.current = true;
    panStart.current = { x: e.clientX - stagePos.x, y: e.clientY - stagePos.y };
  };

  const handlePointerMove = (e) => {
    if (!isPanning.current) return;
    setStagePos({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y
    });
  };

  const handlePointerUp = () => {
    isPanning.current = false;
  };

  // 손바닥 툴 화면 이동(Pan) - 모바일 터치 제어
  const handleTouchStart = (e) => {
    if (tool !== 'hand') return;
    isPanning.current = true;
    const touch = e.touches[0];
    panStart.current = { x: touch.clientX - stagePos.x, y: touch.clientY - stagePos.y };
  };

  const handleTouchMove = (e) => {
    if (!isPanning.current) return;
    const touch = e.touches[0];
    setStagePos({
      x: touch.clientX - panStart.current.x,
      y: touch.clientY - panStart.current.y
    });
  };

  const handleTouchEnd = () => {
    isPanning.current = false;
  };

  // 텍스트 저장 트리거 헬퍼
  const handleTextSubmitInternal = () => {
    if (isTyping && textInputPos) {
      onTextSubmit(localInputValue, textInputPos);
      setIsTyping(false);
      setLocalInputValue('');
    }
  };

  const handleMouseDown = (e) => {
    if (tool === 'hand') return; // 화면 이동 모드일 경우 드로잉 무시
    
    const stage = e.target.getStage();
    // CSS Transform 환경에서는 stage.getPointerPosition()이 캔버스 로컬 내부 좌표[0 ~ canvasWidth/Height]를 자동으로 매핑해 줍니다.
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    if (tool === 'text') {
      if (isTyping) {
        handleTextSubmitInternal();
      }
      setIsTyping(true);
      setTextInputPos(pos);
      setLocalInputValue('');
      return;
    }

    isDrawing.current = true;
    
    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          lines: [...layer.lines, { type: 'line', points: [pos.x, pos.y], strokeWidth: strokeWidth, tool: tool, color: color, opacity: opacity }]
        };
      }
      return layer;
    }));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || tool === 'hand' || tool === 'text') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        if (layer.lines.length === 0) return layer;
        const lastLine = { ...layer.lines[layer.lines.length - 1] };
        if (lastLine.type !== 'line') return layer;
        lastLine.points = lastLine.points.concat([point.x, point.y]);
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
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        backgroundColor: '#e9ecef', 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        cursor: tool === 'hand' ? (isPanning.current ? 'grabbing' : 'grab') : 'default'
      }}
    >
      {/* 줌 및 화면 이동이 마운트되는 GPU 가속 CSS 컨테이너 */}
      <div 
        style={{ 
          position: 'absolute',
          transform: `translate(${stagePos.x}px, ${stagePos.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          boxShadow: '0 4px 25px rgba(0,0,0,0.15)',
          backgroundColor: '#ffffff',
          zIndex: 1
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
        >
          {/* 최하단 전용 Layer: 배경색, 배경 사진, 밑그림, 보조선 */}
          <Layer>
            {/* 1. 최하단: 배경색 */}
            {!isTracing && <Rect width={canvasWidth} height={canvasHeight} fill={bgColor} />}
            
            {/* 2. 중하단: 커스텀 배경 이미지 */}
            {!isTracing && bgImageObj && (
              <KonvaImage image={bgImageObj} width={canvasWidth} height={canvasHeight} />
            )}

            {/* 3. 중단: 밑그림 (스테이지 내부에 위치시켜 줌/팬에 완전 동기화) */}
            {isTracing && tracingImageObj && (
              <KonvaImage 
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
              {layer.lines.map((item, i) => {
                if (item.type === 'text') {
                  return (
                    <Text
                      key={i}
                      text={item.text}
                      x={item.x}
                      y={item.y}
                      fontSize={item.fontSize}
                      fill={item.fill}
                      opacity={item.opacity !== undefined ? item.opacity : 1}
                      lineHeight={1.2}
                    />
                  );
                } else {
                  return (
                    <Line
                      key={i} points={item.points} stroke={item.color} strokeWidth={item.strokeWidth} 
                      opacity={item.opacity !== undefined ? item.opacity : 1}
                      tension={0.5} lineCap="round" lineJoin="round"
                      globalCompositeOperation={item.tool === 'eraser' ? 'destination-out' : 'source-over'}
                    />
                  );
                }
              })}
            </Layer>
          ))}
        </Stage>

        {/* 텍스트 입력용 HTML textarea 오버레이 (트랜스폼 컨테이너 내부에 있으므로 CSS 줌/이동 자동 동기화) */}
        {isTyping && textInputPos && (
          <textarea
            autoFocus
            value={localInputValue}
            onChange={(e) => setLocalInputValue(e.target.value)}
            onBlur={handleTextSubmitInternal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmitInternal();
              }
            }}
            style={{
              position: 'absolute',
              left: `${textInputPos.x}px`,
              top: `${textInputPos.y}px`,
              fontSize: `${strokeWidth * 5}px`,
              color: color,
              background: 'transparent',
              border: '1px dashed #228be6',
              outline: 'none',
              resize: 'both',
              overflow: 'hidden',
              whiteSpace: 'pre',
              zIndex: 10,
              padding: '4px',
              margin: 0,
              lineHeight: 1.2,
              caretColor: color,
              fontFamily: 'sans-serif',
              transformOrigin: 'top left',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasBoard;