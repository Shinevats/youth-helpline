'use client';
import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Lock, Unlock, Save, BookMarked, Smile,
  ChevronDown, ChevronUp, Download, Calendar, Tag
} from 'lucide-react';
import { storage, KEYS } from '@/lib/storage';
import styles from './page.module.css';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#22c55e' },
  { emoji: '😔', label: 'Sad', color: '#60a5fa' },
  { emoji: '😤', label: 'Frustrated', color: '#f97316' },
  { emoji: '😰', label: 'Anxious', color: '#a78bfa' },
  { emoji: '😌', label: 'Calm', color: '#0d9488' },
  { emoji: '😡', label: 'Angry', color: '#dc2626' },
  { emoji: '🥹', label: 'Grateful', color: '#f59e0b' },
  { emoji: '😴', label: 'Tired', color: '#6b7280' },
  { emoji: '💪', label: 'Strong', color: '#14b8a6' },
  { emoji: '💔', label: 'Heartbroken', color: '#ef4444' },
];

const TAGS = ['School', 'Family', 'Friends', 'Health', 'Personal', 'Dreams', 'Vent', 'Gratitude'];

function timeStr(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', mood: null, tag: '', isPrivate: true });
  const [expanded, setExpanded] = useState(null);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [savedPin, setSavedPin] = useState('');
  const [setPinMode, setSetPinMode] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [autoSaveMsg, setAutoSaveMsg] = useState('');

  useEffect(() => {
    const e = storage.get(KEYS.JOURNAL, []);
    const pin = localStorage.getItem('safespace-journal-pin') || '';
    setSavedPin(pin);
    setEntries(e);
    if (!pin) setPinUnlocked(true); // No PIN set = unlocked
  }, []);

  const unlock = () => {
    if (pinInput === savedPin) {
      setPinUnlocked(true);
      setPinInput('');
    } else {
      setPinInput('');
      alert('Wrong PIN. Try again.');
    }
  };

  const savePin = () => {
    if (newPin.length >= 4) {
      localStorage.setItem('safespace-journal-pin', newPin);
      setSavedPin(newPin);
      setNewPin('');
      setSetPinMode(false);
    }
  };

  const removePin = () => {
    localStorage.removeItem('safespace-journal-pin');
    setSavedPin('');
    setSetPinMode(false);
  };

  const saveEntry = () => {
    if (!draft.content.trim()) return;
    const entry = {
      id: Date.now().toString(),
      title: draft.title.trim() || `Entry — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      content: draft.content.trim(),
      mood: draft.mood,
      tag: draft.tag,
      isPrivate: draft.isPrivate,
      time: new Date(),
    };
    const updated = storage.append(KEYS.JOURNAL, entry);
    setEntries(updated);
    setDraft({ title: '', content: '', mood: null, tag: '', isPrivate: true });
    setWriting(false);
    setAutoSaveMsg('Entry saved! 💚');
    setTimeout(() => setAutoSaveMsg(''), 2500);
  };

  const deleteEntry = (id) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    const updated = storage.delete(KEYS.JOURNAL, id);
    setEntries(updated);
    if (expanded === id) setExpanded(null);
  };

  const exportJournal = () => {
    const text = entries.map((e) =>
      `--- ${e.title} ---\n${timeStr(e.time)}\nMood: ${e.mood?.label || 'Not set'}\nTag: ${e.tag || 'None'}\n\n${e.content}\n`
    ).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safespace-journal.txt';
    a.click();
  };

  if (!pinUnlocked) {
    return (
      <div className="page-wrapper">
        <div className={styles.pinGate}>
          <div className={styles.pinCard}>
            <div className={styles.pinIcon}><Lock size={32} /></div>
            <h2>Your Journal is Private</h2>
            <p>Enter your PIN to access your private journal.</p>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              maxLength={8}
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && unlock()}
            />
            <button className="btn btn-primary" onClick={unlock}>Unlock Journal</button>
            <button className={styles.forgotPin} onClick={() => {
              if (confirm('Reset PIN? This will clear your current PIN (but NOT your entries).')) removePin();
            }}>
              Forgot PIN? Reset it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="badge badge-teal animate-fade-up">
              <BookMarked size={12} /> Private Journal
            </span>
            <h1 className="animate-fade-up delay-100">
              Your <span className="gradient-text">Safe Space</span> to Write
            </h1>
            <p className="animate-fade-up delay-200">
              Write freely. No one else can see this. Your words, your feelings, your truth.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.content}`}>
        <div className={styles.contentInner}>
          {/* Main column */}
          <div className={styles.mainCol}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button className="btn btn-primary" onClick={() => setWriting(true)}>
                <Plus size={16} /> New Entry
              </button>
              <div className={styles.toolbarRight}>
                {autoSaveMsg && <span className={styles.savedMsg}>{autoSaveMsg}</span>}
                <button className="btn btn-ghost btn-sm" onClick={() => setSetPinMode((v) => !v)}>
                  {savedPin ? <><Lock size={14} /> Change PIN</> : <><Unlock size={14} /> Set PIN</>}
                </button>
                {entries.length > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={exportJournal}>
                    <Download size={14} /> Export
                  </button>
                )}
              </div>
            </div>

            {/* PIN setup */}
            {setPinMode && (
              <div className={`card ${styles.pinSetup}`}>
                <h4>Set a PIN for your journal</h4>
                <p>Your journal will be locked with this PIN. Minimum 4 digits.</p>
                <div className={styles.pinSetupRow}>
                  <input
                    className="input"
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Enter new PIN (min 4 digits)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" onClick={savePin}>Save PIN</button>
                  {savedPin && <button className="btn btn-danger btn-sm" onClick={removePin}>Remove PIN</button>}
                </div>
              </div>
            )}

            {/* Write form */}
            {writing && (
              <div className={`card ${styles.writeCard}`}>
                <h3 className={styles.writeTitle}>New Journal Entry</h3>
                <input
                  className="input"
                  placeholder="Title (optional)"
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />

                <div className={styles.moodSelector}>
                  <p className={styles.moodLabel}>How are you feeling?</p>
                  <div className={styles.moodGrid}>
                    {MOODS.map((m) => (
                      <button
                        key={m.label}
                        className={`${styles.moodBtn} ${draft.mood?.label === m.label ? styles.moodActive : ''}`}
                        onClick={() => setDraft((d) => ({ ...d, mood: m }))}
                        title={m.label}
                        style={draft.mood?.label === m.label ? { borderColor: m.color, background: `${m.color}15` } : {}}
                      >
                        <span className={styles.moodEmoji}>{m.emoji}</span>
                        <span className={styles.moodName}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="input textarea"
                  placeholder="Write whatever's on your mind... This is just for you. 💙"
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  rows={10}
                />

                <div className={styles.writeRow}>
                  <select
                    className="input"
                    value={draft.tag}
                    onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))}
                  >
                    <option value="">Add a tag (optional)</option>
                    {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    className={`btn ${draft.isPrivate ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                    onClick={() => setDraft((d) => ({ ...d, isPrivate: !d.isPrivate }))}
                  >
                    {draft.isPrivate ? <><Lock size={14} /> Private</> : <><Unlock size={14} /> Private</>}
                  </button>
                </div>

                <div className={styles.writeActions}>
                  <button className="btn btn-ghost" onClick={() => setWriting(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={saveEntry} disabled={!draft.content.trim()}>
                    <Save size={15} /> Save Entry
                  </button>
                </div>
              </div>
            )}

            {/* Entries list */}
            {entries.length === 0 && !writing && (
              <div className={styles.emptyState}>
                <span className={styles.emptyEmoji}>📝</span>
                <h3>Your journal is empty</h3>
                <p>Start writing. Even one sentence can make you feel lighter.</p>
                <button className="btn btn-primary" onClick={() => setWriting(true)}>
                  <Plus size={16} /> Write your first entry
                </button>
              </div>
            )}

            <div className={styles.entriesList}>
              {entries.map((entry) => (
                <div key={entry.id} className={`card ${styles.entryCard}`}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryLeft}>
                      {entry.mood && <span className={styles.entryMood}>{entry.mood.emoji}</span>}
                      <div>
                        <h4 className={styles.entryTitle}>{entry.title}</h4>
                        <div className={styles.entryMeta}>
                          <span><Calendar size={11} /> {timeStr(entry.time)}</span>
                          {entry.tag && <span><Tag size={11} /> {entry.tag}</span>}
                          <span><Lock size={11} /> Private</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.entryActions}>
                      <button
                        className={styles.entryToggle}
                        onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                      >
                        {expanded === entry.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteEntry(entry.id)}
                        title="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {expanded === entry.id && (
                    <div className={styles.entryContent}>
                      <p>{entry.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.journalSidebar}>
            <div className={`card ${styles.sideCard}`}>
              <h4 className={styles.sideTitle}>📊 Your Stats</h4>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{entries.length}</span>
                  <span className={styles.statLabel}>Entries</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{entries.filter((e) => {
                    const d = new Date(e.time);
                    return d >= new Date(Date.now() - 7 * 86400000);
                  }).length}</span>
                  <span className={styles.statLabel}>This Week</span>
                </div>
              </div>
            </div>

            {entries.length > 0 && (
              <div className={`card ${styles.sideCard}`}>
                <h4 className={styles.sideTitle}>🌈 Mood History</h4>
                <div className={styles.moodHistory}>
                  {entries.slice(0, 8).map((e) => (
                    e.mood ? (
                      <div key={e.id} className={styles.moodHistItem} title={`${e.mood.label} — ${timeStr(e.time)}`}>
                        <span>{e.mood.emoji}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            <div className={`card ${styles.sideCard}`}>
              <h4 className={styles.sideTitle}>💡 Journal Prompts</h4>
              <div className={styles.prompts}>
                {[
                  "What made you smile today, even for a second?",
                  "What's something you wish someone understood about you?",
                  "Write a letter to your future self.",
                  "What's weighing on your heart right now?",
                  "What are 3 things you're grateful for today?",
                ].map((p) => (
                  <button
                    key={p}
                    className={styles.promptBtn}
                    onClick={() => { setDraft((d) => ({ ...d, content: d.content + (d.content ? '\n\n' : '') + p + '\n' })); setWriting(true); }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
