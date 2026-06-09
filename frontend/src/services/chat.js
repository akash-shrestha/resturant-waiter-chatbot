// handle responses that are not always in the exact same format.
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
  const url = `${import.meta.env.VITE_API_URL}/chat`;
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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`);
  const body = await response.json();

  if (!response.ok) { 
    throw new Error('Failed to load chat history')
  }

  return body
}

export async function clearChatHistory(params) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
    method: 'DELETE'
  });

  const body = await parseResponseBody(response);
  if (!response.ok) {
    throw new Error(body || 'Failed to clear chat history');
  }

  return body;
}

export async function getOrder() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/order`)
  const body = await response.json();

  if (!response.ok) {
    throw new Error('Failed to load chat history')
  }

  return body
}