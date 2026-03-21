#!/usr/bin/env node

import { mkdirSync, cpSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const name = process.argv[2];

if (!name) {
  console.log(`
  Usage: npx create-vibevibes <name>

  Example:
    npx create-vibevibes my-experience
    cd my-experience
    npm install
    npx vibevibes-serve .
`);
  process.exit(1);
}

const dest = resolve(process.cwd(), name);

if (existsSync(dest)) {
  console.error(`Error: Directory "${name}" already exists.`);
  process.exit(1);
}

console.log(`\n  Creating vibevibes experience: ${name}\n`);

// Copy template
const templateDir = join(__dirname, 'template');
cpSync(templateDir, dest, { recursive: true });

// Process package.json template
const pkgPath = join(dest, 'package.json.tmpl');
const pkg = readFileSync(pkgPath, 'utf-8').replace(/\{\{name\}\}/g, name);
writeFileSync(join(dest, 'package.json'), pkg);
unlinkSync(pkgPath);

// Wire up .mcp.json so agents can connect immediately
const mcpConfig = {
  mcpServers: {
    vibevibes: {
      command: "npx",
      args: ["vibevibes-mcp"],
      env: { VIBEVIBES_SERVER_URL: "http://localhost:4321" },
    },
  },
};
writeFileSync(join(dest, '.mcp.json'), JSON.stringify(mcpConfig, null, 2) + '\n');

// Init git
try {
  execSync('git init', { cwd: dest, stdio: 'ignore' });
  execSync('git add .', { cwd: dest, stdio: 'ignore' });
  execSync('git commit -m "Initial commit via create-vibevibes"', { cwd: dest, stdio: 'ignore' });
} catch {}

console.log(`  Done! Next steps:

    cd ${name}
    npm install
    npx vibevibes-serve .

  Docs:
    SDK:       https://github.com/vibevibes/sdk
    Runtime:   https://github.com/vibevibes/mcp
    Examples:  https://github.com/vibevibes/experiences
`);
