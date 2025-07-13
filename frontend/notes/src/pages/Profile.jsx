import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchBookmarkedNotes = async () => {
    const res = await api.get('/notes/bookmarked');
    setBookmarkedNotes(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const res = await api.get(`/notes/search?tag=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchBookmarkedNotes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-300"></div>
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-600">{user.email}</p>
        <Link
to="/update-profile"
className="mt-2 inline-block text-purple-600 underline text-sm"
>
Update Profile / Change Password
</Link>

          
          <button
            onClick={handleLogout}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Log Out
          </button>

        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter tag name"
            className="border p-2 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-2">Search Results:</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((note) => (
              <div key={note._id} className="border p-4 rounded shadow bg-white">
                <h4 className="font-bold mb-2 truncate">{note.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {note.description.substring(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-1 text-xs text-purple-600 mb-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="bg-purple-100 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-center">Bookmarked Notes</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedNotes.map((note) => (
            <div key={note._id} className="border p-4 rounded shadow bg-white">
              <h4 className="font-bold mb-2 truncate">{note.name}</h4>
              <p className="text-sm text-gray-500 mb-2">
                {note.description.substring(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-1 text-xs text-purple-600 mb-2">
                {note.tags.map((tag) => (
                  <span key={tag} className="bg-purple-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              
                <Link to={`/label/${note.label._id}`}

                className="text-blue-500 text-sm underline"
              >
                Full note
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
