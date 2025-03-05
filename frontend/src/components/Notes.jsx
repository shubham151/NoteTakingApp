import { useState, useEffect } from 'react';
import { getNotes, createNote, deleteNote } from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes(token);
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await createNote(newNote, token);
      fetchNotes();
      setNewNote({ title: '', content: '' });
    } catch (error) {
      console.error('Error creating note', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id, token);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  return (
    <div>
      <h2>My Notes</h2>
      <form onSubmit={handleCreateNote}>
        <input type="text" placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
        <textarea placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}></textarea>
        <button type="submit">Add Note</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
