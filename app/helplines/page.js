'use client';
import { useState } from 'react';
import { Phone, Clock, Globe, Shield, ExternalLink, Search, AlertTriangle } from 'lucide-react';
import { helplines, categories } from '@/lib/helplineData';
import styles from './page.module.css';

export default function HelplinesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = helplines.filter((h) => {
    const matchesCategory = activeCategory === 'all' || h.category === activeCategory;
    const matchesSearch =
      search === '' ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const colorMap = {
    teal: { bg: 'rgba(13,148,136,0.1)', text: '#0d9488', border: 'rgba(13,148,136,0.2)' },
    amber: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.2)' },
    coral: { bg: 'rgba(249,115,22,0.1)', text: '#ea580c', border: 'rgba(249,115,22,0.2)' },
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="badge badge-coral animate-fade-up">
              <AlertTriangle size={12} /> Emergency Resources
            </span>
            <h1 className="animate-fade-up delay-100">
              Indian <span className="gradient-text">Helpline Numbers</span>
            </h1>
            <p className="animate-fade-up delay-200">
              Every number here is free, confidential, and staffed by people who genuinely care.
              You can call anonymously. You deserve support.
            </p>
          </div>

          {/* Emergency banner */}
          <div className={`${styles.emergencyCard} animate-fade-up delay-300`}>
            <div className={styles.emergencyIcon}>🆘</div>
            <div>
              <h3 className={styles.emergencyTitle}>In immediate danger or crisis?</h3>
              <p className={styles.emergencyText}>
                Call <strong>CHILDLINE 1098</strong> (under 18, 24/7) or{' '}
                <strong>AASRA 9820466627</strong> (suicide/crisis, 24/7) right now.
              </p>
            </div>
            <div className={styles.emergencyBtns}>
              <a href="tel:1098" className="btn btn-danger btn-sm">📞 1098</a>
              <a href="tel:9820466627" className="btn btn-danger btn-sm">📞 AASRA</a>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className="container">
          <div className={styles.filtersInner}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={`input ${styles.searchInput}`}
                placeholder="Search helplines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.categories}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`tag ${activeCategory === c.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Helplines Grid */}
      <section className={`section ${styles.content}`}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No helplines match your search. Try a different keyword.</p>
            </div>
          ) : (
            <div className={`grid-2 ${styles.grid}`}>
              {filtered.map((h, i) => {
                const c = colorMap[h.color] || colorMap.teal;
                return (
                  <div
                    key={h.id}
                    className={`card ${styles.helplineCard} animate-fade-up`}
                    style={{ animationDelay: `${i * 0.06}s`, borderColor: h.urgent ? '#f97316' : undefined }}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardIcon} style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                        <span style={{ fontSize: '1.5rem' }}>{h.icon}</span>
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.cardTitleRow}>
                          <h3 className={styles.cardTitle}>{h.name}</h3>
                          {h.free && <span className="badge badge-teal">Free</span>}
                        </div>
                        <div
                          className={styles.cardNumber}
                          style={{ color: c.text }}
                        >
                          📞 {h.number}
                        </div>
                        <span
                          className="badge"
                          style={{ background: c.bg, color: c.text }}
                        >
                          {h.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <p className={styles.cardDesc}>{h.description}</p>

                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <Clock size={13} /> {h.available}
                      </span>
                      <span className={styles.metaItem}>
                        <Globe size={13} /> {h.languages.join(', ')}
                      </span>
                    </div>

                    <div className={styles.cardActions}>
                      <a href={`tel:${h.number.replace(/[-\s]/g, '')}`} className="btn btn-primary btn-sm">
                        <Phone size={14} /> Call Now
                      </a>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigator.clipboard?.writeText(h.number)}
                      >
                        Copy Number
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            <Shield size={16} />
            <p>
              All calls are confidential. Helpline workers follow strict privacy guidelines.
              If you're a minor calling without parental knowledge, you are still protected.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
