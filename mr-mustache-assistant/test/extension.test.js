const assert = require('assert');

// Mock vscode
const mockVscode = {
  workspace: {
    getConfiguration: (section) => ({
      get: (key) => key === 'mockResponses' ? true : undefined
    })
  },
  window: {
    createOutputChannel: () => ({
      appendLine: () => {},
      show: () => {}
    })
  },
  commands: {
    registerCommand: () => ({})
  }
};

// Mock axios
const mockAxios = {
  post: () => Promise.resolve({ data: { choices: [{ message: { content: 'Mock response' } }] } })
};

// Replace modules
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'vscode') return mockVscode;
  if (id === 'axios') return mockAxios;
  return originalRequire.apply(this, arguments);
};

const { callOpenAI, parseShellCommands } = require('../extension');

async function runTests() {
  console.log('Running tests...');

  // Test mock mode
  try {
    const response = await callOpenAI('test prompt');
    const expected = 'Suggested improvements:\n- Review function X for edge cases.\n- Run tests with `$ npm test`.\n\nSuggested commands:\n`$ npm install`\n`$ npm test`';
    assert.strictEqual(response, expected);
    console.log('✅ Mock mode test passed');
  } catch (e) {
    console.log('❌ Mock mode test failed:', e.message);
  }

  // Test parse shell commands
  try {
    const text = 'Here is a suggestion.\n\n```bash\n$ npm install\n$ npm test\n```\n\nAnother command: $ echo hello';
    const commands = parseShellCommands(text);
    assert.deepStrictEqual(commands, ['npm install', 'npm test', 'echo hello']);
    console.log('✅ Parse commands test passed');
  } catch (e) {
    console.log('❌ Parse commands test failed:', e.message);
  }

  // Test parse without codeblock
  try {
    const text = 'Run $ ls -la and $ pwd';
    const commands = parseShellCommands(text);
    assert.deepStrictEqual(commands, ['ls -la and', 'pwd']);
    console.log('✅ Parse commands without codeblock test passed');
  } catch (e) {
    console.log('❌ Parse commands without codeblock test failed:', e.message);
  }

  console.log('Tests completed.');
}

runTests();