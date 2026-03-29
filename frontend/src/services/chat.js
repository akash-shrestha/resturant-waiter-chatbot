async function parseResponseBody(response) {
  const raw = await response.text();
  if (!raw) return '';

  try {
    const payload = JSON.parse(raw);
    if (typeof payload === 'string') return payload;
    return payload.reply ?? payload.message ?? JSON.stringify(payload);
  } catch {
    return raw;
  }
}

export async function sendChatMessage(message) {
  const url = `/chat`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({message})
  });

  const body = await parseResponseBody(response);
  if (!response.ok) {
    throw new Error(body || 'Chat service failed');
  }

  return body;
}

export async function getChatHistory() {
  const response = await fetch('/chat');
  const body = await response.json();

  if (!response.ok) { 
    throw new Error('Failed to load chat history')
  }

  return body
}
