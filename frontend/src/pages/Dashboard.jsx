import { useState, useEffect } from 'react';
import { getNotes, createNote } from '../services/api';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:3000');

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  useEffect(() => {
    fetchNotes();

    socket.on('noteUpdated', (updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.noteId ? { ...note, details: [{ content: updatedNote.content }] } : note
        )
      );
    });

    return () => socket.off('noteUpdated');
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    const res = await getNotes(token);
    setNotes(res);
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle) return alert('Title cannot be empty');
    const token = localStorage.getItem('token');

    try {
      await createNote(newNoteTitle, token);
      fetchNotes(); // Refresh notes list
      setShowModal(false);
      setNewNoteTitle('');
    } catch (error) {
      alert('Failed to create note');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setContent(note.details.length ? note.details[0].content : '');
  };

  const handleSave = async () => {
    if (!editingNote) return;

    try {
      await updateNote(editingNote.id, content);
      socket.emit('updateNote', { noteId: editingNote.id, content });
      setEditingNote(null);
    } catch (error) {
      alert('Failed to update note');
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">My Notes</h2>

      {/* Create Note Button */}
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>+ Create Note</button>

      <ul className="list-group">
        {notes.map((note) => (
          <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{note.title}</h5>
              <p>Owner: {note.owner}</p>
            </div>
            {editingNote && editingNote.id === note.id ? (
              <>
                <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
                <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
              </>
            ) : (
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(note)}>Edit</button>
            )}
          </li>
        ))}
      </ul>

      {/* Modal for Creating Notes */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Note</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Note Title"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateNote}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
