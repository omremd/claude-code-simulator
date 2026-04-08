const STORAGE_KEY = 'claude-code-simulator-hifi';
const ONBOARDING_KEY = 'claude-code-simulator-onboarding-seen';
const SESSION_EXPORT_VERSION = 1;
const VALID_THEMES = ['dark', 'light', 'ansi'];
const VALID_MODELS = ['sonnet', 'opus', 'haiku'];
const VALID_EFFORTS = ['low', 'medium', 'high'];
const SESSION_APPROVAL_KEY = 'claude-code-simulator-approved-actions';

function scenarioPresets() {
  return {
    'debug-bug': {
      title: 'Debug Bug',
      sessionName: 'bugfix-auth-loop',
      cwd: '~/workspace/auth-service',
      branch: 'fix/login-loop',
      objective: 'Trace the login redirect loop and patch the auth guard',
      command: '/plan debug the login redirect loop',
      files: [
        {
          path: 'src/auth/guard.ts',
          language: 'ts',
          status: 'modified',
          staged: false,
          summary: 'Authentication guard and redirect logic.',
          content: `export function guardRoute(isLoggedIn: boolean, next = '/dashboard') {\n  if (!isLoggedIn) return '/login';\n  return next;\n}\n`,
          diff: `-  if (!isLoggedIn) return '/login';\n+  if (!isLoggedIn && next !== '/login') return '/login';\n+  if (!isLoggedIn && next === '/login') return next;\n`,
        },
        {
          path: 'src/routes.ts',
          language: 'ts',
          status: 'staged',
          staged: true,
          summary: 'App routes and redirect handling.',
          content: `export const routes = ['/login', '/dashboard', '/settings'];\n`,
          diff: `+export const publicRoutes = ['/login'];\n`,
        },
      ],
      lines: ['Loaded scenario: Debug Bug', 'Focus area: auth guard redirect loop', 'Suggested next step: open /diff or review src/auth/guard.ts'],
      timeline: [
        { tool: 'Inspect', summary: 'Loaded auth logs and redirect rules', detail: '2 suspect files', status: 'success', time: '09:12' },
      ],
    },
    'review-pr': {
      title: 'Review PR',
      sessionName: 'pr-review-142',
      cwd: '~/workspace/frontend-web',
      branch: 'review/pr-142',
      objective: 'Review the UI patch for regressions and missing tests',
      command: '/review',
      files: [
        {
          path: 'src/components/CommandPalette.tsx',
          language: 'tsx',
          status: 'modified',
          staged: false,
          summary: 'Palette rendering and selection behavior.',
          content: `export function CommandPalette() {\n  return <div>Palette</div>;\n}\n`,
          diff: `-  return <div>Palette</div>;\n+  return <div role="dialog" aria-modal="true">Palette</div>;\n`,
        },
        {
          path: 'src/components/Palette.test.tsx',
          language: 'tsx',
          status: 'clean',
          staged: false,
          summary: 'Palette interaction tests.',
          content: `describe('palette', () => {\n  it('opens', () => {});\n});\n`,
          diff: `+it('supports keyboard navigation', () => {});\n`,
        },
      ],
      lines: ['Loaded scenario: Review PR', 'Focus area: command palette accessibility and regressions', 'Suggested next step: open /diff or inspect the palette file'],
      timeline: [
        { tool: 'Diff', summary: 'Loaded pull request patch set', detail: 'PR #142', status: 'success', time: '10:04' },
      ],
    },
    refactor: {
      title: 'Refactor',
      sessionName: 'refactor-terminal-state',
      cwd: '~/workspace/terminal-ui',
      branch: 'refactor/state-machine',
      objective: 'Refactor terminal state management into clearer modules',
      command: '/plan split terminal state into focused modules',
      files: [
        {
          path: 'src/state/terminal.ts',
          language: 'ts',
          status: 'modified',
          staged: false,
          summary: 'Terminal state and reducers.',
          content: `export const terminalState = {\n  lines: [],\n  status: 'idle',\n};\n`,
          diff: `+export function resetTerminalState() {\n+  return { lines: [], status: 'idle' };\n+}\n`,
        },
        {
          path: 'src/state/history.ts',
          language: 'ts',
          status: 'staged',
          staged: true,
          summary: 'Command history helpers.',
          content: `export function pushHistory(list, value) {\n  return [value, ...list].slice(0, 50);\n}\n`,
          diff: `+export function clearHistory() {\n+  return [];\n+}\n`,
        },
      ],
      lines: ['Loaded scenario: Refactor', 'Focus area: terminal state machine cleanup', 'Suggested next step: inspect state files and compare the diff'],
      timeline: [
        { tool: 'Outline', summary: 'Loaded refactor plan and changed modules', detail: '2 state files', status: 'success', time: '11:22' },
      ],
    },
    'write-tests': {
      title: 'Write Tests',
      sessionName: 'tests-for-parser',
      cwd: '~/workspace/parser-lib',
      branch: 'test/parser-edge-cases',
      objective: 'Add tests for parser edge cases and regressions',
      command: '/plan write parser tests for edge cases',
      files: [
        {
          path: 'src/parser.test.ts',
          language: 'ts',
          status: 'modified',
          staged: false,
          summary: 'Parser unit tests.',
          content: `describe('parser', () => {\n  it('parses basic input', () => {});\n});\n`,
          diff: `+it('handles empty input', () => {});\n+it('handles invalid escapes', () => {});\n`,
        },
        {
          path: 'src/parser.ts',
          language: 'ts',
          status: 'clean',
          staged: false,
          summary: 'Core parser implementation.',
          content: `export function parse(input) {\n  return input;\n}\n`,
          diff: `+// tests cover invalid escapes now\n`,
        },
      ],
      lines: ['Loaded scenario: Write Tests', 'Focus area: parser edge cases', 'Suggested next step: open parser.test.ts or run /review'],
      timeline: [
        { tool: 'Analyze', summary: 'Mapped risky parser inputs', detail: 'empty strings and invalid escapes', status: 'success', time: '13:10' },
      ],
    },
    'fix-ci': {
      title: 'Fix CI',
      sessionName: 'ci-fix-node-20',
      cwd: '~/workspace/web-monorepo',
      branch: 'fix/ci-node20',
      objective: 'Fix the failing CI workflow after the Node 20 upgrade',
      command: '/plan investigate failing CI workflow',
      files: [
        {
          path: '.github/workflows/ci.yml',
          language: 'yml',
          status: 'modified',
          staged: false,
          summary: 'CI pipeline configuration.',
          content: `name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n`,
          diff: `-      node-version: 18\n+      node-version: 20\n+    timeout-minutes: 15\n`,
        },
        {
          path: 'package.json',
          language: 'json',
          status: 'staged',
          staged: true,
          summary: 'Project metadata and scripts.',
          content: `{\n  "scripts": {\n    "test": "vitest"\n  }\n}\n`,
          diff: `+    "test:ci": "vitest run --coverage"\n`,
        },
      ],
      lines: ['Loaded scenario: Fix CI', 'Focus area: GitHub Actions workflow and test script changes', 'Suggested next step: open /diff or inspect ci.yml'],
      timeline: [
        { tool: 'CI', summary: 'Loaded failing workflow snapshot', detail: 'Node 20 upgrade regression', status: 'warn', time: '14:40' },
      ],
    },
  };
}

function defaultFiles() {
  return [
    {
      path: 'src/agents.ts',
      language: 'ts',
      status: 'modified',
      staged: false,
      summary: 'Agent runtime and worker orchestration.',
      content: `export type AgentTask = {\n  id: string;\n  label: string;\n  status: 'queued' | 'running' | 'completed';\n};\n\nexport function startAgent(task: AgentTask) {\n  return {\n    ...task,\n    status: 'running',\n    startedAt: new Date().toISOString(),\n  };\n}\n`,
      diff: `-  status: 'queued' | 'running' | 'completed';\n+  status: 'queued' | 'running' | 'completed' | 'failed';\n+\n+export function summarizeAgent(task: AgentTask) {\n+  return \`\${task.label} (\${task.status})\`;\n+}\n`,
    },
    {
      path: 'src/index.ts',
      language: 'ts',
      status: 'staged',
      staged: true,
      summary: 'Main simulator boot and event wiring.',
      content: `import { startAgent } from './agents';\n\nconst task = startAgent({\n  id: 'bootstrap',\n  label: 'Initialize simulator',\n  status: 'queued',\n});\n\nconsole.log(task);\n`,
      diff: `+import './styles.css';\n+\n console.log(task);\n+console.log('workspace ready');\n`,
    },
    {
      path: '.claude/CLAUDE.md',
      language: 'md',
      status: 'clean',
      staged: false,
      summary: 'Shared team guidance and coding conventions.',
      content: `# Team Guide\n\n- Prefer minimal diffs.\n- Explain risky changes.\n- Keep GitHub Pages compatibility.\n`,
      diff: `+ - Validate static assets before deploy.\n`,
    },
    {
      path: 'README.md',
      language: 'md',
      status: 'modified',
      staged: false,
      summary: 'Project overview and local usage docs.',
      content: `# Claude Code Simulator\n\nA browser-only simulator for a coding agent terminal experience.\n`,
      diff: `- A browser-only simulator for a coding agent terminal experience.\n+ A browser-only simulator with session state, command explorer, and fake tool runs.\n`,
    },
  ];
}

function defaultGit() {
  return {
    branch: 'main',
    objective: 'Improve simulator workflows',
  };
}

const defaultState = {
  commands: [],
  filter: 'all',
  query: '',
  selectedCommand: null,
  history: [],
  historyIndex: -1,
  sessionName: 'untitled-session',
  cwd: '~/claude-simulator/project',
  model: 'opus',
  effort: 'medium',
  theme: 'dark',
  permissionsMode: 'ask',
  planMode: false,
  fastMode: false,
  usageUsd: 0,
  usageTurns: 0,
  favorites: [],
  recentCommands: [],
  savedSessions: {},
  terminalMarkup: '',
  fakeFiles: defaultFiles(),
  git: defaultGit(),
  toolTimeline: [],
  tasks: [
    { name: 'Review release notes', schedule: 'Tomorrow 09:00', status: 'scheduled' },
    { name: 'Lint and summarize errors', schedule: 'Daily 18:00', status: 'scheduled' },
  ],
  hooksEnabled: true,
  plugins: ['code-review@claude-plugins-official'],
  mcpServers: [
    { name: 'github', status: 'connected', prompts: 4, tools: 6 },
    { name: 'filesystem', status: 'connected', prompts: 0, tools: 3 },
  ],
  permissionRules: [
    { scope: 'project', action: 'ask', matcher: 'Bash(*)' },
    { scope: 'project', action: 'allow', matcher: 'Read(*)' },
    { scope: 'user', action: 'deny', matcher: 'Bash(rm -rf *)' },
  ],
  source: '#',
  lastUpdated: '—',
  currentVersion: '—',
};

const state = loadState();
const runtime = {
  paletteItems: [],
  paletteActiveIndex: 0,
  lastPaletteQuery: '',
  commandSuggestion: null,
  onboardingOpen: false,
  pendingApproval: null,
  approvalResolver: null,
};

