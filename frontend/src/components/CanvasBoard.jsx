import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

// 1. App.jsx에서 넘겨준 strokeWidth를 파라미터로 받습니다.
const CanvasBoard = ({ strokeWidth }) => {
  const width = window.innerWidth;
  const height = window.innerHeight - 80;

  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  // 2. 마우스를 눌렀을 때 (그리기 시작) - 중복된 부분을 하나로 깔끔하게 합쳤습니다!
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    
    // 중요! 새로운 선을 추가할 때, '현재 설정된 굵기(strokeWidth)'도 같이 기록해 둡니다.
    setLines([...lines, { points: [pos.x, pos.y], strokeWidth: strokeWidth }]);
  };

  // 3. 마우스를 누른 채로 움직일 때 (선 긋기)
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1]; 
    
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat()); 
  };

  // 4. 마우스를 뗄 때 (그리기 종료)
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div style={{ backgroundColor: '#e9ecef', width: '100%', height: '100%' }}>
      <Stage 
        width={width} 
        height={height}
        onMouseDown={handleMouseDown} 
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown} 
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
              // 3. 고정된 숫자가 아니라, 선 데이터에 저장된 굵기(line.strokeWidth)를 사용합니다!
              strokeWidth={line.strokeWidth} 
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasBoard;