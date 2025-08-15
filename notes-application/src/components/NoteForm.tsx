import React, { useEffect, useState } from "react";
import { Note } from "../types/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // onSave receives the form data; when editing the App will call update if initial is provided
  onSave: (note: { title: string; content: string; tag: string }) => void;
  initial?: Note;
}

export default function NoteForm({ isOpen, onClose, onSave, initial }: Props): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setContent("");
      setTag("");
      return;
    }
    // populate fields when opening for edit
    if (initial) {
      setTitle(initial.title);
      setContent(initial.content);
      setTag(initial.tag || "");
    } else {
      setTitle("");
      setContent("");
      setTag("");
    }
  }, [isOpen, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), tag });
  }

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{initial ? "Edit Note" : "New Note"}</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <form className="modal-body" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-input form-textarea" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-container">
              <label className="tag-option">
                <input type="radio" name="noteTag" value="work" className="tag-radio" checked={tag === "work"} onChange={() => setTag("work")} />
                <span className="tag-label tag-work"><i className="fas fa-briefcase" /> Work</span>
              </label>
              <label className="tag-option">
                <input type="radio" name="noteTag" value="personal" className="tag-radio" checked={tag === "personal"} onChange={() => setTag("personal")} />
                <span className="tag-label tag-personal"><i className="fas fa-user" /> Personal</span>
              </label>
              <label className="tag-option">
                <input type="radio" name="noteTag" value="ideas" className="tag-radio" checked={tag === "ideas"} onChange={() => setTag("ideas")} />
                <span className="tag-label tag-ideas"><i className="fas fa-lightbulb" /> Ideas</span>
              </label>
              <label className="tag-option">
                <input type="radio" name="noteTag" value="reminders" className="tag-radio" checked={tag === "reminders"} onChange={() => setTag("reminders")} />
                <span className="tag-label tag-reminders"><i className="fas fa-bell" /> Reminder</span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn"> Save Note </button>
        </form>
      </div>
    </div>
  );
}