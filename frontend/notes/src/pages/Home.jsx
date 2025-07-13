import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-4xl font-bold">#Tagsnote</h1>
      <p className="mt-4 text-lg">Create. Organize. Tags. Easy</p>
      <p className="mt-2 text-gray-600">Inspiration strikes anywhere. Notes are the best place to write down thoughts or to save time.</p>

      <div className="mt-6 flex flex-col gap-4">
        <Link to="/register">
          <button className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600 w-64">
            Create Account
          </button>
        </Link>
        <Link to="/login" className="text-blue-500 hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
};

export default Home;