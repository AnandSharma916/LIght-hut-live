import fs from 'fs';

let content = fs.readFileSync('server/scripts/seedData.js', 'utf8');

// 1. Categories image mappings
const catImageUpdates = [
  { slug: 'led-wall-lamp', oldImg: '/hero-wall-lamp.jpg', newImg: '/categories/led-wall-lamp.jpg' },
  { slug: 'pendant-lamp', oldImg: '/hero-pendant.jpg', newImg: '/categories/pendant-lamp.jpg' },
  { slug: 'led-hanging-lamp', oldImg: '/hero-pendant.jpg', newImg: '/categories/led-hanging-lamp.jpg' },
  { slug: 'chandelier', oldImg: '/hero-chandelier.jpg', newImg: '/categories/chandelier.jpg' },
  { slug: 'e14-chandelier', oldImg: '/banner-empire.jpg', newImg: '/categories/e14-chandelier.jpg' },
  { slug: 'profile-chandelier', oldImg: '/banner-amalfi.jpg', newImg: '/categories/profile-chandelier.jpg' },
  { slug: 'glass-chandelier', oldImg: '/hero-wall-lamp.jpg', newImg: '/categories/glass-chandelier.jpg' },
  { slug: 'italian-chandelier', oldImg: '/hero-chandelier.jpg', newImg: '/categories/italian-chandelier.jpg' },
  { slug: 'modern-chandelier', oldImg: '/hero-double-height.jpg', newImg: '/categories/modern-chandelier.jpg' },
  { slug: 'antique-chandelier', oldImg: '/categories/outdoor-light.jpg', newImg: '/categories/antic-chandelier.jpg' },
  { slug: 'ceiling-chandelier', oldImg: '/categories/chandelier.jpg', newImg: '/categories/ceiling-chandelier.jpg' },
  { slug: 'double-height', oldImg: '/hero-chandelier.jpg', newImg: '/categories/double-height.jpg' },
  { slug: 'modern-double-height-chandelier', oldImg: '/hero-double-height.jpg', newImg: '/categories/modern-chandelier-dh.jpg' },
  { slug: 'dining-table-lamp', oldImg: '/banner-amalfi.jpg', newImg: '/categories/dining-table-lamp.jpg' },
  { slug: 'outdoor-wall-lamp', oldImg: '/hero-wall-lamp.jpg', newImg: '/hero-outdoor.jpg' },
  { slug: 'table-lamp', oldImg: '/banner-amalfi.jpg', newImg: '/categories/table-lamp.jpg' },
  { slug: 'floor-lamp', oldImg: '/banner-empire.jpg', newImg: '/categories/floor-lamp.jpg' },
];

for (const u of catImageUpdates) {
  // Regex finding slug block and its image
  const reg = new RegExp(`(slug:\\s*'${u.slug}'[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
  content = content.replace(reg, `$1${u.newImg}$3`);
}

// 2. Product image mappings
const prodImageUpdates = [
  { sku: 'LH-CH201', newImg: '/categories/e14-chandelier.jpg' },
  { sku: 'LH-CH301', newImg: '/categories/profile-chandelier.jpg' },
  { sku: 'LH-CH401', newImg: '/categories/glass-chandelier.jpg' },
  { sku: 'LH-CH501', newImg: '/categories/italian-chandelier.jpg' },
  { sku: 'LH-CH601', newImg: '/categories/modern-chandelier.jpg' },
  { sku: 'LH-CH701', newImg: '/categories/antic-chandelier.jpg' },
  { sku: 'LH-CH901', newImg: '/categories/ceiling-chandelier.jpg' },
  { sku: 'LH-DH101', newImg: '/categories/double-height.jpg' },
  { sku: 'LH-DH102', newImg: '/categories/double-height.jpg' },
  { sku: 'LH-DH201', newImg: '/categories/modern-chandelier-dh.jpg' },
  { sku: 'LH-OD102', newImg: '/categories/outdoor-light.jpg' },
  { sku: 'LH-OD201', newImg: '/hero-outdoor.jpg' },
  { sku: 'LH-TL101', newImg: '/categories/table-lamp.jpg' },
  { sku: 'LH-TL102', newImg: '/categories/table-lamp.jpg' },
  { sku: 'LH-FL101', newImg: '/categories/floor-lamp.jpg' },
  { sku: 'LH-FL102', newImg: '/categories/floor-lamp.jpg' },
  { sku: 'LH-FB101', newImg: '/categories/led-filament-bulb.jpg' },
  { sku: 'LH-FB102', newImg: '/categories/led-filament-bulb.jpg' },
  { sku: 'LH-FB103', newImg: '/categories/led-filament-bulb.jpg' },
  { sku: 'LH-SP101', newImg: '/categories/hanging-base.jpg' },
  { sku: 'LH-SP102', newImg: '/categories/hanging-base.jpg' },
  { sku: 'LH-SP201', newImg: '/categories/spare-driver.jpg' },
  { sku: 'LH-SP202', newImg: '/categories/spare-driver.jpg' },
];

for (const p of prodImageUpdates) {
  const reg = new RegExp(`(sku:\\s*'${p.sku}'[\\s\\S]*?images:\\s*\\[\\s*\\{\\s*url:\\s*')([^']+)(')`, 'g');
  content = content.replace(reg, `$1${p.newImg}$3`);
}

fs.writeFileSync('server/scripts/seedData.js', content, 'utf8');
console.log('Successfully updated seedData.js categories and product images!');
