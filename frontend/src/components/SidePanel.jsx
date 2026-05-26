import React, { useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

const SidePanel = ({ 
  strokeWidth, setStrokeWidth, tool, setTool, color, setColor,
  bgColor, setBgColor,
  opacity, setOpacity,
  handleUndo, handleRedo, canUndo, canRedo,
  isTracing, setIsTracing,
  isGrid, setIsGrid,
  handleDownload,
  isFreeMode, handleImageUpload, handleBgImageUpload, bgImageUrl, handleRemoveBgImage, 
  handleBgColorReset, handleClearAll,

  // 캔버스 사이즈 조절 Props
  canvasWidth, setCanvasWidth,
  canvasHeight, setCanvasHeight,
  
  // 레이어 관련 Props
  layers, activeLayerId, handleAddLayer, handleToggleLayerVisibility, handleDeleteLayer, handleSelectLayer,
  handleRenameLayer, handleMoveLayerUp, handleMoveLayerDown, hasAnyLines,
  
  goHome
}) => {
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerBgUpload = () => {
    if (bgInputRef.current) {
      bgInputRef.current.click();
    }
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '20px',
    borderBottom: '1px solid #343a40',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#adb5bd',
    marginBottom: '4px',
  };

  const rowStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const buttonStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{
      width: '300px',
      height: '100vh',
      backgroundColor: '#212529',
      color: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      boxSizing: 'border-box',
      borderLeft: '1px solid #343a40',
      overflowY: 'auto'
    }}>
      {/* 상단 네비게이션 & 저장 */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <button onClick={goHome} style={{ ...buttonStyle, flex: 1, backgroundColor: '#495057', color: 'white' }}>
            🏠 홈으로
          </button>
          <button onClick={handleDownload} style={{ ...buttonStyle, flex: 1, backgroundColor: '#20c997', color: 'white' }}>
            💾 저장하기
          </button>
        </div>
      </div>

      {/* 1구역: 도구 및 그리기 설정 */}
      <div style={sectionStyle}>
        <div style={labelStyle}>🖌️ 그리기 도구</div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            onClick={() => setTool('pen')} 
            style={{ 
              ...buttonStyle, 
              flex: 1, 
              backgroundColor: tool === 'pen' ? '#228be6' : '#e9ecef', 
              color: tool === 'pen' ? 'white' : '#212529',
              padding: '10px 4px',
              fontSize: '12px'
            }}
          >
            ✏️ 펜
          </button>
          <button 
            onClick={() => setTool('eraser')} 
            style={{ 
              ...buttonStyle, 
              flex: 1, 
              backgroundColor: tool === 'eraser' ? '#fa5252' : '#e9ecef',
              color: tool === 'eraser' ? 'white' : '#212529',
              padding: '10px 4px',
              fontSize: '12px'
            }}
          >
            🧽 지우개
          </button>
          <button 
            onClick={() => setTool('hand')} 
            style={{ 
              ...buttonStyle, 
              flex: 1, 
              backgroundColor: tool === 'hand' ? '#15aabf' : '#e9ecef',
              color: tool === 'hand' ? 'white' : '#212529',
              padding: '10px 4px',
              fontSize: '12px'
            }}
          >
            🖐️ 이동
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>
            펜 색상
          </span>
          {tool === 'eraser' ? (
            <div style={{
              height: '180px', backgroundColor: '#343a40', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd',
              fontSize: '14px', border: '1px dashed #495057', boxSizing: 'border-box'
            }}>
              지우개 모드 활성화됨
            </div>
          ) : tool === 'hand' ? (
            <div style={{
              height: '180px', backgroundColor: '#343a40', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd',
              fontSize: '14px', border: '1px dashed #495057', boxSizing: 'border-box'
            }}>
              이동(드래그) 모드 활성화됨
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <HexColorPicker color={color} onChange={setColor} style={{ width: '100%', height: '180px' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#adb5bd' }}>
            <span>브러쉬 두께</span>
            <span>{strokeWidth}px</span>
          </div>
          <input 
            id="thickness" type="range" min="1" max="50" value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
            style={{ width: '100%', cursor: 'pointer' }} 
            disabled={tool === 'hand'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#adb5bd' }}>
            <span>투명도</span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>
          <input 
            id="opacity" type="range" min="1" max="100" value={Math.round(opacity * 100)} 
            onChange={(e) => setOpacity(parseFloat(e.target.value) / 100)} 
            style={{ width: '100%', cursor: 'pointer' }} 
            disabled={tool === 'hand'}
          />
        </div>
      </div>

      {/* 2구역: 캔버스 크기 제어 */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📐 캔버스 크기</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#adb5bd' }}>가로 (px)</span>
            <input 
              type="number" 
              value={canvasWidth} 
              onChange={(e) => setCanvasWidth(Math.max(100, parseInt(e.target.value) || 0))} 
              style={{
                width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #495057',
                backgroundColor: '#343a40', color: 'white', fontSize: '13px', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#adb5bd' }}>세로 (px)</span>
            <input 
              type="number" 
              value={canvasHeight} 
              onChange={(e) => setCanvasHeight(Math.max(100, parseInt(e.target.value) || 0))} 
              style={{
                width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #495057',
                backgroundColor: '#343a40', color: 'white', fontSize: '13px', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <button 
            onClick={() => { setCanvasWidth(800); setCanvasHeight(600); }} 
            style={{ 
              ...buttonStyle, flex: 1, padding: '6px 8px', fontSize: '11px', 
              backgroundColor: '#495057', color: 'white', gap: 0
            }}
          >
            800x600
          </button>
          <button 
            onClick={() => { setCanvasWidth(1080); setCanvasHeight(1080); }} 
            style={{ 
              ...buttonStyle, flex: 1, padding: '6px 8px', fontSize: '11px', 
              backgroundColor: '#495057', color: 'white', gap: 0
            }}
          >
            1080x1080
          </button>
          <button 
            onClick={() => { setCanvasWidth(1920); setCanvasHeight(1080); }} 
            style={{ 
              ...buttonStyle, flex: 1, padding: '6px 8px', fontSize: '11px', 
              backgroundColor: '#495057', color: 'white', gap: 0
            }}
          >
            1920x1080
          </button>
        </div>
      </div>

      {/* 3구역: 캔버스 배경 설정 */}
      <div style={sectionStyle}>
        <div style={labelStyle}>🎨 캔버스 배경</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>배경 색상</span>
          <div style={rowStyle}>
            <input 
              id="bgColorPicker" title="배경 색상" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
              disabled={isTracing}
              style={{ cursor: isTracing ? 'not-allowed' : 'pointer', flex: 1, height: '36px', border: 'none', borderRadius: '4px', padding: 0 }}
            />
            <button 
              onClick={handleBgColorReset} 
              style={{ ...buttonStyle, backgroundColor: '#495057', color: 'white', height: '36px', fontSize: '12px' }}
              title="배경 흰색으로 초기화"
            >
              🎨 리셋
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>배경 이미지</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={triggerBgUpload} style={{ ...buttonStyle, backgroundColor: '#ae3ec9', color: 'white', width: '100%' }}>
              🖼️ 배경 사진 업로드
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={bgInputRef} 
              onChange={handleBgImageUpload} 
              style={{ display: 'none' }} 
            />
            {bgImageUrl && (
              <button onClick={handleRemoveBgImage} style={{ ...buttonStyle, backgroundColor: '#e03131', color: 'white', width: '100%' }}>
                ❌ 배경 사진 삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4구역: 밑그림 및 보조선 */}
      <div style={sectionStyle}>
        <div style={labelStyle}>📏 가이드 및 트레이싱</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={triggerUpload} style={{ ...buttonStyle, backgroundColor: '#f59f00', color: 'white', width: '100%' }}>
            🖼️ 밑그림 사진 등록
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          
          <div style={rowStyle}>
            <button 
              onClick={() => setIsTracing(!isTracing)} 
              style={{ 
                ...buttonStyle, 
                flex: 1, 
                backgroundColor: isTracing ? '#f59f00' : '#495057', 
                color: 'white',
                fontSize: '13px'
              }}
            >
              📸 밑그림 {isTracing ? '숨김' : '보임'}
            </button>
            <button 
              onClick={() => setIsGrid(!isGrid)} 
              style={{ 
                ...buttonStyle, 
                flex: 1, 
                backgroundColor: isGrid ? '#74b816' : '#495057', 
                color: 'white',
                fontSize: '13px'
              }}
            >
              📏 보조선 {isGrid ? '끄기' : '켜기'}
            </button>
          </div>
        </div>
      </div>

      {/* 5구역: 레이어 패널 */}
      <div style={sectionStyle}>
        <div style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>LAYERS (레이어)</span>
          <button 
            onClick={handleAddLayer} 
            style={{ 
              backgroundColor: '#228be6', color: 'white', border: 'none', 
              borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px'
            }}
          >
            ➕ 추가
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '2px'
        }}>
          {[...layers].reverse().map((layer) => {
            const originalIndex = layers.findIndex(l => l.id === layer.id);
            const isActive = layer.id === activeLayerId;
            return (
              <div 
                key={layer.id}
                onClick={() => handleSelectLayer(layer.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#1c7ed6' : '#2b3035',
                  color: isActive ? 'white' : '#f8f9fa',
                  border: isActive ? '1px solid #339af0' : '1px solid #343a40',
                  transition: 'all 0.15s ease',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLayerVisibility(layer.id);
                      }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        fontSize: '14px', opacity: layer.visible ? 1 : 0.4,
                        color: isActive ? 'white' : '#adb5bd'
                      }}
                      title={layer.visible ? "레이어 숨기기" : "레이어 보이기"}
                    >
                      {layer.visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: isActive ? 'bold' : 'normal',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px'
                    }}>
                      {layer.name}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameLayer(layer.id);
                      }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                        fontSize: '12px', color: isActive ? '#e9ecef' : '#adb5bd'
                      }}
                      title="이름 변경"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(layer.id);
                      }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                        fontSize: '12px', color: isActive ? '#ffc9c9' : '#fa5252',
                        opacity: layers.length > 1 ? 1 : 0.3
                      }}
                      disabled={layers.length <= 1}
                      title="레이어 삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* 순서 제어 (위/아래 이동) 영역 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  marginTop: '2px', 
                  borderTop: isActive ? '1px solid #4dadf7' : '1px solid #343a40', 
                  paddingTop: '4px' 
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayerUp(originalIndex);
                    }}
                    disabled={originalIndex === layers.length - 1}
                    style={{
                      flex: 1,
                      background: isActive ? '#1864ab' : '#343a40',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 0',
                      cursor: originalIndex === layers.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: originalIndex === layers.length - 1 ? 0.3 : 1
                    }}
                    title="위로 올리기 (드로잉을 가장 위로)"
                  >
                    ⬆️ 올리기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayerDown(originalIndex);
                    }}
                    disabled={originalIndex === 0}
                    style={{
                      flex: 1,
                      background: isActive ? '#1864ab' : '#343a40',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 0',
                      cursor: originalIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: originalIndex === 0 ? 0.3 : 1
                    }}
                    title="아래로 내리기 (드로잉을 가장 아래로)"
                  >
                    ⬇️ 내리기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6구역: 편집 및 초기화 */}
      <div style={{ ...sectionStyle, borderBottom: 'none' }}>
        <div style={labelStyle}>⚙️ 편집 제어</div>
        <div style={rowStyle}>
          <button 
            onClick={handleUndo} 
            disabled={!canUndo} 
            style={{ 
              ...buttonStyle, 
              flex: 1, 
              backgroundColor: '#495057', 
              color: 'white',
              cursor: canUndo ? 'pointer' : 'not-allowed', 
              opacity: canUndo ? 1 : 0.3 
            }}
          >
            ↩️ 실행취소
          </button>
          <button 
            onClick={handleRedo} 
            disabled={!canRedo} 
            style={{ 
              ...buttonStyle, 
              flex: 1, 
              backgroundColor: '#495057', 
              color: 'white',
              cursor: canRedo ? 'pointer' : 'not-allowed', 
              opacity: canRedo ? 1 : 0.3 
            }}
          >
            ↪️ 다시실행
          </button>
        </div>
        <button 
          onClick={handleClearAll} 
          disabled={!hasAnyLines}
          style={{ 
            ...buttonStyle, 
            backgroundColor: '#e03131', 
            color: 'white',
            width: '100%',
            marginTop: '4px',
            cursor: hasAnyLines ? 'pointer' : 'not-allowed',
            opacity: hasAnyLines ? 1 : 0.5
          }}
        >
          🗑️ 전체 삭제 (초기화)
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
