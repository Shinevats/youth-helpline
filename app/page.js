'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MessageCircle, BookOpen, Users, Phone, BookMarked,
  Heart, Shield, Sparkles, ArrowRight, Star, ChevronRight,
  Flame, Lock
} from 'lucide-react';
import styles from './page.module.css';

const heroWords = ['Heard', 'Seen', 'Safe', 'Loved', 'Supported'];

const features = [
  {
    icon: MessageCircle,
    title: 'Chat with Aanya',
    desc: 'Our AI counselor listens, validates, and guides you — day or night, judgment-free.',
    href: '/chat',
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.1)',
    badge: 'AI Powered',
  },
  {
    icon: Users,
    title: 'Community Wall',
    desc: 'Post anonymously. Get support from real teens and verified adults who care.',
    href: '/community',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    badge: 'Anonymous',
  },
  {
    icon: BookOpen,
    title: 'Read & Learn',
    desc: 'Real, honest articles about anxiety, burnout, harassment, and more — in teen language.',
    href: '/resources',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    badge: '8 Topics',
  },
  {
    icon: Phone,
    title: 'Helpline Numbers',
    desc: 'All major Indian helplines in one place. One tap to call, completely free.',
    href: '/helplines',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.1)',
    badge: '12 Helplines',
  },
  {
    icon: BookMarked,
    title: 'Private Journal',
    desc: 'Write your thoughts safely. Only you can see it — PIN protected, stored on your device.',
    href: '/journal',
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.08)',
    badge: 'Private',
  },
  {
    icon: Shield,
    title: 'Karma System',
    desc: 'Help others and earn Karma Points. Build trust. Unlock badges. Make a difference.',
    href: '/dashboard',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    badge: 'Earn Points',
  },
];

const testimonials = [
  {
    text: "I never told anyone about what my tuition teacher did. But writing it here made me feel like I wasn't alone. Someone actually replied and helped me report it.",
    name: 'Anonymous teen, 16',
    avatar: '🌸',
  },
  {
    text: "I was at my lowest during JEE prep. Aanya helped me realize I wasn't lazy — I was burnt out. She gave me actual steps that helped.",
    name: 'Anonymous teen, 17',
    avatar: '🌻',
  },
  {
    text: "The helpline numbers page is incredible. I was scared to call but the descriptions made me feel less scared. I called iCall and it changed everything.",
    name: 'Anonymous teen, 15',
    avatar: '🍀',
  },
  {
    text: "I started helping others on the Community Wall. Earning karma points made me feel like I was actually doing something good for the world.",
    name: 'Anonymous helper, 22',
    avatar: '⭐',
  },
];

const steps = [
  {
    number: '01',
    title: 'Share Anonymously',
    desc: 'No registration needed. No real name required. Just your words, your way.',
    icon: Lock,
  },
  {
    number: '02',
    title: 'Get Real Support',
    desc: 'Real teens, verified adults, and Aanya the AI counselor are here for you.',
    icon: Heart,
  },
  {
    number: '03',
    title: 'Help Others & Grow',
    desc: 'As you heal, support others. Earn Karma. Build something meaningful.',
    icon: Sparkles,
  },
];

const stats = [
  { value: '12+', label: 'Helpline Numbers' },
  { value: '8', label: 'Resource Topics' },
  { value: '24/7', label: 'Aanya Available' },
  { value: '100%', label: 'Anonymous & Free' },
];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % heroWords.length);
        setIsTransitioning(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOrbs}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={`badge badge-teal animate-fade-up ${styles.heroBadge}`}>
            <Heart size={12} className="animate-heartbeat" />
            Safe. Anonymous. Free. Always.
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-up delay-100`}>
            You Deserve to Feel{' '}
            <span className={`gradient-text ${styles.heroWord} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
              {heroWords[wordIndex]}
            </span>
          </h1>
          <p className={`${styles.heroDesc} animate-fade-up delay-200`}>
            SafeSpace is a free, anonymous platform for Indian teens facing anxiety, depression,
            academic burnout, harassment, or anything that makes life hard. You're not alone.
            We're here.
          </p>
          <div className={`${styles.heroActions} animate-fade-up delay-300`}>
            <Link href="/chat" className="btn btn-primary btn-lg">
              <MessageCircle size={18} />
              Talk to Aanya
            </Link>
            <Link href="/community" className="btn btn-secondary btn-lg">
              <Users size={18} />
              Community Wall
            </Link>
          </div>
          <div className={`${styles.heroStats} animate-fade-up delay-400`}>
            {stats.map((s) => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className={styles.floatingCards}>
          <div className={`${styles.floatCard} animate-float`}>
            <span>💙</span>
            <span>You are not alone</span>
          </div>
          <div className={`${styles.floatCard} ${styles.floatCard2} animate-float delay-300`}>
            <span>🌿</span>
            <span>It gets better</span>
          </div>
          <div className={`${styles.floatCard} ${styles.floatCard3} animate-float delay-500`}>
            <span>⭐</span>
            <span>You matter</span>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={`text-center ${styles.sectionHead}`}>
            <span className="badge badge-teal">Everything You Need</span>
            <h2 className={styles.sectionTitle}>Your Safe Space Has Everything</h2>
            <p className={styles.sectionDesc}>
              From AI-powered support to real human connection — all free, all anonymous.
            </p>
          </div>
          <div className={`grid-3 ${styles.featureGrid}`}>
            {features.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className={`card card-hover ${styles.featureCard} animate-fade-up`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.featureIconWrap} style={{ background: f.bg }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <div className={styles.featureCardTop}>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <span className="badge badge-teal">{f.badge}</span>
                </div>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureArrow} style={{ color: f.color }}>
                  Go there <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────── */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div className={`text-center ${styles.sectionHead}`}>
            <span className="badge badge-amber">How It Works</span>
            <h2 className={styles.sectionTitle}>Simple. Safe. Yours.</h2>
          </div>
          <div className={`grid-3 ${styles.stepsGrid}`}>
            {steps.map((step, i) => (
              <div key={step.number} className={`${styles.stepCard} animate-fade-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepIconWrap}>
                  <step.icon size={28} />
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < 2 && <div className={styles.stepConnector}><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────── */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={`text-center ${styles.sectionHead}`}>
            <span className="badge badge-coral">Stories</span>
            <h2 className={styles.sectionTitle}>They Found Their Voice Here</h2>
            <p className={styles.sectionDesc}>Real experiences shared by teens and helpers. All anonymous.</p>
          </div>
          <div className={`grid-2 ${styles.testimonialsGrid}`}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`card ${styles.testimonialCard} animate-fade-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.testimonialQuote}>"</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialAvatar}>{t.avatar}</span>
                  <span className={styles.testimonialName}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaOrb} />
            <div className={styles.ctaContent}>
              <Flame size={36} className={styles.ctaIcon} />
              <h2 className={styles.ctaTitle}>Ready to Take the First Step?</h2>
              <p className={styles.ctaDesc}>
                You don't have to figure it out alone. Whether you want to talk, read, write,
                or just know you're not alone — we're here.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/chat" className="btn btn-primary btn-lg">
                  <MessageCircle size={18} /> Start Chatting with Aanya
                </Link>
                <Link href="/helplines" className="btn btn-ghost btn-lg" style={{color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)'}}>
                  <Phone size={18} /> See Helplines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
