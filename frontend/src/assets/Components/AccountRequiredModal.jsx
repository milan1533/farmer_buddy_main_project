import { useNavigate } from 'react-router-dom';
import { useAuthIntent } from '../../context/AuthIntentContext';

export default function AccountRequiredModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { setIntent } = useAuthIntent();

  if (!isOpen) return null;

  const handleProceed = (path) => {
    // Store current location as the intended destination
    setIntent({ pathname: window.location.pathname, state: {} });
    navigate(path);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Create your free account to continue
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Your account helps us save your activity, plans, scans, and conversations.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleProceed('/register')}
            className="w-full bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition"
          >
            Create Account
          </button>
          <button
            onClick={() => handleProceed('/login')}
            className="w-full border border-primary-600 text-primary-600 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-700 transition"
          >
            Already have an account? Log In
          </button>
          <button onClick={onClose} className="w-full text-gray-600 dark:text-gray-400 underline">
            Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
