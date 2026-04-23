import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { systemPrompt, tools } from "@/lib/ai-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: ChatMessage[];
  pageState: unknown;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ANTHROPIC_API_KEY in environment." },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  const client = new Anthropic({ apiKey });

  // Inline the current page state as a user preamble so Claude sees the
  // current block ids before the user message.
  const pageContext = `Current page state (JSON):\n\`\`\`json\n${JSON.stringify(
    body.pageState,
    null,
    2
  )}\n\`\`\``;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: pageContext },
    ...body.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 2048,
      // Cache the large, static system prompt across calls.
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools,
      messages,
    });

    const operations: Array<{ name: string; input: Record<string, unknown> }> = [];
    const textParts: string[] = [];

    for (const block of response.content) {
      if (block.type === "tool_use") {
        operations.push({
          name: block.name,
          input: block.input as Record<string, unknown>,
        });
      } else if (block.type === "text") {
        textParts.push(block.text);
      }
    }

    return NextResponse.json({
      text: textParts.join("\n").trim(),
      operations,
      usage: response.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
