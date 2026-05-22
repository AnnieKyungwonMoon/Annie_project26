import React from 'react';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  { id: '1', title: '1단계: 선 긋기', image: 'https://images.unsplash.com/photo-1544383835-bca2bc6f5fc3?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: '2단계: 정육면체', image: 'https://images.unsplash.com/photo-1590202482329-373eeb9ddb53?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: '3단계: 원기둥', image: 'https://images.unsplash.com/photo-1623321526673-9a74421b585a?auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: '4단계: 구', image: 'https://images.unsplash.com/photo-1582294155167-939eec46538d?auto=format&fit=crop&w=800&q=80' },
  { id: '5', title: '5단계: 컵', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80' },
  { id: '6', title: '6단계: 사과', image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg' },
  { id: 'free', title: '자유 그리기', image: null }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8f9fa', minHeight: '100vh', boxSizing: 'border-box' }}>
      <h1 style={{ marginBottom: '40px', color: '#343a40', fontSize: '2.5rem' }}>🎨 미술 교육 커리큘럼</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '25px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {STAGES.map((stage) => (
          <div 
            key={stage.id} 
            onClick={() => navigate(`/draw/${stage.id}`)}
            style={{ 
              padding: '30px 20px', 
              backgroundColor: 'white', 
              borderRadius: '15px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: stage.id === 'free' ? '2px dashed #fcc419' : '2px solid transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }}
          >
            <h3 style={{ margin: 0, color: stage.id === 'free' ? '#f59f00' : '#4dabf7', fontSize: '1.5rem' }}>
              {stage.title}
            </h3>
            <p style={{ color: '#868e96', fontSize: '15px', marginTop: '15px', lineHeight: '1.5' }}>
              {stage.id === 'free' 
                ? '원하는 사진을 올려서 나만의 그림을 그려보세요!' 
                : '기본기부터 탄탄하게 배워봅시다.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { STAGES };
export default Home;
