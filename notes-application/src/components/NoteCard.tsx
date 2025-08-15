import React from "react";
import { Note } from "../types/types";

interface Props {
  note: Note;
  onDelete: () => void;
  onEdit: () => void;
  formatDate: (iso: string) => string;
}

function getTagClass(tag: string) {
  return {
    work: "tag-work",
    personal: "tag-personal",
    ideas: "tag-ideas",
    reminders: "tag-reminders",
  }[tag] || "";
}

function getTagIcon(tag: string) {
  return {
    work: <i className="fas fa-briefcase" />,
    personal: <i className="fas fa-user" />,
    ideas: <i className="fas fa-lightbulb" />,
    reminders: <i className="fas fa-bell" />,
  }[tag] || null;
}

function pickGradient(note: Note): string {
  const palettes: Record<string, [string, string]> = {
    work: ["#11998e", "#38ef7d"],
    personal: ["#667eea", "#764ba2"],
    ideas: ["#ffd166", "#ef476f"],
    reminders: ["#ff7e5f", "#feb47b"],
    default1: ["#84fab0", "#8fd3f4"],
    default2: ["#fbc2eb", "#a6c1ee"],
    default3: ["#fddb92", "#d1fdff"],
    default4: ["#c6ffdd", "#fbd786"],
  };

  if (note.tag && palettes[note.tag]) {
    const p = palettes[note.tag];
    return `linear-gradient(135deg, ${p[0]}, ${p[1]})`;
  }

  // deterministic pick based on id so cards stay consistent
  const idStr = String(note.id);
  let sum = 0;
  for (let i = 0; i < idStr.length; i++) sum += idStr.charCodeAt(i);
  const keys = ["default1", "default2", "default3", "default4"];
  const pick = keys[sum % keys.length];
  const p = palettes[pick];
  return `linear-gradient(135deg, ${p[0]}, ${p[1]})`;
}

export default function NoteCard({ note, onDelete, onEdit, formatDate }: Props): JSX.Element {
  const bg = pickGradient(note);

  return (
    <div className="note-card fade-in" style={{ background: bg, color: "#0b1220" }}>
      <div className="note-content">
        <div className="note-header">
          <div className="note-title" title={note.title}>{note.title}</div>
          <div className="note-actions">
            <button className="edit-btn" onClick={onEdit} aria-label="Edit note" title="Edit">
              <i className="fas fa-edit" />
            </button>
            <button className="delete-btn" onClick={onDelete} aria-label="Delete note" title="Delete">
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div className="note-text">{note.content}</div>
        <div className="note-footer">
          <span className={`note-tag ${getTagClass(note.tag)}`}>
            {getTagIcon(note.tag)}
            {note.tag && (
              <span style={{ marginLeft: 8 }}>
                {note.tag.charAt(0).toUpperCase() + note.tag.slice(1)}
              </span>
            )}
          </span>
          <span className="note-date">{formatDate(note.date)}</span>
        </div>
      </div>
    </div>
  );
}