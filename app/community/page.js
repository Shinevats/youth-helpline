'use client';
import { useState, useEffect } from 'react';
import { Plus, ThumbsUp, MessageSquare, Flag, Send, Search, Filter, Clock, Heart, Users, Flame } from 'lucide-react';
import { storage, KEYS } from '@/lib/storage';
import { useUser } from '@/contexts/UserContext';
import styles from './page.module.css';

const AVATARS = ['🌱', '🌸', '🌻', '🍀', '🌊', '⭐', '🦋', '🌈', '🔥', '🌙', '💫', '🎯'];
const TAGS = ['Academics', 'Family', 'Friends', 'Mental Health', 'Harassment', 'Relationship', 'Career', 'Other'];

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function PostCard({ post, onLike, onReply, currentUserId }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { user, addKarma } = useUser();

  const handleReply = () => {
    if (!replyText.trim()) return;
    const reply = {
      id: Date.now().toString(),
      authorNickname: user.isLoggedIn ? user.nickname : 'Anonymous',
      authorAvatar: user.isLoggedIn ? user.avatar : AVATARS[Math.floor(Math.random() * AVATARS.length)],
      content: replyText,
      time: new Date(),
      isHelper: user.role === 'helper' || user.role === 'counselor',
    };

    const all = storage.get(KEYS.COMMUNITY, []);
    const updated = all.map((p) =>
      p.id === post.id ? { ...p, replies: [...(p.replies || []), reply] } : p
    );
    storage.set(KEYS.COMMUNITY, updated);

    if (user.isLoggedIn) {
      addKarma(5);
    }

    setReplyText('');
    setShowReplyBox(false);
    onReply();
  };

  const replies = post.replies || [];
  const visibleReplies = expanded ? replies : replies.slice(0, 2);

  return (
    <div className={`card ${styles.postCard}`}>
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <span className={styles.postAvatar}>{post.authorAvatar}</span>
          <div>
            <span className={styles.postName}>{post.authorNickname}</span>
            <span className={styles.postTime}><Clock size={11} /> {timeAgo(post.time)}</span>
          </div>
        </div>
        {post.tag && (
          <span className={`badge ${post.tag === 'Harassment' || post.tag === 'Mental Health' ? 'badge-coral' : 'badge-teal'}`}>
            {post.tag}
          </span>
        )}
      </div>

      {post.title && <h3 className={styles.postTitle}>{post.title}</h3>}
      <p className={styles.postContent}>{post.content}</p>

      <div className={styles.postActions}>
        <button className={styles.actionBtn} onClick={() => onLike(post.id)}>
          <Heart size={14} className={post.likedBy?.includes(currentUserId) ? styles.liked : ''} />
          <span>{post.likes || 0}</span>
        </button>
        <button className={styles.actionBtn} onClick={() => setShowReplyBox((v) => !v)}>
          <MessageSquare size={14} />
          <span>{replies.length} replies</span>
        </button>
        <button className={`${styles.actionBtn} ${styles.flagBtn}`} title="Report post">
          <Flag size={13} />
        </button>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className={styles.repliesSection}>
          {visibleReplies.map((r) => (
            <div key={r.id} className={styles.reply}>
              <span className={styles.replyAvatar}>{r.authorAvatar}</span>
              <div className={styles.replyBody}>
                <div className={styles.replyHeader}>
                  <span className={styles.replyName}>{r.authorNickname}</span>
                  {r.isHelper && <span className="badge badge-amber" style={{fontSize:'0.65rem',padding:'2px 6px'}}>Helper ✓</span>}
                  <span className={styles.replyTime}>{timeAgo(r.time)}</span>
                </div>
                <p className={styles.replyContent}>{r.content}</p>
              </div>
            </div>
          ))}
          {replies.length > 2 && (
            <button className={styles.showMoreBtn} onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : `Show ${replies.length - 2} more replies`}
            </button>
          )}
        </div>
      )}

      {showReplyBox && (
        <div className={styles.replyBox}>
          <textarea
            className={`input textarea ${styles.replyTextarea}`}
            placeholder="Write a supportive reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
          />
          <div className={styles.replyBoxActions}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowReplyBox(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleReply}>
              <Send size={13} /> Post Reply (+5 Karma)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [filter, setFilter] = useState('recent');
  const [search, setSearch] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', tag: '', nickname: '' });
  const { user } = useUser();

  const userId = user.id || 'anon-' + (typeof window !== 'undefined' ? localStorage.getItem('anon-id') || (() => {
    const id = Date.now().toString();
    localStorage.setItem('anon-id', id);
    return id;
  })() : '');

  const loadPosts = () => {
    const saved = storage.get(KEYS.COMMUNITY, []);
    // Seed with sample posts if empty
    if (saved.length === 0) {
      const seeds = [
        {
          id: '1', authorNickname: 'Anonymous', authorAvatar: '🌱',
          title: 'My tuition teacher makes me uncomfortable',
          content: "My coaching teacher sometimes touches my shoulder and makes comments about my appearance. I don't know if I'm overreacting but it doesn't feel right. What should I do?",
          tag: 'Harassment', likes: 12, likedBy: [], replies: [
            { id: 'r1', authorNickname: 'Helper', authorAvatar: '⭐', content: "You're absolutely not overreacting. Unwanted touching is wrong, regardless of who does it. Please write down the dates and what happened. Tell a parent or another trusted teacher. You can also call CHILDLINE 1098 anonymously.", time: new Date(Date.now() - 3600000), isHelper: true }
          ], time: new Date(Date.now() - 7200000),
        },
        {
          id: '2', authorNickname: 'StressedTeen17', authorAvatar: '🌻',
          title: "Can't handle JEE pressure anymore",
          content: "I've been studying 12+ hours a day for JEE and I still feel like I'm going to fail. I haven't spoken to friends in months. I feel so empty and alone. Is this normal?",
          tag: 'Academics', likes: 34, likedBy: [], replies: [
            { id: 'r2', authorNickname: 'Priya (Counselor)', authorAvatar: '🍀', content: "What you're describing is textbook burnout, and it's extremely common among JEE aspirants. You need proper rest — this is scientific, not laziness. Your brain literally cannot process information when exhausted. Please take one full rest day this week. Also, iCall (9152987821) has helped many JEE students — they understand the pressure.", time: new Date(Date.now() - 1800000), isHelper: true }
          ], time: new Date(Date.now() - 86400000),
        },
        {
          id: '3', authorNickname: 'QuietKid', authorAvatar: '🌊',
          title: 'My friends share my secrets with others',
          content: "I told my best friend something really personal and they told the whole class. Now everyone is laughing at me. I trusted them so much. How do I deal with this betrayal?",
          tag: 'Friends', likes: 8, likedBy: [], replies: [], time: new Date(Date.now() - 43200000),
        },
      ];
      storage.set(KEYS.COMMUNITY, seeds);
      setPosts(seeds);
    } else {
      setPosts(saved);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const submitPost = () => {
    if (!newPost.content.trim()) return;
    const post = {
      id: Date.now().toString(),
      authorNickname: newPost.nickname.trim() || 'Anonymous',
      authorAvatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      tag: newPost.tag,
      likes: 0,
      likedBy: [],
      replies: [],
      time: new Date(),
    };
    storage.append(KEYS.COMMUNITY, post);
    setNewPost({ title: '', content: '', tag: '', nickname: '' });
    setShowPostForm(false);
    loadPosts();
  };

  const handleLike = (postId) => {
    const all = storage.get(KEYS.COMMUNITY, []);
    const updated = all.map((p) => {
      if (p.id !== postId) return p;
      const liked = p.likedBy?.includes(userId);
      return {
        ...p,
        likes: liked ? (p.likes || 1) - 1 : (p.likes || 0) + 1,
        likedBy: liked ? p.likedBy.filter((id) => id !== userId) : [...(p.likedBy || []), userId],
      };
    });
    storage.set(KEYS.COMMUNITY, updated);
    setPosts(updated);
  };

  let filtered = [...posts];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((p) => p.title?.toLowerCase().includes(s) || p.content.toLowerCase().includes(s));
  }
  if (filter === 'most-supported') filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  else if (filter === 'unanswered') filtered = filtered.filter((p) => !p.replies?.length);
  else filtered.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="badge badge-amber animate-fade-up"><Users size={12} /> Anonymous Community</span>
            <h1 className="animate-fade-up delay-100">
              You're <span className="gradient-text">Not Alone</span>
            </h1>
            <p className="animate-fade-up delay-200">
              Share what's on your heart — anonymously. Real teens and caring adults are here to listen, support, and help.
            </p>
            <button
              className="btn btn-primary btn-lg animate-fade-up delay-300"
              onClick={() => setShowPostForm((v) => !v)}
            >
              <Plus size={18} /> Share Your Story
            </button>
          </div>
        </div>
      </section>

      {/* Post form */}
      {showPostForm && (
        <section className={styles.postFormSection}>
          <div className="container">
            <div className={`card ${styles.postForm}`}>
              <h3 className={styles.formTitle}>Share Anonymously</h3>
              <p className={styles.formNote}>Your story might help someone else feel less alone 💙</p>
              <input
                className="input"
                placeholder="Give it a title (optional)"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
              />
              <textarea
                className={`input textarea`}
                placeholder="What's on your mind? Share as much or as little as you want..."
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                rows={5}
              />
              <div className={styles.formRow}>
                <select
                  className="input"
                  value={newPost.tag}
                  onChange={(e) => setNewPost((p) => ({ ...p, tag: e.target.value }))}
                >
                  <option value="">Choose a topic (optional)</option>
                  {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  className="input"
                  placeholder="Nickname (or stay 'Anonymous')"
                  value={newPost.nickname}
                  onChange={(e) => setNewPost((p) => ({ ...p, nickname: e.target.value }))}
                />
              </div>
              <div className={styles.formActions}>
                <button className="btn btn-ghost" onClick={() => setShowPostForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={submitPost} disabled={!newPost.content.trim()}>
                  <Send size={15} /> Post Anonymously
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters & Posts */}
      <section className={`section ${styles.content}`}>
        <div className={styles.contentInner}>
          <div className={styles.postsColumn}>
            <div className={styles.filtersRow}>
              <div className={styles.searchWrap}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  className={`input ${styles.searchInput}`}
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className={styles.filterBtns}>
                <button className={`tag ${filter === 'recent' ? 'active' : ''}`} onClick={() => setFilter('recent')}>
                  <Clock size={12} /> Recent
                </button>
                <button className={`tag ${filter === 'most-supported' ? 'active' : ''}`} onClick={() => setFilter('most-supported')}>
                  <Flame size={12} /> Most Supported
                </button>
                <button className={`tag ${filter === 'unanswered' ? 'active' : ''}`} onClick={() => setFilter('unanswered')}>
                  <MessageSquare size={12} /> Unanswered
                </button>
              </div>
            </div>

            <div className={styles.postsList}>
              {filtered.length === 0 ? (
                <div className={styles.empty}>
                  <p>No posts found. Be the first to share! 🌱</p>
                </div>
              ) : (
                filtered.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onReply={loadPosts}
                    currentUserId={userId}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar info */}
          <aside className={styles.infoSidebar}>
            <div className={`card ${styles.infoCard}`}>
              <h4 className={styles.infoTitle}>🛡️ Community Rules</h4>
              <ul className={styles.rulesList}>
                <li>Be kind and supportive — always</li>
                <li>Never share someone's real name or school</li>
                <li>No toxic advice or dismissive comments</li>
                <li>Report content that seems harmful</li>
                <li>Remember: professional help is available 24/7</li>
              </ul>
            </div>
            <div className={`card ${styles.infoCard}`}>
              <h4 className={styles.infoTitle}>⭐ Karma System</h4>
              <p className={styles.infoText}>Reply to posts to earn Karma Points. Helpful replies earn +5 points. Build your reputation as a trusted helper.</p>
              {user.isLoggedIn && (
                <div className={styles.karmaDisplay}>
                  <span className={styles.karmaValue}>{user.karmaPoints || 0}</span>
                  <span className={styles.karmaLabel}>Your Karma</span>
                </div>
              )}
            </div>
            <div className={`card ${styles.infoCard}`}>
              <h4 className={styles.infoTitle}>🆘 Need immediate help?</h4>
              <p className={styles.infoText}>If you're in crisis, don't wait for a reply.</p>
              <a href="tel:1098" className="btn btn-danger btn-sm" style={{marginTop:'8px'}}>📞 Call CHILDLINE 1098</a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
