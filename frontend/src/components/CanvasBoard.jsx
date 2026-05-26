import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image as KonvaImage, Group } from 'react-konva';

const CanvasBoard = ({ 
  strokeWidth, tool, color, bgColor, bgImageUrl, opacity, 
  layers, setLayers, activeLayerId, 
  isTracing, isGrid, stageRef, tracingImage,
  onDrawEnd
}) => {
  const width = window.innerWidth - 300;
  const height = window.innerHeight;
  const isDrawing = useRef(false);

  const [bgImageObj, setBgImageObj] = useState(null);

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

  const gridSize = 40;
  const gridLines = [];
  if (isGrid) {
    for (let i = 0; i < width / gridSize; i++) {
      gridLines.push(<Line key={`v${i}`} points={[Math.round(i * gridSize) + 0.5, 0, Math.round(i * gridSize) + 0.5, height]} stroke="#dee2e6" strokeWidth={1} listening={false} />);
    }
    for (let j = 0; j < height / gridSize; j++) {
      gridLines.push(<Line key={`h${j}`} points={[0, Math.round(j * gridSize) + 0.5, width, Math.round(j * gridSize) + 0.5]} stroke="#dee2e6" strokeWidth={1} listening={false} />);
    }
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    
    // activeLayerId에 해당하는 레이어를 찾아 새로운 획(lines)을 삽입
    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          lines: [...layer.lines, { points: [pos.x, pos.y], strokeWidth: strokeWidth, tool: tool, color: color, opacity: opacity }]
        };
      }
      return layer;
    }));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // activeLayerId에 해당하는 레이어의 마지막 획에 좌표 추가
    setLayers(layers.map(layer => {
      if (layer.id === activeLayerId) {
        if (layer.lines.length === 0) return layer;
        const lastLine = { ...layer.lines[layer.lines.length - 1] };
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
    <div style={{ backgroundColor: '#e9ecef', width: '100%', height: '100%', position: 'relative' }}>
      {isTracing && tracingImage && (
        <img 
          src={tracingImage} alt="tracing reference" 
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            maxWidth: '90%', maxHeight: '90%', opacity: 0.7, pointerEvents: 'none', zIndex: 0
          }} 
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Stage 
          width={width} height={height} ref={stageRef}
          onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
        >
          {/* 최하단 전용 Layer: 배경색, 배경 사진, 보조선 */}
          <Layer>
            {/* 1. 최하단: 배경색 */}
            {!isTracing && <Rect width={width} height={height} fill={bgColor} />}
            
            {/* 2. 중하단: 커스텀 배경 이미지 */}
            {!isTracing && bgImageObj && (
              <KonvaImage image={bgImageObj} width={width} height={height} />
            )}

            {/* 3. 중상단: 보조선 */}
            {isGrid && <Group id="gridGroup" listening={false}>{gridLines}</Group>}
          </Layer>

          {/* 그 위로 사용자 layers 순회하며 각각의 Layer 컴포넌트로 분리하여 렌더링 */}
          {layers.map((layer) => (
            <Layer key={layer.id} visible={layer.visible}>
              {layer.lines.map((line, i) => (
                <Line
                  key={i} points={line.points} stroke={line.color} strokeWidth={line.strokeWidth} 
                  opacity={line.opacity !== undefined ? line.opacity : 1}
                  tension={0.5} lineCap="round" lineJoin="round"
                  globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
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