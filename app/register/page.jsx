'use client'
import Register from '@/components/register/Register'
import Layout from '../../components/Layout';


function RegisterPage() {

  return (
    <Layout>
   <div className={`app-container`}>
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', marginTop: '50px' }}>
   <div className="register-page">
      <Register/>
    </div>
    </div>
    </div>
    </Layout>
  );
}

export default RegisterPage;
