"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { config, emptyData } from "@/puck/config";
import { applyOperations } from "@/lib/apply-operations";

const STORAGE_KEY = "gama-editor:data";

type ChatMessage = { role: "user" | "assistant"; content: string; pending?: boolean };

export default function EditorPage() {
  const [data, setData] = useState<Data>(emptyData as Data);
  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const dataRef = useRef<Data>(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Data) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const sendPrompt = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || busy) return;
      const userMsg: ChatMessage = { role: "user", content: prompt };
      setMessages((m) => [...m, userMsg, { role: "assistant", content: "…", pending: true }]);
      setInput("");
      setBusy(true);

      try {
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
            pageState: dataRef.current,
          }),
        });
        const json = (await res.json()) as {
          text?: string;
          operations?: { name: string; input: Record<string, unknown> }[];
          error?: string;
        };

        if (!res.ok || json.error) {
          setMessages((m) => [
            ...m.slice(0, -1),
            { role: "assistant", content: `Erreur : ${json.error ?? res.statusText}` },
          ]);
          return;
        }

        if (json.operations?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const next = applyOperations(dataRef.current, json.operations as any);
          persist(next);
        }

        setMessages((m) => [
          ...m.slice(0, -1),
          {
            role: "assistant",
            content:
              json.text ||
              (json.operations?.length
                ? `${json.operations.length} modification(s) appliquée(s).`
                : "Rien à changer."),
          },
        ]);
      } catch (err) {
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: `Erreur réseau : ${(err as Error).message}` },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, persist]
  );

  if (!hydrated) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", height: "100vh" }}>
      <div style={{ overflow: "hidden" }}>
        <Puck config={config} data={data} onPublish={persist} onChange={persist} />
      </div>
      <aside
        style={{
          borderLeft: "1px solid #e5e2db",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e5e2db" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "1.1rem",
            }}
          >
            Assistant Claude
          </h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
            Décris ce que tu veux, je modifie la page.
          </p>
        </header>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {messages.length === 0 && (
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              <p style={{ marginTop: 0 }}>Suggestions :</p>
              <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                <li>
                  <button
                    style={linkBtn}
                    onClick={() =>
                      sendPrompt(
                        "Crée une landing page pour un cabinet d'architecte à Montréal."
                      )
                    }
                  >
                    Landing cabinet d'architecte
                  </button>
                </li>
                <li>
                  <button
                    style={linkBtn}
                    onClick={() =>
                      sendPrompt("Ajoute une section héros avec un ton chaleureux en français.")
                    }
                  >
                    Section héros chaleureuse
                  </button>
                </li>
                <li>
                  <button
                    style={linkBtn}
                    onClick={() =>
                      sendPrompt("Ajoute trois colonnes qui expliquent nos valeurs.")
                    }
                  >
                    Trois colonnes de valeurs
                  </button>
                </li>
              </ul>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "0.65rem 0.9rem",
                borderRadius: 10,
                background: m.role === "user" ? "#0f1b2d" : "#f6f4f0",
                color: m.role === "user" ? "#fff" : "#0f1b2d",
                fontSize: "0.92rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                opacity: m.pending ? 0.6 : 1,
              }}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendPrompt(input);
          }}
          style={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e2db" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                sendPrompt(input);
              }
            }}
            placeholder="Ex: ajoute une section contact avec un formulaire..."
            disabled={busy}
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: 8,
              border: "1px solid #e5e2db",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              resize: "vertical",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>⌘/Ctrl + Entrée</span>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 999,
                border: 0,
                background: "#b08a4a",
                color: "#fff",
                fontWeight: 600,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy || !input.trim() ? 0.5 : 1,
              }}
            >
              {busy ? "…" : "Envoyer"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  background: "transparent",
  border: 0,
  padding: 0,
  color: "#b08a4a",
  textDecoration: "underline",
  cursor: "pointer",
  font: "inherit",
};
