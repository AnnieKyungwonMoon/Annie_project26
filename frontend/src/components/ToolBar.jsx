import React from 'react';

const ToolBar = ({ strokeWidth, setStrokeWidth, tool, setTool }) => {
  return (
    <div style={{
      height: '80px', backgroundColor: '#343a40', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px'
    }}>
      <div>
        <button 
          onClick={() => setTool('pen')}
          style={{ marginRight: '10px', backgroundColor: tool === 'pen' ? '#4dabf7' : '#e9ecef' }}
        >✏️ 펜</button>
        <button 
          onClick={() => setTool('eraser')}
          style={{ backgroundColor: tool === 'eraser' ? '#ff8787' : '#e9ecef' }}
        >🧽 지우개</button>
      </div>
      <label htmlFor="thickness">굵기: {strokeWidth}px</label>
      <input
        id="thickness" type="range" min="1" max="50"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
      />
    </div>
  );
};

export default ToolBar;