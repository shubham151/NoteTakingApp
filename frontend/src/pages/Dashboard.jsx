import { useState, useEffect } from "react";
import { getNotes, createNote, updateNote, shareNote } from "../services/api";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Dashboard.module.css";

const token = localStorage.getItem("token");
const socket = io("http://localhost:3000", {
  auth: { token },
});

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingField, setEditingField] = useState(null);

  // Dictionary storing { [noteId]: { title, content } }
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    fetchNotes();

    socket.on("noteUpdated", (updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.noteId
            ? {
                ...note,
                title: updatedNote.title,
                details: [{ content: updatedNote.content }],
              }
            : note
        )
      );
    });

    return () => socket.off("noteUpdated");
  }, []);

  // Fetch the initial notes from your API
  const fetchNotes = async () => {
    try {
      const res = await getNotes(token);
      setNotes(res);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create a new note, add it at the top, and prepare it for immediate editing
  const handleCreateNote = async () => {
    try {
      const newNote = await createNote("Untitled Note", token);

      // Insert the brand-new note at the top of local state
      setNotes((prevNotes) => [
        { id: newNote.id, title: "Untitled Note", details: [{ content: "" }] },
        ...prevNotes,
      ]);

      // Set up temporary data so user can edit right away
      setTempData((prev) => ({
        ...prev,
        [newNote.id]: { title: "Untitled Note", content: "" },
      }));

      // Focus on the title immediately
      setEditingNoteId(newNote.id);
      setEditingField("title");
    } catch (error) {
      alert("Failed to create note");
    }
  };

  // When user clicks a note's title or content
  const handleEdit = (note, field) => {
    // If we're already editing the same note + field, do nothing
    if (editingNoteId === note.id && editingField === field) return;

    setEditingNoteId(note.id);
    setEditingField(field);

    // Initialize temp data if not yet present
    setTempData((prev) => ({
      ...prev,
      [note.id]: {
        // If we already stored something for this note, use that
        // Else fallback to the actual note data
        title:
          prev[note.id]?.title ??
          (note.title && note.title !== "Untitled Note" ? note.title : ""),
        content:
          prev[note.id]?.content ??
          (note.details.length ? note.details[0].content : ""),
      },
    }));
  };

  // On blur, save changes to the backend and update local state
  const handleBlur = async () => {
    if (!editingNoteId) return;

    // Grab the in-progress data
    const { title = "", content = "" } = tempData[editingNoteId] || {};

    // If user typed only whitespace or empty, fallback
    const finalTitle = title.trim() === "" ? "Untitled Note" : title.trim();
    const finalContent = content;

    try {
      // Send update to the server
      await updateNote(editingNoteId, finalContent, finalTitle);

      // Emit socket event to keep all clients in sync
      socket.emit("updateNote", {
        noteId: editingNoteId,
        title: finalTitle,
        content: finalContent,
      });

      // Update local notes array
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title: finalTitle,
                details: [{ content: finalContent }],
              }
            : note
        )
      );
    } catch (error) {
      alert("Failed to update note");
    }

    // Clear edit mode
    setEditingNoteId(null);
    setEditingField(null);
  };

  // Helpers to update temp data as user types
  const handleTitleChange = (noteId, newTitle) => {
    setTempData((prev) => ({
      ...prev,
      [noteId]: {
        ...prev[noteId],
        title: newTitle,
      },
    }));
  };

  const handleContentChange = (noteId, newContent) => {
    setTempData((prev) => ({
      ...prev,
      [noteId]: {
        ...prev[noteId],
        content: newContent,
      },
    }));
  };

  // 🔹 New: Handle Share
  const handleShare = async (note) => {
    // Prompt for username to share with
    const usernameToShare = prompt("Enter username to share this note:");
    if (!usernameToShare) return; // User pressed Cancel or typed empty

    try {
      await shareNote(note.id, usernameToShare);
      alert(`Note shared with "${usernameToShare}" successfully!`);
      // Optionally: update local state if you want to track who it's shared with
    } catch (error) {
      alert(`Failed to share note: ${error.message}`);
    }
  };

  return (
    <div className="container-fluid mt-5 pt-5">
      <h2 className="text-center mb-4">My Notes</h2>

      <button className="btn btn-primary mb-3" onClick={handleCreateNote}>
        + Create Note
      </button>

      <div className="row">
        {notes.map((note) => {
          const { id } = note;
          // Grab the temporary data for this note (if any)
          const tempTitle = tempData[id]?.title ?? note.title ?? "";
          const tempContent =
            tempData[id]?.content ??
            (note.details.length ? note.details[0].content : "");

          return (
            <div key={id} className="col-md-4 col-lg-2 mb-4">
              <div
                className={`${styles.noteCard} ${
                  editingNoteId === id ? styles.expandedCard : ""
                }`}
                onClick={() => handleEdit(note, "content")}
              >
                {/* Editable Title */}
                <div
                  className={styles.noteHeader}
                  onClick={(e) => {
                    // Prevent the parent's onClick from firing
                    e.stopPropagation();
                    handleEdit(note, "title");
                  }}
                >
                  {editingNoteId === id && editingField === "title" ? (
                    <input
                      className={styles.editableTitle}
                      value={tempTitle}
                      onChange={(e) => handleTitleChange(id, e.target.value)}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    <span className={styles.fullWidth}>
                      {note.title && note.title !== "Untitled Note"
                        ? note.title
                        : tempTitle || "Untitled Note"}
                    </span>
                  )}
                </div>

                {/* Editable Content */}
                <div
                  className={styles.noteContent}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(note, "content");
                  }}
                >
                  {editingNoteId === id && editingField === "content" ? (
                    <textarea
                      className={styles.editableContent}
                      value={tempContent}
                      onChange={(e) => handleContentChange(id, e.target.value)}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    <p className={styles.fullWidth}>
                      {note.details.length
                        ? note.details[0].content
                        : tempContent || "Click to edit note..."}
                    </p>
                  )}
                </div>
              </div>

              {/* Share Button */}
              <div className="d-flex justify-content-end mt-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent note click event
                    handleShare(note);
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
