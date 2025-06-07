const { faker } = require("@faker-js/faker");

// Check if we have a real MongoDB connection
const hasRealMongoDB =
  process.env.MONGODB_URI &&
  process.env.MONGODB_URI !== "mongodb://localhost:27017/ecommerce-auth";

const categoryIcons = [
  "🛍️",
  "👕",
  "👟",
  "💻",
  "📱",
  "🎮",
  "📚",
  "🏠",
  "🍔",
  "☕",
  "🚗",
  "✈️",
  "🏋️",
  "🎵",
  "🎨",
  "📷",
  "🌱",
  "🐕",
  "💄",
  "⌚",
  "🎯",
  "🏀",
  "⚽",
  "🎸",
  "🎹",
  "🎭",
  "🎪",
  "🎨",
  "🖼️",
  "📖",
  "🔧",
  "🏡",
  "🍳",
  "🧘",
  "💊",
  "🌿",
  "🚴",
  "🏊",
  "🧗",
  "⛷️",
  "🏄",
  "🎣",
  "🏕️",
  "🎲",
  "🧩",
  "🎯",
  "🎪",
  "🎭",
  "🎨",
  "🎵",
];

const categoryTypes = [
  "Fashion & Apparel",
  "Electronics",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Food & Beverages",
  "Automotive",
  "Travel & Tourism",
  "Arts & Crafts",
  "Music & Instruments",
  "Gaming",
  "Photography",
  "Fitness & Wellness",
  "Pet Supplies",
  "Jewelry & Accessories",
  "Tools & Hardware",
  "Baby & Kids",
  "Office Supplies",
  "Toys & Games",
];

async function seedCategories() {
  if (!hasRealMongoDB) {
    console.log("No real MongoDB connection found.");
    console.log("Categories are already seeded in the mock database.");
    console.log("You can start the application with: npm run dev");
    return;
  }

  // Use real MongoDB
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const categories = db.collection("categories");

    // Clear existing categories
    await categories.deleteMany({});
    console.log("Cleared existing categories");

    // Generate 100 categories
    const categoriesToInsert = [];

    for (let i = 0; i < 100; i++) {
      const categoryType = faker.helpers.arrayElement(categoryTypes);
      const icon = faker.helpers.arrayElement(categoryIcons);

      categoriesToInsert.push({
        name: `${categoryType} ${i + 1}`,
        description: faker.commerce.productDescription(),
        icon: icon,
        createdAt: new Date(),
        isActive: true,
      });
    }

    // Insert categories
    const result = await categories.insertMany(categoriesToInsert);
    console.log(`Inserted ${result.insertedCount} categories`);

    // Create indexes
    await categories.createIndex({ name: 1 });
    await categories.createIndex({ isActive: 1 });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedCategories();