const ui = {
  body: document.documentElement,
  output: document.getElementById('terminalOutput'),
  commandInput: document.getElementById('commandInput'),
  commandSuggestion: document.getElementById('commandSuggestion'),
  runButton: document.getElementById('runButton'),
  searchInput: document.getElementById('searchInput'),
  commandList: document.getElementById('commandList'),
  selectedCommand: document.getElementById('selectedCommand'),
  selectedDescription: document.getElementById('selectedDescription'),
  selectedAliases: document.getElementById('selectedAliases'),
  selectedExample: document.getElementById('selectedExample'),
  selectedType: document.getElementById('selectedType'),
  visibleCount: document.getElementById('visibleCount'),
  commandCount: document.getElementById('commandCount'),
  lastUpdated: document.getElementById('lastUpdated'),
  versionBadge: document.getElementById('versionBadge'),
  sourceLink: document.getElementById('sourceLink'),
  modeBadge: document.getElementById('modeBadge'),
  cwdDisplay: document.getElementById('cwdDisplay'),
  sessionNameDisplay: document.getElementById('sessionNameDisplay'),
  modelDisplay: document.getElementById('modelDisplay'),
  effortDisplay: document.getElementById('effortDisplay'),
  statuslineSession: document.getElementById('statuslineSession'),
  statuslineModel: document.getElementById('statuslineModel'),
  statuslinePerms: document.getElementById('statuslinePerms'),
  statuslineUsage: document.getElementById('statuslineUsage'),
  fileTree: document.getElementById('fileTree'),
  gitBranchBadge: document.getElementById('gitBranchBadge'),
  changedFilesCount: document.getElementById('changedFilesCount'),
  stagedFilesCount: document.getElementById('stagedFilesCount'),
  workspaceObjective: document.getElementById('workspaceObjective'),
  workspaceFiles: document.getElementById('workspaceFiles'),
  toolTimeline: document.getElementById('toolTimeline'),
  clearTimelineButton: document.getElementById('clearTimelineButton'),
  overlay: document.getElementById('overlay'),
  panelModal: document.getElementById('panelModal'),
  modalKicker: document.getElementById('modalKicker'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  closeModalButton: document.getElementById('closeModalButton'),
  palette: document.getElementById('commandPalette'),
  paletteButton: document.getElementById('paletteButton'),
  paletteInput: document.getElementById('paletteInput'),
  paletteResults: document.getElementById('paletteResults'),
  closePaletteButton: document.getElementById('closePaletteButton'),
  onboardingButton: document.getElementById('onboardingButton'),
  sessionsButton: document.getElementById('sessionsButton'),
  sessionImportInput: document.getElementById('sessionImportInput'),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return sanitizeState(parsed);
  } catch {
    return structuredClone(defaultState);
  }
}

function sanitizeState(partial = {}) {
  return {
    ...structuredClone(defaultState),
    ...partial,
    commands: [],
    history: Array.isArray(partial.history) ? partial.history.slice(-80) : [],
    favorites: Array.isArray(partial.favorites) ? partial.favorites : [],
    recentCommands: Array.isArray(partial.recentCommands) ? partial.recentCommands : [],
    savedSessions: partial.savedSessions && typeof partial.savedSessions === 'object' ? partial.savedSessions : {},
    fakeFiles: Array.isArray(partial.fakeFiles) && partial.fakeFiles.length ? partial.fakeFiles : defaultFiles(),
    git: partial.git && typeof partial.git === 'object' ? { ...defaultGit(), ...partial.git } : defaultGit(),
    toolTimeline: Array.isArray(partial.toolTimeline) ? partial.toolTimeline.slice(-30) : [],
    selectedCommand: partial.selectedCommand ?? null,
    terminalMarkup: typeof partial.terminalMarkup === 'string' ? partial.terminalMarkup : '',
  };
}

function resetActiveSessionState() {
  state.sessionName = defaultState.sessionName;
  state.cwd = defaultState.cwd;
  state.model = defaultState.model;
  state.effort = defaultState.effort;
  state.theme = defaultState.theme;
  state.permissionsMode = defaultState.permissionsMode;
  state.planMode = defaultState.planMode;
  state.fastMode = defaultState.fastMode;
  state.usageUsd = 0;
  state.usageTurns = 0;
  state.history = [];
  state.historyIndex = -1;
  state.recentCommands = [];
  state.fakeFiles = defaultFiles();
  state.git = defaultGit();
  state.toolTimeline = [];
  state.tasks = structuredClone(defaultState.tasks);
  state.selectedCommand = state.commands.find((cmd) => cmd.command === '/help') || state.commands[0] || null;
  applyTheme(state.theme);
  refreshWorkspace();
  renderFileTree();
  renderToolTimeline();
  renderCommandList();
  renderSelectedCommand();
  renderBoot();
}

function saveState() {
  syncTerminalMarkup();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...state,
    commands: [],
    selectedCommand: state.selectedCommand ? state.selectedCommand.command || state.selectedCommand : null,
  }));
}

function syncTerminalMarkup() {
  state.terminalMarkup = ui.output.innerHTML;
}

