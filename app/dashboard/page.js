'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { storage, KEYS } from '@/lib/storage';
import { Calendar, Award, Star, Activity, Settings, MessageSquare, BookMarked, Shield } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

const BADGES = [
  { id: 'first_post', icon: '🌱', title: 'First Step', desc: 'Made your first post or reply', threshold: 0 },
  { id: 'helper_10', icon: '⭐', title: 'Rising Star', desc: 'Earned 10 Karma Points', threshold: 10 },
  { id: 'helper_50', icon: '🌟', title: 'Guiding Light', desc: 'Earned 50 Karma Points', threshold: 50 },
  { id: 'helper_100', icon: '💎', title: 'Community Pillar', desc: 'Earned 100 Karma Points', threshold: 100 },
];

export default function DashboardPage() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [journalStats, setJournalStats] = useState({ total: 0, thisWeek: 0 });
  const [communityStats, setCommunityStats] = useState({ posts: 0, replies: 0 });

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push('/login');
      return;
    }

    // Load stats
    const journals = storage.get(KEYS.JOURNAL, []);
    const weekAgo = Date.now() - 7 * 86400000;
    setJournalStats({
      total: journals.length,
      thisWeek: journals.filter(j => new Date(j.time).getTime() > weekAgo).length
    });

    const posts = storage.get(KEYS.COMMUNITY, []);
    const myPosts = posts.filter(p => p.authorNickname === user.nickname).length;
    let myReplies = 0;
    posts.forEach(p => {
      if (p.replies) {
        myReplies += p.replies.filter(r => r.authorNickname === user.nickname).length;
      }
    });
    setCommunityStats({ posts: myPosts, replies: myReplies });

  }, [user, router]);

  if (!user.isLoggedIn) return null;

  const earnedBadges = BADGES.filter(b => (user.karmaPoints || 0) >= b.threshold);
  const nextBadge = BADGES.find(b => (user.karmaPoints || 0) < b.threshold);

  const isHelper = user.role === 'helper' || user.role === 'counselor';

  return (
    <div className="page-wrapper">
      <div className={styles.dashboard}>
        <div className="container">
          
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.profileInfo}>
              <div className={styles.avatarLarge}>{user.avatar}</div>
              <div>
                <h1 className={styles.greeting}>
                  Hi, {user.nickname}
                </h1>
                <div className={styles.roleTag}>
                  {user.role === 'counselor' ? <><Shield size={12}/> Verified Counselor</> :
                   user.role === 'helper' ? <><Star size={12}/> Community Helper</> :
                   <><Award size={12}/> Community Member</>}
                </div>
              </div>
            </div>
            <Link href="/profile" className="btn btn-ghost">
              <Settings size={16} /> Edit Profile
            </Link>
          </header>

          <div className={styles.grid}>
            
            {/* Helper Stats (Only for helpers/counselors) */}
            {isHelper && (
              <div className={`card ${styles.karmaCard}`}>
                <div className={styles.karmaHeader}>
                  <div className={styles.karmaIconWrapper}><Star size={24}/></div>
                  <div>
                    <h3 className={styles.karmaTitle}>Karma Points</h3>
                    <p className={styles.karmaDesc}>Earned by helping others on the community wall</p>
                  </div>
                </div>
                <div className={styles.karmaValue}>{user.karmaPoints || 0}</div>
                
                {nextBadge ? (
                  <div className={styles.progressSection}>
                    <div className={styles.progressText}>
                      <span>{nextBadge.threshold - (user.karmaPoints || 0)} points to next badge</span>
                      <span>{nextBadge.icon} {nextBadge.title}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{width: `${Math.min(100, ((user.karmaPoints || 0) / nextBadge.threshold) * 100)}%`}}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.progressSection}>
                    <p className={styles.maxBadgeText}>You've unlocked all badges! Thank you for your incredible support.</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
              <div className={`card ${styles.statCard}`}>
                <div className={styles.statIcon} style={{background: 'rgba(13,148,136,0.1)', color: '#0d9488'}}>
                  <BookMarked size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Journal Entries</span>
                  <span className={styles.statValue}>{journalStats.total}</span>
                </div>
              </div>
              <div className={`card ${styles.statCard}`}>
                <div className={styles.statIcon} style={{background: 'rgba(245,158,11,0.1)', color: '#d97706'}}>
                  <MessageSquare size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Community Posts</span>
                  <span className={styles.statValue}>{communityStats.posts}</span>
                </div>
              </div>
              <div className={`card ${styles.statCard}`}>
                <div className={styles.statIcon} style={{background: 'rgba(249,115,22,0.1)', color: '#ea580c'}}>
                  <Activity size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Helpful Replies</span>
                  <span className={styles.statValue}>{communityStats.replies}</span>
                </div>
              </div>
              <div className={`card ${styles.statCard}`}>
                <div className={styles.statIcon} style={{background: 'rgba(34,197,94,0.1)', color: '#16a34a'}}>
                  <Award size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Badges Earned</span>
                  <span className={styles.statValue}>{earnedBadges.length}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className={`card ${styles.badgesCard}`}>
              <h3 className={styles.cardTitle}>Your Badges</h3>
              <div className={styles.badgesGrid}>
                {BADGES.map(badge => {
                  const unlocked = (user.karmaPoints || 0) >= badge.threshold;
                  return (
                    <div key={badge.id} className={`${styles.badgeItem} ${unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}>
                      <div className={styles.badgeIcon}>{unlocked ? badge.icon : '🔒'}</div>
                      <div className={styles.badgeInfo}>
                        <span className={styles.badgeTitle}>{badge.title}</span>
                        <span className={styles.badgeDesc}>{badge.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
