'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Sparkles, RefreshCw, BookMarked, AlertTriangle, Bot, User } from 'lucide-react';
import { getAanyaResponse, callGeminiAPI, suggestions } from '@/lib/chatResponses';
import styles from './page.module.css';

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'aanya',
  content: `Hey! I'm **Aanya** 🌿 — your safe space counselor.

I'm here to listen, support, and guide you — no judgment, ever. You can tell me anything: how school is going, how you're feeling, what's bothering you at home or with friends, or anything else that's on your mind.

Everything here stays between us. What would you like to talk about today?`,
  time: new Date(),
};

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function MessageBubble({ msg }) {
  const isAanya = msg.role === 'aanya';
  const time = new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`${styles.msgRow} ${isAanya ? styles.aanyaRow : styles.userRow}`}>
      {isAanya && (
        <div className={styles.aanyaAvatar}>
          <span>🌿</span>
        </div>
      )}
      <div className={`${styles.bubble} ${isAanya ? styles.aanyaBubble : styles.userBubble}`}>
        {isAanya && <p className={styles.bubbleName}>Aanya</p>}
        <p
          className={styles.bubbleText}
          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
        />
        <p className={styles.bubbleTime}>{time}</p>
      </div>
      {!isAanya && (
        <div className={`${styles.userAvatar}`}>
          <User size={16} />
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('safespace-chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 1) setMessages(parsed);
      } catch {}
    }
    const key = localStorage.getItem('safespace-gemini-key');
    if (key) setApiKey(key);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('safespace-chat', JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    // Crisis detection
    const lowerText = text.toLowerCase();
    if (/suicid|kill myself|end my life|want to die|hurt myself/.test(lowerText)) {
      setShowCrisis(true);
    }

    // Simulate Aanya thinking (1.5–2.5s)
    const delay = 1500 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, delay));

    let response = null;
    if (apiKey) {
      response = await callGeminiAPI(text, messages, apiKey);
    }
    if (!response) {
      response = getAanyaResponse(text);
    }

    const aanyaMsg = { id: (Date.now() + 1).toString(), role: 'aanya', content: response, time: new Date() };
    setMessages((m) => [...m, aanyaMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem('safespace-chat');
    setShowCrisis(false);
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('safespace-gemini-key', key);
    setShowApiInput(false);
  };

  return (
    <div className="page-wrapper">
      <div className={styles.chatLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.aanyaProfile}>
              <div className={styles.aanyaAvatarLarge}>🌿</div>
              <div>
                <h2 className={styles.aanyaName}>Aanya</h2>
                <p className={styles.aanyaStatus}>
                  <span className={styles.onlineDot} /> Online, ready to listen
                </p>
              </div>
            </div>
            <p className={styles.aanyaDesc}>
              I'm Aanya — a warm, caring AI counselor trained to support Indian teens through real struggles.
            </p>
          </div>

          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Try asking about...</p>
            <div className={styles.suggestionsGrid}>
              {suggestions.slice(0, 6).map((s) => (
                <button
                  key={s}
                  className={styles.suggestionChip}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <p className={styles.sidebarLabel}>Actions</p>
            <button className={`btn btn-ghost btn-sm ${styles.sidebarBtn}`} onClick={clearChat}>
              <RefreshCw size={14} /> New Conversation
            </button>
            <button
              className={`btn btn-ghost btn-sm ${styles.sidebarBtn}`}
              onClick={() => setShowApiInput((v) => !v)}
            >
              <Sparkles size={14} /> {apiKey ? 'Change Gemini Key' : 'Add Gemini API Key'}
            </button>
            {showApiInput && (
              <div className={styles.apiKeyForm}>
                <p className={styles.apiKeyNote}>Add a free Gemini API key for real AI responses. Get one at aistudio.google.com</p>
                <input
                  className="input"
                  placeholder="Paste your API key..."
                  defaultValue={apiKey}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveApiKey(e.target.value);
                  }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => saveApiKey(e.target.previousElementSibling.value)}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {showCrisis && (
            <div className={styles.crisisPanel}>
              <AlertTriangle size={18} />
              <h4>You matter. Please reach out:</h4>
              <div className={styles.crisisNumbers}>
                <a href="tel:9820466627" className="btn btn-danger btn-sm">📞 AASRA</a>
                <a href="tel:1800-2662-345" className="btn btn-danger btn-sm">📞 Vandrevala</a>
                <a href="tel:1098" className="btn btn-danger btn-sm">📞 Childline</a>
              </div>
            </div>
          )}
        </aside>

        {/* Chat Area */}
        <div className={styles.chatMain}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.aanyaAvatarSm}>🌿</div>
              <div>
                <h3 className={styles.chatHeaderName}>Aanya</h3>
                <p className={styles.chatHeaderStatus}>
                  <span className={styles.onlineDot} />
                  {isTyping ? 'typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button className={styles.crisisBtn} onClick={() => setShowCrisis((v) => !v)}>
              <Phone size={14} /> Crisis Help
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isTyping && (
              <div className={`${styles.msgRow} ${styles.aanyaRow}`}>
                <div className={styles.aanyaAvatar}><span>🌿</span></div>
                <div className={`${styles.bubble} ${styles.aanyaBubble} ${styles.typingBubble}`}>
                  <div className={styles.typingDots}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <textarea
                ref={inputRef}
                className={`input textarea ${styles.chatInput}`}
                placeholder="Tell Aanya what's on your mind... (Enter to send)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className={`btn btn-primary ${styles.sendBtn}`}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
            <p className={styles.inputDisclaimer}>
              Everything is private and stored only on your device. Aanya is not a substitute for professional help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
