"""Receive this experiment's generated files from its explicit local export UI."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import json
import re

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parents[3] / 'web/008-splat-js/video-assets'
ORIGIN = 'http://localhost:8018'

class Handler(BaseHTTPRequestHandler):
    def response(self, status, message):
        self.send_response(status)
        self.send_header('Access-Control-Allow-Origin', ORIGIN)
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Splat-Experiment')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'message': message}).encode())

    def do_OPTIONS(self):
        self.response(204, '')

    def do_POST(self):
        if self.headers.get('Origin') != ORIGIN or self.headers.get('X-Splat-Experiment') != 'nickesc-shoe-video':
            self.response(403, 'This receiver only accepts the local experiment page.')
            return
        name = self.path.removeprefix('/export/')
        allowed = name in ('model.sog', 'recon.json', 'original-recon.json', 'run-record.json', 'result-thumb.webp', 'result-cover.webp') or re.fullmatch(r'frames/frame_\d{5}\.jpg', name)
        size = int(self.headers.get('Content-Length', '0'))
        if not self.path.startswith('/export/') or not allowed or not 0 < size <= 30_000_000:
            self.response(400, 'Unexpected experiment artifact.')
            return
        data = self.rfile.read(size)
        if len(data) != size:
            self.response(400, 'Incomplete artifact.')
            return
        base = HERE if name in ('original-recon.json', 'run-record.json') else ASSETS
        target = base / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        self.response(200, name)

    def log_message(self, *args):
        pass

if __name__ == '__main__':
    HTTPServer.allow_reuse_address = False
    server = HTTPServer(('127.0.0.1', 8028), Handler)
    print('Local experiment receiver ready on 127.0.0.1:8028', flush=True)
    server.serve_forever()
