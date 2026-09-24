import fs from 'fs';
import path from 'path';

function findUrls(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findUrls(full));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const txt = fs.readFileSync(full, 'utf8');
      const matches = txt.matchAll(/https:\/\/images\.unsplash\.com\/[^\s'"`\)]+/g);
      for (const m of matches) {
        results.push({ file, url: m[0] });
      }
      const localMatches = txt.matchAll(/(?:\/|\.\/)[a-zA-Z0-9_\-\/]+\.(?:jpg|png|webp|svg)/g);
      for (const m of localMatches) {
        results.push({ file, local: m[0] });
      }
    }
  }
  return results;
}

const items = findUrls('src');
console.log('Total URLs found in src:', items.length);

const uniqueRemote = [...new Set(items.filter(i => i.url).map(i => i.url))];
console.log('Unique remote URLs:', uniqueRemote.length);

async function checkRemote() {
  for (const u of uniqueRemote) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status !== 200) {
        console.log('BAD REMOTE URL:', res.status, u);
      }
    } catch (e) {
      console.log('FAILED REMOTE URL:', e.message, u);
    }
  }
  console.log('Remote URL check finished!');
}

checkRemote();
