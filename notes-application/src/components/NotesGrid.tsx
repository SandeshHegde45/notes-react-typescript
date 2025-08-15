import React from "react";
import NoteCard from "./NoteCard";
import { Note } from "../types/types";

interface Props {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  formatDate: (iso: string) => string;
}

export default function NotesGrid({ notes, onDelete, onEdit, formatDate }: Props): JSX.Element {
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={() => onDelete(note.id)}
          onEdit={() => onEdit(note.id)}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}