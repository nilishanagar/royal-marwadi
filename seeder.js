import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const categories = [
  { 
    name: 'Living Room', 
    description: 'Sofas, coffee tables, TV units, and living room essentials',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Bedroom', 
    description: 'Beds, wardrobes, nightstands, and dressers',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Dining', 
    description: 'Dining tables, chairs, and dining room sets',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Office', 
    description: 'Desks, office chairs, bookshelves, and workstations',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Outdoor', 
    description: 'Garden furniture, patio sets, and outdoor seating',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    name: 'Decor', 
    description: 'Lamps, mirrors, vases, and decorative accents',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
  },
].map(cat => ({ ...cat, slug: slugify(cat.name, { lower: true, strict: true }) }));

const createProducts = (categoryMap) => [
  // Living Room
  {
    name: 'Royal Chesterfield Sofa',
    description: 'Handcrafted Chesterfield sofa in premium Italian leather with deep button tufting. A timeless masterpiece that commands attention in any living room.',
    richDescription: 'Experience unparalleled luxury with our Royal Chesterfield Sofa. Each piece is meticulously handcrafted by skilled artisans using time-honored techniques passed down through generations.',
    price: 185000,
    compareAtPrice: 225000,
    category: categoryMap['Living Room'],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    material: 'Italian Leather',
    dimensions: { length: 220, width: 90, height: 75, unit: 'cm' },
    color: 'Cognac Brown',
    weight: 85,
    featured: true,
    rating: 4.8,
    numReviews: 24,
    tags: ['sofa', 'leather', 'luxury', 'chesterfield'],
  },
  {
    name: 'Maharaja Teak Coffee Table',
    description: 'Solid teak wood coffee table with intricate hand-carved Rajasthani motifs. Finished with natural lacquer for lasting beauty.',
    price: 42000,
    compareAtPrice: 55000,
    category: categoryMap['Living Room'],
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    material: 'Teak Wood',
    dimensions: { length: 120, width: 60, height: 45, unit: 'cm' },
    color: 'Natural Teak',
    weight: 32,
    featured: true,
    rating: 4.6,
    numReviews: 18,
    tags: ['coffee table', 'teak', 'carved', 'rajasthani'],
  },
  {
    name: 'Heritage TV Console',
    description: 'Elegant TV console crafted from sheesham wood with brass inlay work. Features ample storage with concealed cable management.',
    price: 68000,
    compareAtPrice: 82000,
    category: categoryMap['Living Room'],
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 10,
    material: 'Sheesham Wood',
    dimensions: { length: 180, width: 45, height: 55, unit: 'cm' },
    color: 'Dark Walnut',
    weight: 45,
    featured: false,
    rating: 4.5,
    numReviews: 12,
    tags: ['tv console', 'sheesham', 'brass inlay'],
  },
  // Bedroom
  {
    name: 'Imperial Four-Poster Bed',
    description: 'Majestic four-poster king bed in solid rosewood with hand-carved floral pillars. Includes built-in side tables and upholstered headboard.',
    price: 245000,
    compareAtPrice: 310000,
    category: categoryMap['Bedroom'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    material: 'Rosewood',
    dimensions: { length: 210, width: 195, height: 220, unit: 'cm' },
    color: 'Deep Mahogany',
    weight: 150,
    featured: true,
    rating: 4.9,
    numReviews: 31,
    tags: ['bed', 'four-poster', 'king', 'rosewood'],
  },
  {
    name: 'Artisan Wardrobe',
    description: 'Spacious 3-door wardrobe with mirror, adjustable shelves, and soft-close drawers. Handcrafted from premium mango wood.',
    price: 95000,
    compareAtPrice: 120000,
    category: categoryMap['Bedroom'],
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 7,
    material: 'Mango Wood',
    dimensions: { length: 180, width: 60, height: 210, unit: 'cm' },
    color: 'Honey Oak',
    weight: 110,
    featured: false,
    rating: 4.4,
    numReviews: 9,
    tags: ['wardrobe', 'mango wood', 'mirror'],
  },
  {
    name: 'Velvet Upholstered Nightstand',
    description: 'Luxurious nightstand with plush velvet drawer fronts, gold-finished legs, and tempered glass top.',
    price: 18500,
    compareAtPrice: 24000,
    category: categoryMap['Bedroom'],
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    material: 'Engineered Wood & Velvet',
    dimensions: { length: 50, width: 40, height: 55, unit: 'cm' },
    color: 'Emerald Green',
    weight: 15,
    featured: true,
    rating: 4.7,
    numReviews: 15,
    tags: ['nightstand', 'velvet', 'gold'],
  },
  // Dining
  {
    name: 'Rajwada 8-Seater Dining Set',
    description: 'Grand 8-seater dining table with matching chairs. Carved from solid sheesham wood with traditional Marwadi design elements.',
    price: 175000,
    compareAtPrice: 215000,
    category: categoryMap['Dining'],
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    material: 'Sheesham Wood',
    dimensions: { length: 240, width: 110, height: 78, unit: 'cm' },
    color: 'Provincial Teak',
    weight: 120,
    featured: true,
    rating: 4.8,
    numReviews: 22,
    tags: ['dining table', '8-seater', 'sheesham', 'marwadi'],
  },
  {
    name: 'Marble Top Dining Table',
    description: 'Stunning Italian marble top dining table with brushed gold stainless steel base. Seats 6 comfortably.',
    price: 135000,
    compareAtPrice: 165000,
    category: categoryMap['Dining'],
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 6,
    material: 'Italian Marble & Steel',
    dimensions: { length: 180, width: 90, height: 76, unit: 'cm' },
    color: 'Carrara White',
    weight: 95,
    featured: false,
    rating: 4.6,
    numReviews: 14,
    tags: ['dining table', 'marble', 'gold', 'italian'],
  },
  // Office
  {
    name: 'Executive Desk with Leather Top',
    description: 'Premium executive desk with genuine leather writing surface, multiple drawers, and built-in cable management. Perfect for a distinguished home office.',
    price: 88000,
    compareAtPrice: 110000,
    category: categoryMap['Office'],
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9,
    material: 'Teak Wood & Leather',
    dimensions: { length: 160, width: 80, height: 78, unit: 'cm' },
    color: 'Mahogany',
    weight: 65,
    featured: true,
    rating: 4.7,
    numReviews: 19,
    tags: ['desk', 'executive', 'leather', 'office'],
  },
  {
    name: 'Ergonomic Mesh Office Chair',
    description: 'Premium ergonomic office chair with breathable mesh back, adjustable lumbar support, 4D armrests, and synchronized tilt mechanism.',
    price: 32000,
    compareAtPrice: 42000,
    category: categoryMap['Office'],
    images: [
      'https://images.unsplash.com/photo-1580481077197-03683f2e153f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    material: 'Mesh & Aluminum',
    dimensions: { length: 65, width: 65, height: 120, unit: 'cm' },
    color: 'Charcoal Black',
    weight: 18,
    featured: false,
    rating: 4.5,
    numReviews: 28,
    tags: ['office chair', 'ergonomic', 'mesh'],
  },
  // Outdoor
  {
    name: 'Courtyard Rattan Lounge Set',
    description: '5-piece outdoor rattan lounge set with weather-resistant cushions. Includes 2 armchairs, 1 sofa, 1 coffee table, and 1 side table.',
    price: 78000,
    compareAtPrice: 95000,
    category: categoryMap['Outdoor'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 6,
    material: 'PE Rattan & Aluminum',
    dimensions: { length: 200, width: 180, height: 80, unit: 'cm' },
    color: 'Natural Brown',
    weight: 55,
    featured: true,
    rating: 4.4,
    numReviews: 11,
    tags: ['outdoor', 'rattan', 'lounge', 'patio'],
  },
  // Decor
  {
    name: 'Antique Brass Floor Lamp',
    description: 'Handcrafted brass floor lamp with adjustable arm and jute shade. Brings warm, ambient lighting to any room.',
    price: 15500,
    compareAtPrice: 19000,
    category: categoryMap['Decor'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    material: 'Brass & Jute',
    dimensions: { length: 40, width: 40, height: 165, unit: 'cm' },
    color: 'Antique Brass',
    weight: 8,
    featured: false,
    rating: 4.3,
    numReviews: 16,
    tags: ['lamp', 'brass', 'floor lamp', 'decor'],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Royal Marwadi Admin',
      email: 'admin@royalmarwadi.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
    });

    // Create demo customer
    console.log('👤 Creating demo customer...');
    await User.create({
      name: 'Arjun Sharma',
      email: 'arjun@example.com',
      password: 'Customer@123',
      role: 'user',
      phone: '+91 9123456789',
      addresses: [
        {
          fullName: 'Arjun Sharma',
          phone: '+91 9123456789',
          addressLine1: '42, MG Road',
          addressLine2: 'Near City Palace',
          city: 'Jodhpur',
          state: 'Rajasthan',
          pincode: '342001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Create products
    console.log('🪑 Creating products...');
    const products = createProducts(categoryMap).map(p => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true })
    }));
    await Product.insertMany(products);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   📧 Admin: admin@royalmarwadi.com / Admin@123`);
    console.log(`   📧 Customer: arjun@example.com / Customer@123`);
    console.log(`   📂 ${createdCategories.length} categories created`);
    console.log(`   🪑 ${products.length} products created\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