function $(selector, root = document) { return root.querySelector(selector); }

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function formatUsd(value) { return `${value.toFixed(2)} USD`; }
function randomId(prefix = 'session') { return `${prefix}-${Math.random().toString(36).slice(2, 8)}`; }
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
function normalize(v = '') { return v.trim().toLowerCase(); }
function htmlEscape(v = '') {
  return String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function commandBase(raw = '') {
  const text = raw.trim();
  if (!text) return '';
  if (text.startsWith('/')) return text.split(/\s+/)[0].toLowerCase();
  if (text.startsWith('claude')) {
    if (/^claude\s+auth\s+status/.test(text)) return 'claude auth status';
    if (/^claude\s+auth\s+login/.test(text)) return 'claude auth login';
    if (/^claude\s+auth\s+logout/.test(text)) return 'claude auth logout';
    if (/^claude\s+auto-mode/.test(text)) return 'claude auto-mode';
    if (/^claude\s+mcp/.test(text)) return 'claude mcp';
    if (/^claude\s+plugin/.test(text)) return 'claude plugin';
    if (/^claude\s+remote-control/.test(text)) return 'claude remote-control';
    if (/^claude\s+update/.test(text)) return 'claude update';
    if (/^claude\s+-c\s+-p/.test(text)) return 'claude -c -p';
    if (/^claude\s+-p/.test(text) || /--print/.test(text)) return 'claude -p';
    if (/^claude\s+-c/.test(text)) return 'claude -c';
    if (/^claude\s+-r/.test(text) || /--resume/.test(text)) return 'claude -r';
    return 'claude';
  }
  if (text.startsWith('cat ') && text.includes('| claude -p')) return 'cat file | claude -p';
  if (text.startsWith('--')) return text.split(/\s+/)[0].toLowerCase();
  return text.toLowerCase();
}

function appendLine(text, type = 'info') {
  const node = el('div', `line ${type}`);
  node.textContent = text;
  ui.output.appendChild(node);
  syncTerminalMarkup();
  ui.output.scrollTop = ui.output.scrollHeight;
}

function appendMarkup(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while (wrapper.firstChild) {
    ui.output.appendChild(wrapper.firstChild);
  }
  syncTerminalMarkup();
  ui.output.scrollTop = ui.output.scrollHeight;
}

async function appendAnimated(lines, type = 'info', delay = 12) {
  for (const line of lines) {
    appendLine(line, type);
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

function appendToolRun(tool, summary, detail, status = 'success') {
  state.toolTimeline = [
    {
      tool,
      summary,
      detail: detail || '',
      status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    ...state.toolTimeline,
  ].slice(0, 30);
  renderToolTimeline();
  appendMarkup(`
    <div class="tool-card ${status}">
      <div class="tool-row">
        <span class="tool-name">${htmlEscape(tool)}</span>
        <span class="tool-status">${htmlEscape(status)}</span>
      </div>
      <div class="tool-summary">${htmlEscape(summary)}</div>
      ${detail ? `<div class="tool-detail">${htmlEscape(detail)}</div>` : ''}
    </div>
  `);
}

async function simulateWorkflow(title, steps) {
  appendLine(title, 'info');
  for (const step of steps) {
    appendToolRun(step.tool, step.summary, step.detail, step.status || 'success');
    if (step.lines?.length) await appendAnimated(step.lines, step.lineType || 'dim', 18);
    await new Promise((resolve) => setTimeout(resolve, step.delay ?? 40));
  }
}

function bumpUsage() {
  state.usageTurns += 1;
  state.usageUsd += 0.02 + Math.random() * 0.03;
  refreshStatusline();
}

function applyTheme(theme) {
  state.theme = theme;
  ui.body.setAttribute('data-theme', theme);
}

function refreshWorkspace() {
  ui.cwdDisplay.textContent = state.cwd;
  ui.sessionNameDisplay.textContent = state.sessionName;
  ui.modelDisplay.textContent = state.model;
  ui.effortDisplay.textContent = state.effort;
  ui.statuslineSession.textContent = state.sessionName;
  ui.statuslineModel.textContent = state.model;
  ui.statuslinePerms.textContent = state.permissionsMode;
  ui.statuslineUsage.textContent = formatUsd(state.usageUsd);
  ui.modeBadge.textContent = state.planMode ? 'Plan' : 'Interactive';
  renderWorkspaceState();
}

function refreshStatusline() {
  refreshWorkspace();
  autosaveCurrentSession();
  saveState();
}

function renderFileTree() {
  ui.fileTree.innerHTML = '';
  const folders = new Set();
  state.fakeFiles.forEach((file) => {
    const segments = file.path.split('/');
    segments.slice(0, -1).forEach((_, index) => {
      folders.add(`${segments.slice(0, index + 1).join('/')}/`);
    });
  });

  Array.from(folders)
    .sort()
    .forEach((folder) => {
      const row = el('button', 'tree-node tree-folder');
      row.type = 'button';
      row.disabled = true;
      row.append(el('span', '', '▸'), el('strong', '', folder));
      row.style.paddingInlineStart = `${(folder.split('/').filter(Boolean).length - 1) * 12}px`;
      ui.fileTree.appendChild(row);
    });

  state.fakeFiles.forEach((file) => {
    const row = el('button', `tree-node tree-file ${file.status}`);
    row.type = 'button';
    const depth = file.path.split('/').length - 1;
    row.style.paddingInlineStart = `${depth * 12}px`;
    row.append(el('span', '', file.staged ? '●' : '•'), el('strong', '', file.path.split('/').at(-1)));
    row.addEventListener('click', () => openFilePreview(file.path));
    ui.fileTree.appendChild(row);
  });
}

function renderWorkspaceState() {
  const changed = state.fakeFiles.filter((file) => file.status !== 'clean');
  const staged = state.fakeFiles.filter((file) => file.staged);
  if (ui.gitBranchBadge) ui.gitBranchBadge.textContent = state.git.branch;
  if (ui.changedFilesCount) ui.changedFilesCount.textContent = String(changed.length);
  if (ui.stagedFilesCount) ui.stagedFilesCount.textContent = String(staged.length);
  if (ui.workspaceObjective) ui.workspaceObjective.textContent = state.git.objective;
  if (!ui.workspaceFiles) return;
  ui.workspaceFiles.innerHTML = changed.length
    ? changed.map((file) => `
        <button type="button" class="workspace-file ${file.status}" data-file-open="${htmlEscape(file.path)}">
          <span>${htmlEscape(file.path)}</span>
          <strong>${file.staged ? 'staged' : file.status}</strong>
        </button>
      `).join('')
    : '<div class="empty-state">Working tree is clean.</div>';
}

function renderToolTimeline() {
  if (!ui.toolTimeline) return;
  ui.toolTimeline.innerHTML = state.toolTimeline.length
    ? state.toolTimeline.map((entry) => `
        <div class="timeline-entry ${htmlEscape(entry.status)}">
          <div class="timeline-head">
            <strong>${htmlEscape(entry.tool)}</strong>
            <span>${htmlEscape(entry.time)}</span>
          </div>
          <div class="timeline-summary">${htmlEscape(entry.summary)}</div>
          ${entry.detail ? `<div class="timeline-detail">${htmlEscape(entry.detail)}</div>` : ''}
        </div>
      `).join('')
    : '<div class="empty-state">Tool activity will appear here.</div>';
}

function fileByPath(path) {
  return state.fakeFiles.find((file) => file.path === path);
}

function updateObjective(text) {
  state.git.objective = text;
  renderWorkspaceState();
}

function markFile(path, updates = {}) {
  state.fakeFiles = state.fakeFiles.map((file) => (file.path === path ? { ...file, ...updates } : file));
  renderFileTree();
  renderWorkspaceState();
}

function touchWorkspaceFor(command) {
  if (command === '/plan' || command === '/ultraplan') {
    updateObjective('Plan the next implementation safely');
    markFile('.claude/CLAUDE.md', { status: 'modified', staged: false });
  }
  if (command === '/review' || command === '/diff') {
    updateObjective('Review current workspace changes');
    markFile('src/agents.ts', { status: 'modified', staged: false });
  }
  if (command === '/branch') {
    markFile('src/index.ts', { status: 'staged', staged: true });
  }
}

function filePreviewHtml(file) {
  return `
    <div class="grid-2">
      <div class="card">
        <div class="setting-row"><h4>${htmlEscape(file.path)}</h4><span class="badge-${file.staged ? 'ok' : file.status === 'modified' ? 'ask' : 'off'}">${htmlEscape(file.staged ? 'staged' : file.status)}</span></div>
        <p style="margin:0;color:var(--muted)">${htmlEscape(file.summary)}</p>
        <div class="session-actions">
          <button class="ghost-btn small" type="button" data-editor-action="apply" data-file-path="${htmlEscape(file.path)}">Apply Edit</button>
          <button class="ghost-btn small" type="button" data-editor-action="stage" data-file-path="${htmlEscape(file.path)}">${file.staged ? 'Unstage' : 'Stage'}</button>
          <button class="ghost-btn small" type="button" data-editor-action="revert" data-file-path="${htmlEscape(file.path)}">Revert</button>
        </div>
        <pre class="code-preview">${htmlEscape(file.content)}</pre>
      </div>
      <div class="card">
        <div class="setting-row"><h4>Diff preview</h4><span class="badge-ask">workspace</span></div>
        <pre class="diff-preview">${htmlEscape(file.diff || 'No diff available.')}</pre>
      </div>
    </div>
  `;
}

function openFilePreview(path) {
  const file = fileByPath(path);
  if (!file) return;
  openModal('File Preview', filePreviewHtml(file), 'Workspace file');
}

function diffHtml() {
  const changed = state.fakeFiles.filter((file) => file.status !== 'clean');
  return `
    <div class="card">
      <div class="setting-row"><h4>Changed files</h4><span class="badge-ok">${changed.length}</span></div>
      ${changed.map((file) => `
        <div class="diff-row">
          <div class="diff-row-head">
            <strong>${htmlEscape(file.path)}</strong>
            <span>${htmlEscape(file.staged ? 'staged' : file.status)}</span>
          </div>
          <pre class="diff-preview compact">${htmlEscape(file.diff)}</pre>
          <div class="session-actions">
            <button class="ghost-btn small" type="button" data-editor-action="apply" data-file-path="${htmlEscape(file.path)}">Apply Edit</button>
            <button class="ghost-btn small" type="button" data-editor-action="stage" data-file-path="${htmlEscape(file.path)}">${file.staged ? 'Unstage' : 'Stage'}</button>
            <button class="ghost-btn small" type="button" data-editor-action="revert" data-file-path="${htmlEscape(file.path)}">Revert</button>
            <button class="ghost-btn small" type="button" data-editor-action="open" data-file-path="${htmlEscape(file.path)}">Open File</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function onboardingHtml() {
  return `
    <div class="onboarding-grid">
      <section class="card onboarding-hero">
        <div class="eyebrow">Quick Start</div>
        <h4>Learn the simulator in under a minute</h4>
        <p class="details-copy">This simulator is fully static, but it mimics a coding-agent workspace with command search, fake tool runs, file previews, sessions, git state, and workflow panels.</p>
        <div class="session-actions">
          <button class="ghost-btn small" type="button" data-onboarding-action="insert" data-command="/help">Try /help</button>
          <button class="ghost-btn small" type="button" data-onboarding-action="insert" data-command="/diff">Open /diff</button>
          <button class="ghost-btn small" type="button" data-onboarding-action="sessions">Open Sessions</button>
        </div>
      </section>
      <section class="grid-2">
        <div class="card">
          <h4>Main areas</h4>
          <div class="onboarding-list">
            <div><strong>Terminal</strong><span>Run slash commands and fake CLI commands from the center panel.</span></div>
            <div><strong>Command Explorer</strong><span>Search, filter, favorite, and inspect commands on the right side.</span></div>
            <div><strong>Workspace State</strong><span>See branch, changed files, staged files, and the current objective.</span></div>
            <div><strong>Tool Timeline</strong><span>Review simulated Read, Diff, Worktree, Memory, and review steps.</span></div>
          </div>
        </div>
        <div class="card">
          <h4>Keyboard shortcuts</h4>
          <div class="onboarding-list">
            <div><strong>Cmd/Ctrl + K</strong><span>Open the command palette.</span></div>
            <div><strong>Tab</strong><span>Autocomplete the current command.</span></div>
            <div><strong>Up / Down</strong><span>Browse command history.</span></div>
            <div><strong>Esc</strong><span>Close the current modal or palette.</span></div>
          </div>
        </div>
      </section>
      <section class="grid-2 onboarding-grid-tight">
        <div class="card">
          <h4>Useful commands</h4>
          <div class="onboarding-list">
            <div><strong>/config</strong><span>Adjust theme and model settings.</span></div>
            <div><strong>/plan off</strong><span>Disable plan mode and switch back to normal interaction.</span></div>
            <div><strong>/interactive</strong><span>Return directly to interactive mode.</span></div>
            <div><strong>/sessions</strong><span>Save, load, export, and import simulator sessions.</span></div>
            <div><strong>/review</strong><span>Trigger a fake review workflow and timeline entries.</span></div>
            <div><strong>/branch feature/name</strong><span>Change the fake branch and update workspace state.</span></div>
          </div>
        </div>
        <div class="card">
          <h4>Extra options</h4>
          <div class="onboarding-list">
            <div><strong>Scenario presets</strong><span>Load Debug Bug, Review PR, Refactor, Write Tests, or Fix CI from the left sidebar.</span></div>
            <div><strong>Approval flow</strong><span>Risky actions now prompt for allow once, allow session, or deny.</span></div>
            <div><strong>Click project files</strong><span>Open file previews and diff previews.</span></div>
            <div><strong>Editor actions</strong><span>Apply edits, stage files, unstage, or revert directly from file and diff modals.</span></div>
            <div><strong>Star commands</strong><span>Pin favorites in the explorer and command palette.</span></div>
            <div><strong>Clear timeline</strong><span>Reset the tool timeline panel when you want a fresh run.</span></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function openOnboarding() {
  runtime.onboardingOpen = true;
  openModal('Welcome Guide', onboardingHtml(), 'Onboarding');
}

function markOnboardingSeen() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

function shouldShowOnboarding() {
  return localStorage.getItem(ONBOARDING_KEY) !== 'true';
}

function approvalStorage() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_APPROVAL_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveApprovalStorage(data) {
  localStorage.setItem(SESSION_APPROVAL_KEY, JSON.stringify(data));
}

function requiresApproval(base) {
  return [
    '/privacy-settings',
    '/upgrade',
    '/extra-usage',
    'claude auth login',
    '/remote-control',
    'claude remote-control',
    '/plugin',
  ].includes(base);
}

function approvalHtml(request) {
  return `
    <div class="card">
      <div class="setting-row"><h4>${htmlEscape(request.title)}</h4><span class="badge-ask">Approval required</span></div>
      <p class="details-copy">${htmlEscape(request.message)}</p>
      <div class="approval-actions">
        <button class="ghost-btn small" type="button" data-approval-choice="allow-once">Allow once</button>
        <button class="ghost-btn small" type="button" data-approval-choice="allow-session">Allow session</button>
        <button class="ghost-btn small" type="button" data-approval-choice="deny">Deny</button>
      </div>
    </div>
  `;
}

function requestApproval(base, raw) {
  const approvals = approvalStorage();
  if (approvals[base] === 'allow-session') {
    return Promise.resolve('allow-session');
  }

  runtime.pendingApproval = { base, raw };
  openModal('Permission Request', approvalHtml({
    title: raw,
    message: 'This simulated action would normally need confirmation because it touches billing, account, plugins, or remote control capabilities.',
  }), 'Approval');

  return new Promise((resolve) => {
    runtime.approvalResolver = resolve;
  });
}

function resolveApproval(choice) {
  const pending = runtime.pendingApproval;
  if (!pending || !runtime.approvalResolver) return;
  if (choice === 'allow-session') {
    const approvals = approvalStorage();
    approvals[pending.base] = 'allow-session';
    saveApprovalStorage(approvals);
  }
  const resolve = runtime.approvalResolver;
  runtime.pendingApproval = null;
  runtime.approvalResolver = null;
  ui.panelModal.classList.add('hidden');
  if (ui.palette.classList.contains('hidden')) ui.overlay.classList.add('hidden');
  resolve(choice);
}

function extractAppliedContent(file) {
  if (!file.diff) return file.content;
  const additions = file.diff
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.slice(1));
  return additions.length ? `${file.content.trimEnd()}\n${additions.join('\n')}\n` : file.content;
}

function editorAction(action, path) {
  const file = fileByPath(path);
  if (!file) return;
  if (action === 'open') {
    openFilePreview(path);
    return;
  }
  if (action === 'apply') {
    markFile(path, {
      content: extractAppliedContent(file),
      status: file.staged ? 'staged' : 'modified',
    });
    appendToolRun('Edit', `Applied patch to ${path}`, 'Updated file preview content', 'success');
  }
  if (action === 'stage') {
    markFile(path, {
      staged: !file.staged,
      status: !file.staged ? 'staged' : 'modified',
    });
    appendToolRun('Git', `${!file.staged ? 'Staged' : 'Unstaged'} ${path}`, `branch=${state.git.branch}`, 'success');
  }
  if (action === 'revert') {
    markFile(path, {
      staged: false,
      status: 'clean',
      diff: 'No diff available.',
    });
    appendToolRun('Revert', `Reverted simulated changes in ${path}`, 'Workspace returned to clean state for this file', 'warn');
  }
  if (ui.modalTitle.textContent === 'File Preview') {
    openFilePreview(path);
  } else if (ui.modalTitle.textContent === 'Diff Preview') {
    openModal('Diff Preview', diffHtml(), 'Workspace diff');
  }
  saveState();
}

function applyScenario(name) {
  const preset = scenarioPresets()[name];
  if (!preset) return;
  state.sessionName = preset.sessionName;
  state.cwd = preset.cwd;
  state.git.branch = preset.branch;
  state.git.objective = preset.objective;
  state.fakeFiles = preset.files;
  state.toolTimeline = preset.timeline;
  state.history = [];
  state.historyIndex = 0;
  refreshWorkspace();
  renderFileTree();
  renderToolTimeline();
  renderBoot();
  preset.lines.forEach((line) => appendLine(line, 'success'));
  ui.commandInput.value = preset.command;
  renderCommandSuggestion();
  const suggested = state.commands.find((cmd) => cmd.command === commandBase(preset.command)) || state.commands.find((cmd) => cmd.command === '/plan') || state.selectedCommand;
  if (suggested) selectCommand(suggested);
  appendToolRun('Scenario', `Loaded preset: ${preset.title}`, preset.objective, 'success');
  saveState();
}

function renderBoot() {
  ui.output.innerHTML = '';
  const tpl = document.getElementById('bootTemplate');
  ui.output.appendChild(tpl.content.cloneNode(true));
  $('[data-bind="cwd"]', ui.output).textContent = state.cwd;
  appendLine('This is a simulator: visual workflow and fake state, not a real Claude runtime.', 'dim');
  syncTerminalMarkup();
}

function restoreTerminal() {
  if (state.terminalMarkup) {
    ui.output.innerHTML = state.terminalMarkup;
  } else {
    renderBoot();
  }
  if (!$('[data-bind="cwd"]', ui.output) && !ui.output.textContent.trim()) {
    renderBoot();
  }
}

function rankCommand(cmd) {
  let score = 0;
  if (isFavorite(cmd.command)) score += 50;
  if (state.recentCommands.includes(cmd.command)) score += 20 - state.recentCommands.indexOf(cmd.command);
  return score;
}

function commandSearchList() {
  return state.commands
    .filter((cmd) => {
      const matchesType = state.filter === 'all' || cmd.type === state.filter;
      const q = normalize(state.query);
      if (!q) return matchesType;
      const haystack = `${cmd.command} ${cmd.description} ${(cmd.aliases || []).join(' ')} ${cmd.example || ''}`.toLowerCase();
      return matchesType && haystack.includes(q);
    })
    .sort((a, b) => rankCommand(b) - rankCommand(a) || a.command.localeCompare(b.command));
}

function isFavorite(command) {
  return state.favorites.includes(command);
}

function toggleFavorite(command) {
  const next = new Set(state.favorites);
  if (next.has(command)) next.delete(command);
  else next.add(command);
  state.favorites = Array.from(next);
  renderCommandList();
  renderPaletteResults(runtime.lastPaletteQuery);
  saveState();
}

function addRecentCommand(command) {
  state.recentCommands = [command, ...state.recentCommands.filter((entry) => entry !== command)].slice(0, 12);
}

function selectCommand(cmd, options = {}) {
  if (!cmd) return;
  const { populateInput = false, focusInput = false } = options;
  state.selectedCommand = cmd;
  if (populateInput) ui.commandInput.value = cmd.command;
  renderSelectedCommand();
  renderCommandList();
  renderCommandSuggestion();
  if (focusInput) ui.commandInput.focus();
  saveState();
}

function commandBadges(cmd) {
  const badges = [];
  if (isFavorite(cmd.command)) badges.push('<span class="mini-pill">Favorite</span>');
  if (state.recentCommands.includes(cmd.command)) badges.push('<span class="mini-pill subtle">Recent</span>');
  return badges.join('');
}

function renderCommandList() {
  const list = commandSearchList();
  ui.visibleCount.textContent = String(list.length);
  ui.commandList.innerHTML = '';
  if (!list.length) {
    ui.commandList.innerHTML = '<div class="empty-state">No commands match your search.</div>';
    return;
  }

  list.forEach((cmd) => {
    const row = el('div', `command-item ${state.selectedCommand?.command === cmd.command ? 'active' : ''}`);
    const action = el('button', 'command-main');
    action.type = 'button';
    action.innerHTML = `
      <span class="cmd">${htmlEscape(cmd.command)}</span>
      <span class="desc">${htmlEscape(cmd.description.slice(0, 88))}</span>
      <span class="command-meta">${commandBadges(cmd)}</span>
    `;
    action.addEventListener('click', () => selectCommand(cmd, { populateInput: true, focusInput: true }));

    const fav = el('button', `favorite-toggle ${isFavorite(cmd.command) ? 'active' : ''}`, isFavorite(cmd.command) ? '★' : '☆');
    fav.type = 'button';
    fav.title = isFavorite(cmd.command) ? 'Remove favorite' : 'Add favorite';
    fav.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavorite(cmd.command);
    });

    row.append(action, fav);
    ui.commandList.appendChild(row);
  });
}

function renderSelectedCommand() {
  const cmd = state.selectedCommand;
  if (!cmd) return;
  ui.selectedCommand.textContent = cmd.command;
  ui.selectedDescription.textContent = cmd.description;
  ui.selectedAliases.textContent = cmd.aliases?.length ? cmd.aliases.join(', ') : '—';
  ui.selectedExample.textContent = cmd.example || cmd.command;
  ui.selectedType.textContent = cmd.type === 'cli' ? 'CLI' : 'Slash';
}

function groupedPaletteResults(query) {
  const q = normalize(query);
  const matches = state.commands.filter((cmd) => {
    if (!q) return true;
    return `${cmd.command} ${cmd.description} ${(cmd.aliases || []).join(' ')}`.toLowerCase().includes(q);
  });

  const favorites = matches.filter((cmd) => isFavorite(cmd.command)).slice(0, 6);
  const recent = state.recentCommands
    .map((name) => matches.find((cmd) => cmd.command === name))
    .filter(Boolean)
    .filter((cmd) => !favorites.some((entry) => entry.command === cmd.command))
    .slice(0, 6);
  const commands = matches
    .filter((cmd) => !favorites.some((entry) => entry.command === cmd.command) && !recent.some((entry) => entry.command === cmd.command))
    .sort((a, b) => rankCommand(b) - rankCommand(a) || a.command.localeCompare(b.command))
    .slice(0, 16);

  return [
    { title: 'Favorites', items: favorites },
    { title: 'Recent', items: recent },
    { title: 'Commands', items: commands },
  ].filter((group) => group.items.length);
}

function paletteItemMarkup(cmd) {
  return `
    <div class="cmd">${htmlEscape(cmd.command)}</div>
    <div class="desc">${htmlEscape(cmd.description)}</div>
    <div class="palette-badges">${commandBadges(cmd)}</div>
  `;
}

function renderPaletteResults(query = runtime.lastPaletteQuery) {
  runtime.lastPaletteQuery = query;
  runtime.paletteItems = [];
  ui.paletteResults.innerHTML = '';

  const groups = groupedPaletteResults(query);
  if (!groups.length) {
    ui.paletteResults.innerHTML = '<div class="empty-state">No commands found.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  groups.forEach((group) => {
    const section = el('section', 'palette-group');
    section.append(el('div', 'palette-group-title', group.title));
    group.items.forEach((cmd) => {
      runtime.paletteItems.push(cmd);
      const item = el('button', 'palette-item');
      item.type = 'button';
      item.innerHTML = paletteItemMarkup(cmd);
      item.addEventListener('click', () => {
        closePalette();
        selectCommand(cmd, { populateInput: true, focusInput: true });
      });
      section.appendChild(item);
    });
    fragment.appendChild(section);
  });
  ui.paletteResults.appendChild(fragment);

  runtime.paletteActiveIndex = clamp(runtime.paletteActiveIndex, 0, Math.max(runtime.paletteItems.length - 1, 0));
  updatePaletteActiveItem();
}

function updatePaletteActiveItem() {
  const items = Array.from(ui.paletteResults.querySelectorAll('.palette-item'));
  items.forEach((item, index) => item.classList.toggle('active', index === runtime.paletteActiveIndex));
  items[runtime.paletteActiveIndex]?.scrollIntoView({ block: 'nearest' });
}

function movePaletteSelection(delta) {
  if (!runtime.paletteItems.length) return;
  runtime.paletteActiveIndex = (runtime.paletteActiveIndex + delta + runtime.paletteItems.length) % runtime.paletteItems.length;
  updatePaletteActiveItem();
}

function chooseActivePaletteItem() {
  const cmd = runtime.paletteItems[runtime.paletteActiveIndex];
  if (!cmd) return;
  closePalette();
  selectCommand(cmd, { populateInput: true, focusInput: true });
}

function openModal(title, html, kicker = 'Claude Code') {
  ui.modalKicker.textContent = kicker;
  ui.modalTitle.textContent = title;
  ui.modalBody.innerHTML = html;
  ui.overlay.classList.remove('hidden');
  ui.panelModal.classList.remove('hidden');
}

function closeModal() {
  if (runtime.pendingApproval && runtime.approvalResolver) {
    resolveApproval('deny');
    return;
  }
  ui.panelModal.classList.add('hidden');
  if (runtime.onboardingOpen) {
    markOnboardingSeen();
    runtime.onboardingOpen = false;
  }
  if (ui.palette.classList.contains('hidden')) ui.overlay.classList.add('hidden');
}

function openPalette() {
  ui.overlay.classList.remove('hidden');
  ui.palette.classList.remove('hidden');
  ui.paletteInput.value = '';
  runtime.paletteActiveIndex = 0;
  renderPaletteResults('');
  ui.paletteInput.focus();
}

function closePalette() {
  ui.palette.classList.add('hidden');
  if (ui.panelModal.classList.contains('hidden')) ui.overlay.classList.add('hidden');
}

function metadataFor(base, raw) {
  const normalizedBase = normalize(base);
  return state.commands.find((cmd) => {
    const names = [cmd.command, ...(cmd.aliases || [])].map((v) => commandBase(v));
    return names.includes(normalizedBase);
  }) || state.commands.find((cmd) => normalize(cmd.command) === normalize(raw));
}

function parseArg(raw, command) {
  return raw.trim().slice(command.length).trim();
}

function commandCandidates() {
  return state.commands.map((cmd) => cmd.command);
}

function bestSuggestion(value) {
  const input = value.trim();
  if (!input) return null;
  const normalized = normalize(input);
  const direct = commandCandidates().find((name) => normalize(name).startsWith(normalized) && normalize(name) !== normalized);
  if (direct) return direct;
  const fuzzy = state.commands.find((cmd) => `${cmd.command} ${(cmd.aliases || []).join(' ')}`.toLowerCase().includes(normalized));
  return fuzzy?.command || null;
}

function renderCommandSuggestion() {
  const suggestion = bestSuggestion(ui.commandInput.value);
  runtime.commandSuggestion = suggestion;
  if (!suggestion) {
    ui.commandSuggestion.classList.add('hidden');
    ui.commandSuggestion.textContent = '';
    return;
  }
  ui.commandSuggestion.classList.remove('hidden');
  ui.commandSuggestion.textContent = `Autocomplete: ${suggestion}`;
}

function acceptSuggestion() {
  const suggestion = runtime.commandSuggestion || bestSuggestion(ui.commandInput.value);
  if (!suggestion) return false;
  runtime.commandSuggestion = suggestion;
  ui.commandInput.value = suggestion;
  renderCommandSuggestion();
  return true;
}

function currentSessionSnapshot(name = state.sessionName) {
  syncTerminalMarkup();
  return {
    version: SESSION_EXPORT_VERSION,
    name,
    savedAt: new Date().toISOString(),
    sessionName: name,
    cwd: state.cwd,
    model: state.model,
    effort: state.effort,
    theme: state.theme,
    permissionsMode: state.permissionsMode,
    planMode: state.planMode,
    fastMode: state.fastMode,
    usageUsd: state.usageUsd,
    usageTurns: state.usageTurns,
    history: state.history.slice(-80),
    tasks: state.tasks,
    favorites: state.favorites,
    recentCommands: state.recentCommands,
    fakeFiles: state.fakeFiles,
    git: state.git,
    toolTimeline: state.toolTimeline,
    selectedCommand: state.selectedCommand?.command || state.selectedCommand || null,
    terminalMarkup: state.terminalMarkup,
  };
}

function autosaveCurrentSession() {
  if (!state.sessionName) return;
  state.savedSessions[state.sessionName] = currentSessionSnapshot(state.sessionName);
}

function saveNamedSession(name) {
  const cleanName = name.trim() || randomId('session');
  state.sessionName = cleanName;
  autosaveCurrentSession();
  refreshWorkspace();
  saveState();
  return cleanName;
}

function restoreSession(snapshot) {
  state.sessionName = snapshot.sessionName || snapshot.name || randomId('session');
  state.cwd = snapshot.cwd || defaultState.cwd;
  state.model = VALID_MODELS.includes(snapshot.model) ? snapshot.model : defaultState.model;
  state.effort = VALID_EFFORTS.includes(snapshot.effort) ? snapshot.effort : defaultState.effort;
  state.theme = VALID_THEMES.includes(snapshot.theme) ? snapshot.theme : defaultState.theme;
  state.permissionsMode = snapshot.permissionsMode || defaultState.permissionsMode;
  state.planMode = Boolean(snapshot.planMode);
  state.fastMode = Boolean(snapshot.fastMode);
  state.usageUsd = Number(snapshot.usageUsd) || 0;
  state.usageTurns = Number(snapshot.usageTurns) || 0;
  state.history = Array.isArray(snapshot.history) ? snapshot.history.slice(-80) : [];
  state.historyIndex = state.history.length;
  state.tasks = Array.isArray(snapshot.tasks) ? snapshot.tasks : defaultState.tasks;
  state.favorites = Array.isArray(snapshot.favorites) ? snapshot.favorites : [];
  state.recentCommands = Array.isArray(snapshot.recentCommands) ? snapshot.recentCommands : [];
  state.fakeFiles = Array.isArray(snapshot.fakeFiles) && snapshot.fakeFiles.length ? snapshot.fakeFiles : defaultFiles();
  state.git = snapshot.git && typeof snapshot.git === 'object' ? { ...defaultGit(), ...snapshot.git } : defaultGit();
  state.toolTimeline = Array.isArray(snapshot.toolTimeline) ? snapshot.toolTimeline.slice(0, 30) : [];
  state.selectedCommand = snapshot.selectedCommand || null;
  state.terminalMarkup = typeof snapshot.terminalMarkup === 'string' ? snapshot.terminalMarkup : '';

  applyTheme(state.theme);
  refreshWorkspace();
  restoreTerminal();
  renderToolTimeline();
  renderFileTree();
  if (typeof state.selectedCommand === 'string') {
    state.selectedCommand = state.commands.find((cmd) => cmd.command === state.selectedCommand) || state.commands[0] || null;
  }
  renderSelectedCommand();
  renderCommandList();
  renderCommandSuggestion();
  saveState();
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.replace(/[<>:"/\\|?*]+/g, '-');
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function sessionsHtml() {
  const entries = Object.values(state.savedSessions).sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
  return `
    <div class="grid-2">
      <div class="card">
        <div class="setting-row"><h4>Current session</h4><span class="badge-ok">${htmlEscape(state.sessionName)}</span></div>
        <div class="setting-row"><span>Directory</span><strong>${htmlEscape(state.cwd)}</strong></div>
        <div class="setting-row"><span>History entries</span><strong>${state.history.length}</strong></div>
        <div class="setting-row"><span>Favorites</span><strong>${state.favorites.length}</strong></div>
        <div class="setting-row"><span>Saved sessions</span><strong>${entries.length}</strong></div>
        <div class="session-actions">
          <button class="ghost-btn small" type="button" data-session-action="save-current">Save current</button>
          <button class="ghost-btn small" type="button" data-session-action="export-current">Export JSON</button>
          <button class="ghost-btn small" type="button" data-session-action="import">Import JSON</button>
          <button class="ghost-btn small" type="button" data-session-action="clear-all">Clear all</button>
        </div>
      </div>
      <div class="card">
        <h4>Saved sessions</h4>
        <div class="session-list">
          ${entries.length ? entries.map((session) => `
            <div class="session-row">
              <div>
                <strong>${htmlEscape(session.name || session.sessionName)}</strong>
                <div class="session-meta">${htmlEscape(session.cwd || defaultState.cwd)} • ${htmlEscape((session.savedAt || '').replace('T', ' ').slice(0, 16) || 'saved')}</div>
              </div>
              <div class="session-row-actions">
                <button class="ghost-btn small" type="button" data-session-action="load" data-session-name="${htmlEscape(session.name || session.sessionName)}">Load</button>
                <button class="ghost-btn small" type="button" data-session-action="export" data-session-name="${htmlEscape(session.name || session.sessionName)}">Export</button>
                <button class="ghost-btn small" type="button" data-session-action="delete" data-session-name="${htmlEscape(session.name || session.sessionName)}">Delete</button>
              </div>
            </div>
          `).join('') : '<div class="empty-state">No saved sessions yet.</div>'}
        </div>
      </div>
    </div>
  `;
}

function settingsHtml() {
  return `
    <div class="grid-2">
      <div class="card">
        <h4>Status</h4>
        <div class="setting-row"><span>Session name</span><strong>${htmlEscape(state.sessionName)}</strong></div>
        <div class="setting-row"><span>Current directory</span><strong>${htmlEscape(state.cwd)}</strong></div>
        <div class="setting-row"><span>Model</span><strong>${htmlEscape(state.model)}</strong></div>
        <div class="setting-row"><span>Effort</span><strong>${htmlEscape(state.effort)}</strong></div>
        <div class="setting-row"><span>Permissions</span><strong>${htmlEscape(state.permissionsMode)}</strong></div>
        <div class="setting-row"><span>Saved sessions</span><strong>${Object.keys(state.savedSessions).length}</strong></div>
      </div>
      <div class="card">
        <h4>Interactive settings</h4>
        <label class="setting-row"><span>Theme</span>
          <select class="select" id="themeSelect">
            ${VALID_THEMES.map((theme) => `<option value="${theme}" ${state.theme === theme ? 'selected' : ''}>${theme}</option>`).join('')}
          </select>
        </label>
        <label class="setting-row"><span>Model</span>
          <select class="select" id="modelSelect">
            ${VALID_MODELS.map((model) => `<option value="${model}" ${state.model === model ? 'selected' : ''}>${model}</option>`).join('')}
          </select>
        </label>
        <label class="setting-row"><span>Editor mode</span><span class="badge-ok">Normal</span></label>
        <label class="setting-row"><span>Fast mode</span><span class="${state.fastMode ? 'badge-ok' : 'badge-ask'}">${state.fastMode ? 'On' : 'Off'}</span></label>
      </div>
    </div>
  `;
}

function permissionsHtml() {
  return `
    <div class="card">
      <div class="setting-row"><h4>Permission rules</h4><span class="badge-ask">${htmlEscape(state.permissionsMode)}</span></div>
      <table class="table">
        <thead><tr><th>Scope</th><th>Action</th><th>Matcher</th></tr></thead>
        <tbody>
          ${state.permissionRules.map((rule) => `
            <tr>
              <td>${htmlEscape(rule.scope)}</td>
              <td>${htmlEscape(rule.action)}</td>
              <td><code>${htmlEscape(rule.matcher)}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function mcpHtml() {
  return `
    <div class="card">
      <h4>MCP servers</h4>
      <table class="table">
        <thead><tr><th>Server</th><th>Status</th><th>Prompts</th><th>Tools</th></tr></thead>
        <tbody>
          ${state.mcpServers.map((server) => `
            <tr>
              <td>${htmlEscape(server.name)}</td>
              <td><span class="${server.status === 'connected' ? 'badge-ok' : 'badge-off'}">${htmlEscape(server.status)}</span></td>
              <td>${server.prompts}</td>
              <td>${server.tools}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function hooksHtml() {
  return `
    <div class="grid-2">
      <div class="card">
        <h4>Hook status</h4>
        <div class="setting-row"><span>Enabled</span><span class="${state.hooksEnabled ? 'badge-ok' : 'badge-off'}">${state.hooksEnabled ? 'Yes' : 'No'}</span></div>
        <div class="setting-row"><span>Common events</span><span>PreToolUse, PostToolUse, SessionStart, SessionEnd</span></div>
      </div>
      <div class="card">
        <h4>Debug note</h4>
        <p style="margin:0;color:var(--muted)">This simulator mirrors the hook lifecycle and configuration style but does not execute real shell, HTTP, or prompt hooks.</p>
      </div>
    </div>
  `;
}

function statsHtml() {
  const avg = state.usageTurns ? state.usageUsd / state.usageTurns : 0;
  return `
    <div class="grid-2">
      <div class="card">
        <h4>Usage overview</h4>
        <div class="setting-row"><span>Total cost</span><strong>${formatUsd(state.usageUsd)}</strong></div>
        <div class="setting-row"><span>Turns</span><strong>${state.usageTurns}</strong></div>
        <div class="setting-row"><span>Average per turn</span><strong>${formatUsd(avg)}</strong></div>
      </div>
      <div class="card">
        <h4>Preferences</h4>
        <div class="setting-row"><span>Favorite model</span><strong>${htmlEscape(state.model)}</strong></div>
        <div class="setting-row"><span>Plan mode</span><strong>${state.planMode ? 'On' : 'Off'}</strong></div>
        <div class="setting-row"><span>Fast mode</span><strong>${state.fastMode ? 'On' : 'Off'}</strong></div>
      </div>
    </div>
  `;
}

function tasksHtml() {
  return `
    <div class="card">
      <div class="setting-row"><h4>Background tasks</h4><span class="badge-ok">${state.tasks.length} tasks</span></div>
      <table class="table">
        <thead><tr><th>Name</th><th>Schedule</th><th>Status</th></tr></thead>
        <tbody>
          ${state.tasks.map((task) => `
            <tr>
              <td>${htmlEscape(task.name)}</td>
              <td>${htmlEscape(task.schedule)}</td>
              <td>${htmlEscape(task.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function releaseNotesHtml() {
  return `
    <div class="card">
      <h4>Release notes</h4>
      <p style="margin:0;color:var(--muted)">Current synced version: <strong>${htmlEscape(state.currentVersion)}</strong></p>
      <p style="margin:0;color:var(--muted)">Use the source link to inspect the official changelog and built-in commands reference.</p>
      <p style="margin:0"><a href="${htmlEscape(state.source)}" target="_blank" rel="noreferrer">Open official docs</a></p>
    </div>
  `;
}

function maybeOpenSpecialPanel(base) {
  if (base === '/config' || base === '/status') {
    openModal('Settings', settingsHtml(), base === '/status' ? 'Status tab' : 'Config');
    attachSettingsHandlers();
    return true;
  }
  if (base === '/permissions') { openModal('Permissions', permissionsHtml(), 'Permissions'); return true; }
  if (base === '/mcp' || base === 'claude mcp') { openModal('MCP', mcpHtml(), 'Model Context Protocol'); return true; }
  if (base === '/hooks') { openModal('Hooks', hooksHtml(), 'Hooks'); return true; }
  if (base === '/diff') { openModal('Diff Preview', diffHtml(), 'Workspace diff'); return true; }
  if (base === '/stats' || base === '/usage' || base === '/cost') { openModal('Usage', statsHtml(), 'Stats'); return true; }
  if (base === '/tasks') { openModal('Tasks', tasksHtml(), 'Background tasks'); return true; }
  if (base === '/release-notes') { openModal('Release notes', releaseNotesHtml(), 'Changelog'); return true; }
  if (base === '/sessions') { openModal('Sessions', sessionsHtml(), 'Session manager'); return true; }
  return false;
}

function attachSettingsHandlers() {
  $('#themeSelect', ui.modalBody)?.addEventListener('change', (event) => {
    applyTheme(event.target.value);
    refreshStatusline();
  });
  $('#modelSelect', ui.modalBody)?.addEventListener('change', (event) => {
    state.model = event.target.value;
    refreshStatusline();
  });
}

async function handleSessionAction(action, name) {
  if (action === 'save-current') {
    const saved = saveNamedSession(state.sessionName || randomId('session'));
    openModal('Sessions', sessionsHtml(), 'Session manager');
    appendLine(`Session saved: ${saved}`, 'success');
    return;
  }
  if (action === 'export-current') {
    downloadJson(`${state.sessionName}.session.json`, currentSessionSnapshot());
    appendLine(`Exported session JSON for ${state.sessionName}.`, 'success');
    return;
  }
  if (action === 'import') {
    ui.sessionImportInput.value = '';
    ui.sessionImportInput.click();
    return;
  }
  if (action === 'clear-all') {
    state.savedSessions = {};
    resetActiveSessionState();
    openModal('Sessions', sessionsHtml(), 'Session manager');
    saveState();
    appendLine('Cleared all saved sessions and reset the active simulator state.', 'warn');
    return;
  }
  if (!name) return;
  if (action === 'load' && state.savedSessions[name]) {
    restoreSession(state.savedSessions[name]);
    closeModal();
    appendLine(`Loaded session: ${name}`, 'success');
    return;
  }
  if (action === 'export' && state.savedSessions[name]) {
    downloadJson(`${name}.session.json`, state.savedSessions[name]);
    appendLine(`Exported session JSON for ${name}.`, 'success');
    return;
  }
  if (action === 'delete' && state.savedSessions[name]) {
    delete state.savedSessions[name];
    openModal('Sessions', sessionsHtml(), 'Session manager');
    saveState();
    appendLine(`Deleted saved session: ${name}`, 'warn');
  }
}

function relatedCommands(metadata) {
  if (!metadata) return [];
  return state.commands
    .filter((cmd) => cmd.command !== metadata.command && cmd.type === metadata.type)
    .slice(0, 3)
    .map((cmd) => cmd.command);
}

async function runCommand(rawInput) {
  const raw = rawInput.trim();
  if (!raw) return;

  appendLine(`❯ ${raw}`, 'command');
  state.history.push(raw);
  state.historyIndex = state.history.length;
  bumpUsage();

  const base = commandBase(raw);
  if (requiresApproval(base)) {
    const choice = await requestApproval(base, raw);
    if (choice === 'deny') {
      appendToolRun('Approval', `Denied ${raw}`, 'Action cancelled by the simulated approval flow', 'warn');
      await appendAnimated(['Action denied.', 'You can retry and choose allow once or allow session.'], 'warn');
      return;
    }
    appendToolRun('Approval', `${choice === 'allow-session' ? 'Allowed for this session' : 'Allowed once'}: ${raw}`, 'Continuing the simulated action', 'success');
  }
  const metadata = metadataFor(base, raw);
  touchWorkspaceFor(base);
  if (metadata) {
    state.selectedCommand = metadata;
    addRecentCommand(metadata.command);
  }
  renderSelectedCommand();
  renderCommandList();
  autosaveCurrentSession();
  saveState();

  if (maybeOpenSpecialPanel(base)) {
    await appendAnimated([`Opened ${base.replace(/^claude\s+/, '').replace('/', '') || 'panel'} panel.`], 'success');
    return;
  }

  if (base === '/help') {
    const builtIns = state.commands.filter((cmd) => cmd.type === 'built-in').slice(0, 12).map((cmd) => cmd.command);
    await appendAnimated(['Available commands:', ...builtIns, 'Use / followed by letters to filter in Claude Code.'], 'success');
    return;
  }

  if (base === '/add-dir') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || '../shared';
    appendToolRun('Filesystem', `Added working directory ${arg}`, 'Simulator now treats it as an extra readable path', 'success');
    await appendAnimated([`Added directory: ${arg}`, 'Project discovery remains simulated and browser-only.'], 'success');
    return;
  }

  if (base === '/btw') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || 'What should we investigate next?';
    await appendAnimated(['Side question captured:', arg, 'This would stay out of the main conversation thread in the real product.'], 'success');
    return;
  }

  if (['/clear', '/reset', '/new', 'clear'].includes(base)) {
    renderBoot();
    autosaveCurrentSession();
    saveState();
    return;
  }

  if (base === '/compact') {
    await simulateWorkflow('Compacting conversation…', [
      { tool: 'Summarize', summary: 'Compressing recent turns into a checkpoint', detail: 'Preserving action items and decisions' },
      { tool: 'Memory', summary: 'Writing condensed context into session memory', detail: `Session: ${state.sessionName}` },
    ]);
    await appendAnimated(['Summary saved in simulator memory.', 'Continue in the same session with a smaller context snapshot.'], 'success');
    return;
  }

  if (base === '/context') {
    await appendAnimated([
      'Context usage snapshot:',
      '■■■■■■■■□□ 78% used',
      'Heavy areas: terminal transcript, workspace diff, recent tool timeline',
      'Suggestion: use /compact before a long review or planning pass.',
    ], 'success');
    return;
  }

  if (base === '/init') {
    await appendAnimated(['Scaffold suggestions:', '- CLAUDE.md', '- .claude/commands/', '- .claude/skills/', '- .claude/settings.json', 'No files were written; this is a simulator.'], 'success');
    return;
  }

  if (base === '/memory') {
    await simulateWorkflow('Loading project memory…', [
      { tool: 'Read', summary: 'Inspecting CLAUDE.md', detail: `${state.cwd}/CLAUDE.md` },
      { tool: 'Index', summary: 'Refreshing workspace memory', detail: 'Conventions, aliases, and last task context' },
    ]);
    await appendAnimated([`Session instructions loaded from CLAUDE.md`, `cwd: ${state.cwd}`, `Team conventions: preserve tests, prefer minimal diffs, explain risky changes.`], 'success');
    return;
  }

  if (base === '/model') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]).replace(/[[\]]/g, '');
    if (arg && !VALID_MODELS.includes(arg)) {
      await appendAnimated([`Unknown model: ${arg}`, `Valid models: ${VALID_MODELS.join(', ')}`], 'error');
      return;
    }
    if (arg) state.model = arg;
    refreshStatusline();
    await appendAnimated([`Model set to ${state.model}.`, 'Future turns will reflect the new model badge and fake runtime settings.'], 'success');
    return;
  }

  if (base === '/effort') {
    const arg = (parseArg(raw, raw.split(/\s+/)[0]) || 'medium').replace(/[[\]]/g, '');
    if (!VALID_EFFORTS.includes(arg)) {
      await appendAnimated([`Unknown effort: ${arg}`, `Valid effort levels: ${VALID_EFFORTS.join(', ')}`], 'error');
      return;
    }
    state.effort = arg;
    refreshStatusline();
    await appendAnimated([`Effort updated to ${state.effort}.`, 'Planning depth and fake response latency are now adjusted.'], 'success');
    return;
  }

  if (base === '/fast') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]).toLowerCase();
    state.fastMode = arg ? arg === 'on' : !state.fastMode;
    refreshStatusline();
    await appendAnimated([`Fast mode ${state.fastMode ? 'enabled' : 'disabled'}.`], 'success');
    return;
  }

  if (base === '/theme' || base === '/color') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]).toLowerCase();
    if (arg && !VALID_THEMES.includes(arg)) {
      await appendAnimated([`Unknown theme: ${arg}`, `Valid themes: ${VALID_THEMES.join(', ')}`], 'error');
      return;
    }
    const nextTheme = arg || (state.theme === 'dark' ? 'light' : 'dark');
    applyTheme(nextTheme);
    refreshStatusline();
    await appendAnimated([`Theme changed to ${nextTheme}.`], 'success');
    return;
  }

  if (base === '/rename') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || randomId('session');
    state.sessionName = arg.replace(/^"|"$/g, '');
    refreshStatusline();
    await appendAnimated([`Session renamed to ${state.sessionName}.`], 'success');
    return;
  }

  if (base === '/session') {
    const [, action = 'list', ...rest] = raw.split(/\s+/);
    const name = rest.join(' ').trim().replace(/^"|"$/g, '');
    if (action === 'save') {
      const saved = saveNamedSession(name || state.sessionName || randomId('session'));
      await appendAnimated([`Saved session: ${saved}`, 'Open /sessions to manage or export snapshots.'], 'success');
      return;
    }
    if (action === 'load') {
      const snapshot = state.savedSessions[name];
      if (!snapshot) {
        await appendAnimated([`Session not found: ${name || '(missing name)'}`], 'error');
        return;
      }
      restoreSession(snapshot);
      await appendAnimated([`Loaded session: ${name}`], 'success');
      return;
    }
    if (action === 'delete') {
      if (!state.savedSessions[name]) {
        await appendAnimated([`Session not found: ${name || '(missing name)'}`], 'error');
        return;
      }
      delete state.savedSessions[name];
      saveState();
      await appendAnimated([`Deleted saved session: ${name}`], 'warn');
      return;
    }
    if (action === 'export') {
      const snapshot = state.savedSessions[name] || currentSessionSnapshot(name || state.sessionName);
      downloadJson(`${snapshot.name || snapshot.sessionName}.session.json`, snapshot);
      await appendAnimated([`Exported session snapshot for ${snapshot.name || snapshot.sessionName}.`], 'success');
      return;
    }
    if (action === 'import') {
      ui.sessionImportInput.value = '';
      ui.sessionImportInput.click();
      await appendAnimated(['Choose a saved session JSON file to import.'], 'success');
      return;
    }
    openModal('Sessions', sessionsHtml(), 'Session manager');
    await appendAnimated(['Session manager opened.'], 'success');
    return;
  }

  if (base === '/recent') {
    const recent = state.recentCommands.length ? state.recentCommands : ['No recent commands yet.'];
    await appendAnimated(['Recent commands:', ...recent], 'success');
    return;
  }

  if (base === '/favorite') {
    const target = parseArg(raw, raw.split(/\s+/)[0]) || state.selectedCommand?.command;
    if (!target) {
      await appendAnimated(['Provide a command to favorite, or select one in the explorer first.'], 'error');
      return;
    }
    toggleFavorite(target);
    await appendAnimated([`${isFavorite(target) ? 'Favorited' : 'Removed favorite'}: ${target}`], 'success');
    return;
  }

  if (base === '/branch') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || 'feature/simulator';
    state.git.branch = arg;
    updateObjective(`Validate work on ${arg}`);
    renderWorkspaceState();
    await simulateWorkflow(`Preparing branch ${arg}…`, [
      { tool: 'Checkpoint', summary: 'Saving current working state', detail: `Session ${state.sessionName}` },
      { tool: 'Worktree', summary: 'Creating an isolated branch workspace', detail: arg },
    ]);
    await appendAnimated([`Created worktree for branch ${arg}.`, 'Pending changes are isolated in a fake branch workspace.'], 'success');
    return;
  }

  if (base === '/plan' || base === '/ultraplan') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || 'Investigate current task';
    if (normalize(arg) === 'off') {
      state.planMode = false;
      refreshStatusline();
      await appendAnimated(['Plan mode disabled.', 'The simulator is back in interactive mode.'], 'success');
      return;
    }
    state.planMode = true;
    refreshStatusline();
    updateObjective(arg);
    await simulateWorkflow('Plan mode enabled.', [
      { tool: 'Inspect', summary: 'Scanning the workspace for relevant files', detail: state.cwd },
      { tool: 'Outline', summary: 'Drafting an execution plan', detail: arg },
      { tool: 'Risk check', summary: 'Flagging test and regression risk', detail: 'Static simulator risk pass' },
    ]);
    await appendAnimated(['1. Inspect the codebase', '2. Draft a minimal implementation', '3. Validate with tests', '4. Present tradeoffs before editing'], 'success');
    return;
  }

  if (base === '/interactive') {
    state.planMode = false;
    refreshStatusline();
    await appendAnimated(['Interactive mode enabled.', 'Plan mode is now off.'], 'success');
    return;
  }

  if (base === '/sandbox') {
    await appendAnimated(['Sandbox mode toggled for this simulated session.', 'Filesystem edits remain fake and in-browser only.'], 'success');
    return;
  }

  if (base === '/doctor') {
    await simulateWorkflow('Running diagnostics…', [
      { tool: 'Health', summary: 'Checking account reachability', detail: 'Simulator only', status: 'success' },
      { tool: 'MCP', summary: 'Verifying server configuration', detail: `${state.mcpServers.length} servers`, status: 'success' },
      { tool: 'Keys', summary: 'Checking keyboard shortcuts and palette state', detail: 'Cmd/Ctrl+K ready', status: 'success' },
    ]);
    await appendAnimated(['✓ Claude account reachable', '✓ MCP configuration loaded', '✓ Terminal keybindings supported', '✓ No fatal startup issues detected'], 'success');
    return;
  }

  if (base === '/feedback') {
    const arg = parseArg(raw, raw.split(/\s+/)[0]) || 'General simulator feedback';
    await appendAnimated([`Feedback queued: ${arg}`, 'In the real product this would be submitted to Claude Code feedback tooling.'], 'success');
    return;
  }

  if (base === '/desktop') {
    await appendAnimated(['Desktop handoff ready.', 'In real Claude Code this command appears only on supported desktop platforms.'], 'warn');
    return;
  }

  if (base === '/login') {
    appendToolRun('Browser', 'Opening Anthropic sign-in flow', 'Simulated account authentication', 'success');
    await appendAnimated(['Signed in to the simulated Claude Code account.'], 'success');
    return;
  }

  if (base === '/logout') {
    await appendAnimated(['Signed out from the simulated Claude Code account.'], 'warn');
    return;
  }

  if (base === '/mobile' || base === '/voice' || base === '/chrome') {
    await appendAnimated(['This command is surfaced conditionally in real Claude Code.', 'The simulator exposes it for exploration without platform checks.'], 'warn');
    return;
  }

  if (base === '/keybindings') {
    await appendAnimated(['Keybindings file opened (simulated).', 'You can customize shortcuts like Submit, Newline, and Palette in a real environment.'], 'success');
    return;
  }

  if (base === '/ide') {
    await appendAnimated([
      'IDE integrations:',
      '• VS Code: connected',
      '• Cursor: available',
      '• JetBrains: available',
      'Use /config to adjust editor-related preferences.',
    ], 'success');
    return;
  }

  if (base === '/install-github-app') {
    appendToolRun('GitHub', 'Opening GitHub app installation flow', 'Repository selection is simulated only', 'success');
    await appendAnimated(['GitHub app setup ready (simulated).'], 'success');
    return;
  }

  if (base === '/install-slack-app') {
    appendToolRun('Slack', 'Opening Slack app install flow', 'OAuth is simulated only', 'success');
    await appendAnimated(['Slack app installation ready (simulated).'], 'success');
    return;
  }

  if (base === '/passes' || base === '/stickers') {
    await appendAnimated(['This command is account-gated in the real product.', 'The simulator shows the command without contacting any service.'], 'warn');
    return;
  }

  if (base === '/privacy-settings' || base === '/upgrade' || base === '/extra-usage') {
    appendToolRun('Approval', 'Would require account or billing access', 'Showing the workflow without leaving the browser', 'warn');
    await appendAnimated(['This action is plan-gated in the real product.', 'The simulator shows the flow without contacting billing or account services.'], 'warn');
    return;
  }

  if (base === '/powerup') {
    openModal('Powerup', `
      <div class="card">
        <h4>Feature lessons</h4>
        <div class="onboarding-list">
          <div><strong>Palette</strong><span>Practice opening the command palette and picking a command.</span></div>
          <div><strong>Sessions</strong><span>Learn how to save, load, export, and import simulator sessions.</span></div>
          <div><strong>Diffs</strong><span>Explore the diff modal and editor actions.</span></div>
        </div>
      </div>
    `, 'Interactive lessons');
    await appendAnimated(['Powerup lessons opened (simulated).'], 'success');
    return;
  }

  if (base === '/schedule') {
    const description = parseArg(raw, raw.split(/\s+/)[0]) || 'Untitled task';
    state.tasks.unshift({ name: description, schedule: 'Soon', status: 'scheduled' });
    refreshStatusline();
    await appendAnimated([`Scheduled task created: ${description}`, 'Open /tasks to review the queue.'], 'success');
    return;
  }

  if (base === '/plugin') {
    await appendAnimated([`Installed plugins: ${state.plugins.join(', ')}`, 'Use claude plugin install <name> in the real CLI to add more plugins.'], 'success');
    return;
  }

  if (base === '/reload-plugins') {
    await simulateWorkflow('Reloading plugins…', [
      { tool: 'Plugin', summary: 'Reloading active plugin manifests', detail: `${state.plugins.length} active plugins`, status: 'success' },
      { tool: 'Plugin', summary: 'Refreshing plugin commands and hooks', detail: 'No restart required', status: 'success' },
    ]);
    await appendAnimated(['Plugins reloaded successfully (simulated).'], 'success');
    return;
  }

  if (base === '/security-review') {
    await simulateWorkflow('Running security review…', [
      { tool: 'Diff', summary: 'Inspecting changed files', detail: `${state.fakeFiles.filter((file) => file.status !== 'clean').length} changed files`, status: 'success' },
      { tool: 'Analyze', summary: 'Checking for auth, injection, and data exposure risks', detail: 'Static simulator scan', status: 'warn' },
    ]);
    await appendAnimated(['Security review complete.', 'Potential focus areas: auth flows, input handling, and secrets in config.'], 'warn');
    return;
  }

  if (base === '/setup-bedrock') {
    await appendAnimated(['Amazon Bedrock setup wizard opened (simulated).', 'In the real product this is only available when Bedrock mode is enabled.'], 'warn');
    return;
  }

  if (base === '/skills' || base === '/agents') {
    await appendAnimated(['Available skills: /simplify, /batch, /debug, /loop', 'Custom skills would be loaded from .claude/skills in a real project.'], 'success');
    return;
  }

  if (base === '/copy') {
    const text = metadata?.example || raw;
    await navigator.clipboard?.writeText(text).catch(() => {});
    await appendAnimated(['Copied example command to clipboard.'], 'success');
    return;
  }

  if (base === '/export') {
    const payload = { transcript: ui.output.textContent || '', session: currentSessionSnapshot() };
    downloadJson((parseArg(raw, '/export') || `${state.sessionName}.transcript.json`), payload);
    await appendAnimated([`Exported terminal transcript and session state.`], 'success');
    return;
  }

  if (base === '/review') {
    markFile('README.md', { status: 'modified', staged: false });
    await simulateWorkflow('Code review mode (simulated)…', [
      { tool: 'Diff', summary: 'Collecting changed files', detail: '3 files changed' },
      { tool: 'Analyze', summary: 'Checking for regressions and risky behavior', detail: 'Focus: UI, keyboard flow, persistence' },
      { tool: 'Summarize', summary: 'Preparing findings for the user', detail: 'Bugs first, summary second' },
    ]);
    await appendAnimated(['Deprecated in current docs.', 'Install the code-review plugin instead: claude plugin install code-review@claude-plugins-official'], 'warn');
    return;
  }

  if (base === '/vim') {
    await appendAnimated(['Removed in current docs.', 'Use /config → Editor mode instead.'], 'warn');
    return;
  }

  if (base === '/pr-comments') {
    await appendAnimated(['Removed in current docs.', 'Ask Claude directly to inspect pull request comments instead.'], 'warn');
    return;
  }

  if (base === '/statusline') {
    await appendAnimated(['Status line configuration ready.', 'This simulator already reflects session, model, permissions, and fake usage in the footer bar.'], 'success');
    return;
  }

  if (base === '/terminal-setup') {
    await appendAnimated(['Terminal setup guide opened (simulated).', 'This command is only shown in terminals that need extra keybinding configuration.'], 'warn');
    return;
  }

  if (base === '/resume') {
    openModal('Sessions', sessionsHtml(), 'Resume');
    await appendAnimated(['Session picker opened (simulated).', `Latest sessions: ${Object.keys(state.savedSessions).slice(0, 3).join(', ') || 'untitled-session, auth-refactor, docs-polish'}.`], 'success');
    return;
  }

  if (base === '/rewind') {
    appendToolRun('Checkpoint', 'Browsing earlier snapshots', 'Rewind is simulated from local session history', 'success');
    await appendAnimated(['Checkpoint browser opened (simulated).', 'You can restore a prior summary or code snapshot in the real product.'], 'success');
    return;
  }

  if (base === '/insights') {
    const mostUsed = state.history.reduce((acc, entry) => {
      const key = commandBase(entry);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(mostUsed).sort((a, b) => b[1] - a[1])[0]?.[0] || '/config';
    await appendAnimated(['Recent patterns:', `• Most used command: ${top}`, `• Frequent model: ${state.model}`, `• Main workspace: ${state.cwd}`], 'success');
    return;
  }

  if (base === '/remote-control' || base === 'claude remote-control') {
    await appendAnimated(['Remote control server ready (simulated).', 'Open Claude.ai and connect to this session name in a real environment.'], 'success');
    return;
  }

  if (base === '/remote-env') {
    await appendAnimated(['Remote environment preferences updated.', 'Default remote shell: ubuntu-22.04 / node-20 / python-3.11'], 'success');
    return;
  }

  if (base === '/usage') {
    await appendAnimated([`Plan usage snapshot: ${formatUsd(state.usageUsd)} across ${state.usageTurns} turns.`, 'Rate limit status: normal (simulated).'], 'success');
    return;
  }

  if (base === '/exit') {
    await appendAnimated(['Exiting current simulated session…', `Session ${state.sessionName} closed. Use /resume to reopen a saved thread.`], 'warn');
    return;
  }

  if (base === 'claude auth status') {
    await appendAnimated(['Authenticated via Claude.ai', `Account type: Pro (simulated)`, `Current model default: ${state.model}`], 'success');
    return;
  }

  if (base === 'claude auth login') {
    appendToolRun('Browser', 'Launching Claude.ai sign-in flow', 'Static simulator: no network call is made', 'success');
    await appendAnimated(['Authentication successful (simulated).'], 'success');
    return;
  }

  if (base === 'claude auth logout') {
    await appendAnimated(['Logged out of the simulated CLI session.'], 'warn');
    return;
  }

  if (base === 'claude update') {
    await appendAnimated([`Claude Code is up to date (simulated current version: ${state.currentVersion}).`], 'success');
    return;
  }

  if (base === 'claude -p' || base === 'cat file | claude -p' || base === 'claude -c -p') {
    const quoted = raw.match(/"([\s\S]+)"/);
    const prompt = quoted ? quoted[1] : 'Explain this function';
    await simulateWorkflow('Running one-shot print mode…', [
      { tool: 'Prompt', summary: 'Preparing single-turn request', detail: prompt.slice(0, 80) },
      { tool: 'Model', summary: `Dispatching to ${state.model}`, detail: `effort=${state.effort}` },
      { tool: 'Format', summary: 'Building structured JSON output', detail: 'print mode' },
    ]);
    await appendAnimated(['{', `  "model": "${state.model}",`, `  "effort": "${state.effort}",`, `  "summary": "${prompt.slice(0, 72)}"`, '}'], 'success');
    return;
  }

  if (base === 'claude -c' || base === 'claude -r') {
    await appendAnimated(['Resuming the most relevant previous conversation in this working directory (simulated).'], 'success');
    return;
  }

  if (base === 'claude auto-mode') {
    await appendAnimated(['{', '  "classifier": "balanced",', '  "threshold": 0.72,', '  "source": "defaults"', '}'], 'success');
    return;
  }

  if (base.startsWith('--')) {
    await appendAnimated([`Flag captured: ${base}`, metadata?.description || 'Launch-time option recognized from the official CLI reference.'], 'success');
    return;
  }

  if (base === 'claude') {
    await simulateWorkflow('Launching interactive session…', [
      { tool: 'Session', summary: 'Hydrating interactive runtime', detail: `cwd=${state.cwd}` },
      { tool: 'Memory', summary: 'Loading saved preferences and session memory', detail: `model=${state.model}` },
    ]);
    await appendAnimated([`cwd: ${state.cwd}`, `model: ${state.model}`, 'Use /help to discover commands.'], 'success');
    return;
  }

  if (metadata) {
    const related = relatedCommands(metadata);
    await appendAnimated([
      metadata.description,
      metadata.example ? `Example: ${metadata.example}` : 'No example available.',
      metadata.aliases?.length ? `Aliases: ${metadata.aliases.join(', ')}` : 'No aliases.',
      related.length ? `Related: ${related.join(', ')}` : 'Related: none surfaced.',
    ], 'info');
    return;
  }

  await appendAnimated(['Command not recognized.', 'Try /help or open the command palette with ⌘K.', 'Tip: press Tab for autocomplete while typing.'], 'error');
}

async function loadCommands() {
  const res = await fetch('./data/commands.json');
  if (!res.ok) throw new Error(`Unable to load commands.json (${res.status})`);
  const payload = await res.json();
  state.commands = payload.commands || [];
  state.lastUpdated = payload.lastUpdated || '—';
  state.currentVersion = payload.currentVersion || '—';
  state.source = payload.sources?.primary || payload.sources?.builtIn || '#';
  ui.lastUpdated.textContent = state.lastUpdated;
  ui.versionBadge.textContent = `v${state.currentVersion}`;
  ui.commandCount.textContent = String(state.commands.length);
  ui.sourceLink.href = state.source;
  ui.sourceLink.textContent = 'Official docs';
  if (state.selectedCommand && typeof state.selectedCommand === 'string') {
    state.selectedCommand = state.commands.find((cmd) => cmd.command === state.selectedCommand) || state.commands[0] || null;
  } else {
    state.selectedCommand = state.commands.find((cmd) => cmd.command === '/help') || state.commands[0] || null;
  }
  renderSelectedCommand();
  renderCommandList();
  renderCommandSuggestion();
}

function bindEvents() {
  ui.runButton.addEventListener('click', () => {
    const value = ui.commandInput.value;
    ui.commandInput.value = '';
    renderCommandSuggestion();
    runCommand(value);
  });

  ui.commandInput.addEventListener('input', () => renderCommandSuggestion());

  ui.commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const accepted = acceptSuggestion();
      if (accepted) event.preventDefault();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = ui.commandInput.value;
      ui.commandInput.value = '';
      renderCommandSuggestion();
      runCommand(value);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!state.history.length) return;
      state.historyIndex = clamp(state.historyIndex - 1, 0, state.history.length - 1);
      ui.commandInput.value = state.history[state.historyIndex] || '';
      renderCommandSuggestion();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!state.history.length) return;
      state.historyIndex = clamp(state.historyIndex + 1, 0, state.history.length);
      ui.commandInput.value = state.history[state.historyIndex] || '';
      if (state.historyIndex === state.history.length) ui.commandInput.value = '';
      renderCommandSuggestion();
    }
  });

  ui.searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderCommandList();
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((node) => node.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderCommandList();
      saveState();
    });
  });

  document.querySelectorAll('[data-quick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ui.commandInput.value = btn.dataset.quick;
      renderCommandSuggestion();
      ui.commandInput.focus();
    });
  });

  document.querySelectorAll('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => applyScenario(btn.dataset.scenario));
  });

  ui.paletteButton.addEventListener('click', openPalette);
  ui.closePaletteButton.addEventListener('click', closePalette);
  ui.onboardingButton?.addEventListener('click', openOnboarding);
  ui.sessionsButton.addEventListener('click', () => openModal('Sessions', sessionsHtml(), 'Session manager'));

  ui.paletteInput.addEventListener('input', (event) => {
    runtime.paletteActiveIndex = 0;
    renderPaletteResults(event.target.value);
  });

  ui.paletteInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      movePaletteSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      movePaletteSelection(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      chooseActivePaletteItem();
    }
  });

  ui.closeModalButton.addEventListener('click', closeModal);
  ui.overlay.addEventListener('click', () => { closeModal(); closePalette(); });
  ui.clearTimelineButton?.addEventListener('click', () => {
    state.toolTimeline = [];
    renderToolTimeline();
    saveState();
  });

  ui.fileTree.addEventListener('click', (event) => {
    const button = event.target.closest('.tree-file');
    if (!button) return;
  });

  ui.workspaceFiles?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-file-open]');
    if (!button) return;
    openFilePreview(button.dataset.fileOpen);
  });

  ui.modalBody.addEventListener('click', (event) => {
    const approvalAction = event.target.closest('[data-approval-choice]');
    if (approvalAction) {
      resolveApproval(approvalAction.dataset.approvalChoice);
      return;
    }

    const editorButton = event.target.closest('[data-editor-action]');
    if (editorButton) {
      editorAction(editorButton.dataset.editorAction, editorButton.dataset.filePath);
      return;
    }

    const onboardingAction = event.target.closest('[data-onboarding-action]');
    if (onboardingAction) {
      const action = onboardingAction.dataset.onboardingAction;
      if (action === 'insert') {
        ui.commandInput.value = onboardingAction.dataset.command || '';
        renderCommandSuggestion();
        closeModal();
        ui.commandInput.focus();
        return;
      }
      if (action === 'sessions') {
        openModal('Sessions', sessionsHtml(), 'Session manager');
        return;
      }
    }
    const button = event.target.closest('[data-session-action]');
    if (!button) return;
    handleSessionAction(button.dataset.sessionAction, button.dataset.sessionName);
  });

  ui.sessionImportInput?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const snapshot = payload.sessionName || payload.name ? payload : payload.session;
      if (!snapshot || (!snapshot.sessionName && !snapshot.name)) throw new Error('Invalid session file');
      const name = snapshot.name || snapshot.sessionName;
      state.savedSessions[name] = snapshot;
      saveState();
      openModal('Sessions', sessionsHtml(), 'Session manager');
      appendLine(`Imported session: ${name}`, 'success');
    } catch (error) {
      appendLine(`Failed to import session: ${error.message}`, 'error');
    }
  });

  document.addEventListener('keydown', (event) => {
    const modifier = event.metaKey || event.ctrlKey;
    if (modifier && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPalette();
      return;
    }
    if (event.key === 'Escape') {
      closePalette();
      closeModal();
    }
  });
}

async function init() {
  applyTheme(state.theme);
  refreshWorkspace();
  renderFileTree();
  renderToolTimeline();
  restoreTerminal();
  bindEvents();

  try {
    await loadCommands();
  } catch (error) {
    appendLine(`Failed to load command catalog: ${error.message}`, 'error');
  }

  autosaveCurrentSession();
  saveState();
  if (shouldShowOnboarding()) openOnboarding();
  ui.commandInput.focus();
}

init();
