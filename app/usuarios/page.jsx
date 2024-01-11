'use client'
import React from 'react';
import UsersList from '@/components/users/UserList';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
    <div>
      <UsersList></UsersList>
      </div>
      </Layout>
  );
}
