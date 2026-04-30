import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useStore } from './store/useStore';

const Root = () => {
  const fetchProducts = useStore(state => state.fetchProducts);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);