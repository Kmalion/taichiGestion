'use client'
import Profile from '@/components/profile/Profile'
import Layout from '../../components/Layout';


function ProfilePage() {

  return (
    <Layout>
   <div className={`app-container`}>
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', marginTop: '20px', marginBottom: '20px' }}>
   <div className="register-page ">
      <Profile/>
    </div>
    </div>
    </div>
    </Layout>
  );
}

export default ProfilePage;
