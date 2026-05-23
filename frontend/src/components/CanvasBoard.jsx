import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Image as KonvaImage, Group } from 'react-konva';

const CanvasBoard = ({ strokeWidth, tool, color, bgColor, bgImageUrl, lines, setLines, setRedoLines, isTracing, isGrid, stageRef, tracingImage }) => {
  const width = window.innerWidth;
  const height = window.innerHeight - 80;
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
    setRedoLines([]); 
    setLines([...lines, { points: [pos.x, pos.y], strokeWidth: strokeWidth, tool: tool, color: color }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1]; 
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat()); 
  };

  const handleMouseUp = () => { isDrawing.current = false; };

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
          <Layer>
            {/* 1. 최하단: 배경색 */}
            {!isTracing && <Rect width={width} height={height} fill={bgColor} />}
            
            {/* 2. 중하단: 커스텀 배경 이미지 */}
            {!isTracing && bgImageObj && (
              <KonvaImage image={bgImageObj} width={width} height={height} />
            )}

            {/* 3. 중상단: 보조선 (다운로드 방지를 위해 id="gridGroup" 부여) */}
            {isGrid && <Group id="gridGroup" listening={false}>{gridLines}</Group>}
            
            {/* 4. 최상단: 드로잉 선화 */}
            {lines.map((line, i) => (
              <Line
                key={i} points={line.points} stroke={line.color} strokeWidth={line.strokeWidth} 
                tension={0.5} lineCap="round" lineJoin="round"
                globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasBoard;