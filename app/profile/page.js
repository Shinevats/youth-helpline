'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Save, LogOut } from 'lucide-react';
import styles from './page.module.css';

const AVATARS = ['🌱', '🌸', '🌻', '🍀', '🌊', '⭐', '🦋', '🌈', '🔥', '🌙', '💫', '🎯', '🦁', '🐼', '🦊', '🐬'];

export default function ProfilePage() {
  const { user, updateUser, logout } = useUser();
  const router = useRouter();
  
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push('/login');
    } else {
      setNickname(user.nickname || '');
      setAvatar(user.avatar || '🌱');
      setBio(user.bio || '');
    }
  }, [user, router]);

  if (!user.isLoggedIn) return null;

  const handleSave = () => {
    if (!nickname.trim()) return;
    
    updateUser({
      nickname: nickname.trim(),
      avatar,
      bio: bio.trim()
    });
    
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="page-wrapper">
      <div className={styles.profilePage}>
        <div className="container">
          <div className={styles.cardContainer}>
            <div className={`card ${styles.profileCard}`}>
              <h1 className={styles.title}>Your Profile</h1>
              <p className={styles.subtitle}>Manage your anonymous identity on SafeSpace.</p>
              
              {savedMsg && (
                <div className={styles.successMsg}>
                  Profile saved successfully!
                </div>
              )}

              <div className={styles.avatarSection}>
                <p className={styles.label}>Avatar</p>
                <div className={styles.avatarGrid}>
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      className={`${styles.avatarBtn} ${avatar === a ? styles.avatarActive : ''}`}
                      onClick={() => setAvatar(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label}>Nickname</label>
                  <input 
                    className="input" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={30}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Bio (Optional)</label>
                  <textarea 
                    className="input textarea" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A little about yourself..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Role</label>
                  <div className={styles.roleDisplay}>
                    {user.role === 'counselor' ? 'Verified Counselor' :
                     user.role === 'helper' ? 'Community Helper' : 'Teen Member'}
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-primary" onClick={handleSave} disabled={!nickname.trim()}>
                  <Save size={16} /> Save Changes
                </button>
                <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
