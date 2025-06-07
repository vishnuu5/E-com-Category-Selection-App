// Mock MongoDB for development without database
const mockDatabase = {
  users: [],
  categories: [],
  otps: [],
};

// Generate some mock categories
function generateMockCategories() {
  const categoryNames = [
    "Shoes",
    "Men T-shirts",
    "Makeup",
    "Jewellery",
    "Women T-shirts",
    "Furniture",
    "Electronics",
    "Books",
    "Sports",
    "Home & Garden",
    "Automotive",
    "Health & Beauty",
    "Toys & Games",
    "Clothing",
    "Accessories",
    "Kitchen",
    "Office Supplies",
    "Pet Supplies",
  ];

  return categoryNames.map((name, index) => ({
    _id: (index + 1).toString(),
    name,
    description: `High quality ${name.toLowerCase()} for all your needs`,
    icon: "🛍️",
    createdAt: new Date(),
    isActive: true,
  }));
}

// Initialize mock data
mockDatabase.categories = generateMockCategories();

export default {
  async connect() {
    return {
      db() {
        return {
          collection(name) {
            return {
              async find(query = {}) {
                return {
                  skip(num) {
                    return this;
                  },
                  limit(num) {
                    return {
                      async toArray() {
                        return mockDatabase[name]?.slice(0, num) || [];
                      },
                    };
                  },
                  async toArray() {
                    return mockDatabase[name] || [];
                  },
                };
              },
              async findOne(query) {
                const collection = mockDatabase[name] || [];
                if (query._id) {
                  return collection.find((item) => item._id === query._id);
                }
                if (query.email) {
                  return collection.find((item) => item.email === query.email);
                }
                return collection[0] || null;
              },
              async insertOne(doc) {
                const collection = mockDatabase[name] || [];
                const newDoc = {
                  ...doc,
                  _id: (collection.length + 1).toString(),
                };
                collection.push(newDoc);
                mockDatabase[name] = collection;
                return { insertedId: newDoc._id };
              },
              async insertMany(docs) {
                const collection = mockDatabase[name] || [];
                const newDocs = docs.map((doc, index) => ({
                  ...doc,
                  _id: (collection.length + index + 1).toString(),
                }));
                collection.push(...newDocs);
                mockDatabase[name] = collection;
                return { insertedCount: newDocs.length };
              },
              async updateOne(query, update) {
                const collection = mockDatabase[name] || [];
                const index = collection.findIndex((item) => {
                  if (query._id) return item._id === query._id;
                  if (query.email) return item.email === query.email;
                  return false;
                });
                if (index !== -1) {
                  if (update.$set) {
                    collection[index] = {
                      ...collection[index],
                      ...update.$set,
                    };
                  }
                  if (update.$unset) {
                    Object.keys(update.$unset).forEach((key) => {
                      delete collection[index][key];
                    });
                  }
                }
                return { modifiedCount: index !== -1 ? 1 : 0 };
              },
              async deleteMany(query) {
                mockDatabase[name] = [];
                return { deletedCount: 0 };
              },
              async countDocuments() {
                return (mockDatabase[name] || []).length;
              },
              async createIndex() {
                return true;
              },
            };
          },
        };
      },
    };
  },
};
