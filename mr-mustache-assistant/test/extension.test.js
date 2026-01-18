const assert = require('assert');
const vscode = require('vscode');
const { activate } = require('../extension');

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Activation test', () => {
        const context = { subscriptions: [] };
        activate(context);
        assert.strictEqual(context.subscriptions.length, 3); // suggest, runCommand, output
    });
});