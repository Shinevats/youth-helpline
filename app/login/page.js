'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Heart, Shield, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import styles from './page.module.css';

const AVATARS = ['🌱', '🌸', '🌻', '🍀', '🌊', '⭐', '🦋', '🌈', '🔥', '🌙', '💫', '🎯', '🦁', '🐼', '🦊', '🐬'];

const ROLES = [
  {
    id: 'teen',
    icon: Heart,
    title: 'I need support',
    subtitle: 'Teen / Student',
    desc: 'Access all resources, chat with Aanya, write in your journal, and connect anonymously with the community.',
    color: '#0d9488',
    features: ['Anonymous community access', 'Chat with Aanya', 'Private journal', 'Resources & helplines'],
  },
  {
    id: 'helper',
    icon: Users,
    title: 'I want to help',
    subtitle: 'Helper / Supportive Adult',
    desc: 'Reply to teens on the community wall, earn Karma Points, build your reputation as a trusted supporter.',
    color: '#f59e0b',
    features: ['Reply to teens anonymously', 'Earn Karma Points', 'Unlock helper badges', 'Dashboard with stats'],
  },
  {
    id: 'counselor',
    icon: Shield,
    title: 'I\'m a professional',
    subtitle: 'Counselor / Therapist',
    desc: 'Provide verified professional support. Your replies are marked as "Counselor Verified" for added trust.',
    color: '#f97316',
    features: ['Verified counselor badge', 'All helper features', 'Moderation tools', 'Priority in community'],
  },
];

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = role, 2 = details
  const [selectedRole, setSelectedRole] = useState(null);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌱');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!nickname.trim()) { setError('Please enter a nickname'); return; }
    if (nickname.trim().length < 2) { setError('Nickname must be at least 2 characters'); return; }

    login({
      nickname: nickname.trim(),
      avatar: selectedAvatar,
      role: selectedRole,
      bio: bio.trim(),
      karmaPoints: 0,
      teensHelped: 0,
      badges: [],
    });

    router.push('/dashboard');
  };

  return (
    <div className="page-wrapper">
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          {/* Logo */}
          <div className={styles.loginLogo}>
            <span>🌿</span>
            <span>SafeSpace India</span>
          </div>

          {step === 1 ? (
            <>
              <div className={styles.loginHead}>
                <h1 className={styles.loginTitle}>Welcome. Who are you?</h1>
                <p className={styles.loginDesc}>
                  No real name, no email required. Just choose a role and pick a nickname.
                </p>
              </div>

              <div className={styles.roles}>
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    className={`${styles.roleCard} ${selectedRole === role.id ? styles.roleActive : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                    style={selectedRole === role.id ? { borderColor: role.color, boxShadow: `0 0 0 3px ${role.color}25` } : {}}
                  >
                    <div className={styles.roleIcon} style={{ background: `${role.color}15`, color: role.color }}>
                      <role.icon size={22} />
                    </div>
                    <div className={styles.roleInfo}>
                      <div className={styles.roleHeader}>
                        <span className={styles.roleTitle}>{role.title}</span>
                        <span className={styles.roleSubtitle}>{role.subtitle}</span>
                      </div>
                      <p className={styles.roleDesc}>{role.desc}</p>
                      <ul className={styles.roleFeatures}>
                        {role.features.map((f) => (
                          <li key={f}><Check size={12} /> {f}</li>
                        ))}
                      </ul>
                    </div>
                    {selectedRole === role.id && (
                      <div className={styles.roleCheck} style={{ background: role.color }}>
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={() => { if (selectedRole) setStep(2); }}
                disabled={!selectedRole}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Continue <ArrowRight size={16} />
              </button>

              <p className={styles.loginNote}>
                🔒 No account required. All data is stored only on your device.
              </p>
            </>
          ) : (
            <>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <div className={styles.loginHead}>
                <h1 className={styles.loginTitle}>Create your profile</h1>
                <p className={styles.loginDesc}>
                  Choose a nickname and avatar. Stay as anonymous as you want.
                </p>
              </div>

              <div className={styles.avatarSection}>
                <p className={styles.avatarLabel}>Pick an avatar</p>
                <div className={styles.avatarGrid}>
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      className={`${styles.avatarBtn} ${selectedAvatar === a ? styles.avatarActive : ''}`}
                      onClick={() => setSelectedAvatar(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.selectedAvatar}>
                <span>{selectedAvatar}</span>
              </div>

              <div className={styles.fields}>
                <div>
                  <label className={styles.fieldLabel}>Nickname *</label>
                  <input
                    className="input"
                    placeholder="e.g. QuietStar, HopefulTeen..."
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value); setError(''); }}
                    maxLength={30}
                  />
                  {error && <p className={styles.error}>{error}</p>}
                </div>
                <div>
                  <label className={styles.fieldLabel}>A little about you (optional)</label>
                  <textarea
                    className="input textarea"
                    placeholder="Share a bit about yourself... or leave blank."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Sparkles size={16} /> Enter SafeSpace
              </button>

              <p className={styles.loginNote}>
                You can change your nickname and avatar anytime from your profile.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
