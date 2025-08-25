
import Cookies from 'js-cookie';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';
import { isUserAuthenticated, redirectToLoginApp } from '../../../utility/authHandler';

function AuthRoutes() {
  const location = useLocation();
  const isNewTemplate = (localStorage.getItem("templateValue"))
  // Get cookie value safely
  // const tokenRefreshCookie = JSON.parse(Cookies.get('jeetrt'));
  // const tokenAccessString = Cookies.get('jeetat');
  // const tokenAccessCookie = tokenAccessString ? JSON.parse(tokenAccessString) : null;
   // Check authentication using the new auth handler
  const isAuth = isUserAuthenticated();

    if (!isAuth) {
    // Redirect to login app instead of non-existent login route
    redirectToLoginApp();
    return null; // Return null since redirectToLoginApp handles the navigation
  }
  
  if (isAuth && location.pathname === "/") {
    return <Navigate to={`${ROUTES.TRIPS}?theme=${isNewTemplate}`} replace />;
  }

  return <Outlet />;
}

export default AuthRoutes;