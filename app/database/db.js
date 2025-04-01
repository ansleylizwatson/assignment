import * as SQLite from 'expo-sqlite';

// Create the database connection
const db = SQLite.openDatabaseSync('db.db');

// Initialize the database tables
export async function initDatabase() {
  // Initialize your database logic here
  console.log('Database initialized');
  try {
    // Create categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT
      );
    `);
    console.log('Categories table created successfully');

    // Create locations table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      );
    `);
    console.log('Locations table created successfully');

    // Create items table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        category_id INTEGER,
        location_id INTEGER,
        description TEXT,
        purchase_date TEXT,
        purchase_price REAL,
        warranty_expiry TEXT,
        serial_number TEXT,
        notes TEXT,
        image_uri TEXT,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        updated_at TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (location_id) REFERENCES locations(id)
      );
    `);
    console.log('Items table created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Recipe CRUD operations
export const insertDefaultData = async () => {
  try {
    // Insert default categories
    await db.execAsync(`
      INSERT OR IGNORE INTO categories (name, icon) VALUES 
      ('Electronics', 'devices'),
      ('Furniture', 'chair'),
      ('Kitchenware', 'kitchen'),
      ('Clothing', 'clothing'),
      ('Tools', 'build'),
      ('Books', 'book'),
      ('Decor', 'palette'),
      ('Other', 'category');
    `);
    console.log('Default categories inserted');

    // Insert default locations
    await db.execAsync(`
      INSERT OR IGNORE INTO locations (name, description) VALUES 
      ('Living Room', 'Main living area'),
      ('Kitchen', 'Cooking and food storage'),
      ('Bedroom', 'Sleeping area'),
      ('Bathroom', 'Personal care'),
      ('Garage', 'Storage and vehicles'),
      ('Basement', 'Additional storage'),
      ('Attic', 'Long-term storage');
    `);
    console.log('Default locations inserted');
  } catch (error) {
    console.error('Error inserting default data:', error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const result = await db.execAsync('SELECT * FROM categories ORDER BY name ASC');
    return result[0].rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getLocations = async () => {
  try {
    const result = await db.execAsync('SELECT * FROM locations ORDER BY name ASC');
    return result[0].rows;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};
