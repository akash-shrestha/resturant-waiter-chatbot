import ModalBackdrop from './ModalBackdrop';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  titleId,
  description,
  error,
  confirmLabel,
  loadingLabel,
  cancelLabel = 'Cancel',
  confirmClassName = 'dialog-danger-button',
}) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose} preventClose={isLoading}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="confirm-dialog-header">
          <p className="eyebrow">Confirmation</p>
          <h2 id={titleId}>{title}</h2>
        </div>
        <div className="confirm-dialog-body">
          <p>{description}</p>
          {error && <p className="confirm-dialog-error">{error}</p>}
        </div>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="dialog-cancel-button"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClassName}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </ModalBackdrop>
  );
}
