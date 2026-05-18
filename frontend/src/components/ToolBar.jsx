import React from 'react';

// 부모(App.jsx)로부터 현재 굵기(strokeWidth)와 변경 함수(setStrokeWidth)를 받아옵니다.
const ToolBar = ({ strokeWidth, setStrokeWidth }) => {
  return (
    <div style={{
      height: '80px',
      backgroundColor: '#343a40',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px' // 요소들 사이의 간격
    }}>
      <label htmlFor="thickness">펜 굵기: {strokeWidth}px</label>
      
      {/* HTML5 기본 슬라이더(range) 바를 사용합니다 */}
      <input
        id="thickness"
        type="range"
        min="1"
        max="50"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
      />
    </div>
  );
};

export default ToolBar;