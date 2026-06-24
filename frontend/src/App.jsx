import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory, getOrder } from './services/chat';

const HEADER_HELPER = 'Ask for menu, select your items or confirm your order.';

const formatOrderLabel = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatOrderValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Not provided';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

function OrderDetails({ order }) {
  if (!order) {
    return <p className="order-empty">No order details available yet.</p>;
  }

  if (typeof order === 'string') {
    return <p className="order-empty">{order}</p>;
  }

  const customerEntries = order.customer && typeof order.customer === 'object'
    ? Object.entries(order.customer)
    : [];
  const orderItems = Array.isArray(order.order_items) ? order.order_items : [];

  return (
    <>
      <div className="order-summary-grid">
        <div>
          <span>Order ID</span>
          <strong>{order.order_id || 'Not created'}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{order.status || 'Not started'}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{order.total_amount ? `Rs. ${order.total_amount}` : 'Not calculated'}</strong>
        </div>
      </div>

      <div className="order-modal-section">
        <h3>Customer</h3>
        {customerEntries.length > 0 ? (
          <dl className="order-detail-list">
            {customerEntries.map(([key, value]) => (
              <div key={key}>
                <dt>{formatOrderLabel(key)}</dt>
                <dd>{formatOrderValue(value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="order-empty">Customer details not provided yet.</p>
        )}
      </div>

      <div className="order-modal-section">
        <h3>Items</h3>
        {orderItems.length > 0 ? (
          <ul className="order-item-list">
            {orderItems.map((item, index) => (
              <li key={`${item && typeof item === 'object' && item.name ? item.name : 'item'}-${index}`}>
                {item && typeof item === 'object' ? (
                  <>
                    <strong>{item.name || `Item ${index + 1}`}</strong>
                    <span>
                      {Object.entries(item)
                        .filter(([key]) => key !== 'name')
                        .map(([key, value]) => `${formatOrderLabel(key)}: ${formatOrderValue(value)}`)
                        .join(' • ')}
                    </span>
                  </>
                ) : (
                  <strong>{item}</strong>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="order-empty">No items selected yet.</p>
        )}
      </div>
    </>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [clearError, setClearError] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [orderConfirmationMessage, setOrderConfirmationMessage] = useState('');
  const [orderConfirmationType, setOrderConfirmationType] = useState('');
  const messagesEndRef = useRef(null);

  const loadChatHIstory = useCallback(async () => {
    setIsTyping(true);
    try {
      const history = await getChatHistory();
      const normalized = history.map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'bot' : 'user',
        text: msg.content,
      }))
      setMessages(normalized);
    } catch (error) {
      console.error(error);
      setMessages([]);
      setHistoryError('Could not load chat history. Please refresh the page to try again.');
    } finally {
      setIsTyping(false);
    }
  }, []
  );

  useEffect(() => { 
    loadChatHIstory();
  }, [loadChatHIstory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // const fetchInitialMenu = useCallback(async () => {
  //   setIsTyping(true);
  //   try {
  //     const reply = await sendChatMessage('show menu');
  //     console.log("reply", reply)
  //     setMessages([{ role: 'bot', text: reply }]);
  //   } catch (error) {
  //     console.error(error);
  //     setMessages([
  //       {
  //         role: 'bot',
  //         text: 'I could not load the menu right now. Please try again in a moment.'
  //       }
  //     ]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchInitialMenu();
  // }, [fetchInitialMenu]);

  const handleBotReply = useCallback(
    async (prompt) => {
      setIsTyping(true);
      try {
        const reply = await sendChatMessage(prompt);
        appendMessage({ role: 'bot', text: reply });
      } catch (error) {
        console.error(error);
        appendMessage({
          role: 'bot',
          text: 'Sorry, the AI service is unreachable. Please try again later.'
        });
      } finally {
        setIsTyping(false);
      }
    },
    [appendMessage]
  );

  const handleSend = (event) => {
    event?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;
    appendMessage({ role: 'user', text: trimmed });
    setInputValue('');
    handleBotReply(trimmed);
  };

  const handleClearChat = () => {
    setClearError('');
    setIsClearDialogOpen(true);
  }

  const handleConfirmClearChat = async () => {
    if (isClearing) return;
    setIsClearing(true);
    setClearError('');
    try {
      await clearChatHistory();
      setIsClearDialogOpen(false);
      loadChatHIstory();
    } catch (error) {
      console.log(error);
      setClearError('Could not clear chat history. Please try again later.');
    } finally {
      setIsClearing(false)
    }
  }

  const handleShowOrder = async () => {
    setIsOrderModalOpen(true);
    setIsOrderLoading(true);
    setOrderError('');
    setOrderConfirmationMessage('');
    setOrderConfirmationType('');
    try {
      const response = await getOrder();
      setOrderDetails(response);
    } catch (error) {
      console.log(error);
      setOrderDetails(null);
      setOrderError('Could not load order details. Please try again later.');
    } finally {
      setIsOrderLoading(false);
    }
  }

  const handleConfirmOrder = async () => {
    handleShowOrder();
  }

  const handleFinalizeOrderConfirmation = async () => {
    if (isConfirmingOrder) return;
    setIsConfirmingOrder(true);
    setOrderConfirmationMessage('');
    setOrderConfirmationType('');
    try {
      const response = await getOrder();
      setOrderDetails(response);
      if (response.status === "ready_for_confirmation") {
        setOrderConfirmationMessage('Order confirmed!');
        setOrderConfirmationType('success');
      }
      else {
        setOrderConfirmationMessage('Please provide the required details for order completion and proceed.');
        setOrderConfirmationType('warning');
      }
    }
    catch (error) {
      console.log(error)
      setOrderConfirmationMessage('Could not confirm order. Please try again later.');
      setOrderConfirmationType('error');
    } finally {
      setIsConfirmingOrder(false);
    }
  }

  return (
    <div className="app-shell">
      <section className="chat-panel">
        <header>
          <div>
            <p className="eyebrow">Chat</p>
            <h1>Talk to Gita 💁‍♀️</h1>
          </div>
          <div className='header-cover'>
          <div className='header-actions'>
            <p className='header-meta'>{HEADER_HELPER}</p>
            <button
              type='button'
              className='clear-chat-button'
              onClick={handleClearChat}
              disabled={isTyping || isClearing || messages.length === 0}
            >
            {isClearing ? 'Clearing...' : 'Clear chat'}
            </button>
            <button
              type='button'
              onClick={handleShowOrder}
              className='show-order-button'
              disabled={isOrderLoading}
            >
              {isOrderLoading ? 'Loading...' : 'Show order'}
            </button>
            </div>
            <button
              type='button'
              onClick={handleConfirmOrder}
              className='confirm-order-button'
              disabled={isOrderLoading || isConfirmingOrder}
            >
              Confirm order
            </button>
          </div>
        </header>
        {historyError && (
          <p className='error-message'>{historyError}</p>
        )}
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <span className="sender">{message.role === 'bot' ? 'Gita' : 'You'}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {messages.length === 0 && isTyping && (
            <div className="message bot typing">
              <span className="sender">Gita</span>
              <p>Loading today’s menu…</p>
            </div>
          )}
          {isTyping && messages.length > 0 && (
            <div className="message bot typing">
              <span className="sender">Gita</span>
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Chat..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !inputValue.trim()}>
            Send
          </button>
        </form>
      </section>
      {isOrderModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (!isConfirmingOrder && event.target === event.currentTarget) {
              setIsOrderModalOpen(false);
            }
          }}
        >
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
                onClick={() => setIsOrderModalOpen(false)}
                disabled={isConfirmingOrder}
                aria-label="Close order details"
              >
                ×
              </button>
            </div>
            <div className="order-modal-body">
              {isOrderLoading && <p className="order-empty">Loading order details...</p>}
              {!isOrderLoading && orderError && (
                <p className="order-modal-error">{orderError}</p>
              )}
              {!isOrderLoading && !orderError && <OrderDetails order={orderDetails} />}
            </div>
            <div className="order-modal-footer">
              {orderConfirmationMessage && (
                <p className={`order-confirmation-message ${orderConfirmationType}`}>
                  {orderConfirmationMessage}
                </p>
              )}
              <div className="order-modal-actions">
                <button
                  type="button"
                  className="dialog-cancel-button"
                  onClick={() => setIsOrderModalOpen(false)}
                  disabled={isConfirmingOrder}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="order-confirm-button"
                  onClick={handleFinalizeOrderConfirmation}
                  disabled={isOrderLoading || isConfirmingOrder || Boolean(orderError)}
                >
                  {isConfirmingOrder ? 'Confirming...' : 'Confirm order'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
      {isClearDialogOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (!isClearing && event.target === event.currentTarget) {
              setIsClearDialogOpen(false);
            }
          }}
        >
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
          >
            <div className="confirm-dialog-header">
              <p className="eyebrow">Confirmation</p>
              <h2 id="clear-dialog-title">Clear chat?</h2>
            </div>
            <div className="confirm-dialog-body">
              <p>
                This will delete the saved chat history and order details. This action cannot be undone.
              </p>
              {clearError && <p className="confirm-dialog-error">{clearError}</p>}
            </div>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="dialog-cancel-button"
                onClick={() => setIsClearDialogOpen(false)}
                disabled={isClearing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dialog-danger-button"
                onClick={handleConfirmClearChat}
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Clear chat'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
