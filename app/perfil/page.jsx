'use client'
import Profile from '@/components/profile/Profile'
import Layout from '../../components/Layout';


function ProfilePage() {

  return (
    <Layout>
   <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
        <div className="flex justifify-context-center width: 100%">
          <Profile/>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default ProfilePage;
