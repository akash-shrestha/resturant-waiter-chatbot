function MessageBubble({ role, text }) {
  return (
    <div className={`message ${role}`}>
      <span className="sender">{role === 'bot' ? 'Gita' : 'You'}</span>
      <p>{text}</p>
    </div>
  );
}

function TypingIndicator({ text }) {
  return (
    <div className="message bot typing">
      <span className="sender">Gita</span>
      <p>{text}</p>
    </div>
  );
}

export default function MessageList({ messages, isTyping, messagesEndRef }) {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id ?? index}
          role={message.role}
          text={message.text}
        />
      ))}
      {messages.length === 0 && isTyping && (
        <TypingIndicator text="Loading today’s menu…" />
      )}
      {isTyping && messages.length > 0 && <TypingIndicator text="Thinking..." />}
      <div ref={messagesEndRef} />
    </div>
  );
}
