/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { conversachat } from '../../services/chatbot/chatbot';

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    try {
      const res = await conversachat({ pergunta: userMsg.text });
      const botReply = {
        id: Date.now() + 1,
        text: res.resposta,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      const botError = {
        id: Date.now() + 1,
        text: 'Ocorreu um erro ao processar a pergunta.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botError]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSend();
    }
  }

  return (
    <section className="chatbot-wrapper">
      <div className="chatbot-header">
        <h1 className="chatbot-brand">Fala Doutor AI</h1>
      </div>

      <div className="chatbot-content" ref={contentRef}>
        <div className="messages-container">
          {messages.map(({ id, text, sender }) => (
            <div
              key={id}
              className={`message-bubble ${sender === 'user' ? 'user' : 'bot'}`}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          placeholder="Digite sua pergunta..."
          className="chatbot-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chatbot-button" onClick={handleSend}>Enviar</button>
      </div>
    </section>
  );
}

export default Chatbot;
