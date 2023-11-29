import Login from '@/components/Login';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '150px' }}>
      <div className="login-page">
        <Login />
      </div>
    </div>
  );
};

export default HomePage;
