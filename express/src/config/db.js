// src/config/db.js

import pg from 'pg';
import dotenv from "dotenv";

// Panggil dotenv.config() di sini untuk memastikan variabel lingkungan (.env) dimuat 
dotenv.config(); 

const { Client } = pg;

// Opsi 1: Menggunakan Client (Koneksi Tunggal)
// Karena Anda tidak memberikan konfigurasi, Client akan menggunakan variabel PGUSER, PGHOST, dll. dari .env
const dbClient = new Client(); 

dbClient.connect()
.then(() => console.log('✅ Berhasil terhubung ke PostgreSQL dari db.js!'))
.catch(e => console.error('❌ Gagal terhubung ke PostgreSQL:', e.stack));

// Export dbClient
export default dbClient;