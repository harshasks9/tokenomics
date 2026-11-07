"use client";

/**
 * Rendered mocks of Workspace surfaces for one moment of the day. Drawn in
 * HTML/CSS (not screenshots) so they stay crisp, themeable and accessible.
 */
import { CalendarDays, FileText, HardDrive, Mail, MessageSquare, Sparkles, Table2, Video } from "lucide-react";
import type { Frame, Surface } from "@/lib/agentify/functions-types";

export const SURFACE_ICON: Record<Surface, typeof Mail> = {
  Gmail: Mail, Calendar: CalendarDays, Chat: MessageSquare, Docs: FileText, Sheets: Table2, Meet: Video, Drive: HardDrive,
};

const STATUS: Record<string, { label: string; tone: string }> = {
  draft: { label: "Draft — not sent", tone: "" },
  "awaiting-approval": { label: "Waiting for your approval", tone: "warn" },
  "sent-after-approval": { label: "Sent after you approved", tone: "ok" },
  received: { label: "Received", tone: "" },
};

export function SurfaceFrame({ surface, frame }: { surface: Surface; frame: Frame }) {
  const Icon = SURFACE_ICON[surface];
  return (
    <div className="ag-screen" data-surface={surface}>
      <div className="ag-screen-bar">
        <span className="ag-screen-dots" aria-hidden><i /><i /><i /></span>
        <Icon size={14} /><b>{surface}</b>
        <span className="ag-spacer" />
        <span className="ag-screen-agent"><Sparkles size={12} />Gemini agent</span>
      </div>
      <div className="ag-screen-body">
        {frame.type === "email" && (
          <div className="ag-f-email">
            <div className="ag-f-email-head">
              <div className="ag-f-subject">{frame.subject}</div>
              <span className={`ag-tag ${STATUS[frame.status]?.tone ?? ""}`}>{STATUS[frame.status]?.label ?? frame.status}</span>
            </div>
            <div className="ag-f-meta"><span><b>From</b> {frame.from}</span><span><b>To</b> {frame.to}</span></div>
            <div className="ag-f-text">{frame.body.map((p, i) => <p key={i}>{p}</p>)}</div>
            {frame.status === "awaiting-approval" && <div className="ag-f-actions"><span className="ag-f-btn primary">Approve &amp; send</span><span className="ag-f-btn">Edit</span><span className="ag-f-btn">Discard</span></div>}
          </div>
        )}
        {frame.type === "chat" && (
          <div className="ag-f-chat">
            <div className="ag-f-space"># {frame.space}</div>
            {frame.messages.map((m, i) => (
              <div key={i} className={`ag-f-msg ${m.agent ? "agent" : ""}`}>
                <span className="ag-f-av" aria-hidden>{m.agent ? <Sparkles size={12} /> : m.author.slice(0, 1)}</span>
                <div><b>{m.author}</b><p>{m.text}</p></div>
              </div>
            ))}
          </div>
        )}
        {frame.type === "doc" && (
          <div className="ag-f-doc">
            <div className="ag-f-page">
              <div className="ag-f-doctitle">{frame.title}</div>
              {frame.lines.map((l, i) => (
                <div key={i} className="ag-f-line">
                  <p className={l.suggestion ? "sugg" : ""}>{l.text}</p>
                  {l.comment && <aside className="ag-f-comment"><Sparkles size={11} /> {l.comment}</aside>}
                </div>
              ))}
            </div>
          </div>
        )}
        {frame.type === "sheet" && (
          <div className="ag-f-sheet">
            <div className="ag-f-sheettitle">{frame.title}</div>
            <div className="ag-table-wrap">
              <table>
                <thead><tr><th aria-hidden /> {frame.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>{frame.rows.map((r, i) => <tr key={i} className={frame.highlightRows?.includes(i) ? "hl" : ""}><td className="rn">{i + 2}</td>{r.map((c, j) => <td key={j} className={typeof c === "number" ? "n" : ""}>{typeof c === "number" ? c.toLocaleString("en-US") : c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        )}
        {frame.type === "calendar" && (
          <div className="ag-f-cal">
            <div className="ag-f-calday">{frame.day}</div>
            {frame.events.map((e, i) => (
              <div key={i} className={`ag-f-event ${e.agent ? "agent" : ""}`}><span className="ag-mono">{e.time}</span><span>{e.title}</span>{e.agent && <Sparkles size={12} />}</div>
            ))}
          </div>
        )}
        {frame.type === "meet" && (
          <div className="ag-f-meet">
            <div className="ag-f-meettile"><Video size={22} /><span>{frame.title}</span></div>
            <div className="ag-f-notes"><div className="ag-f-noteshead"><Sparkles size={12} /> Take notes for me</div><ul>{frame.notes.map((n, i) => <li key={i}>{n}</li>)}</ul></div>
          </div>
        )}
      </div>
    </div>
  );
}
