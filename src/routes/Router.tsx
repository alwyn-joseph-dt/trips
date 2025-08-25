import React, { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AuthRoutes from '../components/core-module/auth-routes/AuthRoutes';
import NotAuthorized from '../pages/NotAuthorized';
import NotFound from '../pages/NotFound';
import OfferPage from '../pages/offer-module/OfferPage';
import { isUserAuthenticated } from '../utility/authHandler';
import { ROUTES } from '../utility/constant';
import SearchProvider from '../utility/context/provider/SearchProvider';
import { LastVisitedProvider } from '../utility/hooks/LastVisitedContext';
import useTitle from '../utility/hooks/useTitle';
import AllTrips from '../pages/my-trips/AllTrips/AllTrips';
import NewTrip from '../pages/my-trips/NewTrip/NewTrip';
import AddNewTraveler from '../pages/my-trips/AddNewTraveler/AddNewTraveler';
/**
 * The main router component for the application. This component is responsible
 * for rendering the correct page based on the current route.
 *
 * @returns The router component.
 */
const Router: React.FC = (): JSX.Element => {
  const [conversationalWay, setConversationalWay] = React.useState(false);
  useTitle();
  if (!localStorage.getItem('templateValue')) {
    localStorage.setItem('templateValue', '0');
    window.dispatchEvent(new Event('template-change'));
  }
  const isAuth = isUserAuthenticated();

  const RouteGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const location = useLocation();
    const validPaths = Object.values(ROUTES) as string[];
    const currentPath = location.pathname;

    if (currentPath === '/') {
      if (isAuth) {
        return <Navigate to={ROUTES.TRIPS} replace />;
      }
      return <Navigate to={ROUTES.TRIPS} replace />;
    }
    if (
      currentPath !== ROUTES.NOTAUTHORIZED &&
      currentPath !== ROUTES.NOTFOUND &&
      !validPaths.includes(currentPath) &&
      isAuth
    ) {
      return <Navigate to={ROUTES.NOTFOUND} replace />;
    } else if (
      currentPath !== ROUTES.NOTAUTHORIZED &&
      currentPath !== ROUTES.NOTFOUND &&
      !validPaths.includes(currentPath) &&
      !isAuth
    ) {
      return <Navigate to={ROUTES.TRIPS} replace />;
    }
    return <>{children}</>;
  };

  return (
    <LastVisitedProvider>
      <SearchProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouteGuard>
            <Routes>
              {/* 🔒 Protected Routes */}
              <Route element={<AuthRoutes />}>
                <Route path={ROUTES.TRIPS} element={<AllTrips />} />
                {/* </Route> */}
                <Route path={ROUTES.NEWTRIP} element={<NewTrip />} />
                {/* </Route> */}
                <Route
                  path={ROUTES.ADDNEWTRAVELER}
                  element={<AddNewTraveler />}
                />
                {/* </Route> */}
              </Route>
              {/* Not Authorized Route */}
              <Route path={ROUTES.NOTAUTHORIZED} element={<NotAuthorized />} />
              <Route path={ROUTES.NOTFOUND} element={<NotFound />} />
              {/* Fallback for any unknown route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </RouteGuard>
        </Suspense>
      </SearchProvider>
    </LastVisitedProvider>
  );
};

export default Router;
