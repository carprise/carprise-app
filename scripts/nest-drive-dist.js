/**
 * Expo exports to dist/ with asset URLs prefixed /drive/*.
 * Nest files under dist/drive/ so Vercel can serve them at that path.
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const nested = path.join(dist, 'drive');

if (!fs.existsSync(dist)) {
  console.error('dist/ missing — run expo export first');
  process.exit(1);
}

fs.mkdirSync(nested, { recursive: true });

for (const item of fs.readdirSync(dist)) {
  if (item === 'drive') continue;
  fs.renameSync(path.join(dist, item), path.join(nested, item));
}

const nestedIndex = path.join(nested, 'index.html');
if (fs.existsSync(nestedIndex)) {
  let html = fs.readFileSync(nestedIndex, 'utf8');
  if (!html.includes('fonts.googleapis.com')) {
    html = html.replace(
      '</head>',
      `  <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  </head>`,
    );
  }
  if (!html.includes('font-family: Inter')) {
    html = html.replace(
      'html,\n      body {\n        height: 100%;\n      }',
      `html,
      body {
        height: 100%;
        background-color: #ece5dc;
        color: #08090b;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      html, body, #root, #root * {
        font-family: Inter, ui-sans-serif, system-ui, sans-serif !important;
      }`,
    );
    if (!html.includes('background-color: #ece5dc')) {
      html = html.replace(
        'html,\n      body {\n        height: 100%;\n      }',
        'html,\n      body {\n        height: 100%;\n        background-color: #ece5dc;\n        color: #08090b;\n      }',
      );
    }
  }
  fs.writeFileSync(nestedIndex, html);
}

fs.writeFileSync(
  path.join(dist, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=/drive" />
    <title>Carprise Driver</title>
    <script>location.replace('/drive');</script>
  </head>
  <body>
    <p><a href="/drive">Open Carprise Driver</a></p>
  </body>
</html>
`
);

console.log('Nested web export under dist/drive/');
