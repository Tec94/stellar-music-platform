import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createChatMessage, useAppState } from '../context/AppStateContext';

export function ChatPage() {
  const { user, chatMessages, addChatMessage, setChatMessages } = useAppState();
  const [status, setStatus] = useState<'connected' | 'reconnecting'>('connected');
  const [message, setMessage] = useState('');
  const listRef = useRef<HTMLUListElement | null>(null);

  const author = user?.username || user?.email || 'Explorer';
  const channel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      return new BroadcastChannel('adventure-chat');
    }
    return {
      postMessage: () => {},
      close: () => {},
      onmessage: null as BroadcastChannel['onmessage']
    } as BroadcastChannel;
  }, []);

  useEffect(() => {
    channel.onmessage = (event) => {
      if (event.data?.type === 'chat-message') {
        setChatMessages((prev) => [...prev, event.data.payload]);
      }
    };
    return () => channel.close();
  }, [channel, setChatMessages]);

  useEffect(() => {
    const node = listRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage = createChatMessage(author, message.trim());
    addChatMessage(newMessage);
    channel.postMessage({ type: 'chat-message', payload: newMessage });
    setMessage('');
  };

  const simulateDisconnect = () => {
    setStatus('reconnecting');
    setTimeout(() => {
      setStatus('connected');
    }, 1500);
  };

  const restoreConnection = () => {
    setStatus('connected');
  };

  return (
    <section className="page" aria-labelledby="chat-heading">
      <h2 id="chat-heading">Global Chat</h2>
      <p>Status: {status === 'connected' ? 'Connected' : 'Reconnecting...'}</p>
      <div className="chat__actions">
        <button type="button" onClick={simulateDisconnect}>
          Simulate Disconnect
        </button>
        <button type="button" onClick={restoreConnection}>
          Restore Connection
        </button>
      </div>
      <ul ref={listRef} className="chat__messages">
        {chatMessages.map((item) => (
          <li key={item.id}>
            <strong>{item.author}</strong>
            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
      <form className="chat__form" onSubmit={handleSubmit}>
        <label htmlFor="chat-message">Message</label>
        <input
          id="chat-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={status === 'reconnecting'}
        />
        <button type="submit" disabled={status === 'reconnecting'}>
          Send
        </button>
      </form>
    </section>
  );
}
