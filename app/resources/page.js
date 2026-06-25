'use client';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Clock, Phone, AlertTriangle, Search } from 'lucide-react';
import { resources, resourceCategories } from '@/lib/resourcesData';
import styles from './page.module.css';

function ResourceCard({ resource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`card ${styles.resourceCard} ${resource.urgent ? styles.urgent : ''} animate-fade-up`}>
      {resource.urgent && (
        <div className={styles.urgentBadge}>
          <AlertTriangle size={12} /> Important
        </div>
      )}
      <div className={styles.cardHeader}>
        <div className={styles.cardEmoji}>{resource.emoji}</div>
        <div className={styles.cardMeta}>
          <span className={`badge badge-${resource.tagColor}`}>{resource.tag}</span>
          <span className={styles.readTime}><Clock size={12} /> {resource.readTime} read</span>
        </div>
      </div>
      <h3 className={styles.cardTitle}>{resource.title}</h3>
      <p className={styles.cardSummary}>{resource.summary}</p>

      {expanded && (
        <div className={styles.expanded}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>What is it?</h4>
            <p className={styles.bodyText}>{resource.whatItIs}</p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Signs to watch for</h4>
            <ul className={styles.signsList}>
              {resource.signs.map((s, i) => (
                <li key={i} className={styles.signItem}>
                  <span className={styles.bullet}>•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>What you can do</h4>
            <ul className={styles.doList}>
              {resource.whatToDo.map((d, i) => (
                <li key={i} className={styles.doItem}>
                  <span className={styles.doNum}>{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: d.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={`${styles.sectionTitle} ${styles.dontTitle}`}>What NOT to do</h4>
            <ul className={styles.dontList}>
              {resource.doNot.map((d, i) => (
                <li key={i} className={styles.dontItem}>
                  <span className={styles.xBullet}>✕</span> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.helplineBlock}>
            <Phone size={16} />
            <div>
              <p className={styles.helplineLabel}>Who to call:</p>
              <p className={styles.helplineNumbers}>{resource.whoToCall}</p>
            </div>
          </div>
        </div>
      )}

      <button
        className={`btn btn-secondary ${styles.expandBtn}`}
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? (
          <><ChevronUp size={16} /> Read Less</>
        ) : (
          <><ChevronDown size={16} /> Read More</>
        )}
      </button>
    </div>
  );
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === 'all' || r.tag === activeCategory;
    const matchSearch =
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.tag.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="badge badge-teal animate-fade-up">
              <BookOpen size={12} /> Read & Learn
            </span>
            <h1 className="animate-fade-up delay-100">
              Resources Written <span className="gradient-text">For You</span>
            </h1>
            <p className="animate-fade-up delay-200">
              Real, honest, teen-friendly articles about the things nobody talks about.
              No jargon. No judgment. Just information that can help.
            </p>
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
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.categories}>
              {resourceCategories.map((c) => (
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

      {/* Resources */}
      <section className={`section ${styles.content}`}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No resources found. Try a different search term.</p>
            </div>
          ) : (
            <div className={`grid-2 ${styles.grid}`}>
              {filtered.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
