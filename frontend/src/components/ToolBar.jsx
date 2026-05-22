import React, { useRef } from 'react';

const ToolBar = ({ 
  strokeWidth, setStrokeWidth, tool, setTool, color, setColor,
  handleUndo, handleRedo, canUndo, canRedo,
  isTracing, setIsTracing,
  handleDownload,
  isFreeMode, handleImageUpload, goHome
}) => {
  const fileInputRef = useRef(null);

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{
      height: '80px', backgroundColor: '#343a40', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '0 10px',
      overflowX: 'auto'
    }}>
      {/* 홈 버튼 추가 */}
      <div style={{ display: 'flex' }}>
        <button onClick={goHome} style={{ backgroundColor: '#868e96', color: 'white', fontWeight: 'bold' }}>🏠 홈</button>
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={handleUndo} disabled={!canUndo} style={{ cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.5 }}>↩️</button>
        <button onClick={handleRedo} disabled={!canRedo} style={{ cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.5 }}>↪️</button>
      </div>

      <div style={{ display: 'flex' }}>
        <button onClick={() => setTool('pen')} style={{ marginRight: '5px', backgroundColor: tool === 'pen' ? '#4dabf7' : '#e9ecef' }}>✏️</button>
        <button onClick={() => setTool('eraser')} style={{ backgroundColor: tool === 'eraser' ? '#ff8787' : '#e9ecef' }}>🧽</button>
      </div>

      {/* 자유 그리기 모드일 때만 이미지 업로드 버튼 노출 */}
      {isFreeMode && (
        <div style={{ display: 'flex' }}>
          <button onClick={triggerUpload} style={{ backgroundColor: '#fcc419', color: 'black', fontWeight: 'bold' }}>
            🖼️ 업로드
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </div>
      )}

      <div style={{ display: 'flex' }}>
        <button onClick={() => setIsTracing(!isTracing)} style={{ backgroundColor: isTracing ? '#ffd43b' : '#e9ecef' }}>📸 밑그림</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input 
          id="colorPicker" type="color" value={color} onChange={(e) => setColor(e.target.value)}
          disabled={tool === 'eraser'} 
          style={{ cursor: 'pointer', width: '35px', height: '35px', border: 'none', borderRadius: '5px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '12px' }}>{strokeWidth}px</span>
        <input id="thickness" type="range" min="1" max="50" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))} style={{ width: '80px' }} />
      </div>

      <div style={{ display: 'flex' }}>
        <button onClick={handleDownload} style={{ backgroundColor: '#20c997', color: 'white', fontWeight: 'bold' }}>💾 저장</button>
      </div>
    </div>
  );
};

export default ToolBar;