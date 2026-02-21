import React from 'react';
import InstagramProfile from '../components/InstagramProfile';
import { useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');

  let profileId = username;
  if (!profileId) {
    profileId = currentUser?.id;
  }

  if (!profileId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User ID not available.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <InstagramProfile profileId={profileId} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;
