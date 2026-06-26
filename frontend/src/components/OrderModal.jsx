import ModalBackdrop from './ModalBackdrop';
import OrderDetails from './OrderDetails';

export default function OrderModal({
  isOpen,
  onClose,
  isLoading,
  isConfirming,
  orderDetails,
  orderError,
  confirmationMessage,
  confirmationType,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose} preventClose={isConfirming}>
      <section
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <div className="order-modal-header">
          <div>
            <p className="eyebrow">Current order</p>
            <h2 id="order-modal-title">Order details</h2>
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            disabled={isConfirming}
            aria-label="Close order details"
          >
            ×
          </button>
        </div>
        <div className="order-modal-body">
          {isLoading && <p className="order-empty">Loading order details...</p>}
          {!isLoading && orderError && <p className="order-modal-error">{orderError}</p>}
          {!isLoading && !orderError && <OrderDetails order={orderDetails} />}
        </div>
        <div className="order-modal-footer">
          {confirmationMessage && (
            <p className={`order-confirmation-message ${confirmationType}`}>
              {confirmationMessage}
            </p>
          )}
          <div className="order-modal-actions">
            <button
              type="button"
              className="dialog-cancel-button"
              onClick={onClose}
              disabled={isConfirming}
            >
              Close
            </button>
            <button
              type="button"
              className="order-confirm-button"
              onClick={onConfirm}
              disabled={isLoading || isConfirming || Boolean(orderError)}
            >
              {isConfirming ? 'Confirming...' : 'Confirm order'}
            </button>
          </div>
        </div>
      </section>
    </ModalBackdrop>
  );
}
