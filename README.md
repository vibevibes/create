# @vibevibes/create

Scaffold a new [vibevibes](https://github.com/vibevibes/sdk) experience in seconds. Zero dependencies.

[![npm](https://img.shields.io/npm/v/@vibevibes/create)](https://www.npmjs.com/package/@vibevibes/create)
[![license](https://img.shields.io/npm/l/@vibevibes/create)](./LICENSE)

## Usage

```bash
npx @vibevibes/create my-experience
cd my-experience
npm install
npx vibevibes-serve .
```

Open http://localhost:4321 — you have a running experience with a starter canvas and tools.

Open Claude in the project — it already knows the SDK (via CLAUDE.md).

## What You Get

```
my-experience/
  src/index.tsx       <- Your experience (tools + canvas)
  CLAUDE.md           <- Full SDK reference for Claude
  .mcp.json           <- Auto-registers MCP server with Claude
  package.json
  tsconfig.json
```

Edit `src/index.tsx`. The dev server hot-reloads on save. Humans use the browser. Agents connect via MCP. Same room, same tools.

## Ecosystem

| Package | Description |
|---------|-------------|
| [@vibevibes/sdk](https://github.com/vibevibes/sdk) | Define experiences — tools, canvas, state |
| [@vibevibes/mcp](https://github.com/vibevibes/mcp) | Runtime engine — MCP server + WebSocket + viewer |
| **@vibevibes/create** | `npx @vibevibes/create` — scaffold in seconds |
| [experiences](https://github.com/vibevibes/experiences) | Example experiences — fork and remix |

## License

MIT
