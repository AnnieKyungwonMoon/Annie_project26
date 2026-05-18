import React, { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import ToolBar from './components/ToolBar';

function App() {
  // 펜 굵기 상태 (기본값을 5로 설정합니다)
  const [strokeWidth, setStrokeWidth] = useState(5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      <div style={{ flex: 1 }}>
        {/* 캔버스에는 '현재 굵기'만 전달합니다 */}
        <CanvasBoard strokeWidth={strokeWidth} />
      </div>
      
      {/* 툴바에는 '현재 굵기'와 '굵기를 바꾸는 리모컨(함수)'을 모두 전달합니다 */}
      <ToolBar strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
      
    </div>
  );
}

export default App;