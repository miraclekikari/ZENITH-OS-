import React from 'react';
import InstagramProfile from '../components/InstagramProfile';
import { useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User ID not provided</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <InstagramProfile profileId={userId} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;
