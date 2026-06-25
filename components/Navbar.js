'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import {
  Sun, Moon, Heart, Menu, X, ChevronDown,
  BookOpen, Phone, MessageCircle, BookMarked,
  Users, LayoutDashboard, User, LogIn, LogOut,
  Shield,
} from 'lucide-react';
import styles from './Navbar.module.css';

const exploreLinks = [
  { href: '/resources', label: 'Resources', icon: BookOpen, desc: 'Read & learn' },
  { href: '/helplines', label: 'Helplines', icon: Phone, desc: 'Emergency numbers' },
  { href: '/community', label: 'Community', icon: Users, desc: 'Anonymous support wall' },
];

const toolLinks = [
  { href: '/chat', label: 'Chat with Aanya', icon: MessageCircle, desc: 'AI counselor' },
  { href: '/journal', label: 'Private Journal', icon: BookMarked, desc: 'Your safe space' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  const isActive = (href) => pathname === href;

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span className={styles.logoText}>SafeSpace</span>
          <span className={styles.logoSub}>India</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopNav}>
          {/* Explore dropdown */}
          <div className={styles.dropWrapper} ref={dropRef}>
            <button
              className={`${styles.navLink} ${exploreOpen ? styles.active : ''}`}
              onClick={() => setExploreOpen((o) => !o)}
            >
              Explore <ChevronDown size={14} className={exploreOpen ? styles.chevronUp : ''} />
            </button>
            {exploreOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropSection}>
                  <p className={styles.dropLabel}>Support & Learn</p>
                  {exploreLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.dropItem}>
                      <l.icon size={16} className={styles.dropIcon} />
                      <div>
                        <span className={styles.dropName}>{l.label}</span>
                        <span className={styles.dropDesc}>{l.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className={styles.dropDivider} />
                <div className={styles.dropSection}>
                  <p className={styles.dropLabel}>Your Tools</p>
                  {toolLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.dropItem}>
                      <l.icon size={16} className={styles.dropIcon} />
                      <div>
                        <span className={styles.dropName}>{l.label}</span>
                        <span className={styles.dropDesc}>{l.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/community" className={`${styles.navLink} ${isActive('/community') ? styles.active : ''}`}>
            Community
          </Link>
          <Link href="/chat" className={`${styles.navLink} ${isActive('/chat') ? styles.active : ''}`}>
            Chat Aanya
          </Link>
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeBtn}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user.isLoggedIn ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.userBtn}>
                <span className={styles.userAvatar}>{user.avatar}</span>
                <span className={styles.userName}>{user.nickname}</span>
              </Link>
              <button onClick={logout} className={styles.logoutBtn} title="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn size={15} />
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSection}>
            <p className={styles.mobileSectionLabel}>Support & Learn</p>
            {exploreLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.mobileLink}>
                <l.icon size={18} />
                {l.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileDivider} />
          <div className={styles.mobileSection}>
            <p className={styles.mobileSectionLabel}>Your Tools</p>
            {toolLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.mobileLink}>
                <l.icon size={18} />
                {l.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileDivider} />
          {user.isLoggedIn ? (
            <>
              <Link href="/dashboard" className={styles.mobileLink}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/profile" className={styles.mobileLink}>
                <User size={18} /> Profile
              </Link>
              <button onClick={logout} className={`${styles.mobileLink} ${styles.mobileLogout}`}>
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className={`${styles.mobileLink} ${styles.mobileLogin}`}>
              <LogIn size={18} /> Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
