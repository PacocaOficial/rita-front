import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes/app-routes';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MessageProvider } from './contexts/message-context';
import { AuthProvider } from './contexts/auth-context';
import { ThemeProvider, useTheme } from './contexts/theme-context'; // Importe o ThemeProvider
import AlertMessage from './components/alerts/alerts-message';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// root.render(
//   <BrowserRouter>
//     <AppRoutes />
//   </BrowserRouter>
// );

root.render(
    <HelmetProvider>
    <BrowserRouter>
        <MessageProvider>
          <AuthProvider>
              <ThemeProvider> {/* Garantindo que ThemeProvider envolve tudo */}
                {/* <AlertMessage /> */}
                <AppRoutes />
              </ThemeProvider>
          </AuthProvider>
        </MessageProvider>
    </BrowserRouter>
  </HelmetProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
