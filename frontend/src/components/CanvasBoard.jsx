import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

// App.jsx에서 넘어온 stageRef를 받습니다.
const CanvasBoard = ({ strokeWidth, tool, color, lines, setLines, setRedoLines, isTracing, stageRef }) => {
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

  const sampleImageUrl = "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg";

  return (
    <div style={{ backgroundColor: '#e9ecef', width: '100%', height: '100%', position: 'relative' }}>
      {isTracing && (
        <img 
          src={sampleImageUrl} alt="tracing reference" 
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            maxWidth: '90%', maxHeight: '90%', opacity: 0.7, pointerEvents: 'none', zIndex: 0
          }} 
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Stage 컴포넌트에 ref 속성을 연결합니다 */}
        <Stage 
          width={width} height={height} ref={stageRef}
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