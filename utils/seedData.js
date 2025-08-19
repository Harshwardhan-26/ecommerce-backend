const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features a 6.1-inch Super Retina XDR display with ProMotion technology.",
    price: 134900,
    originalPrice: 139900,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        alt: "iPhone 15 Pro front view"
      },
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        alt: "iPhone 15 Pro back view"
      }
    ],
    stock: 50,
    sku: "IPHONE15PRO-128",
    weight: 0.187,
    dimensions: { length: 14.67, width: 7.08, height: 0.83 },
    tags: ["smartphone", "apple", "5g", "pro"],
    features: [
      "A17 Pro chip",
      "48MP Main camera",
      "6.1-inch Super Retina XDR display",
      "Titanium design",
      "USB-C connector"
    ],
    specifications: new Map([
      ["Display", "6.1-inch Super Retina XDR"],
      ["Chip", "A17 Pro"],
      ["Storage", "128GB"],
      ["Camera", "48MP Main, 12MP Ultra Wide"],
      ["Battery", "Up to 23 hours video playback"]
    ]),
    isFeatured: true,
    discount: 4
  },
  {
    name: "MacBook Air M3",
    description: "Supercharged by the M3 chip, MacBook Air is up to 60% faster than the previous generation. With an all-day battery life and a fanless design.",
    price: 114900,
    originalPrice: 119900,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
        alt: "MacBook Air M3"
      }
    ],
    stock: 30,
    sku: "MBA-M3-256",
    weight: 1.24,
    dimensions: { length: 30.41, width: 21.5, height: 1.13 },
    tags: ["laptop", "apple", "m3", "ultrabook"],
    features: [
      "M3 chip with 8-core CPU",
      "13.6-inch Liquid Retina display",
      "Up to 18 hours battery life",
      "Fanless design",
      "MagSafe 3 charging"
    ],
    isFeatured: true,
    discount: 4
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with exceptional sound quality. Features 30-hour battery life and quick charge capability.",
    price: 29990,
    originalPrice: 34990,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
        alt: "Sony WH-1000XM5 headphones"
      }
    ],
    stock: 75,
    sku: "SONY-WH1000XM5",
    weight: 0.25,
    tags: ["headphones", "noise-canceling", "wireless", "sony"],
    features: [
      "Industry-leading noise canceling",
      "30-hour battery life",
      "Quick Charge (3 min = 3 hours)",
      "Multipoint connection",
      "Touch sensor controls"
    ],
    isFeatured: true,
    discount: 14
  },
  {
    name: "Nike Air Max 270",
    description: "Inspired by two icons of big Air: the Air Max 180 and Air Max 93. Features Nike's biggest heel Air unit yet for incredible comfort.",
    price: 12995,
    originalPrice: 14995,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Nike",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        alt: "Nike Air Max 270"
      }
    ],
    stock: 100,
    sku: "NIKE-AM270-10",
    weight: 0.4,
    tags: ["shoes", "nike", "airmax", "sneakers"],
    features: [
      "Max Air heel unit",
      "Engineered mesh upper",
      "Rubber outsole",
      "Heel pull tab",
      "Comfortable fit"
    ],
    discount: 13
  },
  {
    name: "Samsung 55\" 4K Smart TV",
    description: "Crystal UHD 4K Smart TV with HDR and Tizen OS. Experience brilliant picture quality with vibrant colors and sharp details.",
    price: 54990,
    originalPrice: 64990,
    category: "Electronics",
    subcategory: "Television",
    brand: "Samsung",
    images: [
      {
        url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
        alt: "Samsung 55 inch 4K TV"
      }
    ],
    stock: 25,
    sku: "SAMSUNG-55CU7000",
    weight: 15.4,
    dimensions: { length: 123.1, width: 70.7, height: 7.8 },
    tags: ["tv", "4k", "smart", "samsung"],
    features: [
      "Crystal UHD 4K resolution",
      "HDR support",
      "Tizen Smart TV platform",
      "Multiple connectivity options",
      "Voice control"
    ],
    isFeatured: true,
    discount: 15
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Running shoes with responsive BOOST midsole and Primeknit upper. Designed for comfort and performance in every stride.",
    price: 16999,
    originalPrice: 18999,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Adidas",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
        alt: "Adidas Ultraboost 22"
      }
    ],
    stock: 80,
    sku: "ADIDAS-UB22-9",
    weight: 0.32,
    tags: ["shoes", "adidas", "running", "boost"],
    features: [
      "BOOST midsole",
      "Primeknit upper",
      "Continental rubber outsole",
      "Torsion System",
      "Comfortable fit"
    ],
    discount: 11
  },
  {
    name: "Canon EOS R6 Mark II",
    description: "Full-frame mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system for professional photography.",
    price: 219999,
    originalPrice: 239999,
    category: "Electronics",
    subcategory: "Cameras",
    brand: "Canon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
        alt: "Canon EOS R6 Mark II"
      }
    ],
    stock: 15,
    sku: "CANON-R6M2-BODY",
    weight: 0.588,
    tags: ["camera", "canon", "mirrorless", "professional"],
    features: [
      "24.2MP full-frame sensor",
      "4K video recording",
      "Dual Pixel CMOS AF II",
      "In-body image stabilization",
      "Weather sealing"
    ],
    isFeatured: true,
    discount: 8
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. A fascinating exploration of how psychology affects our financial decisions.",
    price: 399,
    originalPrice: 499,
    category: "Books",
    subcategory: "Finance",
    brand: "Jaico Publishing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        alt: "The Psychology of Money book"
      }
    ],
    stock: 200,
    sku: "BOOK-POM-EN",
    weight: 0.3,
    tags: ["book", "finance", "psychology", "bestseller"],
    features: [
      "Paperback edition",
      "256 pages",
      "English language",
      "International bestseller",
      "Financial wisdom"
    ],
    discount: 20
  }
];

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@ecommerce.com",
  password: "admin123",
  role: "admin"
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    const admin = await User.create({
      ...adminUser,
      password: hashedPassword
    });
    console.log('Created admin user');

    // Create products with admin as creator
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: admin._id
    }));

    await Product.insertMany(productsWithCreator);
    console.log('Created sample products');

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts, adminUser };