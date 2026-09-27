import { useAuthIntent } from '../context/AuthIntentContext';

export const useRequireAuth = () => {
  const auth = useAuthIntent();

  const requireAuth = (callback) => () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    if (user && token) {
      callback();
    } else if (auth && typeof auth.setIntent === 'function') {
      // store current location as intended destination
      auth.setIntent({ pathname: window.location.pathname, state: {} });
      // The AuthGate will show modal automatically
    } else {
      console.warn('Auth context not available');
    }
  };

  return { requireAuth };
};
