import React from 'react';
import InstagramProfile from '../components/InstagramProfile';
import { useParams } from 'react-router-dom';

// Define the props interface to accept isOwnProfile
interface ProfilePageProps {
  isOwnProfile?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isOwnProfile: isOwnProfileProp }) => {
  const { username } = useParams<{ username: string }>();
  // Fallback to localStorage is kept for robustness
  const currentUser = JSON.parse(localStorage.getItem('zenith_user') || '{}');

  // If a username is in the URL, we view that profile. Otherwise, we view our own.
  const profileId = username || currentUser?.id;

  if (!profileId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User ID not available.</p>
      </div>
    );
  }

  // The prop from the router takes precedence. If it's not passed (e.g., for /profile/:username),
  // we calculate it by comparing the current user's ID to the ID being viewed.
  const isOwnProfile = isOwnProfileProp !== undefined ? isOwnProfileProp : currentUser?.id === profileId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <InstagramProfile profileId={profileId} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;
