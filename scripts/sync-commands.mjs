import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const SOURCES = {
  builtIn: 'https://code.claude.com/docs/en/commands',
  cli: 'https://code.claude.com/docs/en/cli-reference',
  releaseNotes: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
};

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'claude-code-simulator-sync/1.0',
      'accept-language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function clean(text = '') {
  return text.replace(/\s+/g, ' ').replace(/Copy page/gi, '').trim();
}

function ensureExample(command, example) {
  if (example && clean(example)) return clean(example);
  return command;
}

function parseTables($, kind) {
  const out = [];
  $('table').each((_, table) => {
    const rows = $(table).find('tr');
    rows.each((rowIndex, row) => {
      if (rowIndex === 0) return;
      const cells = $(row).find('th, td').map((__, cell) => clean($(cell).text())).get();
      if (kind === 'built-in' && cells.length >= 2 && cells[0].startsWith('/')) {
        out.push({
          command: cells[0],
          description: cells[1],
          type: 'built-in',
          example: cells[0],
          aliases: [],
        });
      }
      if (kind === 'cli' && cells.length >= 2) {
        const cmd = cells[0];
        if (cmd.startsWith('claude') || cmd.startsWith('--') || cmd.startsWith('cat ')) {
          out.push({
            command: cmd,
            description: cells[1],
            type: 'cli',
            example: cells[2] || cmd,
            aliases: [],
          });
        }
      }
    });
  });
  return out;
}

function parseBuiltInFallback(text) {
  const lines = text.split('\n').map((line) => clean(line)).filter(Boolean);
  const start = lines.findIndex((line) => line === 'Command Purpose');
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith('/')) break;
    const match = line.match(/^(\/[^ ]+(?:\s+[^A-Z][^ ]*)?)(.*)$/);
    if (!match) continue;
    const command = match[1].trim();
    const description = match[2].trim() || 'No description found.';
    out.push({ command, description, type: 'built-in', example: command, aliases: [] });
  }
  return out;
}

function parseCliFallback(text) {
  const lines = text.split('\n').map((line) => clean(line)).filter(Boolean);
  const start = lines.findIndex((line) => line === 'Command Description Example');
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === 'CLI flags') break;
    if (!(line.startsWith('claude') || line.startsWith('cat ') || line.startsWith('--'))) continue;
    out.push({ command: line, description: 'Parsed from fallback text extraction.', type: 'cli', example: line, aliases: [] });
  }
  return out;
}

function attachAliases(commands) {
  const aliasMap = new Map([
    ['/clear', ['/reset', '/new']],
    ['/config', ['/settings']],
    ['/desktop', ['/app']],
    ['/exit', ['/quit']],
    ['/feedback', ['/bug']],
    ['/branch', ['/fork']],
    ['/mobile', ['/ios', '/android']],
    ['/permissions', ['/allowed-tools']],
    ['/remote-control', ['/rc']],
    ['/resume', ['/continue']],
    ['/rewind', ['/checkpoint']],
    ['/tasks', ['/bashes']],
    ['claude -c', ['claude --continue']],
    ['claude -r "<session>" "query"', ['claude --resume <session>']],
    ['claude plugin', ['claude plugins']],
  ]);

  return commands.map((cmd) => ({
    ...cmd,
    aliases: aliasMap.get(cmd.command) || cmd.aliases || [],
    example: ensureExample(cmd.command, cmd.example),
  }));
}

function dedupe(commands) {
  const seen = new Map();
  for (const cmd of commands) {
    const key = cmd.command;
    if (!seen.has(key)) seen.set(key, cmd);
    else {
      const prev = seen.get(key);
      seen.set(key, {
        ...prev,
        description: prev.description.length >= cmd.description.length ? prev.description : cmd.description,
        example: prev.example || cmd.example,
      });
    }
  }
  return [...seen.values()];
}

function sortCommands(commands) {
  return [...commands].sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.command.localeCompare(b.command);
  });
}

function extractVersion(text) {
  const match = text.match(/##\s+(\d+\.\d+\.\d+)/);
  return match?.[1] || 'unknown';
}

async function main() {
  const [builtInHtml, cliHtml, releaseNotesHtml] = await Promise.all([
    fetchHtml(SOURCES.builtIn),
    fetchHtml(SOURCES.cli),
    fetchHtml(SOURCES.releaseNotes),
  ]);

  const $builtIn = cheerio.load(builtInHtml);
  const $cli = cheerio.load(cliHtml);

  let builtIns = parseTables($builtIn, 'built-in');
  let cli = parseTables($cli, 'cli');

  if (builtIns.length < 20) {
    builtIns = parseBuiltInFallback($builtIn.text());
  }
  if (cli.length < 15) {
    cli = parseCliFallback($cli.text());
  }

  const all = sortCommands(dedupe(attachAliases([...builtIns, ...cli])));

  if (!all.length) {
    throw new Error('No commands were parsed. Upstream markup may have changed.');
  }

  const payload = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    currentVersion: extractVersion(releaseNotesHtml),
    sources: {
      primary: SOURCES.builtIn,
      builtIn: SOURCES.builtIn,
      cli: SOURCES.cli,
      releaseNotes: SOURCES.releaseNotes,
    },
    commands: all,
  };

  const outPath = path.join(process.cwd(), 'data', 'commands.json');
  await fs.writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${payload.commands.length} commands to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
