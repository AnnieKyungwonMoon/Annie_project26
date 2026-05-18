import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CanvasBoard = ({ strokeWidth, tool, color }) => {
  const width = window.innerWidth;
  const height = window.innerHeight - 80;
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // 선 데이터에 color 속성을 추가하여 저장
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
              stroke={line.color} // 개별 선에 저장된 색상 적용
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