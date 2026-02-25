"use client";

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

interface ChatMessage {
  roomId: string;
  content: string;
  sender: string;
  createdAt?: string;
}

export default function RoomsPage() {
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) {
      socket = io({ path: '/api/socket' });
      socket.on('connect', () => {
        console.log('connected');
      });
      socket.on('message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    socket.emit('joinRoom', room);

    // load existing messages
    fetch(`/api/rooms/${room}/messages`)
      .then((r) => r.json())
      .then((data) => setMessages(data || []));

    return () => {
      socket.emit('leaveRoom', room);
    };
  }, [room]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    socket.emit('message', { roomId: room, content: message, sender: 'anonymous' });
    setMessage('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Brewing Rooms</h2>
      <div className="mb-4">
        <label>
          Room:
          <input
            className="border ml-2"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </label>
      </div>
      <div
        ref={messagesRef}
        className="border h-64 overflow-y-auto p-2 mb-4"
      >
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <strong>{m.sender}: </strong>{m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
}
