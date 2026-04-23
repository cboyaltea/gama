import type Anthropic from "@anthropic-ai/sdk";

// Tool schema exposed to Claude. Names map 1:1 to operations applied on the client.
export const tools: Anthropic.Tool[] = [
  {
    name: "add_block",
    description:
      "Add a new block to the page. Returns the new block id. Use this to append sections, headings, images, buttons or columns to the page.",
    input_schema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["Hero", "Heading", "Text", "ImageBlock", "Button", "Columns", "Spacer"],
          description: "Component type.",
        },
        props: {
          type: "object",
          description:
            "Component props. Must match the shape expected by the component. Unknown props will be ignored.",
          additionalProperties: true,
        },
        index: {
          type: "number",
          description:
            "Optional 0-based insert position. Defaults to end of the page if omitted.",
        },
      },
      required: ["type", "props"],
    },
  },
  {
    name: "update_block",
    description:
      "Update one or several props of an existing block. Only include the props that should change; others are preserved.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Target block id (e.g. 'Hero-abc123')." },
        props: {
          type: "object",
          description: "Partial props to merge into the existing block.",
          additionalProperties: true,
        },
      },
      required: ["id", "props"],
    },
  },
  {
    name: "delete_block",
    description: "Remove a block from the page.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "move_block",
    description: "Reorder a block by moving it to a new 0-based position.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        newIndex: { type: "number" },
      },
      required: ["id", "newIndex"],
    },
  },
  {
    name: "set_page_title",
    description: "Update the root page title (used for the browser tab and SEO).",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
      },
      required: ["title"],
    },
  },
];

export const systemPrompt = `You are the design assistant embedded in a Puck-based visual website editor.

The user is building a page by describing what they want in natural language, and you translate their intent into precise tool calls that edit the page state.

Rules:
- Prefer several small, composable blocks over one big block. A typical landing uses Hero + Columns + Heading + Text + Button + Spacer.
- When the user asks for a full page ("landing pour un cabinet d'architecte"), plan the blocks in order, then emit tool calls one after the other to build it.
- When the user asks to tweak copy, call update_block on the target with only the props that change.
- For Hero, default to background="dark" unless the user asks for something lighter.
- Write in the same language as the user (default: French, Quebec style — professional, concrete, no fluff).
- Never invent ids — only reuse ids that appear in the current page state you are shown.
- If nothing needs to change, answer in plain text without tool calls.
- After tool calls, give a short 1-2 sentence summary of what you changed.

Available block types and their props:
- Hero: { eyebrow?: string, title: string, subtitle?: string, ctaLabel?: string, ctaHref?: string, background: "dark" | "light" | "accent" }
- Heading: { text: string, level: "h1" | "h2" | "h3", align: "left" | "center" }
- Text: { body: string, align: "left" | "center" }
- ImageBlock: { src: string, alt: string, caption?: string }
- Button: { label: string, href: string, variant: "solid" | "outline" }
- Columns: { columns: Array<{ title: string, body: string }> }
- Spacer: { size: "sm" | "md" | "lg" }
`;
