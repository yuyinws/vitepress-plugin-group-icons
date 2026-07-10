# Agent Skills

VitePress Plugin Group Icons provides an official [Agent Skill](https://agentskills.io/) for AI coding agents. It helps agents understand how to install the package, configure both plugin integrations, import the generated styles, and enable optional features without replacing your existing VitePress configuration.

## Installation

Install the skill in your AI coding agent:

```sh
npx skills add yuyinws/vitepress-plugin-group-icons
```

The source code of the skill is available [on GitHub](https://github.com/yuyinws/vitepress-plugin-group-icons/tree/main/skills/vitepress-plugin-group-icons).

## Example Prompts

Once installed, you can ask your agent to help with common integration tasks:

```text
Integrate vitepress-plugin-group-icons into this VitePress site
```

```text
Enable title bars for titled code blocks and imported snippets
```

```text
Add a custom icon for MDX code blocks with light and dark variants
```

```text
Troubleshoot why virtual:group-icons.css cannot be resolved
```

## What's Included

The skill guides agents through:

- Detecting the active VitePress config, theme entry, workspace, and package manager
- Installing `vitepress-plugin-group-icons` in the correct package
- Registering `groupIconMdPlugin` and `groupIconVitePlugin` without overwriting existing configuration
- Importing `virtual:group-icons.css` from the active theme
- Configuring title bars, custom Iconify icons, local SVG files, and remote SVG URLs
- Verifying the integration with the project's existing checks or VitePress build
