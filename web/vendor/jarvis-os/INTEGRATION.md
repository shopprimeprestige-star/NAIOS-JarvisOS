# ZARK OS — J.A.R.V.I.S OS upstream design integration

Upstream: https://github.com/porokka/jarvis-os
Author: Sami Porokka / Poro-IT OÜ
License: MIT (see ./LICENSE)

Original sources imported from upstream:
- globals.css — original HUD design tokens, grid, scanlines and panel styling
- jarvis-scene.tsx — React Three Fiber scene
- lattice-face.tsx — original holographic face
- ambient.tsx — original background scene and effects
- hud-panel.tsx — original HUD panel component

These are *unmodified source copies*, not yet compiled or deployed.
The current ZARK OS 2.0 production dashboard remains independent vanilla JS/Three.js.
Next integration step: create a dedicated Next.js app using the upstream React components, change branding to ZARK OS / FILIPPOLABS, connect existing authenticated /api/health and /api/chat endpoints, run a production build and test, then deploy to a Cloudflare-compatible runtime.

Do not install or execute upstream shell scripts or background services on the VPS: the user has an existing remote desktop and Ollama installation. Do not expose local Ollama or shell-execution tools to the internet. AI gateway requires authentication and rate limiting before any paid API integration.
