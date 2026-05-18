import React from 'react';

const ToolBar = ({ strokeWidth, setStrokeWidth, tool, setTool, color, setColor }) => {
  return (
    <div style={{
      height: '80px', backgroundColor: '#343a40', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px'
    }}>
      {/* 도구 선택 영역 */}
      <div>
        <button onClick={() => setTool('pen')} style={{ marginRight: '5px', backgroundColor: tool === 'pen' ? '#4dabf7' : '#e9ecef' }}>✏️ 펜</button>
        <button onClick={() => setTool('eraser')} style={{ backgroundColor: tool === 'eraser' ? '#ff8787' : '#e9ecef' }}>🧽 지우개</button>
      </div>

      {/* 색상 선택 영역 (지우개 모드일 때는 비활성화 느낌을 줌) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="colorPicker">색상:</label>
        <input 
          id="colorPicker" type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === 'eraser'} // 지우개일 때는 색상 선택 무의미
          style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', borderRadius: '5px' }}
        />
      </div>

      {/* 굵기 조절 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="thickness">굵기: {strokeWidth}px</label>
        <input id="thickness" type="range" min="1" max="50" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))} />
      </div>
    </div>
  );
};

export default ToolBar;