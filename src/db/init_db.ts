import 'dotenv/config';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '../../dbServiceAccountKey.json';

const client_id = process.env.FB_CLIENT_ID;
const project_id = process.env.FB_PROJECT_ID;
const private_key_id = process.env.FB_PRIVATE_KEY_ID;
const private_key = process.env.FB_PRIVATE_KEY?.split(String.raw`\n`).join('');
const databaseURL = process.env.FB_DATABASE_URL;
const client_email = process.env.FB_CLIENT_EMAIL;

if (!private_key_id || !private_key || !client_id || !project_id || !client_email) {
  throw new Error(`Отсутствуют необходимые переменные окружения: 
    ${!private_key_id ? 'FIREBASE_PRIVATE_KEY_ID' : ''} 
    ${!private_key ? 'FIREBASE_PRIVATE_KEY' : ''} 
    ${!client_id ? 'FIREBASE_CLIENT_ID' : ''}`);
}

// Инициализация Firebase
const app = initializeApp({
  credential: cert({
    ...serviceAccount, 
    private_key_id, 
    client_id,
    project_id,
    client_email,
    private_key: private_key,
  } as ServiceAccount),
  databaseURL,
});

// Получаем ссылку на базу данных
const db = getDatabase(app);

export default db;