import type { Data } from "@measured/puck";

type Operation =
  | { name: "add_block"; input: { type: string; props: Record<string, unknown>; index?: number } }
  | { name: "update_block"; input: { id: string; props: Record<string, unknown> } }
  | { name: "delete_block"; input: { id: string } }
  | { name: "move_block"; input: { id: string; newIndex: number } }
  | { name: "set_page_title"; input: { title: string } };

function genId(type: string) {
  return `${type}-${Math.random().toString(36).slice(2, 10)}`;
}

export function applyOperations(data: Data, ops: Operation[]): Data {
  // Clone once — operations are applied sequentially.
  const next: Data = JSON.parse(JSON.stringify(data));
  next.content = next.content ?? [];
  next.root = next.root ?? { props: {} };

  for (const op of ops) {
    switch (op.name) {
      case "add_block": {
        const { type, props, index } = op.input;
        const block = { type, props: { id: genId(type), ...props } };
        if (typeof index === "number" && index >= 0 && index <= next.content.length) {
          next.content.splice(index, 0, block as (typeof next.content)[number]);
        } else {
          next.content.push(block as (typeof next.content)[number]);
        }
        break;
      }
      case "update_block": {
        const { id, props } = op.input;
        const idx = next.content.findIndex((b) => b.props?.id === id);
        if (idx >= 0) {
          next.content[idx] = {
            ...next.content[idx],
            props: { ...next.content[idx].props, ...props },
          };
        }
        break;
      }
      case "delete_block": {
        next.content = next.content.filter((b) => b.props?.id !== op.input.id);
        break;
      }
      case "move_block": {
        const { id, newIndex } = op.input;
        const idx = next.content.findIndex((b) => b.props?.id === id);
        if (idx >= 0) {
          const [block] = next.content.splice(idx, 1);
          const clamped = Math.max(0, Math.min(newIndex, next.content.length));
          next.content.splice(clamped, 0, block);
        }
        break;
      }
      case "set_page_title": {
        next.root = {
          ...next.root,
          props: { ...next.root.props, title: op.input.title },
        };
        break;
      }
    }
  }

  return next;
}
