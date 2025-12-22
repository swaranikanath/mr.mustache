# CI and Packaging

This repository includes a GitHub Actions workflow that builds the VS Code extension VSIX and uploads it as a workflow artifact.

- Workflow: [.github/workflows/build-vsix.yml](.github/workflows/build-vsix.yml)

How to get the VSIX from an action run
1. Open the Actions page for this repository and select a run of the `Build VSIX` workflow.
2. Download the `mr-mustache-vsix` artifact (contains the `.vsix`).
3. Install locally or in Codespaces:

```bash
# download and then
code --install-extension ./mr-mustache-assistant-0.0.1.vsix
```

Automating in Codespaces
- The devcontainer `postCreateCommand` attempts to build the VSIX and install it at create time. See [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json#L1).

Publishing
- To make the extension available across all your Codespaces via `customizations.vscode.extensions`, publish the extension to the Visual Studio Marketplace using `vsce publish` and a publisher.
