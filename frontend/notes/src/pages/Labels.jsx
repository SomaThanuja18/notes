import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

const Labels = () => {
  const [labels, setLabels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [editingLabel, setEditingLabel] = useState(null);
  const [editLabelName, setEditLabelName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchLabels = async () => {
    const res = await api.get('/labels');
    setLabels(res.data);
  };

  const handleAddLabel = async () => {
    if (newLabelName.trim()) {
      await api.post('/labels', { name: newLabelName });
      setNewLabelName('');
      setShowAddModal(false);
      fetchLabels();
    }
  };

  const handleUpdateLabel = async () => {
    if (editLabelName.trim()) {
      await api.patch(`/labels/${editingLabel._id}`, { name: editLabelName });
      setEditingLabel(null);
      fetchLabels();
    }
  };

  const handleDeleteLabel = async (id) => {
    await api.delete(`/labels/${id}`);
    fetchLabels();
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
    fetchLabels();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Labels</h2>

      <button
        onClick={() => setShowAddModal(true)}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-6"
      >
        Add Label
      </button>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labels.map((label) => (
          <div key={label._id} className="border rounded p-4 shadow bg-white">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{label.name}</div>
              <button
                onClick={() => {
                  setEditingLabel(label);
                  setEditLabelName(label.name);
                }}
                className="text-purple-500 hover:underline text-sm"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <Link
                to={`/label/${label._id}`}
                className="text-blue-500 underline"
              >
                View Notes
              </Link>
              <button
                onClick={() => handleDeleteLabel(label._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Label Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow space-y-4 w-96">
            <h2 className="text-lg font-bold">Add Label</h2>
            <input
              className="border p-2 w-full"
              placeholder="Label Name"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="text-gray-500" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded"
                onClick={handleAddLabel}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Label Modal */}
      {editingLabel && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow space-y-4 w-96">
            <h2 className="text-lg font-bold">Update Label</h2>
            <input
              className="border p-2 w-full"
              value={editLabelName}
              onChange={(e) => setEditLabelName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="text-gray-500" onClick={() => setEditingLabel(null)}>
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateLabel}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Labels;
