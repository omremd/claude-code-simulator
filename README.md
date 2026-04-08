# Claude Code Simulator

A browser-based Claude Code simulator for learning the interface, commands, and workflows before using the real product.

- Hosted on GitHub Pages: [omremd.github.io/claude-code-simulator](https://omremd.github.io/claude-code-simulator/)
- Auto-updated command catalog in `data/commands.json`
- No backend, no build step, no API usage

## What is Claude Code Simulator?

Claude Code Simulator is a browser-only learning tool inspired by the Claude Code terminal experience.

It helps users explore how Claude Code looks and feels before installing or using the real product. The simulator is designed for learning, onboarding, demos, and workflow exploration in a safe static environment.

If you want to learn Claude Code, understand Claude Code commands, and practice Claude Code-style workflows in the browser, this project gives you a simple place to start.

## Why this project exists

Claude Code is easier to understand when you can see the interface, try common commands, and move through realistic workflows yourself.

This project exists to make that process easier. Instead of starting with setup, authentication, or a real coding environment, users can open a static browser-based Claude Code simulator and begin exploring immediately.

It is especially useful for:

- learning Claude Code in the browser
- understanding Claude Code commands and interface patterns
- onboarding new users to a Claude Code-style workflow
- demonstrating the experience in workshops, documentation, or internal training
- practicing terminal-based navigation and command discovery before using the real tool

## Learn Claude Code in the browser

Claude Code Simulator is built for people who want to learn Claude Code through exploration.

You can use it to:

- learn Claude Code commands and terminal interaction patterns
- explore Claude Code workflows in a browser-based simulator
- practice sessions, approvals, navigation, and command discovery
- understand how a coding-agent workspace can feel before installing anything
- share a simple learning environment with teammates, students, or workshop participants

Because the project is fully static, it is easy to open, share, and use anywhere.

## What it includes

- Static HTML, CSS, and JavaScript only
- A browser-based Claude Code simulator inspired by the Claude Code terminal experience
- Fake terminal workflows for guided learning and practice
- A command explorer for browsing available commands
- A command palette for quick command access
- Session management with save, load, export, import, and reset flows
- Workspace state with fake branch, objective, and changed files
- A tool timeline for simulated tool activity
- Onboarding guidance for first-time users
- File preview and diff preview modals
- Scenario presets such as Debug Bug, Review PR, Refactor, Write Tests, and Fix CI
- Simulated approval flow for risky actions
- An auto-updated command catalog in [`data/commands.json`](./data/commands.json), synced daily from official Claude Code command sources through GitHub Actions

## What it does not do

Claude Code Simulator is not the real Claude Code product.

It does not:

- connect to real Claude services
- run real MCP tools
- execute real shell commands
- edit your local project files from the browser
- authenticate with live Claude accounts
- require a backend, framework, or build step for the UI

The focus is learning, exploration, and onboarding in a safe simulated environment.

## Main simulator areas

- Left sidebar: workspace summary, project files, quick actions, and scenario presets
- Center terminal: simulated command input, transcript, fake workflow output, and guided command exploration
- Right sidebar: command details, workspace state, and tool timeline
- Modals: onboarding, sessions, settings, file preview, diff preview, and approval prompts

## Useful commands

- `/help`
- `/config`
- `/status`
- `/diff`
- `/sessions`
- `/plan some task`
- `/plan off`
- `/interactive`
- `/review`
- `/branch feature/name`

These commands are simulated for learning purposes and help users understand how Claude Code workflows are presented in the interface.

## Keyboard shortcuts

- `Cmd/Ctrl + K` to open the command palette
- `Tab` to autocomplete the current command
- `Up / Down` to browse command history
- `Esc` to close the active modal or palette

## Run locally

Serve the repository with any simple static file server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Update commands from the official docs

The simulator uses an auto-updated command catalog stored in [`data/commands.json`](./data/commands.json).

This file powers the command explorer, command palette, and command lookup inside the simulator. It keeps command names, descriptions, aliases, and examples aligned with the latest official Claude Code command references.

### Sync locally

To refresh the command catalog on your machine:

```bash
npm install
npm run sync:commands
```

This runs the sync script and updates the local `data/commands.json` file.

### Daily GitHub Actions sync

This project also includes a GitHub Actions workflow that syncs the command catalog automatically every day.

Once the repository is pushed to GitHub and Actions are enabled, the workflow can:

- fetch the latest official Claude Code command updates
- rebuild `data/commands.json`
- commit the updated file if changes are found

This helps keep the simulator current without requiring manual updates.

### Notes

- The sync script depends on `cheerio`
- The simulator UI can still run using the checked-in version of [`data/commands.json`](./data/commands.json)
- Updating the command catalog refreshes command data, but it does not automatically add custom simulator logic for every new command

## Best use cases

- Learning how Claude Code feels before using the real product
- Exploring Claude Code workflows in a low-risk environment
- Teaching new users the interface, commands, and navigation model
- Sharing a browser-based simulator in documentation or workshops
- Practicing session flows, command discovery, and approval prompts without local setup

## Disclaimer

Claude Code Simulator is an unofficial project and a simulated learning tool.

It is inspired by the Claude Code experience, but it is not Claude Code, is not affiliated with the real product, and should not be treated as a live connection to Claude services, real MCP tooling, or real shell execution.
