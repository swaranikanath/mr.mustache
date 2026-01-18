# Mr Mustache Assistant

Lightweight VS Code extension prototype that sends the current file/selection to the OpenAI API for suggestions and can run suggested shell commands in the integrated terminal.

Prerequisites
- Node.js (v16+ recommended)
- VS Code
- An OpenAI API key set as environment variable `OPENAI_API_KEY` (or configured in workspace setting `mrMustache.openaiKey`)

Configuration
- You can set the OpenAI API key via the workspace/user setting `mrMustache.openaiKey` (recommended for per-workspace usage), or export `OPENAI_API_KEY` in your environment.

Offline / Mock mode
- For development without network access, set the workspace setting `mrMustache.mockResponses` to `true`. The extension will return canned suggestions and example commands instead of calling the OpenAI API.

Quick start
1. From the project folder:

```bash
cd mr-mustache-assistant
npm install
```

2. Start using the extension in development mode:
- Open the folder in VS Code and press F5 to launch an Extension Development Host. Use the command palette and run `Mr Mustache: Suggest Code` or `Mr Mustache: Run Command`.

Packaging and installing
- Install `vsce` (optional) to create a VSIX package:

```bash
npm install -g vsce
vsce package
```

- Install the produced `.vsix` in VS Code (Extensions → ... → Install from VSIX).

Making it available inside GitHub Codespaces for all your repos
1. Build a VSIX as above.
2. Add the VSIX install to your Codespaces dotfiles or `devcontainer.json` postCreate step so Codespaces will install the extension automatically when creating a new codespace. Example `postCreateCommand`:

```json
"postCreateCommand": "code --install-extension /workspaces/mr.mustache/mr-mustache-assistant/mr-mustache-assistant-0.0.1.vsix || true"
```

Notes
- The extension uses the `OPENAI_API_KEY` environment variable. For Codespaces, add that secret to your Codespace or repository secrets and set it in the environment.
- This is a prototype. Do not run suggested commands without review.
