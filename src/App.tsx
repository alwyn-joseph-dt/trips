// // src/App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// import PageNotFound from './pages/PagNotFound'
// import './Styles.scss';

// const App: React.FC = () => (
  
//   <Router>
//     <Routes>
//        {/* <Route path="/AirportMaster" element={<AirportMasterTable />} />
//         <Route path="/AirlineMaster" element={<AirlineMasterTable />} /> */}
//         {/* <Route path="*" element={<PageNotFound />} /> */}
//     </Routes>
//   </Router>
// );

// export default App;
import Router from "./routes/Router";
import i18n from 'i18next';
import rtlCache from './rtlCache';
import { CacheProvider } from "@emotion/react";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthInitializer from "./components/core-module/auth-initializer/AuthInitializer";

const App: React.FC = (): JSX.Element => {
  const isArabic = (lang: string) => ['ar', 'ar-SA'].includes(lang);
  const [isRtl, setIsRtl] = useState(false);
  i18n.on('languageChanged', (lng) => {
    const direction = isArabic(lng) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    if (direction == 'rtl') {
      setIsRtl(true);
      localStorage.setItem("isRtl", "true");
    }
    else {
      setIsRtl(false);
      localStorage.setItem("isRtl", "false");
    }
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        {isRtl ? (
          <CacheProvider value={rtlCache}>
            <AuthInitializer>
              <Router />
            </AuthInitializer>
          </CacheProvider>
        ) : (
          <AuthInitializer>
            <Router />
          </AuthInitializer>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default App;
