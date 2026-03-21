import { defineExperience, defineTool } from "@vibevibes/sdk";
import { z } from "zod";
import React from "react";

const ping = defineTool({
  name: "ping",
  description: "Send a ping — adds it to the log",
  input_schema: z.object({
    message: z.string().default("pong"),
  }),
  handler: async (ctx, input) => {
    const log = [...(ctx.state.log || []), { actor: ctx.actorId, message: input.message, ts: ctx.timestamp }];
    ctx.setState({ ...ctx.state, log: log.slice(-50) });
    return { ok: true };
  },
});

export default defineExperience({
  manifest: {
    id: "my-experience",
    version: "0.1.0",
    title: "My Experience",
    description: "A new vibevibes experience",
    requested_capabilities: ["state.write"],
  },
  Canvas: ({ sharedState, callTool, actorId }) => {
    const log = sharedState.log || [];
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui", maxWidth: 600, margin: "0 auto" }}>
        <h1>My Experience</h1>
        <button onClick={() => callTool("ping", { message: `hello from ${actorId}` })}>
          Ping
        </button>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {log.map((entry: any, i: number) => (
            <li key={i} style={{ padding: "0.25rem 0", borderBottom: "1px solid #eee" }}>
              <strong>{entry.actor}</strong>: {entry.message}
            </li>
          ))}
        </ul>
      </div>
    );
  },
  tools: [ping],
  initialState: { log: [] },
});
