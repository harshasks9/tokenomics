"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Mail, RotateCcw, ShieldCheck, Pencil } from "lucide-react";
import {
  composeEmail, defaultTone, EMAIL_PERSONAS, EMAIL_TYPES,
  type EmailContext, type EmailLength, type EmailPersona, type EmailTone, type EmailType,
} from "./emails";
import { PALETTE } from "../data";

const SENDER_KEY = "voice-email-sender-v1";

export function EmailStudio({ ctx, accent = PALETTE.blue }: { ctx: EmailContext; accent?: string }) {
  const [type, setType] = useState<EmailType>("first-touch");
  const [persona, setPersona] = useState<EmailPersona>("owner");
  const [tone, setTone] = useState<EmailTone>(defaultTone(ctx.market));
  const [length, setLength] = useState<EmailLength>("standard");
  const [senderName, setSenderName] = useState("Your name");
  const [senderTitle, setSenderTitle] = useState("Google Cloud");
  const [recipientName, setRecipientName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Remember the seller's own signature across accounts.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SENDER_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.name) setSenderName(s.name);
        if (s.title) setSenderTitle(s.title);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(SENDER_KEY, JSON.stringify({ name: senderName, title: senderTitle })); } catch {}
  }, [senderName, senderTitle]);

  const composed = useMemo(
    () => composeEmail(ctx, { type, persona, tone, length, senderName, senderTitle, recipientName: recipientName.trim() || undefined }),
    [ctx, type, persona, tone, length, senderName, senderTitle, recipientName],
  );

  // Recompose whenever the configuration changes; manual edits persist until then.
  useEffect(() => {
    setSubject(composed.subject);
    setBody(composed.body);
    setEdited(false);
  }, [composed]);

  const copy = async (what: "subject" | "body" | "both") => {
    const text = what === "subject" ? subject : what === "body" ? body : `Subject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1800);
  };

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const Toggle = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
        active ? "text-white border-transparent" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"
      }`}
      style={active ? { backgroundColor: accent } : {}}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
      {/* Controls */}
      <div className="p-5 border-b border-[#E8EAED] bg-[#F8F9FA] space-y-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-1.5">Moment in the deal</div>
          <div className="flex flex-wrap gap-1.5">
            {EMAIL_TYPES.map((t) => (
              <Toggle key={t.id} active={type === t.id} onClick={() => setType(t.id)}>{t.label}</Toggle>
            ))}
          </div>
          <div className="text-[10px] text-[#9AA0A6] mt-1.5">{EMAIL_TYPES.find((t) => t.id === type)?.when}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-1.5">Who it&apos;s addressed to</div>
          <div className="flex flex-wrap gap-1.5">
            {EMAIL_PERSONAS.map((p) => (
              <Toggle key={p.id} active={persona === p.id} onClick={() => setPersona(p.id)}>{p.label}</Toggle>
            ))}
          </div>
          <div className="text-[10px] text-[#9AA0A6] mt-1.5">Cares about: {EMAIL_PERSONAS.find((p) => p.id === persona)?.cares}</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-1.5">Register</div>
            <div className="flex gap-1.5">
              {(["direct", "consultative", "formal"] as EmailTone[]).map((t) => (
                <Toggle key={t} active={tone === t} onClick={() => setTone(t)}>{t[0].toUpperCase() + t.slice(1)}</Toggle>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-1.5">Length</div>
            <div className="flex gap-1.5">
              {(["short", "standard", "detailed"] as EmailLength[]).map((l) => (
                <Toggle key={l} active={length === l} onClick={() => setLength(l)}>{l[0].toUpperCase() + l.slice(1)}</Toggle>
              ))}
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <label className="block">
            <span className="text-[10px] text-[#5F6368]">Recipient first name (optional)</span>
            <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Priya"
              className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1A73E8]" />
          </label>
          <label className="block">
            <span className="text-[10px] text-[#5F6368]">Your name</span>
            <input value={senderName} onChange={(e) => setSenderName(e.target.value)}
              className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1A73E8]" />
          </label>
          <label className="block">
            <span className="text-[10px] text-[#5F6368]">Your title / team</span>
            <input value={senderTitle} onChange={(e) => setSenderTitle(e.target.value)}
              className="mt-0.5 w-full text-xs border border-[#DADCE0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1A73E8]" />
          </label>
        </div>
      </div>

      {/* Draft */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">Draft — edit freely before sending</span>
          {edited && <span className="text-[10px] text-[#B26A00] inline-flex items-center gap-1"><Pencil size={10} /> edited</span>}
        </div>
        <input
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setEdited(true); }}
          className="w-full text-sm font-bold border border-[#DADCE0] rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-[#1A73E8]"
        />
        <textarea
          value={body}
          onChange={(e) => { setBody(e.target.value); setEdited(true); }}
          rows={14}
          className="w-full text-[13px] leading-relaxed border border-[#DADCE0] rounded-lg px-3 py-2.5 font-sans focus:outline-none focus:border-[#1A73E8] resize-y"
        />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button onClick={() => copy("both")} className="inline-flex items-center gap-1.5 text-xs font-bold text-white rounded-full px-4 py-2 hover:opacity-90" style={{ backgroundColor: accent }}>
            {copied === "both" ? <Check size={13} /> : <Copy size={13} />} {copied === "both" ? "Copied" : "Copy email"}
          </button>
          <a href={mailto} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#202124] border border-[#DADCE0] rounded-full px-4 py-2 hover:bg-[#F8F9FA]">
            <Mail size={13} /> Open in mail client
          </a>
          <button onClick={() => copy("subject")} className="text-xs font-semibold text-[#5F6368] border border-[#DADCE0] rounded-full px-3 py-2 hover:bg-[#F8F9FA]">
            {copied === "subject" ? "Copied" : "Copy subject"}
          </button>
          <button
            onClick={() => { setSubject(composed.subject); setBody(composed.body); setEdited(false); }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6368] border border-[#DADCE0] rounded-full px-3 py-2 hover:bg-[#F8F9FA]"
          >
            <RotateCcw size={12} /> Reset draft
          </button>
        </div>
        <div className="mt-3 rounded-xl border border-[#E6F4EA] bg-[#F2F9F4] px-3.5 py-2.5 flex gap-2 items-start">
          <ShieldCheck size={13} className="text-[#188038] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#1E6B33] leading-relaxed">
            Customer-safe by construction: drafts are composed only from customer-facing fields. Account tier, build-vs-buy classification,
            priority score, internal routing, and partner-commercial detail are not inputs to the composer, so they cannot appear in a draft.
            Money figures are always framed as modelled from the customer&apos;s own volumes. Read before sending — you own what goes out.
          </p>
        </div>
      </div>
    </div>
  );
}
