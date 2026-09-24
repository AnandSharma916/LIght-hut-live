import fs from 'fs';

const content = fs.readFileSync('server/scripts/seedData.js', 'utf8');
const pDataStart = content.indexOf('const productsData = [');
const pDataEnd = content.indexOf('const createdProducts = [];', pDataStart);
const pDataStr = content.slice(pDataStart, pDataEnd);

const items = pDataStr.split(/\n\s*\{\s*\n\s*name:/).slice(1);
console.log('Total products in seedData.js:', items.length);
items.forEach((item, idx) => {
  const nameLine = item.split('\n')[0].replace(/['",]/g, '').trim();
  const skuMatch = item.match(/sku:\s*'([^']+)'/);
  const imgMatch = item.match(/url:\s*'([^']+)'/);
  const catMatch = item.match(/category:\s*catMap\['([^']+)'\]/);
  const sku = skuMatch ? skuMatch[1] : 'NO SKU';
  const img = imgMatch ? imgMatch[1] : 'NO IMG';
  const cat = catMatch ? catMatch[1] : 'NO CAT';
  console.log(`${(idx + 1).toString().padStart(2)}. SKU: ${sku.padEnd(10)} | Cat: ${cat.padEnd(20)} | Img: ${img.padEnd(30)} | Name: ${nameLine}`);
});
