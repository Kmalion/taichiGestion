'use client'

import Login from '@/components/Login';

const HomePage = () => {


  return (

      <div className={`app-container`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '100px' }}>
          <div className="login-page">
            <Login />
          </div>
        </div>
      </div>

  );
};

export default HomePage;
