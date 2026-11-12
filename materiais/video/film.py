import os, subprocess, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
mode = sys.argv[1] if len(sys.argv) > 1 else "preview"

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1080, "height": 1920})
    page.goto("file://" + os.path.join(HERE, "video.html"))
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(300)
    durs = page.evaluate("durations()")
    if mode == "preview":
        for i, d in enumerate(durs):
            page.evaluate("([i,t]) => render(i,t)", [i, d - 0.6])
            page.screenshot(path=os.path.join(HERE, f"prev{i}.jpg"), type="jpeg", quality=80)
        page.evaluate("([i,t]) => render(i,t)", [3, 2.6])
        page.screenshot(path=os.path.join(HERE, "prev7.jpg"), type="jpeg", quality=80)
    else:
        files = []
        for i, d in enumerate(durs):
            if os.environ.get("ONLY") and int(os.environ["ONLY"]) != i:
                files.append(os.path.join(HERE, f"scene{i}.mp4")); continue
            tmp = os.path.join(HERE, f"scene{i}.tmp.mp4")
            out = os.path.join(HERE, f"scene{i}.mp4")
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                                   "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
            for f in range(round(d * FPS)):
                page.evaluate("([i,t]) => render(i,t)", [i, f / FPS])
                ff.stdin.write(page.screenshot(type="jpeg", quality=92))
            ff.stdin.close()
            if ff.wait() != 0:
                sys.exit(f"ffmpeg failed on scene {i}")
            os.replace(tmp, out)
            files.append(out)
            print("scene", i, "ok", flush=True)
        with open(os.path.join(HERE, "list.txt"), "w") as fh:
            for f in files:
                fh.write(f"file '{f}'\n")
    b.close()
