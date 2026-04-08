import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from './services/chat';

const HEADER_HELPER = 'Ask for ingredients, availability, or confirm your order.';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
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

  const handleClearChat = async () => {
    const confirmed = window.confirm(
      'Clear this chat? This will delete the saved history and cannot be undone.'
    );
    if (!confirmed || isClearing) return;
    setIsClearing(true);
    try {
      await clearChatHistory();
      setMessages([])
    } catch (error) {
      console.log(error);
      alert('Could not clear chat history. Please try again later.');
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="app-shell">
      <section className="chat-panel">
        <header>
          <div>
            <p className="eyebrow">Chat</p>
            <h1>Talk to Cheffy</h1>
          </div>
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
          </div>
        </header>
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <span className="sender">{message.role === 'bot' ? 'Cheffy' : 'You'}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {messages.length === 0 && isTyping && (
            <div className="message bot typing">
              <span className="sender">Cheffy</span>
              <p>Loading today’s menu…</p>
            </div>
          )}
          {isTyping && messages.length > 0 && (
            <div className="message bot typing">
              <span className="sender">Cheffy</span>
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type a question or request..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !inputValue.trim()}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
