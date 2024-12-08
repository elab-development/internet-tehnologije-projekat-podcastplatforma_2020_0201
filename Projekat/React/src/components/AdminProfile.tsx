// AdminProfile.tsx
import React from 'react';
import NavigationMenu from './NavigationMenu';
import GeneralProfile from './GeneralProfile'; 


interface AdminProfileProps {
}

const AdminProfile: React.FC<AdminProfileProps> = ({
}) => {
  return (
    <div>
      <NavigationMenu userType="administrator" />
      <div className="profile-container">
        <GeneralProfile 
        />
      </div>
    </div>
  );
};



export default AdminProfile;
