// src/controllers/authController.js

import dbClient from '../config/db.js';
import bcrypt from 'bcrypt';

const saltRounds = 10; // Jumlah putaran hashing. 10 adalah nilai standar yang baik.

// --- 1. Render Halaman Register (GET) ---
export const renderRegisterPage = (req, res) => {
    // Kirim pesan error jika ada (dari proses POST gagal)
    const error = req.session.error;
    req.session.error = null; // Hapus error setelah ditampilkan
    res.render('register', { error: error });
};

// --- 2. Handle Registrasi (POST) ---
export const handleRegister = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.session.error = 'Password dan konfirmasi password tidak cocok.';
        return res.redirect('/register');
    }

    try {
        // 1. Cek apakah email sudah terdaftar
        const existingUser = await dbClient.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            req.session.error = 'Email sudah terdaftar. Silakan gunakan email lain.';
            return res.redirect('/register');
        }

        // 2. Hash Password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Simpan pengguna baru ke database
        const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
        const result = await dbClient.query(query, [email, hashedPassword]);

        // Opsional: Langsung loginkan pengguna setelah registrasi
        req.session.userId = result.rows[0].id;
        
        // Redirect ke halaman utama setelah sukses
        res.redirect('/home'); 

    } catch (error) {
        console.error('Error during registration:', error.stack);
        req.session.error = 'Registrasi gagal karena kesalahan server.';
        res.redirect('/register');
    }
};

// --- 3. Render Halaman Login (GET) ---
export const renderLoginPage = (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('login', { error: error });
};

// --- 4. Handle Login (POST) ---
export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cari pengguna berdasarkan email
        const result = await dbClient.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            req.session.error = 'Email atau password salah.';
            return res.redirect('/login');
        }

        // 2. Bandingkan password yang dimasukkan dengan hash di database
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Password cocok! Buat sesi
            req.session.userId = user.id; // Simpan ID pengguna ke sesi
            req.session.email = user.email; // Simpan Email pengguna ke sesi
            return res.redirect('/home');
        } else {
            // Password tidak cocok
            req.session.error = 'Email atau password salah.';
            return res.redirect('/login');
        }

    } catch (error) {
        console.error('Error during login:', error.stack);
        req.session.error = 'Login gagal karena kesalahan server.';
        res.redirect('/login');
    }
};

// --- 5. Handle Logout (POST/GET, kita pakai GET saja untuk simplifikasi) ---
export const handleLogout = (req, res) => {
    // Hapus sesi
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out.');
        }
        // Redirect ke halaman login atau home
        res.redirect('/login'); 
    });
};