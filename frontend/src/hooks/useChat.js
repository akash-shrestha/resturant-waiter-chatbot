import { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/chat';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [clearError, setClearError] = useState('');
  const messagesEndRef = useRef(null);

  const loadChatHistory = useCallback(async () => {
    setIsTyping(true);
    try {
      const history = await getChatHistory();
      const normalized = history.map((msg) => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'bot' : 'user',
        text: msg.content,
      }));
      setMessages(normalized);
    } catch (error) {
      console.error(error);
      setMessages([]);
      setHistoryError('Could not load chat history. Please refresh the page to try again.');
    } finally {
      setIsTyping(false);
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

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
          text: 'Sorry, the AI service is unreachable. Please try again later.',
        });
      } finally {
        setIsTyping(false);
      }
    },
    [appendMessage]
  );

  const handleSend = useCallback(
    (event) => {
      event?.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed || isTyping) return;
      appendMessage({ role: 'user', text: trimmed });
      setInputValue('');
      handleBotReply(trimmed);
    },
    [inputValue, isTyping, appendMessage, handleBotReply]
  );

  const openClearDialog = useCallback(() => {
    setClearError('');
    setIsClearDialogOpen(true);
  }, []);

  const closeClearDialog = useCallback(() => {
    setIsClearDialogOpen(false);
  }, []);

  const confirmClearChat = useCallback(async () => {
    if (isClearing) return;
    setIsClearing(true);
    setClearError('');
    try {
      await clearChatHistory();
      setIsClearDialogOpen(false);
      loadChatHistory();
    } catch (error) {
      console.error(error);
      setClearError('Could not clear chat history. Please try again later.');
    } finally {
      setIsClearing(false);
    }
  }, [isClearing, loadChatHistory]);

  return {
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
  };
}
