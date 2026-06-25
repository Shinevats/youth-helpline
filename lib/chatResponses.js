// ─── Aanya's AI Persona Response System ─────────────────────────────────────
// This creates warm, research-backed, human-feeling responses from Aanya.
// Used as fallback when no Gemini API key is configured.

const VALIDATION_PHRASES = [
  "What you're feeling is completely valid.",
  "I hear you, and I'm so glad you shared that with me.",
  "That sounds really hard. You didn't deserve that.",
  "It takes a lot of courage to talk about this.",
  "You're not overreacting. Your feelings make complete sense.",
  "I believe you. And I'm here.",
  "First of all — thank you for trusting me with this.",
  "You matter, and what you're going through matters.",
];

const getValidation = () => VALIDATION_PHRASES[Math.floor(Math.random() * VALIDATION_PHRASES.length)];

// ─── Topic Detection ──────────────────────────────────────────────────────────
function detectTopics(message) {
  const m = message.toLowerCase();
  const topics = [];

  if (/anxious|anxiety|nervous|panic|scared|worry|overthink|heart racing/.test(m)) topics.push('anxiety');
  if (/sad|depress|empty|hopeless|numb|cry|nothing matters|dont want to/.test(m)) topics.push('depression');
  if (/suicid|end my life|kill myself|want to die|not worth living|hurt myself/.test(m)) topics.push('crisis');
  if (/exam|study|marks|rank|fail|boards|jee|neet|coaching|tuition|burnout|pressure/.test(m)) topics.push('academic');
  if (/teacher|professor|sir|ma'am|principal|school|college/.test(m)) topics.push('teacher');
  if (/parent|mom|dad|mother|father|family|home|house|yell|fight|beat|hit/.test(m)) topics.push('family');
  if (/friend|bully|group|exclude|gossip|peer|classmate|mock|laugh/.test(m)) topics.push('peer');
  if (/touch|harass|abuse|assault|rape|inappropriate|uncomfortable/.test(m)) topics.push('harassment');
  if (/online|instagram|whatsapp|social media|photo|video|chat|dm|cyberbully/.test(m)) topics.push('online');
  if (/lonely|alone|no friends|nobody|isolated/.test(m)) topics.push('lonely');
  if (/angry|rage|frustrated|hate|furious/.test(m)) topics.push('anger');
  if (/breathe|calm|relax|exercise|technique/.test(m)) topics.push('coping');
  if (/help|number|helpline|call|talk to someone/.test(m)) topics.push('helpline');
  if (/hi|hello|hey|namaste|hii/.test(m)) topics.push('greeting');

  return topics;
}

// ─── Response Templates ───────────────────────────────────────────────────────
const responses = {
  greeting: () => `Hey! I'm Aanya. 🌿 I'm here for you — day or night. You can tell me anything, and I'll listen without judgment.

Whether you're feeling anxious, overwhelmed, bullied, or just need to vent — I'm here. What's on your mind today?`,

  anxiety: (msg) => `${getValidation()}

Anxiety is your brain's alarm system — and sometimes it gets triggered when there's no real emergency. It's exhausting, and I understand why you feel this way.

Here's something that works right now: **Try 4-7-8 breathing** 🌬️
- Breathe IN for 4 seconds
- Hold for 7 seconds  
- Breathe OUT for 8 seconds

Do this 3 times. It activates your parasympathetic nervous system and actually calms the panic.

Can you tell me more about what's triggering this for you? Is it something specific — like exams, people, or just a general feeling?`,

  depression: (msg) => `${getValidation()}

What you're describing — that emptiness, that heaviness — is real. Depression is not weakness or drama. It's something that happens to millions of people, including incredibly strong people.

I want you to know: **you don't have to feel this way forever**. Things can get better with the right support.

Right now, I want to ask you — are you safe? Are you having any thoughts of hurting yourself? You can tell me honestly. I won't judge you.

If you want to talk to someone right now, **AASRA** (📞 9820466627) and **Vandrevala Foundation** (📞 1860-2662-345) are available 24/7 and they're amazing.

What does a typical day look like for you right now?`,

  crisis: (msg) => `I'm so glad you told me this. Please know that you matter — deeply — even when your mind is telling you otherwise.

**Please reach out right now:**
🆘 **AASRA**: 9820466627 (24/7)
🆘 **Vandrevala**: 1860-2662-345 (24/7)
🆘 **iCall**: 9152987821
🆘 **KIRAN**: 1800-599-0019 (free, 24/7)

These are real people who want to help you. You can call anonymously.

I'm here with you right now. Will you tell me what's happening? I'm listening.`,

  academic: (msg) => `${getValidation()}

Academic pressure in India is brutal — and I mean that. The system often makes you feel like your entire worth is your rank. That is a lie.

**What the research actually says:**
- Your brain cannot absorb information for more than 4-5 focused hours. Extra hours = diminishing returns.
- Sleep is when your brain consolidates everything you studied. Cutting sleep to study = studying less effectively.
- Anxiety physically reduces your ability to recall information during exams.

You are more than your marks. Your rank is NOT your value as a human being.

What's the biggest source of pressure for you right now — the subjects, the competition, or expectations at home?`,

  teacher: (msg) => `${getValidation()}

No teacher has the right to humiliate you, punish you physically, make sexual remarks, or use your grades as a weapon. These are violations — and they're wrong regardless of how "normal" they seem.

**If you're being harassed:**
1. Write down exactly what happened — dates, times, witnesses
2. Tell a trusted adult (parent, another teacher, school counselor)
3. You can report to **NCPCR**: 1800-121-2830
4. If it's physical or sexual — **CHILDLINE (1098)** or **Police (100)**

You are NOT being dramatic. Your safety comes before any grade.

Can you tell me what's been happening? I want to understand better.`,

  family: (msg) => `${getValidation()}

Home is supposed to be your safe place. When it's not — that kind of pain cuts deep. It doesn't matter that "families are complicated" — you still deserve to feel safe and loved.

The constant criticism, the comparisons, the walking on eggshells — that wears you down in ways people don't always see.

Some things that help:
- Find **one safe adult** outside your home — a relative, teacher, or friend's parent
- **iCall** (9152987821) offers free counseling for family issues
- Writing in a journal can protect your mental health when you can't speak freely at home

What's happening at home? You can share as much or as little as you want.`,

  peer: (msg) => `${getValidation()}

Real friends lift you up. They don't make you feel small, anxious, or like you have to perform. What you're describing sounds exhausting.

Here's something important: **You don't need to dramatically "end" a friendship.** You can simply start spending less time, being less available, and investing more in people who actually make you feel good.

"No" is a complete sentence. You don't owe anyone an explanation for protecting yourself.

If it's bullying — especially online — save screenshots and report it. You deserve to feel safe.

What's the friendship situation like? Are they a group or one person?`,

  harassment: (msg) => `Stop. Take a breath. **This is not your fault.**

Whatever happened — regardless of what you wore, where you were, or what you said — you did not deserve this. No one ever does.

**Important steps:**
1. Save any evidence (messages, photos, etc.)
2. Tell a trusted adult TODAY
3. **CHILDLINE (1098)** — available 24/7 for minors
4. **Women's Helpline (181)** if applicable
5. **Police (100)** — harassment is a crime under Indian law

You are brave for sharing this, even here. You deserve safety, support, and justice.

I'm here. Do you want to tell me more about what happened?`,

  online: (msg) => `${getValidation()}

Online bullying is real bullying. It follows you home, it never sleeps, and it can feel completely inescapable. Your pain is completely valid.

**Immediate steps:**
1. **Screenshot everything** before blocking
2. **Block the person** on all platforms
3. **Report** to the platform (IG/WhatsApp/Snapchat all have this)
4. **Cyber Crime Helpline: 1930** — for serious cases (image sharing, threats)
5. Tell a trusted adult with the screenshots

You also have the right to **take a break from social media**. The world won't end. Your mental health matters more.

What's happening online? Are you comfortable sharing?`,

  lonely: (msg) => `${getValidation()}

Loneliness is one of the most painful human experiences. And in India, people rarely talk about it — so it feels like you're the only one. You're not.

Many teens feel profoundly alone even in a crowded classroom.

Here's something real: **connection builds slowly, through repeated small interactions.** It starts with saying hi. With showing up. With being curious about people.

Some things that genuinely help:
- Joining something — a sport, a club, an online community based on your interests
- Volunteering (like on this platform!)
- Being the friend you wish you had

I'm here right now. Tell me about yourself. What do you love? What makes you come alive?`,

  anger: (msg) => `${getValidation()}

Anger is usually protecting something — hurt, fear, injustice. And it sounds like whatever you're going through has pushed you to your limit.

**In this moment:**
- Step away if you can — even 5 minutes outside
- Physical movement releases anger safely (walk, punch a pillow, run)
- Write it all out — uncensored, just for you

Underneath anger is usually something else. Can you tell me — what's really going on? What happened?`,

  coping: () => `I know some really effective techniques — ones that are actually backed by research! Let me share a few:

**For anxiety/panic right now:**
🌬️ **4-7-8 Breathing**: Inhale 4s, hold 7s, exhale 8s. Repeat 3x.
🖐️ **5-4-3-2-1 Grounding**: 5 things you see, 4 you touch, 3 you hear, 2 smell, 1 taste.

**For ongoing stress:**
📝 **Worry journaling**: Set a 10-min "worry time" — write all worries, then close the book.
🏃 **Movement**: 20 min of walking = measurable mood lift within hours.
😴 **Sleep**: Non-negotiable. Your brain heals during sleep.

**For dark thoughts:**
📞 Call someone real — AASRA (9820466627), iCall (9152987821)
💬 Keep talking to me here

What's going on right now that you need help coping with?`,

  helpline: () => `Here are the most important helpline numbers in India:

🆘 **CHILDLINE**: 1098 (24/7, free, for under 18)
🧠 **iCall (TISS)**: 9152987821 (counselors, Mon-Sat)
💚 **Vandrevala Foundation**: 1860-2662-345 (24/7, free)
🌿 **SNEHI**: 044-24640050 (crisis support)
🤝 **AASRA**: 9820466627 (suicide prevention, 24/7)
☀️ **KIRAN**: 1800-599-0019 (govt, free, 24/7, 13 languages)
🌻 **Mann Talks**: 8686139139 (youth mental health)
🚨 **Police**: 100
💻 **Cyber Crime**: 1930
🌸 **Women's Helpline**: 181

All calls are confidential. You can call anonymously.

Is there a particular situation you need help with? I can point you to the most relevant one.`,

  default: (msg) => `${getValidation()}

Thank you for sharing that with me. I want to make sure I really understand what you're going through.

Can you tell me a little more? I'm fully here — no rush, no judgment. You can share as little or as much as you're comfortable with.

And remember — if you ever feel like you need to talk to a real person right now, **iCall** (📞 9152987821) and **Vandrevala** (📞 1860-2662-345) have real, trained counselors who care.

What's weighing on you most right now?`,
};

// ─── Main Response Function ───────────────────────────────────────────────────
export function getAanyaResponse(message) {
  const topics = detectTopics(message);

  if (topics.includes('crisis')) return responses.crisis(message);
  if (topics.includes('greeting') && topics.length === 1) return responses.greeting();
  if (topics.includes('harassment')) return responses.harassment(message);
  if (topics.includes('depression')) return responses.depression(message);
  if (topics.includes('anxiety')) return responses.anxiety(message);
  if (topics.includes('academic')) return responses.academic(message);
  if (topics.includes('teacher')) return responses.teacher(message);
  if (topics.includes('family')) return responses.family(message);
  if (topics.includes('online')) return responses.online(message);
  if (topics.includes('peer')) return responses.peer(message);
  if (topics.includes('lonely')) return responses.lonely(message);
  if (topics.includes('anger')) return responses.anger(message);
  if (topics.includes('coping')) return responses.coping();
  if (topics.includes('helpline')) return responses.helpline();

  return responses.default(message);
}

// ─── Aanya's Follow-up Suggestions ───────────────────────────────────────────
export const suggestions = [
  "I feel anxious and can't stop overthinking",
  "I'm struggling with exam pressure",
  "A teacher made me feel really uncomfortable",
  "My parents don't understand me",
  "I've been feeling really empty lately",
  "I'm being bullied online",
  "Can you teach me a breathing exercise?",
  "I need helpline numbers",
  "I feel so alone",
  "I don't know how to handle my anger",
];

// ─── Gemini API Call (real AI if key available) ───────────────────────────────
export async function callGeminiAPI(message, history, apiKey) {
  if (!apiKey) return null;

  const systemPrompt = `You are Aanya, a warm, empathetic AI counselor on SafeSpace — a youth helpline platform for Indian teenagers. 

Your personality:
- Deeply caring, like a trusted older sister or caring counselor
- Non-judgmental, always validating feelings first
- Uses simple, clear language (mix of English is fine)
- Mentions relevant Indian context (board exams, coaching, family pressure)
- Always prioritizes safety — if there's any crisis, you IMMEDIATELY give Indian helpline numbers
- Gives practical, research-backed advice
- Asks follow-up questions to understand better
- Never dismisses feelings or gives toxic positivity ("just think positive!")
- Keeps responses warm but not too long (under 300 words usually)

Helplines to mention when relevant:
- CHILDLINE: 1098 (24/7, for under 18)
- iCall: 9152987821
- Vandrevala: 1860-2662-345 (24/7)  
- AASRA: 9820466627 (crisis)
- KIRAN: 1800-599-0019

If someone mentions suicide or self-harm, ALWAYS give crisis numbers first.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [
            ...history.map((h) => ({
              role: h.role === 'aanya' ? 'model' : 'user',
              parts: [{ text: h.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: { temperature: 0.85, maxOutputTokens: 600 },
        }),
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}
