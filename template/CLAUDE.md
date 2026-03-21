# vibevibes experience

You are working on a **vibevibes experience**: a shared interactive app where humans (in the browser) and AI agents (via MCP tools) collaborate in real-time through shared state.

## Auto-Setup

On your first interaction, before doing anything else:

1. Check if `node_modules/` exists. If not, run `npm install`.
2. Check if port 4321 is in use (`lsof -ti :4321`). If not, start the dev server: run `npx vibevibes-serve .` in the background.
3. Tell the user the viewer is at http://localhost:4321.

This ensures the experience is always ready to use and preview.

## How to Edit

Edit `src/index.tsx` — that's the only file you need to touch. It exports:

```tsx
export default defineExperience({
  manifest: { id, version, title, description, requested_capabilities },
  Canvas,   // React component — renders the UI
  tools,    // Array of tools — mutate shared state
});
```

The dev server hot-reloads on save.

## Architecture

```
Browser (Canvas)  <--WebSocket-->  vibevibes-serve  <--MCP-->  AI Agent
```

All state lives on the server. Tools are the only mutation path. Both humans and agents use the same tools.

## Tools

Tools are the **only** way to mutate shared state:

```tsx
defineTool({
  name: "tool.name",
  description: "What it does",
  input_schema: z.object({ /* Zod schema */ }),
  handler: async (ctx, input) => {
    ctx.setState({ ...ctx.state, key: newValue });
    return { result };
  },
});
```

**ctx** gives you: `state`, `setState()`, `actorId`, `roomId`, `timestamp`, `memory`, `setMemory()`.

Always spread existing state: `ctx.setState({ ...ctx.state, key: value })`.

## Canvas

React component receiving:

| Prop | Type | Purpose |
|------|------|---------|
| `sharedState` | `Record<string, any>` | Current state (read-only here) |
| `callTool` | `(name, input) => Promise` | Mutate state via tool |
| `actorId` | `string` | Your identity |
| `participants` | `string[]` | Everyone in the room |
| `ephemeralState` | `Record<string, Record<string, any>>` | Per-actor transient data |
| `setEphemeral` | `(data) => void` | Set your ephemeral data |

## Hooks (from @vibevibes/sdk)

| Hook | Returns | Purpose |
|------|---------|---------|
| `useToolCall(callTool)` | `{ call, loading, error }` | Loading/error tracking |
| `useSharedState(state, key, default?)` | `value` | Typed state accessor |
| `useOptimisticTool(callTool, state)` | `{ call, state, pending }` | Optimistic updates |
| `useParticipants(participants)` | `ParsedParticipant[]` | Parse actor IDs |

## Components (from @vibevibes/sdk)

Inline-styled (no Tailwind): `Button`, `Card`, `Input`, `Badge`, `Stack`, `Grid`

## MCP Tools (for agents)

This project has a local MCP server (`.mcp.json`). As an agent, you have:

| Tool | Purpose |
|------|---------|
| `connect` | Join the room — returns tools, state, browser URL |
| `act` | Execute a tool to change shared state |
| `look` | Observe current state |
| `disconnect` | Leave the room |

**Agent loop:** `connect` -> `look` -> `act` -> repeat.

## Rules

1. All mutations go through tools — no direct state writes
2. Tools have Zod schemas — the server validates all inputs
3. `ctx.setState()` does shallow merge — always spread existing state
4. Canvas re-renders on every state change — keep renders efficient
5. You are an actor — your actions are visible to all participants

## Links

- [SDK docs](https://github.com/vibevibes/sdk)
- [MCP runtime](https://github.com/vibevibes/mcp)
- [More experiences](https://github.com/vibevibes/experiences)
