import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const Notes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ name: '', tags: '', description: '', link: '' });
  const [tags, setTags] = useState('');
  const [editForm, setEditForm] = useState({ name: '', tags: '', description: '', link: '' });

  const fetchNotes = async () => {
    const res = await api.get(`/notes/label/${id}`);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const handleAddNote = async () => {
    await api.post(`/notes/label/${id}`, {
      name: noteForm.name,
      description: noteForm.description,
      tags: noteForm.tags.split(',').map(tag => tag.trim()),
      link: noteForm.link,
    });
    setNoteForm({ name: '', tags: '', description: '', link: '' });
    setShowNoteModal(false);
    fetchNotes();
  };

  const handleAddTags = async () => {
    await Promise.all(
      notes.map((note) =>
        api.patch(`/notes/${note._id}/tags`, {
          tags: tags.split(',').map((tag) => tag.trim()),
        })
      )
    );
    setTags('');
    setShowTagModal(false);
    fetchNotes();
  };

  const handleBookmark = async (note) => {
    await api.patch(`/notes/${note._id}/bookmark`, { bookmarked: !note.bookmarked });
    fetchNotes();
  };

  const handleDeleteNote = async (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      await api.delete(`/notes/${noteId}`);
      setSelectedNote(null);
      fetchNotes();
    }
  };

  const handleEditNote = async () => {
    await api.patch(`/notes/${selectedNote._id}`, {
      name: editForm.name,
      tags: editForm.tags.split(',').map((tag) => tag.trim()),
      description: editForm.description,
      link: editForm.link,
    });
    setSelectedNote(null);
    fetchNotes();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notes</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowNoteModal(true)} className="bg-purple-500 text-white px-4 py-2 rounded">
            Add Note
          </button>
          <button onClick={() => setShowTagModal(true)} className="bg-purple-500 text-white px-4 py-2 rounded">
            Add Tags
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="border rounded p-4 shadow bg-white relative">
            <h3 className="font-bold text-lg">{note.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Tags: {note.tags.join(', ')}</p>
            <p className="mt-2 text-gray-700">
              {note.description.length > 100 ? note.description.slice(0, 100) + '...' : note.description}
            </p>
            <button
              onClick={() => handleBookmark(note)}
              className={`absolute top-2 right-2 text-xl ${note.bookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
              title="Bookmark"
            >
              ★
            </button>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  setSelectedNote(note);
                  setEditForm({
                    name: note.name,
                    tags: note.tags.join(', '),
                    description: note.description,
                    link: note.link || '',
                  });
                }}
                className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Note</h2>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Note Title"
              value={noteForm.name}
              onChange={(e) => setNoteForm({ ...noteForm, name: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Tags (comma separated)"
              value={noteForm.tags}
              onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={noteForm.description}
              onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-4"
              placeholder="Link (optional)"
              value={noteForm.link}
              onChange={(e) => setNoteForm({ ...noteForm, link: e.target.value })}
            />
            <button onClick={handleAddNote} className="bg-purple-500 text-white px-4 py-2 rounded w-full">
              Add
            </button>
          </div>
        </div>
      )}

      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Tags to All Notes</h2>
            <textarea
              className="border p-2 w-full mb-4"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button onClick={handleAddTags} className="bg-purple-500 text-white px-4 py-2 rounded w-full">
              Add Tags
            </button>
          </div>
        </div>
      )}

      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <input
              className="border p-2 w-full mb-2"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-4"
              value={editForm.link}
              onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
            />
            <button
              onClick={handleEditNote}
              className="bg-purple-500 text-white px-4 py-2 rounded w-full mb-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedNote(null)}
              className="text-gray-500 w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
