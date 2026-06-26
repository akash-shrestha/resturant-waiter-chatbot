export default function ModalBackdrop({ onClose, preventClose = false, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (!preventClose && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}
