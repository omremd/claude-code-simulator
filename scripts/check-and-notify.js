const fs = require("fs");

const COMMANDS_FILE = "data/commands.json";
const OLD_COMMANDS_FILE = "/tmp/old-commands.json";

function readJson(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function main() {
  const current = readJson(COMMANDS_FILE);
  const old = readJson(OLD_COMMANDS_FILE);

  const version = current.currentVersion || "Unknown";
  const currentCommands = current.commands || [];
  const oldCommands = old.commands || [];

  const oldSet = new Set(oldCommands.map((cmd) => cmd.command));
  const newCommands = currentCommands.filter((cmd) => !oldSet.has(cmd.command));

  if (newCommands.length === 0) {
    console.log("No new commands. Slack skipped.");
    return;
  }

  const list = newCommands
    .map((cmd) => `• ${cmd.command}

  description: ${cmd.description || "No description"}

  usage: ${cmd.example || cmd.command}`)
    .join("\n\n");

  const message = `:claude: Claude Code v${version}

New commands:

${list}`;

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  });

  console.log(`Slack sent for ${newCommands.length} new commands.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
