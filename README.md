# mr.mustache

<div align="center">
  <p style="font-size: 4em; color: #00ff00; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00;">🐱</p>
  <h2 style="color: #00ff00; text-shadow: 0 0 10px #00ff00;">Neon Cat Face Logo</h2>
</div>

This repository contains a prototype VS Code extension, **Mr Mustache Assistant**, that sends code context to the OpenAI API, returns suggestions, and can run suggested shell commands in the integrated terminal.

Quick links
- Extension code: [mr-mustache-assistant/extension.js](mr-mustache-assistant/extension.js)
- Extension manifest: [mr-mustache-assistant/package.json](mr-mustache-assistant/package.json)
- Devcontainer: [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json)
- CI workflow (build VSIX): [.github/workflows/build-vsix.yml](.github/workflows/build-vsix.yml)
- Publish workflow (manual dispatch): [.github/workflows/publish-vsix.yml](.github/workflows/publish-vsix.yml)

Getting started

1. Local development

```bash
cd mr-mustache-assistant
npm install
code . # open in VS Code and press F5 to launch Extension Development Host
```

2. Package VSIX locally (helper)

```bash
cd mr-mustache-assistant
./package-and-install.sh
# If a VSIX was created it will be moved to the repository root
code --install-extension ../mr-mustache-assistant-0.0.1.vsix || true
```

3. Build in CI

Push to `main` to run the `Build VSIX` workflow which will produce a `mr-mustache-vsix` artifact. Download and install the produced `.vsix`.

Build VSIX in CI

- The repository contains a GitHub Actions workflow that packages the extension and uploads a VSIX artifact: `.github/workflows/build-vsix.yml` (runs on pushes to `main` and manual dispatch).
- To download the produced VSIX: open the run for the workflow in Actions, select the successful run, and download the `mr-mustache-vsix` artifact. Install the VSIX locally via VS Code → Install from VSIX.

4. Publish to Marketplace (optional)

- Create a publisher and generate a Personal Access Token (PAT) for vsce (named `VSCE_TOKEN`).
- In the repository Settings → Secrets, add `VSCE_TOKEN`.
- From Actions → `Publish VSIX` workflow select **Run workflow** to manually build and publish.

Codespaces

- The repository includes a devcontainer which attempts to build the VSIX and install it at codespace creation time. You can also download the VSIX from the `Build VSIX` workflow artifacts and install it manually.

Security

- This prototype runs shell commands in your integrated terminal only when you confirm; always review suggestions before running.

If you'd like, I can now:
- Package a `.vsix` here and add it to the repository root, or
- Attempt to run the `package-and-install.sh` script in this workspace now and report back.
