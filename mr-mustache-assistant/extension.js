const vscode = require('vscode');
const axios = require('axios');

function getOpenAiKey() {
  return process.env.OPENAI_API_KEY || vscode.workspace.getConfiguration('mrMustache').get('openaiKey');
}

async function callOpenAI(prompt) {
  const key = getOpenAiKey();
  if (!key) {
    throw new Error('OPENAI_API_KEY not set. Set the OPENAI_API_KEY env var or configure mrMustache.openaiKey.');
  }

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1200
  }, {
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });

  return resp.data.choices && resp.data.choices[0] && resp.data.choices[0].message && resp.data.choices[0].message.content;
}

function parseShellCommands(text) {
  // simple heuristic: find fenced codeblock with "bash" or lines starting with $ or simple codeblock
  const commands = [];
  const fenceRegex = /```(?:bash|sh)?\n([\s\S]*?)```/g;
  let m;
  while ((m = fenceRegex.exec(text))) {
    const block = m[1].trim();
    block.split('\n').forEach(line => {
      const l = line.trim();
      if (l && !l.startsWith('#')) commands.push(l.replace(/^\$\s?/, ''));
    });
  }

  // lines starting with $ in plain text
  text.split('\n').forEach(line => {
    const t = line.trim();
    if (t.startsWith('$ ')) commands.push(t.replace(/^\$\s?/, ''));
  });

  return Array.from(new Set(commands));
}

function runInTerminal(command, name = 'mr-mustache') {
  const term = vscode.window.activeTerminal || vscode.window.createTerminal(name);
  term.show(true);
  term.sendText(command, true);
}

function activate(context) {
  const output = vscode.window.createOutputChannel('Mr Mustache');

  const suggest = vscode.commands.registerCommand('mr-mustache.suggest', async () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return vscode.window.showInformationMessage('Open a file to get suggestions.');

      const selection = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
      const prompt = `You are a helpful coding assistant. Provide concise code suggestions, improvements, and — if useful — shell commands to run to fix, build, or test the code. Provide shell commands either as lines starting with "$ " or in a fenced codeblock annotated with bash.\n\nContext:\n${selection}`;

      output.appendLine('Requesting suggestion from OpenAI...');
      const response = await callOpenAI(prompt);
      output.appendLine('---- Suggestion ----');
      output.appendLine(response || 'No response');
      output.show(true);

      const commands = parseShellCommands(response || '');
      if (commands.length) {
        const pick = await vscode.window.showQuickPick(['Copy suggestion', 'Run suggested commands', 'Close'], { placeHolder: 'What would you like to do?' });
        if (pick === 'Run suggested commands') {
          for (const cmd of commands) {
            const confirm = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Run: ${cmd} ?` });
            if (confirm === 'Yes') runInTerminal(cmd);
          }
        } else if (pick === 'Copy suggestion') {
          await vscode.env.clipboard.writeText(response || '');
          vscode.window.showInformationMessage('Suggestion copied to clipboard.');
        }
      } else {
        const copy = await vscode.window.showInformationMessage('No shell commands detected. Copy suggestion to clipboard?', 'Yes', 'No');
        if (copy === 'Yes') await vscode.env.clipboard.writeText(response || '');
      }
    } catch (err) {
      vscode.window.showErrorMessage(String(err));
    }
  });

  const runCommand = vscode.commands.registerCommand('mr-mustache.runCommand', async () => {
    const cmd = await vscode.window.showInputBox({ prompt: 'Shell command to run in the integrated terminal' });
    if (!cmd) return;
    const conf = await vscode.window.showQuickPick(['Run once', 'Run with confirmation per line'], { placeHolder: 'Run mode' });
    if (conf === 'Run with confirmation per line') {
      const lines = cmd.split(';').map(l => l.trim()).filter(Boolean);
      for (const l of lines) {
        const ok = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Run: ${l} ?` });
        if (ok === 'Yes') runInTerminal(l);
      }
    } else {
      runInTerminal(cmd);
    }
  });

  context.subscriptions.push(suggest, runCommand, output);
}

function deactivate() {}

module.exports = { activate, deactivate };
