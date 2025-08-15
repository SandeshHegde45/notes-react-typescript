import React from "react";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onCancel, onConfirm }: Props): JSX.Element {
  return (
    <div className= {`modal-overlay ${isOpen ? "active" : ""}`
} onMouseDown = { onCancel } >
  <div className="modal confirmation-modal" onMouseDown = {(e) => e.stopPropagation()}>
    <div className="modal-body" >
      <p className="confirmation-text" > Are you sure you want to delete this note ? </p>
        < div className = "confirmation-buttons" >
          <button className="confirmation-btn cancel-btn" onClick = { onCancel } > Cancel </button>
            < button className = "confirmation-btn confirm-btn" onClick = { onConfirm } > Delete </button>
              </div>
              </div>
              </div>
              </div>
  );
}