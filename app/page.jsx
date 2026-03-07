"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";
import { useClerk, useUser } from "@clerk/nextjs";

// ── Counter Hook ──────────────────────────────────────────────────
function useCounter(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

const STEP_DATA = [
  {
    num: "01",
    icon: "🔍",
    title: "Discover Events",
    desc: "Browse thousands of events near you — filtered by category, city, or vibe. From music festivals to corporate mixers, find exactly what excites you.",
    from: "#7c3aed",
    to: "#a855f7",
    glow: "rgba(124,58,237,0.2)",
    highlights: ["Search by city", "Filter by category", "Real-time feed"],
  },
  {
    num: "02",
    icon: "✨",
    title: "Register & Connect",
    desc: "One-tap registration. Connect with other attendees before the event even starts. Build your network before you even walk in.",
    from: "#0ea5e9",
    to: "#6366f1",
    glow: "rgba(14,165,233,0.2)",
    highlights: ["Instant RSVP", "Meet attendees", "Get reminders"],
  },
  {
    num: "03",
    icon: "🚀",
    title: "Create Your Own",
    desc: "Launch your event in minutes. Sell tickets, manage RSVPs, track attendance — all from one beautiful dashboard.",
    from: "#f97316",
    to: "#ef4444",
    glow: "rgba(249,115,22,0.2)",
    highlights: ["Sell tickets", "Manage RSVPs", "Track analytics"],
  },
];

function StepTabs() {
  const [active, setActive] = useState(0);
  const s = STEP_DATA[active];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Tab switcher */}
      <div
        className="flex items-center gap-2 p-1.5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {STEP_DATA.map((step, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
            style={
              active === i
                ? {
                    background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
                    color: "#fff",
                    boxShadow: `0 4px 20px ${step.glow}`,
                  }
                : { color: "rgba(255,255,255,0.4)", background: "transparent" }
            }
          >
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.title}</span>
            <span className="sm:hidden">0{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Active card */}
      <div
        key={active}
        className="w-full rounded-2xl p-8 md:p-10 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${s.from}12, ${s.to}08)`,
          border: `1px solid ${s.from}40`,
          boxShadow: `0 0 60px ${s.glow}`,
          animation: "fadeSlide 0.3s ease",
        }}
      >
        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
        `}</style>

        {/* big faded number */}
        <div
          className="absolute -bottom-6 -right-4 text-[130px] font-extrabold leading-none select-none pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: 0.07,
          }}
        >
          {s.num}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* left */}
          <div className="flex-1">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${s.from}22, ${s.to}22)`,
                border: `1px solid ${s.from}40`,
              }}
            >
              {s.icon}
            </div>

            <div
              className="inline-block text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full mb-4"
              style={{
                background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                color: "#fff",
              }}
            >
              Step {s.num}
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
              {s.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              {s.desc}
            </p>
          </div>

          {/* right — highlights */}
          <div className="flex flex-col gap-3 md:w-48 flex-shrink-0">
            {s.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                  }}
                />
                <span className="text-sm text-gray-300 font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom gradient bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${s.from}, ${s.to})` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {STEP_DATA.map((step, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className="cursor-pointer transition-all duration-300 rounded-full"
            style={{
              width: active === i ? 24 : 8,
              height: 8,
              background:
                active === i
                  ? `linear-gradient(90deg, ${step.from}, ${step.to})`
                  : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Static Data ───────────────────────────────────────────────────
const TICKER_EVENTS = [
  {
    emoji: "🎵",
    title: "Neon Frequencies",
    loc: "Mumbai",
    date: "MAR 22",
    cat: "MUSIC",
    cc: "rgba(167,139,250,.15)",
    ct: "#a78bfa",
    att: "2.4K attending",
    t: "2m ago",
    isNew: true,
  },
  {
    emoji: "⚡",
    title: "HackSphere 2025",
    loc: "Bangalore",
    date: "APR 5",
    cat: "TECH",
    cc: "rgba(56,189,248,.15)",
    ct: "#38bdf8",
    att: "1.8K attending",
    t: "5m ago",
    isNew: true,
  },
  {
    emoji: "🎨",
    title: "Rang Utsav",
    loc: "Jaipur",
    date: "MAR 30",
    cat: "CULTURE",
    cc: "rgba(251,146,60,.15)",
    ct: "#fb923c",
    att: "5.2K attending",
    t: "8m ago",
    isNew: false,
  },
  {
    emoji: "🏆",
    title: "Campus League Finals",
    loc: "Delhi",
    date: "APR 12",
    cat: "SPORTS",
    cc: "rgba(74,222,128,.15)",
    ct: "#4ade80",
    att: "900 attending",
    t: "11m ago",
    isNew: false,
  },
  {
    emoji: "🔬",
    title: "AI/ML Workshop",
    loc: "Hyderabad",
    date: "APR 3",
    cat: "WORKSHOP",
    cc: "rgba(168,85,247,.15)",
    ct: "#c084fc",
    att: "340 attending",
    t: "14m ago",
    isNew: false,
  },
  {
    emoji: "🎭",
    title: "Spic Macay Night",
    loc: "Pune",
    date: "MAR 28",
    cat: "CULTURE",
    cc: "rgba(251,146,60,.15)",
    ct: "#fb923c",
    att: "1.1K attending",
    t: "17m ago",
    isNew: false,
  },
  {
    emoji: "🤝",
    title: "Startup Mixer",
    loc: "Chennai",
    date: "APR 8",
    cat: "NETWORK",
    cc: "rgba(99,102,241,.15)",
    ct: "#818cf8",
    att: "280 attending",
    t: "21m ago",
    isNew: false,
  },
  {
    emoji: "🎮",
    title: "GameJam IIT-B",
    loc: "Mumbai",
    date: "APR 15",
    cat: "TECH",
    cc: "rgba(56,189,248,.15)",
    ct: "#38bdf8",
    att: "620 attending",
    t: "24m ago",
    isNew: false,
  },
  {
    emoji: "🎤",
    title: "Open Mic Night",
    loc: "Kolkata",
    date: "MAR 25",
    cat: "MUSIC",
    cc: "rgba(167,139,250,.15)",
    ct: "#a78bfa",
    att: "480 attending",
    t: "28m ago",
    isNew: false,
  },
  {
    emoji: "📸",
    title: "Photography Walk",
    loc: "Ahmedabad",
    date: "APR 1",
    cat: "WORKSHOP",
    cc: "rgba(168,85,247,.15)",
    ct: "#c084fc",
    att: "95 attending",
    t: "31m ago",
    isNew: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Verma",
    org: "Event Organizer · Delhi",
    av: "RV",
    color: "#7c3aed",
    role: "🎪 Community Events",
    text: "We used SynKronia to manage our city-wide food festival. 8,000+ registrations, zero chaos. The ticketing and RSVP system is genuinely the best I've used.",
  },
  {
    name: "Meera Nair",
    org: "Startup Founder · Bangalore",
    av: "MN",
    color: "#0ea5e9",
    role: "🚀 Corporate & Networking",
    text: "Hosted our product launch and investor mixer on SynKronia. The reach was incredible — people found us organically through the platform. Sold out in 3 days.",
  },
  {
    name: "Karan Bhatia",
    org: "Music Producer · Mumbai",
    av: "KB",
    color: "#f97316",
    role: "🎵 Music & Entertainment",
    text: "From underground gigs to large concerts — SynKronia handles everything. The live feed feature gets our shows in front of thousands who are actually looking to attend.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Discover Events",
    desc: "Browse thousands of campus and city events near you, filtered by category, date, or vibe.",
  },
  {
    num: "02",
    icon: "✨",
    title: "Register & Connect",
    desc: "One-tap registration. Connect with attendees before the event even starts.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Create Your Own",
    desc: "Launch your event in minutes. Sell tickets, manage RSVPs, and go viral on campus.",
  },
];

export default function Home() {
  const [statsOn, setStatsOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const statsRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openSignUp, openUserProfile } = useClerk();
  const { isSignedIn } = useUser();

  const c1 = useCounter(7378, 2000, statsOn); // Events Hosted
  const c2 = useCounter(23542, 2000, statsOn); // Active Users
  const c3 = useCounter(118, 2000, statsOn); // Cities Covered
  const c4 = useCounter(785, 2000, statsOn); // Organizers

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsOn(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleProClick = () => {
    if (!isSignedIn) {
      openSignUp();
      return;
    }
    openUserProfile({ initialPage: "billing" });
  };
  const handleFreeClick = () => {
    if (!isSignedIn) {
      openSignUp();
      return;
    }
  };

  const handleEnterpriseClick = () => {
    document
      .getElementById("newsletter-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Clerk ka actual billing checkout

  const handleNewsletter = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // double the list for seamless infinite scroll
  const doubled = [...TICKER_EVENTS, ...TICKER_EVENTS];

  return (
    <>
      <style>
        {`
        @keyframes tickerScroll {
          0%   { transform: translateY(0);    }
          100% { transform: translateY(-50%); }
        }
        .ticker-track        { animation: tickerScroll 30s linear infinite; }
        .ticker-track.paused { animation-play-state: paused; }

        @keyframes shimmer {
          0%   { background-position: 0% center;   }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #60a5fa, #a78bfa, #fb923c, #a78bfa, #60a5fa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes liveBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .live-blink { animation: liveBlink 1.5s ease-in-out infinite; }



         @keyframes marqueeScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track { animation: marqueeScroll 20s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

      `}
      </style>

      <div>
        {/* ════════════════════════════════
            HERO
        ════════════════════════════════ */}
        <section className="pb-16 relative overflow-hidden">
          {/* subtle bg glows */}
          <div
            className="pointer-events-none absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,.13) 0%, transparent 65%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-40 -right-20 w-[450px] h-[450px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,.07) 0%, transparent 65%)",
            }}
          />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 mt-20">
            {/* ── LEFT — your original code untouched ── */}
            <div className="text-center sm:text-left">
              <span className="text-gray-500 font-light tracking-wide mb-6">
                SynKronia <span className="text-purple-400">*</span>
              </span>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight mt-4">
                Discover & Create
                <br /> Amazing Events <br />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  Around You!
                </span>
              </h1>

              <p className="text-lg sm:text-xl mb-12 text-gray-400 max-w-lg font-light">
                Discover events happening in your city, connect with
                communities, and create unforgettable experiences with
                SynKronia.
              </p>

              <Link href="/explore">
                <Button size="xl" className="rounded-full">
                  Explore Events
                </Button>
              </Link>
              <br />
              <Link href="/create-event">
                <Button
                  size="xl"
                  variant="outline"
                  className="rounded-full mt-3 mx-1"
                >
                  Create Event
                </Button>
              </Link>

              {/* Trust / Rating row */}
              <div className="mt-10 flex items-center gap-5 justify-center sm:justify-start flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[
                      { bg: "linear-gradient(135deg,#7c3aed,#9333ea)", l: "A" },
                      { bg: "linear-gradient(135deg,#0ea5e9,#6366f1)", l: "N" },
                      { bg: "linear-gradient(135deg,#f97316,#ef4444)", l: "S" },
                      { bg: "linear-gradient(135deg,#10b981,#06b6d4)", l: "H" },
                      { bg: "linear-gradient(135deg,#10b981,#06b6d4)", l: "I" },
                    ].map((a, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-semibold"
                        style={{
                          background: a.bg,
                          marginLeft: i ? "-8px" : "0",
                        }}
                      >
                        {a.l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      7K+ events hosted
                    </div>
                    <div className="text-xs text-gray-500">
                      across India on SynKronia
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-yellow-400 text-sm tracking-widest">
                    ★★★★★
                  </div>
                  <div className="text-xs text-gray-500">
                    Loved by organizers
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT — Live Scrolling Ticker ── */}
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.025)",
              }}
            >
              {/* ticker header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(124,58,237,0.04)",
                }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <div
                    className="live-blink w-2 h-2 rounded-full bg-green-400"
                    style={{ boxShadow: "0 0 7px #4ade80" }}
                  />
                  Live Events Feed
                </div>
                <span
                  className="text-xs text-gray-500 px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  247 happening now
                </span>
              </div>

              {/* scrolling body */}
              <div
                className="relative overflow-hidden"
                style={{ height: 420 }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* top + bottom fade masks */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 z-10"
                  style={{
                    height: 48,
                    background:
                      "linear-gradient(to bottom, rgba(8,8,20,.95), transparent)",
                  }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
                  style={{
                    height: 48,
                    background:
                      "linear-gradient(to top, rgba(8,8,20,.95), transparent)",
                  }}
                />

                <div
                  className={`ticker-track flex flex-col ${paused ? "paused" : ""}`}
                >
                  {doubled.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(124,58,237,0.06)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* emoji icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: ev.cc }}
                      >
                        {ev.emoji}
                      </div>

                      {/* title + location */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate flex items-center gap-2">
                          {ev.title}
                          {ev.isNew && (
                            <span
                              className="text-[8px] font-bold tracking-widest text-purple-400 px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(168,85,247,0.12)" }}
                            >
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex gap-3 mt-0.5">
                          <span>📍 {ev.loc}</span>
                          <span>📅 {ev.date}</span>
                        </div>
                      </div>

                      {/* badge + attendees + time */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
                          style={{ background: ev.cc, color: ev.ct }}
                        >
                          {ev.cat}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                          {ev.att}
                        </span>
                        <span className="text-[10px] text-gray-600">
                          {ev.t}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ticker footer */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(124,58,237,0.03)",
                }}
              >
                <span className="text-xs text-gray-600">Updates every 30s</span>
                <Link
                  href="/explore"
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View all events →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            STATS STRIP
        ════════════════════════════════ */}
        <div
          ref={statsRef}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { num: c1, label: "Events Hosted" },
              { num: c2, label: "Active Users" },
              { num: c3, label: "Cities Covered" },
              { num: c4, label: "Organizers" },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center py-10 px-4"
                style={{
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {s.num.toLocaleString()}+
                </div>
                <div className="text-gray-500 text-sm mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <section
          className="py-14 px-6 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto mb-8 text-center">
            <p className="text-xs tracking-[3px] uppercase text-gray-600 font-semibold">
              Trusted by students & organizers from
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* left + right fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(8,8,20,1), transparent)",
              }}
            />
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
              style={{
                background:
                  "linear-gradient(to left, rgba(8,8,20,1), transparent)",
              }}
            />

            <div
              className="marquee-track flex items-center gap-10"
              style={{ width: "max-content" }}
            >
              {[
                { name: "IIT Delhi", short: "IIT-D" },
                { name: "BITS Pilani", short: "BITS" },
                { name: "VIT Vellore", short: "VIT" },
                { name: "IIT Bombay", short: "IIT-B" },
                { name: "NIT Trichy", short: "NIT-T" },
                { name: "Manipal Univ.", short: "MU" },
                { name: "SRM Chennai", short: "SRM" },
                { name: "NMIMS Mumbai", short: "NMIMS" },
                { name: "DTU Delhi", short: "DTU" },
                { name: "Christ Univ.", short: "CU" },
                // duplicate for seamless loop
                { name: "IIT Delhi", short: "IIT-D" },
                { name: "BITS Pilani", short: "BITS" },
                { name: "VIT Vellore", short: "VIT" },
                { name: "IIT Bombay", short: "IIT-B" },
                { name: "NIT Trichy", short: "NIT-T" },
                { name: "Manipal Univ.", short: "MU" },
                { name: "SRM Chennai", short: "SRM" },
                { name: "NMIMS Mumbai", short: "NMIMS" },
                { name: "DTU Delhi", short: "DTU" },
                { name: "Christ Univ.", short: "CU" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed44,#a855f744)",
                    }}
                  >
                    {c.short.slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
    PRICING
════════════════════════════════ */}
        <section
          className="py-24 px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[3px] uppercase text-purple-400 font-semibold mb-3">
                💰 Simple Pricing
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                Plans for Everyone
              </h2>
              <p className="text-gray-400 font-light max-w-md mx-auto text-sm leading-relaxed">
                Whether you're attending your first event or running a
                10,000-person festival — we've got you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "forever",
                  desc: "Perfect for discovering and attending events.",
                  color: "#6366f1",
                  glow: "rgba(99,102,241,0.15)",
                  popular: false,
                  features: [
                    "Browse all events",
                    "RSVP up to 5 events/month",
                    "Basic profile",
                    "Email reminders",
                    "Community access",
                  ],
                  cta: "Get Started Free",
                  type: "free",
                },
                {
                  name: "Pro",
                  price: "$7",
                  period: "per month",
                  desc: "For active organizers and power users.",
                  color: "#7c3aed",
                  glow: "rgba(124,58,237,0.25)",
                  popular: true,
                  features: [
                    "Everything in Free",
                    "Create unlimited events",
                    "Sell tickets & collect payments",
                    "RSVP management dashboard",
                    "Analytics & insights",
                    "Priority support",
                  ],
                  cta: "Start Pro — 7 Days Free",
                  type: "pro",
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "talk to us",
                  desc: "For institutions, colleges & large-scale organizers.",
                  color: "#0ea5e9",
                  glow: "rgba(14,165,233,0.15)",
                  popular: false,
                  features: [
                    "Everything in Pro",
                    "Dedicated account manager",
                    "White-label options",
                    "API access",
                    "Custom integrations",
                    "SLA & uptime guarantee",
                  ],
                  cta: "Contact Us",
                  type: "enterprise",
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: plan.popular
                      ? `linear-gradient(135deg, ${plan.color}18, ${plan.color}08)`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${plan.popular ? plan.color + "50" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: plan.popular ? `0 0 60px ${plan.glow}` : "none",
                  }}
                >
                  {plan.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full text-white whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${plan.color}, #a855f7)`,
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className="inline-block text-xs font-bold tracking-[2px] uppercase px-3 py-1 rounded-full mb-4"
                      style={{
                        background: `${plan.color}18`,
                        color: plan.color,
                        border: `1px solid ${plan.color}33`,
                      }}
                    >
                      {plan.name}
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-extrabold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-sm mb-1">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.type === "pro" && (
                      <div className="text-xs text-green-400 font-medium mb-2">
                        ✓ 7-day free trial included
                      </div>
                    )}
                    <p className="text-gray-400 text-sm font-light">
                      {plan.desc}
                    </p>
                  </div>

                  <div
                    className="h-px mb-6"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />

                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                          style={{
                            background: `${plan.color}22`,
                            color: plan.color,
                          }}
                        >
                          ✓
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.type === "pro" ? (
                    <button
                      onClick={handleProClick}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                      style={{
                        background: `linear-gradient(135deg, ${plan.color}, #a855f7)`,
                      }}
                    >
                      {plan.cta} ✨
                    </button>
                  ) : plan.type === "free" ? (
                    <button
                      onClick={handleFreeClick}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:text-white"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <button
                      onClick={handleEnterpriseClick}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:text-white"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════ */}
        <section
          className="py-24 px-6"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[3px] uppercase text-purple-400 font-semibold mb-3">
                ⚙️ The Process
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                How SynKronia Works
              </h2>
              <p className="text-gray-400 font-light max-w-md mx-auto text-sm leading-relaxed">
                Three steps to your next unforgettable experience.
              </p>
            </div>

            <StepTabs />
          </div>
        </section>
        {/* ════════════════════════════════
            WHAT PEOPLE SAY
        ════════════════════════════════ */}
        <section
          className="py-24 px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[3px] uppercase text-purple-400 font-semibold mb-3">
              💬 Real Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              What People Say
            </h2>
            <p className="text-gray-400 font-light mb-12 max-w-md text-sm leading-relaxed">
              From music festivals to corporate mixers — SynKronia works for
              every kind of event.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)")
                  }
                >
                  {/* role badge — stars se PEHLE add karo */}
                  <div
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                    style={{
                      background: `${t.color}18`,
                      color: t.color,
                      border: `1px solid ${t.color}33`,
                    }}
                  >
                    {t.role}
                  </div>
                  <div className="text-yellow-400 tracking-[3px] text-sm mb-4">
                    ★★★★★
                  </div>
                  <p className="text-gray-300 font-light text-sm leading-relaxed italic mb-6">
                    <span className="text-3xl text-purple-400 font-bold leading-none align-[-12px] mr-1">
                      "
                    </span>
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg,${t.color},${t.color}88)`,
                      }}
                    >
                      {t.av}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500">{t.org}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-20 px-6"
          id="newsletter-section"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            {/* glow */}
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative z-10">
              <p className="text-xs tracking-[3px] uppercase text-purple-400 font-semibold mb-3">
                📬 Stay in the Loop
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                Get Events Delivered to You
              </h2>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">
                Subscribe to get weekly curated events in your city — zero spam,
                only vibes.
              </p>

              {!submitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(168,85,247,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
                  />
                  <button
                    onClick={handleNewsletter}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    }}
                  >
                    {loading ? "Sending..." : "Notify Me →"}
                  </button>
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
                  style={{
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)",
                  }}
                >
                  <span className="text-green-400 text-xl">✓</span>
                  <span className="text-green-400 text-sm font-medium">
                    You're on the list! We'll be in touch.
                  </span>
                </div>
              )}

              <p className="text-gray-600 text-xs mt-4">
                Join 12,000+ subscribers · Unsubscribe anytime
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            CTA
        ════════════════════════════════ */}
        <section
          className="py-10 px-6 text-center relative overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="w-[700px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse,rgba(124,58,237,.11) 0%,transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-xs tracking-[3px] uppercase text-purple-400 font-semibold mb-5">
              🚀 Get Started Today
            </p>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[0.97]">
              Ready to Make
              <br />
              <span className="shimmer-text">Events Click?</span>
            </h2>
            <p className="text-gray-400 font-light text-lg mb-10 leading-relaxed">
              Join 84,000+ students already discovering and creating amazing
              events.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/explore">
                <Button size="xl" className="rounded-full">
                  🎯 Start for Free
                </Button>
              </Link>
              <Link href="/create-event">
                <Button size="xl" variant="outline" className="rounded-full">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="text-gray-600 text-xs mt-6">
              No credit card required · Free forever plan available
            </p>
          </div>
        </section>

        {/* ════════════════════════════════
            FOOTER
        ════════════════════════════════ */}
        <footer
          className="px-6 pt-8 md:pt-12 pb-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
              <div className="col-span-2 md:col-span-1">
                <div className="text-white font-extrabold text-xl tracking-tight mb-1">
                  SYNK<span className="text-purple-400">RONIA</span>
                </div>
                <div className="text-gray-600 text-xs tracking-widest mb-4">
                  where campus events click
                </div>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Connecting students and communities through unforgettable
                  events.
                </p>
              </div>
              {[
                {
                  heading: "Platform",
                  links: [
                    "Explore Events",
                    "Create Event",
                    "Colleges",
                    "Pricing",
                  ],
                },
                {
                  heading: "Company",
                  links: ["About Us", "Blog", "Careers", "Press"],
                },
                {
                  heading: "Support",
                  links: ["Help Center", "Contact", "Privacy Policy", "Terms"],
                },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-4">
                    {col.heading}
                  </h4>
                  {col.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="block text-gray-500 hover:text-white text-sm mb-2.5 transition-colors"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div
              className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-gray-600 text-xs">
                © 2025 SynKronia. Made For Production. All rights reserved.
              </p>
              <div className="flex gap-5">
                {["Twitter", "Instagram", "LinkedIn", "Discord"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-gray-600 hover:text-white text-xs transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
