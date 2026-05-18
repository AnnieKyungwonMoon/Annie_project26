import React from 'react';
import CanvasBoard from './components/CanvasBoard';

// 임시 ToolBar 컴포넌트 (나중에 ToolBar.jsx로 분리할 예정)
const TempToolBar = () => (
  <div style={{ 
    height: '80px', 
    backgroundColor: '#343a40', 
    color: 'white', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    하단 도구 모음 (펜, 색상, 지우개 등)
  </div>
);

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {/* 상단 캔버스 영역 (남은 공간을 모두 차지함) */}
      <div style={{ flex: 1 }}>
        <CanvasBoard />
      </div>
      
      {/* 하단 고정 툴바 영역 */}
      <TempToolBar />
    </div>
  );
}

export default App;