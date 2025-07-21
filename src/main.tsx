import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#393E46',
            color: '#DFD0B8',
            border: '1px solid #948979',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#222831',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#222831',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);