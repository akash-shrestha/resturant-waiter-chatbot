const HEADER_HELPER = 'Ask for menu, select your items or confirm your order.';

export default function ChatHeader({
  onClearChat,
  onShowOrder,
  onConfirmOrder,
  isTyping,
  isClearing,
  hasMessages,
  isOrderLoading,
  isConfirmingOrder,
}) {
  return (
    <header>
      <div>
        <p className="eyebrow">Chat</p>
        <h1>Talk to Gita 💁‍♀️</h1>
      </div>
      <div className="header-cover">
        <div className="header-actions">
          <p className="header-meta">{HEADER_HELPER}</p>
          <button
            type="button"
            className="clear-chat-button"
            onClick={onClearChat}
            disabled={isTyping || isClearing || !hasMessages}
          >
            {isClearing ? 'Clearing...' : 'Clear chat'}
          </button>
          <button
            type="button"
            onClick={onShowOrder}
            className="show-order-button"
            disabled={isOrderLoading}
          >
            {isOrderLoading ? 'Loading...' : 'Show order'}
          </button>
        </div>
        <button
          type="button"
          onClick={onConfirmOrder}
          className="confirm-order-button"
          disabled={isOrderLoading || isConfirmingOrder}
        >
          Confirm order
        </button>
      </div>
    </header>
  );
}
