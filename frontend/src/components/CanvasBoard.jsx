import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CanvasBoard = ({ strokeWidth, tool, color, lines, setLines, setRedoLines, isTracing }) => {
  const width = window.innerWidth;
  const height = window.innerHeight - 80;
  const isDrawing = useRef(false);

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

  // 샘플 실사 이미지 (빨간 사과)
  const sampleImageUrl = "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg";

  return (
    <div style={{ backgroundColor: '#e9ecef', width: '100%', height: '100%', position: 'relative' }}>
      
      {/* isTracing이 true일 때만 밑그림 렌더링 */}
      {isTracing && (
        <img 
          src={sampleImageUrl} 
          alt=" reference" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90%',
            opacity: 0.7, // 70% 투명도
            pointerEvents: 'none', // 마우스 이벤트 투과 (그리기 방해 안 함)
            zIndex: 0
          }} 
        />
      )}

      {/* Konva Stage의 zIndex를 높여 위로 올림 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Stage 
          width={width} height={height}
          onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
        >
          <Layer>
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