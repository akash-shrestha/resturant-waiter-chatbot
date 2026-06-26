import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ConfirmDialog from './components/ConfirmDialog';
import MessageList from './components/MessageList';
import OrderModal from './components/OrderModal';
import { useChat } from './hooks/useChat';
import { useOrder } from './hooks/useOrder';

function App() {
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isClearing,
    historyError,
    isClearDialogOpen,
    clearError,
    messagesEndRef,
    handleSend,
    openClearDialog,
    closeClearDialog,
    confirmClearChat,
  } = useChat();

  const {
    isOrderModalOpen,
    isOrderLoading,
    isConfirmingOrder,
    orderDetails,
    orderError,
    orderConfirmationMessage,
    orderConfirmationType,
    openOrderModal,
    closeOrderModal,
    finalizeOrderConfirmation,
  } = useOrder();

  return (
    <div className="app-shell">
      <section className="chat-panel">
        <ChatHeader
          onClearChat={openClearDialog}
          onShowOrder={openOrderModal}
          onConfirmOrder={openOrderModal}
          isTyping={isTyping}
          isClearing={isClearing}
          hasMessages={messages.length > 0}
          isOrderLoading={isOrderLoading}
          isConfirmingOrder={isConfirmingOrder}
        />
        {historyError && <p className="error-message">{historyError}</p>}
        <MessageList messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          disabled={isTyping}
        />
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        isLoading={isOrderLoading}
        isConfirming={isConfirmingOrder}
        orderDetails={orderDetails}
        orderError={orderError}
        confirmationMessage={orderConfirmationMessage}
        confirmationType={orderConfirmationType}
        onConfirm={finalizeOrderConfirmation}
      />

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={closeClearDialog}
        onConfirm={confirmClearChat}
        isLoading={isClearing}
        titleId="clear-dialog-title"
        title="Clear chat?"
        description="This will delete the saved chat history and order details. This action cannot be undone."
        error={clearError}
        confirmLabel="Clear chat"
        loadingLabel="Clearing..."
      />
    </div>
  );
}

export default App;
