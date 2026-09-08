// Local research adaptations for upstream commit 7c7a38a (Apache-2.0).
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2];
if (!root) throw new Error('Pass the upstream checkout directory');
function adapt(file, transform) {
  const dest = path.join(root, file);
  const before = fs.readFileSync(dest, 'utf8');
  const after = transform(before);
  if (after !== before) fs.writeFileSync(dest, after);
}
adapt('app/layout.tsx', text => {
  if (text.includes('process.env.LOCAL_RESEARCH')) return text;
  const start = text.indexOf('        <Script');
  const end = text.indexOf('        <QueryProvider>');
  if (start < 0 || end < start) throw new Error('Unexpected upstream layout; no files overwritten');
  return text.slice(0,start) + '        {process.env.LOCAL_RESEARCH !== "1" && <>\n' + text.slice(start,end) + '        </>}\n' + text.slice(end);
});
adapt('instrumentation-client.ts', text => {
  if (text.includes('NEXT_PUBLIC_LOCAL_RESEARCH')) return text;
  if (!text.includes('posthog.init(')) throw new Error('Unexpected instrumentation file');
  return text.replace('posthog.init(', "if (process.env.NEXT_PUBLIC_LOCAL_RESEARCH !== '1') posthog.init(");
});
const healthDir = path.join(root, 'app/api/local-health');
fs.mkdirSync(healthDir, {recursive:true});
fs.writeFileSync(path.join(healthDir, 'route.ts'), `import { NextResponse } from 'next/server';
export function GET() {
  if (process.env.LOCAL_RESEARCH !== '1') return new NextResponse(null, {status:404});
  return NextResponse.json({app:'screenshot-studio', revision:'7c7a38a', mode:'local-research'}, {
    headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'no-store'}
  });
}
`);
if (!fs.existsSync(path.join(root,'.env')) && !fs.existsSync(path.join(root,'.env.local'))) {
  fs.writeFileSync(path.join(root,'.env'), 'DATABASE_URL="postgresql://demo:demo@127.0.0.1:1/screenshot_studio?connect_timeout=1"\n');
}
console.log('Local configuration ready. Editing and export code remain upstream implementations.');
