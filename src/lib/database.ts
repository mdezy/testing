import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'auth.db');

export const db = new Database(dbPath);

export function initializeDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createUsersTable);
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

  console.log('Database initialized successfully');
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export class UserService {
  static async create(input: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash) 
      VALUES (?, ?)
    `);

    const result = stmt.run(input.email, passwordHash);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
    return user;
  }

  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  static async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    return user;
  }

  static findById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  static async seedDatabase() {
    const testUsers = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'user@example.com', password: 'user123' },
      { email: 'test@example.com', password: 'test123' }
    ];

    for (const testUser of testUsers) {
      const existingUser = this.findByEmail(testUser.email);
      if (!existingUser) {
        await this.create(testUser);
        console.log(`Created test user: ${testUser.email}`);
      }
    }
  }
}

initializeDatabase();
