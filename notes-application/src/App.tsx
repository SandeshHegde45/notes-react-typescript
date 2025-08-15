import React, { useMemo, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import NotesGrid from "./components/NotesGrid";
import NoteForm from "./components/NoteForm";
import ConfirmModal from "./components/ConfirmModal";
import { formatDateTime } from "./utils/formatDate";
import { Note } from "./types/types";

export default function App(): JSX.Element {
    const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    function addNote(note: Omit<Note, "id" | "date">) {
        const noteWithMeta: Note = { id: Date.now(), ...note, date: new Date().toISOString() };
        setNotes((prev) => [noteWithMeta, ...prev]);
        setIsFormOpen(false);
    }

    function updateNote(id: number, patch: { title: string; content: string; tag: string }) {
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...patch, date: new Date().toISOString() } : n))
        );
        setEditingId(null);
        setIsFormOpen(false);
    }

    function openEdit(id: number) {
        setEditingId(id);
        setIsFormOpen(true);
    }

    function requestDelete(id: number) {
        setToDeleteId(id);
        setConfirmOpen(true);
    }

    function confirmDelete() {
        if (toDeleteId == null) return;
        setNotes((prev) => prev.filter((n) => n.id !== toDeleteId));
        setToDeleteId(null);
        setConfirmOpen(false);
        // if we were editing that note, close form
        if (editingId === toDeleteId) {
            setEditingId(null);
            setIsFormOpen(false);
        }
    }

    function cancelDelete() {
        setToDeleteId(null);
        setConfirmOpen(false);
    }

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return notes.filter((n) => {
            const matchesSearch = !s || n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s);
            const matchesFilter = filter === "all" || n.tag === filter;
            return matchesSearch && matchesFilter;
        });
    }, [notes, search, filter]);

    const editingInitial = editingId != null ? notes.find((n) => n.id === editingId) ?? undefined : undefined;

    return (
        <div className="container">
            <header className="header">
                <h1>Perfect Notes</h1>
                <p>Store your thoughts and ideas in style</p>
            </header>

            <div className="controls">
                <div className="controls-container">
                    <input className="search-input" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="filter-group">
                        <select className="filter-select" title="Filter notes by category" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All notes</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="ideas">Ideas</option>
                            <option value="reminders">Reminders</option>
                        </select>
                        <button className="add-btn" onClick={() => { setEditingId(null); setIsFormOpen(true); }}><i className="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </div>

            <NotesGrid
                notes={filtered}
                onDelete={requestDelete}
                onEdit={openEdit}
                formatDate={(iso: string) => formatDateTime(new Date(iso))}
            />

            {filtered.length === 0 && (
                <div className="empty-state">
                    <i className="fas fa-notes-medical"></i>
                    <h3>No Notes</h3>
                    <p>Add your first note by clicking the "Add" button</p>
                </div>
            )}

            <NoteForm
                isOpen={isOpenSafe(isFormOpen)}
                onClose={() => { setIsFormOpen(false); setEditingId(null); }}
                onSave={(data) => {
                    if (editingId != null) updateNote(editingId, data);
                    else addNote(data);
                }}
                initial={editingInitial}
            />
            <ConfirmModal isOpen={confirmOpen} onCancel={cancelDelete} onConfirm={confirmDelete} />
        </div>
    );
}

// helper to satisfy strict boolean use in TSX props (keeps code concise)
function isOpenSafe(val: boolean) {
    return val;
}