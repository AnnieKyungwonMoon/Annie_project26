import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

// App.jsx에서 관리하는 lines, setLines, setRedoLines를 받아옵니다.
const CanvasBoard = ({ strokeWidth, tool, color, lines, setLines, setRedoLines }) => {
  const width = window.innerWidth;
  const height = window.innerHeight - 80;
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    
    // 새로운 선을 그리면 기존의 Redo 기록은 모두 날아갑니다.
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
    <div style={{ backgroundColor: '#e9ecef', width: '100%', height: '100%' }}>
      <Stage 
        width={width} height={height}
        onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color} 
              strokeWidth={line.strokeWidth} 
              tension={0.5} lineCap="round" lineJoin="round"
              globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasBoard;