# NAIOS Cloud companion (no Telegram)

This is an **additive** Cloudflare Worker for the *original* JarvisOS source tree. It does not replace the desktop UI, kernel, Project-JARVIS, Ollama, or the voice runtime.

## Repository

- Upstream: https://github.com/JarvisOSLinux/jarvisos
- NAIOS copy: https://github.com/shopprimeprestige-star/NAIOS-JarvisOS
- All four upstream submodules are preserved.
- License: GNU GPL v3; retain upstream copyright and attribution.

## Hosting

- Supabase project: `ybvnjabscrinbrgjycgu` (`NAIOS-JarvisOS`, `eu-west-1`).
- Cloudflare Worker: `naios-core-status`. GET `/health` for edge health and GET `/status` for a non-privileged reachability check of Supabase Auth.
- No Telegram implementation is included.

Deploy from this directory with a configured Cloudflare account:

```sh
cd cloud
npx wrangler deploy
```

## Full original JarvisOS

Clone all gitlink submodules, not just a source ZIP:

```sh
git clone --recurse-submodules https://github.com/shopprimeprestige-star/NAIOS-JarvisOS.git
cd NAIOS-JarvisOS
git submodule status
```

The actual JARVIS kernel, runtime and desktop are installed/built on a compatible Linux host; consult the original root README. Cloudflare Workers cannot host the custom Linux kernel, Wayland desktop or local hardware control.

## Security boundaries

Do not expose a terminal, Unix socket, or privileged `jarvis` daemon directly on the public internet. A future device bridge needs device identity, signed requests, narrow permissions, revocation, rate limiting, replay protection, audit logging, and explicit local approval for high-risk commands.

Do not commit Supabase secret/service-role keys or Cloudflare secrets. A public Supabase publishable key is suitable only for appropriately RLS-protected browser access.
