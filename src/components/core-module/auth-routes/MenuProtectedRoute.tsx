import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../../../store/store';
import { useMenuListQuery } from '../../../store/musafirHomePageApi';
import LoadingScreen from '../loading-screen/LoadingScreen';
import { MenuProtectedRouteProps } from '../../../utility/types/menu-protected-routes/MenuProtectedRoutes';

const MenuProtectedRoute: React.FC<MenuProtectedRouteProps> = ({ menuId }) => {
  const allowedMenuIds = useSelector((state: RootState) => state.menu.allowedMenuIds);
  const location = useLocation();
  // Only call menu API if allowedMenuIds is empty (first mount or after logout)
  const shouldFetchMenu = allowedMenuIds.length === 0;
  const { isLoading: menuLoading } = useMenuListQuery({}, { skip: !shouldFetchMenu });
  const [ready, setReady] = useState(false);
  const menuLoadingRef = useRef(menuLoading);

  useEffect(() => {
    // When menuLoading goes from true to false, start a 3s timer
    if (menuLoadingRef.current && !menuLoading) {
      const timer = setTimeout(() => setReady(true), 500);
      return () => clearTimeout(timer);
    }
    // If still loading, not ready
    if (menuLoading) {
      setReady(false);
    }
    menuLoadingRef.current = menuLoading;
  }, [menuLoading]);

  // Wait for menu API to load and then 3s delay (only if allowedMenuIds is empty)
  if ((menuLoading || !ready) && shouldFetchMenu) {
    return <LoadingScreen isLoading={(menuLoading || !ready) && shouldFetchMenu} />;
  }

  const normalizedAllowed = allowedMenuIds.map(id => id?.trim().toLowerCase());
  const normalizedMenuId = menuId.trim().toLowerCase();

  if (!normalizedAllowed.includes(normalizedMenuId)) {
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default MenuProtectedRoute; 