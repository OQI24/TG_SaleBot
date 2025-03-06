import 'dotenv/config';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '../../dbServiceAccountKey.json';

// Инициализация Firebase
const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Получаем ссылку на базу данных
const db = getDatabase(app);

export default db;