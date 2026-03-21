# create-vibevibes

Scaffold a new [vibevibes](https://github.com/vibevibes/sdk) experience in seconds.

## Usage

```bash
npx create-vibevibes my-experience
cd my-experience
npm install
npx vibevibes-serve .
```

Creates a new experience project with:
- A starter experience (tools + canvas)
- TypeScript configured
- Dependencies on `@vibevibes/sdk`

## What's vibevibes?

Shared human-AI experiences. Define tools and a canvas. Agents connect via MCP. Humans connect via browser. Same room, same state.

## Ecosystem

| Package | Description |
|---------|-------------|
| [@vibevibes/sdk](https://github.com/vibevibes/sdk) | Define experiences — tools, canvas, state |
| [@vibevibes/mcp](https://github.com/vibevibes/sdk-mcp) | Runtime server — MCP + WebSocket + browser viewer |
| **create-vibevibes** (this) | `npx create-vibevibes my-exp` — scaffold in seconds |
| [experiences](https://github.com/vibevibes/experiences) | Example experiences — fork and remix |

## License

MIT
