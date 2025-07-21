import React from 'react';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const { username } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile: {username}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {/* Profile content will be implemented later */}
            <p className="text-gray-600">Profile information for {username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;