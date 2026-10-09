"""Run with python3 app.py, then open http://localhost:8000."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Haven furniture demo")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    handler = partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).parent / "static"))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Haven is ready: http://localhost:{args.port} (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
