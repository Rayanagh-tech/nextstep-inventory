import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4 text-red-500">
      <h1 className="text-3xl font-bold">🚫 Unauthorized</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔙 Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
