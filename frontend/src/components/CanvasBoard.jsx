import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CanvasBoard = () => {
  // 모바일 화면을 가정하여 너비와 높이를 임시로 설정합니다.
  const width = window.innerWidth;
  const height = window.innerHeight - 80;

  // 1. 상태(State) 관리
  const [lines, setLines] = useState([]); // 화면에 그려질 모든 선들의 데이터
  const isDrawing = useRef(false); // 현재 마우스를 클릭하고(그리는 중) 있는지 여부

  // 2. 마우스를 눌렀을 때 (그리기 시작)
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // 새로운 선 데이터를 배열에 추가합니다. (초기 좌표 세팅)
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  // 3. 마우스를 누른 채로 움직일 때 (선 긋기)
  const handleMouseMove = (e) => {
    // 그리는 중이 아니면 함수를 종료합니다.
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1]; // 방금 추가한 마지막 선을 가져옵니다.
    
    // 마지막 선의 좌표 배열에 현재 마우스 좌표(X, Y)를 이어 붙입니다.
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    // 기존 선 배열의 마지막 항목을 업데이트한 선으로 교체합니다.
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat()); // 상태를 강제로 업데이트하여 화면을 다시 그립니다.
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
        onMouseDown={handleMouseDown} // 데스크톱 마우스 이벤트
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown} // 모바일 터치 이벤트
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {/* lines 배열을 순회하며 모든 선을 그려줍니다. */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000" // 기본 펜 색상 (검정)
              strokeWidth={5}  // 기본 펜 굵기
              tension={0.5}    // 선을 부드럽게(곡선) 만들어주는 속성
              lineCap="round"  // 선의 끝부분을 둥글게 처리
              lineJoin="round" // 선이 꺾이는 부분을 둥글게 처리
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasBoard;