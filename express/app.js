// app.js

import express from "express";
import dotenv from "dotenv";
// import dbClient from './src/config/db.js'; 
import multer from 'multer';
import exphbs from 'express-handlebars';
import session from 'express-session'; // <-- IMPORT SESSION
// import cookieParser from 'cookie-parser';

// Import controller
import { 
    renderHome, 
    renderAddProjectPage, 
    handleCreateProject,
    renderProjectDetail,
    handleDeleteProject,
    renderEditPage,        // <-- PASTIKAN ADA
    handleUpdateProject
} from './src/controllers/projectcontroller.js'; 

import { 
    renderRegisterPage,   // <-- IMPORT FUNGSI AUTENTIKASI
    handleRegister, 
    renderLoginPage, 
    handleLogin, 
    handleLogout 
} from './src/controllers/authController.js'; // <-- PATH BARU


const app = express();
const PORT = process.env.PORT || 3000; 
dotenv.config();

// 1. Middleware Session
app.use(session({
    // AMBIL DARI ENVIRONMENT VARIABLE
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Set ke true jika menggunakan HTTPS
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// 2. Middleware untuk menyediakan status login ke semua views
app.use((req, res, next) => {
    // Menambahkan variabel global ke Handlebars. Setiap view sekarang punya akses ke isAuthenticated dan userEmail
    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.userEmail = req.session.email || null; 
    next();
});


// --- 2. Konfigurasi Multer (Sebelum app.listen) ---

// a. Konfigurasi disk storage: Tempat dan nama file disimpan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Simpan file di folder 'uploads' (PASTIKAN FOLDER INI ADA di root project)
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Nama file unik: fieldname-timestamp-originalfilename.ext
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

// b. Inisialisasi Multer (Variabel 'upload' yang Anda butuhkan)
const upload = multer({ storage: storage }); // <-- 3. Variabel 'upload' didefinisikan di sini!

// --- 1. Konfigurasi Handlebars Engine ---
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: false, // Karena Anda tidak menggunakan layout
    // Daftarkan Helper di sini
    helpers: {
        // Helper untuk mengecek apakah suatu nilai ada dalam array
        isIncluded: function (array, value) {
            // Cek jika array ada dan apakah array tersebut menyertakan nilai (value)
            if (Array.isArray(array)) {
                return array.includes(value);
            }
            return false;
        }
    }
});

// --- Setup View Engine, Middleware Statis, dll. ---
app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.set("views", "src/views");

// Middleware untuk melayani file statis
app.use(express.static("src/assets"));
app.use(express.static("gambar"));

// 4. Middleware untuk melayani file dari folder 'uploads' secara publik
app.use('/uploads', express.static('uploads'));


// Middleware Request Body (NON-FILE)
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

const requireLogin = (req, res, next) => {
    // Cek apakah user ID ada di sesi
    if (!req.session.userId) {
        // Jika TIDAK login, redirect ke halaman login
        // Opsional: Beri pesan error
        req.session.error = 'Anda harus login untuk mengakses halaman ini.';
        return res.redirect('/login'); 
    }
    // Jika SUDAH login, lanjutkan ke controller berikutnya
    next();
};

// 1. ROUTES AUTHENTICATION (HARUS BISA DIAKSES PUBLIK)
app.get('/register', renderRegisterPage);
app.post('/register', handleRegister);

app.get('/login', renderLoginPage);
app.post('/login', handleLogin);

app.get('/logout', handleLogout); 


// 2. ROUTES PUBLIK (BOLEH DIAKSES SIAPA SAJA)
// Home/Root sekarang PUBLIK (TANPA requireLogin)
app.get('/', renderHome); 
app.get('/home', renderHome);

// Route Project Detail (READ ONE) juga dibuat PUBLIK, agar yang belum login bisa lihat detail proyek.
app.get('/project/:id', renderProjectDetail); 

// -------------------------------------------------------------
// --- 3. ROUTES YANG MEMBUTUHKAN AUTENTIKASI (Operasi Data Sensitif) ---
// -------------------------------------------------------------

// a. Route Add Project (CREATE) - HARUS LOGIN
app.get('/projectdetail', requireLogin, renderAddProjectPage); 
app.post('/submit-project', upload.single('image'), requireLogin, handleCreateProject); 

// b. Route Delete Project (DELETE) - HARUS LOGIN
app.post('/project/delete/:id', requireLogin, handleDeleteProject);

// c. Route Edit Project (UPDATE) - HARUS LOGIN
app.get('/edit-project/:id', requireLogin, renderEditPage); 
app.post('/update-project/:id', upload.single('image'), requireLogin, handleUpdateProject);

app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
});