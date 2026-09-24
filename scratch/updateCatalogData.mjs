import fs from 'fs';

let content = fs.readFileSync('client/src/data/catalogData.js', 'utf8');

// Update subcategories with their images
content = content.replace(
  "{ name: 'LED Wall Lamp', slug: 'led-wall-lamp', count: 3 },",
  "{ name: 'LED Wall Lamp', slug: 'led-wall-lamp', count: 3, image: '/categories/led-wall-lamp.jpg' },"
);
content = content.replace(
  "{ name: 'E27 Wall Lamp', slug: 'e27-wall-lamp', count: 3 },",
  "{ name: 'E27 Wall Lamp', slug: 'e27-wall-lamp', count: 3, image: '/categories/e27-wall-lamp.jpg' },"
);
content = content.replace(
  "{ name: 'LED Hanging Lamp', slug: 'led-hanging-lamp', count: 3 },",
  "{ name: 'LED Hanging Lamp', slug: 'led-hanging-lamp', count: 3, image: '/categories/led-hanging-lamp.jpg' },"
);
content = content.replace(
  "{ name: 'E27 Hanging Lamp', slug: 'e27-hanging-lamp', count: 3 },",
  "{ name: 'E27 Hanging Lamp', slug: 'e27-hanging-lamp', count: 3, image: '/categories/e27-hanging-lamp.jpg' },"
);

content = content.replace(
  "{ name: 'LED Chandelier', slug: 'led-chandelier', count: 2 },",
  "{ name: 'LED Chandelier', slug: 'led-chandelier', count: 2, image: '/categories/chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'E14 Chandelier', slug: 'e14-chandelier', count: 2 },",
  "{ name: 'E14 Chandelier', slug: 'e14-chandelier', count: 2, image: '/categories/e14-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Profile Chandelier', slug: 'profile-chandelier', count: 2 },",
  "{ name: 'Profile Chandelier', slug: 'profile-chandelier', count: 2, image: '/categories/profile-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Glass Chandelier', slug: 'glass-chandelier', count: 2 },",
  "{ name: 'Glass Chandelier', slug: 'glass-chandelier', count: 2, image: '/categories/glass-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Italian Chandelier', slug: 'italian-chandelier', count: 2 },",
  "{ name: 'Italian Chandelier', slug: 'italian-chandelier', count: 2, image: '/categories/italian-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Modern Chandelier', slug: 'modern-chandelier', count: 2 },",
  "{ name: 'Modern Chandelier', slug: 'modern-chandelier', count: 2, image: '/categories/modern-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Antic Chandelier', slug: 'antic-chandelier', count: 2 },",
  "{ name: 'Antic Chandelier', slug: 'antic-chandelier', count: 2, image: '/categories/antic-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Fan Chandelier', slug: 'fan-chandelier', count: 2 },",
  "{ name: 'Fan Chandelier', slug: 'fan-chandelier', count: 2, image: '/categories/fan-chandelier.jpg' },"
);
content = content.replace(
  "{ name: 'Celling Chandelier', slug: 'ceiling-chandelier', count: 2 },",
  "{ name: 'Celling Chandelier', slug: 'ceiling-chandelier', count: 2, image: '/categories/ceiling-chandelier.jpg' },"
);

content = content.replace(
  "{ name: 'Crystal Chandelier', slug: 'crystal-chandelier', count: 2 },",
  "{ name: 'Crystal Chandelier', slug: 'crystal-chandelier', count: 2, image: '/categories/double-height.jpg' },"
);
content = content.replace(
  "{ name: 'Modern Chandelier', slug: 'modern-chandelier-dh', count: 2 },",
  "{ name: 'Modern Chandelier', slug: 'modern-chandelier-dh', count: 2, image: '/categories/modern-chandelier-dh.jpg' },"
);

content = content.replace(
  "{ name: 'Gate Lamp', slug: 'gate-lamp', count: 2 },",
  "{ name: 'Gate Lamp', slug: 'gate-lamp', count: 2, image: '/categories/outdoor-light.jpg' },"
);
content = content.replace(
  "{ name: 'Wall Lamp', slug: 'outdoor-wall-lamp', count: 2 },",
  "{ name: 'Wall Lamp', slug: 'outdoor-wall-lamp', count: 2, image: '/hero-outdoor.jpg' },"
);

content = content.replace(
  "{ name: 'Hanging Base', slug: 'hanging-base', count: 2 },",
  "{ name: 'Hanging Base', slug: 'hanging-base', count: 2, image: '/categories/hanging-base.jpg' },"
);
content = content.replace(
  "{ name: 'Spare Driver', slug: 'spare-driver', count: 2 },",
  "{ name: 'Spare Driver', slug: 'spare-driver', count: 2, image: '/categories/spare-driver.jpg' },"
);

// In getFallbackCategoryBySlug
content = content.replace(
  'image: cat.image,',
  'image: sub.image || cat.image,'
);

// Update product images
content = content.replace(
  "{ url: '/banner-empire.jpg', alt: 'LH-CH201 E14 Chandelier', isCover: true }",
  "{ url: '/categories/e14-chandelier.jpg', alt: 'LH-CH201 8-Arm E14 French Candelabra Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/banner-amalfi.jpg', alt: 'LH-CH301 Linear Profile', isCover: true }",
  "{ url: '/categories/profile-chandelier.jpg', alt: 'LH-CH301 Linear Architectural Profile Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/hero-pendant.jpg', alt: 'LH-CH401 Glass Cloud', isCover: true }",
  "{ url: '/categories/glass-chandelier.jpg', alt: 'LH-CH401 Murano Cloud Glass Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/hero-chandelier.jpg', alt: 'LH-CH501 Italian Chandelier', isCover: true }",
  "{ url: '/categories/italian-chandelier.jpg', alt: 'LH-CH501 Venetian Filigree Italian Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/hero-double-height.jpg', alt: 'LH-CH601 Sputnik Modern', isCover: true }",
  "{ url: '/categories/modern-chandelier.jpg', alt: 'LH-CH601 Sputnik Brass Geometric Modern Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/banner-empire.jpg', alt: 'LH-CH701 Antic Chandelier', isCover: true }",
  "{ url: '/categories/antic-chandelier.jpg', alt: 'LH-CH701 Heritage Wrought Iron Antic Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/categories/chandelier.jpg', alt: 'LH-CH901 Ceiling Chandelier', isCover: true }",
  "{ url: '/categories/ceiling-chandelier.jpg', alt: 'LH-CH901 Flush Mount Crystal Ceiling Chandelier', isCover: true }"
);

content = content.replace(
  "{ url: '/hero-double-height.jpg', alt: 'LH-DH201 Modern Double Height', isCover: true }",
  "{ url: '/categories/modern-chandelier-dh.jpg', alt: 'LH-DH201 Modern Staggered Geometric Rings Double Height', isCover: true }"
);

fs.writeFileSync('client/src/data/catalogData.js', content, 'utf8');
console.log('Successfully updated client/src/data/catalogData.js');
