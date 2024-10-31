import React from 'react';
import { useSelector } from 'react-redux';
import { MEMBER_PERMISSIONS } from '../../constants/permissions';

const PermissionGate = ({ permission, children }) => {
  const { user } = useSelector(state => state.auth);
  
  const hasPermission = () => {
    if (!user || !permission) return false;
    return MEMBER_PERMISSIONS[permission].includes(user.role);
  };

  return hasPermission() ? children : null;
};

export default PermissionGate; 