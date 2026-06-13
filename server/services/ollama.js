const sendToOllama = async (messages, context) => {
  const prompt = JSON.stringify({ context, messages });
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'dungeonmaster',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  });
  const data = await response.json();
  return data.message.content;
};

export default sendToOllama;
