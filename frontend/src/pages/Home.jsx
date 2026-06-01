import React from 'react';
import { useNavigate } from 'react-router-dom';
import { curriculumData } from '../data/curriculumData';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '60px 20px',
      backgroundColor: '#f1f3f5',
      minHeight: '100vh',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: '#1a1b1e', fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>
            🎨 모두의 미술 수업
          </h1>
          <p style={{ color: '#495057', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            필압과 기교 대신 사물의 본질적인 형태와 선, 색에 집중하는 체계적인 미술 커리큘럼입니다.
          </p>
        </div>

        {/* Free Draw Banner */}
        <div 
          onClick={() => navigate('/draw/free')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            border: '2px dashed #fab005',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: '#f59f00', fontSize: '1.6rem' }}>✨ 자유 그리기 모드</h2>
            <p style={{ margin: '8px 0 0 0', color: '#495057', fontSize: '14px' }}>
              자유로운 주제로 그림을 그리거나, 원하는 이미지를 불러와 밑그림 삼아 트레이싱해보세요.
            </p>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59f00' }}>🚀 입장하기 →</span>
        </div>

        {/* Curriculum Stages */}
        {curriculumData.map((stage) => (
          <div key={stage.stageId} style={{ marginBottom: '50px' }}>
            <div style={{
              borderLeft: '5px solid #228be6',
              paddingLeft: '15px',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, color: '#1a1b1e', fontSize: '1.6rem', fontWeight: '700' }}>
                {stage.stageTitle}
              </h2>
              <p style={{ margin: '6px 0 0 0', color: '#868e96', fontSize: '14px', lineHeight: '1.5' }}>
                {stage.stageDescription}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {stage.lectures.map((lecture) => (
                <div
                  key={lecture.id}
                  onClick={() => navigate(`/draw/${stage.stageId}/${lecture.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px',
                    border: '1px solid #e9ecef'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#339af0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }}
                >
                  <div>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#e7f5ff',
                      color: '#228be6',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}>
                      {stage.stageId}단계 - {lecture.id}강
                    </span>
                    <h3 style={{ margin: 0, color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>
                      {lecture.title}
                    </h3>
                    <p style={{ margin: '8px 0 0 0', color: '#495057', fontSize: '13px', lineHeight: '1.4' }}>
                      {lecture.description}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#228be6',
                    fontWeight: 'bold',
                    marginTop: '15px'
                  }}>
                    그리러 가기 →
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
