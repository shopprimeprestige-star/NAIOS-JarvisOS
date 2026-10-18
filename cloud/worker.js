// NAIOS edge status service. Independent of the original JARVIS Linux runtime.
// No command execution, shell proxy, public database reads, or Telegram integration.
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "access-control-allow-origin": "*",
};
const respond = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET") return respond({ error: "method_not_allowed" }, 405);
    if (url.pathname === "/health") {
      return respond({ service: "naios-cloud", status: "ok", linux_agent: "not_connected" });
    }
    if (url.pathname === "/status") {
      const project = env.SUPABASE_URL || "https://ybvnjabscrinbrgjycgu.supabase.co";
      let database = "unknown";
      // Query public Auth discovery rather than private tables. No service-role credential is required.
      try {
        const r = await fetch(new URL("/auth/v1/health", project), {
          method: "GET",
          signal: AbortSignal.timeout(3500),
        });
        database = r.ok ? "reachable" : "unavailable";
      } catch {
        database = "unavailable";
      }
      return respond({
        service: "naios-cloud",
        status: "ok",
        supabase_auth: database,
        linux_agent: "not_connected",
        note: "The original JARVIS Linux distribution runs on Linux hardware or a VM, not Cloudflare Workers.",
      });
    }
    return respond({ error: "not_found", available: ["/health", "/status"] }, 404);
  },
};
