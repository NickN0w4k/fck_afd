#!/usr/bin/env python3
"""Quellen-Archiv für fck_afd (Phase 2).

Archiviert jede Quelle als Volltext-Kopie mit SHA256 + Abrufdatum,
damit jeder Beleg später nachweisbar bleibt. Bewusster Strategiewechsel
gegenüber heavy_block: curl mit Cookie-Jar + Browser-UA als Hauptweg
(behördliche Seiten wie bmi.bund.de blocken trafilatura bzw. setzen
Cookie-Gates), trafilatura nur noch als HTML→Text-Extraktion aus dem
lokal geholten Dokument. PDFs werden geladen und per pdftotext textifiziert.

Usage: /root/heavy_block/.venv/bin/python tools/archive_source.py <url1> [url2 ...]
Output: sources/pages/<datum>_<slug>.md bzw. sources/pdf/<datum>_<slug>.pdf
        (+ Logzeile in sources/sources_log.md)
"""
import subprocess, sys, hashlib, re, datetime
from pathlib import Path
import trafilatura

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "sources" / "pages"
PDFS = ROOT / "sources" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
PDFS.mkdir(parents=True, exist_ok=True)
LOG = ROOT / "sources" / "sources_log.md"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def slugify(s: str) -> str:
    s = re.sub(r"https?://", "", s)
    s = s.split("?")[0].split("#")[0]
    s = re.sub(r"[^A-Za-z0-9._-]+", "_", s)
    return s[:80].strip("_") or "page"


def curl_get(url: str):
    """Holt URL via curl mit Cookie-Jar; liefert bytes oder None."""
    jar = "/tmp/fck_afd_cookies.txt"
    tmp = "/tmp/fck_afd_fetch_body"
    for attempt in range(2):  # 2. Versuch nutzt Cookies aus Versuch 1 (Cookie-Gates)
        r = subprocess.run(
            [
                "curl", "-sL", "--max-time", "60", "--compressed",
                "-A", UA,
                "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "-H", "Accept-Language: de-DE,de;q=0.9,en;q=0.5",
                "-c", jar, "-b", jar,
                "-w", "%{http_code}",
                "-o", tmp,
                url,
            ],
            capture_output=True,
        )
        if r.stdout.decode().strip() == "200":
            return Path(tmp).read_bytes()
    return None


def log(today: str, kind: str, title: str, url: str, where: str) -> None:
    with LOG.open("a") as f:
        f.write(f"{today} · {kind} · {title} · {url} · Archiv: {where} · curl+trafilatura\n")


def archive(url: str) -> None:
    today = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%d")
    slug = slugify(url)
    got = curl_get(url)
    if got is None:
        print(f"FAIL  {url}")
        log(today, "FETCH-FAIL", "?", url, "-")
        return
    body = got
    sha = hashlib.sha256(body).hexdigest()[:16]

    is_pdf = body[:5] == b"%PDF-" or ".pdf" in url.split("?")[0]
    if is_pdf:
        raw = PDFS / f"{today}_{slug}.pdf"
        raw.write_bytes(body)
        txt = subprocess.run(
            ["pdftotext", "-layout", str(raw), "-"], capture_output=True
        ).stdout.decode("utf-8", "replace")
        title = (txt.strip().splitlines() or ["PDF"])[0][:90]
        head = (
            f"# ARCHIV-KOPIE (PDF): {url}\n"
            f"- Geholt: {today} (UTC) · {len(body)} Bytes\n"
            f"- SHA256(pdf): {sha}\n"
            f"- PDF-Rohkopie: {raw.relative_to(ROOT)}\n\n---\n\n"
        )
        fname = f"{today}_{slug}.md"
        (OUT / fname).write_text(head + txt, encoding="utf-8")
        print(f"OK-PDF {url}  ->  {len(txt)} Zeichen  ({fname})")
        log(today, "PDF", title, url, f"sources/pages/{fname} + {raw.name}")
        return

    html = body.decode("utf-8", "replace")
    text = trafilatura.extract(
        html, include_comments=True, include_tables=True,
        include_links=True, with_metadata=True,
    ) or ""
    meta = trafilatura.extract_metadata(html)
    title = (meta.title if meta else "") or "?"
    head = (
        f"# ARCHIV-KOPIE: {url}\n"
        f"- Geholt: {today} (UTC)\n"
        f"- Titel: {title}\n"
        f"- SHA256(html): {sha}\n\n---\n\n"
    )
    fname = f"{today}_{slug}.md"
    (OUT / fname).write_text(head + text, encoding="utf-8")
    print(f"OK    {url}  ->  {len(text)} Zeichen  ({fname})")
    log(today, "WEBSEITE", title, url, f"sources/pages/{fname}")


if __name__ == "__main__":
    for u in sys.argv[1:]:
        archive(u)