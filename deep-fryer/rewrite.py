# /root/phpscan/mitm-addons/rewrite.py
from mitmproxy import http
import time

# Exact (host, path) -> exact target mapping (host, port, path)
ROUTES = [
    {
        "host":  "store.cockpit.lol",
        "path":  "/modules/servers/licensing/verify.php",
        "target":("b3tx3.co.uk", 443, "/wip/chickenpanel/api.php"),
        "name":  "verify",
    },
    {
        "host":  "store.cockpit.lol",
        "path":  "/modules/servers/licensing/_verify.php",
        "target":("b3tx3.co.uk", 443, "/wip/chickenpanel/alt.php"),
        "name":  "_verify",
    },
    {
        "host":  "raw.githubusercontent.com",
        "path":  "/Cockpit-Panel/cockpit-notifications/main/api.json",
        "target":("b3tx3.co.uk", 443, "/wip/chickenpanel/notes.json"),
        "name":  "notifications",
    },

]

def _find_rule(host: str, path_with_qs: str):
    host = (host or "").lower()
    path = path_with_qs.split("?", 1)[0]  # strip query for matching
    for r in ROUTES:
        if host == r["host"] and path.lower() == r["path"].lower():
            return r, path
    return None, None

def request(flow: http.HTTPFlow) -> None:
    host = (flow.request.host or "").lower()
    raw_path = flow.request.path or ""
    qs = raw_path.split("?", 1)[1] if "?" in raw_path else ""

    rule, _ = _find_rule(host, raw_path)
    if not rule:
        return  # pass-through

    tgt_host, tgt_port, tgt_path = rule["target"]

    # Re-point the request WITHOUT appending any original path.
    flow.request.scheme = "https"
    flow.request.host   = tgt_host
    flow.request.port   = tgt_port
    flow.request.path   = tgt_path + (("?" + qs) if qs else "")

    # Clean headers to match new origin; do NOT append paths anywhere.
    flow.request.headers["Host"]    = tgt_host
    flow.request.headers["Origin"]  = f"https://{tgt_host}"
    flow.request.headers["Referer"] = f"https://{tgt_host}/"
    flow.request.headers.pop("Accept-Encoding", None)   # easier to read response
    flow.request.headers.pop("Content-Length", None)    # let stack recalc

    # Minimal console log so you can see exactly what was built
    ts = time.strftime("%H:%M:%S")
    print(f"[{ts}] ROUTE {rule['name']}: -> https://{tgt_host}{tgt_path}{('?' + qs) if qs else ''}")

def response(flow: http.HTTPFlow) -> None:
    # small status log to confirm the target answered
    ts = time.strftime("%H:%M:%S")
    print(f"[{ts}] RESP {flow.response.status_code} for {flow.request.host}{flow.request.path}")
