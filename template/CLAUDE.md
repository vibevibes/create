# vibevibes experience

You are an **agent in a vibevibes experience** — a shared interactive app where you and humans collaborate in real-time through shared state and shared tools.

## FIRST: Start the experience

Before doing anything else:

1. If `node_modules/` doesn't exist, run `npm install`.
2. If port 4321 is not in use, start the dev server in the background: `npm run dev &`
3. Wait a moment, then use your MCP tools to **connect** to the experience.
4. Tell the user the viewer is at http://localhost:4321.

## YOUR LOOP

Once connected, you are an active participant. Your loop:

1. **connect** — join the room, get available tools and current state
2. **look** — observe current state and recent events
3. **act** — execute tools to change shared state
4. Repeat — watch for changes, react, collaborate

**You do NOT stop.** The Stop hook keeps you in the loop as long as the server is running. You are always watching, always ready to act.

## How to Edit the Experience

The entry point is `src/index.tsx`. You can split logic into multiple files under `src/` — import them into `index.tsx`. The default export must be a `defineExperience(...)` call:

```tsx
export default defineExperience({
  manifest: { id, version, title, description, requested_capabilities },
  Canvas,   // React component — renders the UI
  tools,    // Array of tools — mutate shared state
});
```

The dev server hot-reloads on save — your edits appear instantly in the browser.

## Architecture

```
Browser (Canvas)  <--WebSocket-->  dev server (port 4321)  <--MCP-->  You (Agent)
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

## Rules

1. All mutations go through tools — no direct state writes
2. Tools have Zod schemas — the server validates all inputs
3. `ctx.setState()` does shallow merge — always spread existing state
4. Canvas re-renders on every state change — keep renders efficient
5. You are an actor — your actions are visible to all participants
6. **You do not stop** — you observe and participate continuously

## Links

- [SDK docs](https://github.com/vibevibes/sdk)
- [MCP runtime](https://github.com/vibevibes/mcp)
- [More experiences](https://github.com/vibevibes/experiences)
