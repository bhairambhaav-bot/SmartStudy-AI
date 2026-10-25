
import http.server
import socketserver
import os

PORT = int(os.environ.get("PORT", 10000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
        )
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as server:
        print(f"SmartStudy AI running on port {PORT}")
        server.serve_forever()
