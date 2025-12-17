import dbClient from '../config/db.js'; 

// --- Helper Function ---
// Fungsi untuk memproses string technologies menjadi array untuk ditampilkan di HBS
const processProjectForDisplay = (project) => {
    // Memastikan project.technologies adalah string dan ada isinya
    if (project.technologies && typeof project.technologies === 'string') {
        // Konversi string "Node Js, Next Js" menjadi array ['Node Js', 'Next Js']
        project.technologiesArray = project.technologies.split(',').map(tech => tech.trim());
    } else {
        project.technologiesArray = [];
    }
    
    // Optional: Format tanggal untuk tampilan yang lebih baik (jika Anda menggunakan date field di HBS)
    if (project.start_date) {
        project.start_date_formatted = new Date(project.start_date).toISOString().split('T')[0];
    }
    if (project.end_date) {
        project.end_date_formatted = new Date(project.end_date).toISOString().split('T')[0];
    }

    return project;
};


// --- 1. Render Form (ADD PROJECT) ---
// Route: app.get('/projectdetail', renderAddProjectPage);
export const renderAddProjectPage = (req, res) => {
    res.render('projectdetail'); 
};


// --- 2. Fungsi Handle Create (Menangani Submit Form) ---
// Route: app.post('/submit-project', upload.single('image'), handleCreateProject);
export const handleCreateProject = async (req, res) => {
    try {
        const { project_name, start_date, end_date, description } = req.body;
        
        // Ambil array technologies (dari checkbox)
        const technologiesArray = Array.isArray(req.body.technologies) 
            ? req.body.technologies 
            : [req.body.technologies].filter(Boolean); 

        // Konversi ARRAY menjadi STRING untuk kolom VARCHAR
        const technologiesString = technologiesArray.join(', '); 

        // Ambil nama file dari Multer (req.file)
        // Asumsi Multer sudah diaktifkan pada route POST ini di app.js
        const image_filename = req.file ? req.file.filename : null;

        if (!image_filename) {
            console.error('File upload missing');
            return res.status(400).send('Image upload failed.');
        }

        const query = `
            INSERT INTO projects (project_name, start_date, end_date, description, technologies, image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        const values = [project_name, start_date, end_date, description, technologiesString, image]; 

        await dbClient.query(query, values);

        console.log("Project created successfully.");
        res.redirect('/home'); // Redirect ke daftar proyek
    } catch (error) {
        console.error('Error creating project:', error.stack);
        res.status(500).send('Failed to create project.');
    }
};


// --- 3. Render Home (READ ALL) ---
// Route: app.get('/home', renderHome);
export const renderHome = async (req, res) => {
    try {
        // Ambil semua data proyek dari database
        const result = await dbClient.query('SELECT * FROM projects ORDER BY created_at DESC');
        
        // Proses setiap proyek (terutama memecah technologies string)
        const projects = result.rows.map(processProjectForDisplay);

        // Kirim data 'projects' ke home.hbs
        res.render('home', { projects: projects });
    } catch (error) {
        console.error('Error fetching projects:', error.stack);
        // Jika ada error database, kirim array kosong agar halaman tetap loading
        res.render('home', { projects: [] });
    }
};


// --- 4. Render Project Detail (READ ONE) ---
// Route: app.get('/project/:id', renderProjectDetail);
export const renderProjectDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ambil proyek berdasarkan ID
        const result = await dbClient.query('SELECT * FROM projects WHERE id = $1', [id]);
        let project = result.rows[0];

        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Proses technologies dan tanggal untuk ditampilkan
        project = processProjectForDisplay(project);

        // Render view untuk detail proyek (Asumsi Anda membuat file views/detail-view.hbs)
        // Kita tidak bisa menggunakan projectdetail.hbs karena itu form ADD
        res.render('detail', { project: project }); 
    } catch (error) {
        console.error('Error fetching project detail:', error.stack);
        res.status(500).send('Failed to load project detail.');
    }
};


// --- 5. Fungsi Delete (Tambahan untuk CRUD) ---
// Route: app.post('/project/delete/:id', handleDeleteProject);
export const handleDeleteProject = async (req, res) => {
    try {
        const { id } = req.params; 
        
        await dbClient.query('DELETE FROM projects WHERE id = $1', [id]);

        res.redirect('/home'); 
    } catch (error) {
        console.error('Error deleting project:', error.stack);
        res.status(500).send('Failed to delete project.');
    }
};
// --- FUNGSI BARU: 6. Render Halaman Edit (GET) ---
export const renderEditPage = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Ambil data proyek lama dari database berdasarkan ID
        const result = await dbClient.query('SELECT * FROM projects WHERE id = $1', [id]);
        let project = result.rows[0];

        if (!project) {
            return res.status(404).send('Project not found');
        }

        // 2. Lakukan formatting tanggal secara INLINE (Manual) 
        // agar cocok dengan input type="date" (YYYY-MM-DD)
        if (project.start_date) {
            project.start_date_formatted = new Date(project.start_date).toISOString().split('T')[0];
        } else {
            project.start_date_formatted = '';
        }

        if (project.end_date) {
            project.end_date_formatted = new Date(project.end_date).toISOString().split('T')[0];
        } else {
            project.end_date_formatted = '';
        }

        // 3. Tambahkan technologiesArray agar HBS mudah menampilkan checkbox yang tercentang
        project = processProjectForDisplay(project); 

        // 4. Render view edit-project.hbs dan kirim data lama
        res.render('edit-project', { project: project }); 

    } catch (error) {
        console.error('Error rendering edit page:', error.stack);
        res.status(500).send('Failed to load edit page.');
    }
};

// --- FUNGSI BARU: 7. Handle Update Data (POST) ---
export const handleUpdateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_name, start_date, end_date, description } = req.body;
        
        // 1. Ambil data technologies 
        const technologiesArray = Array.isArray(req.body.technologies) 
            ? req.body.technologies 
            : [req.body.technologies].filter(Boolean); 
        const technologiesString = technologiesArray.join(', '); 
        
        // 2. Cek apakah ada file baru diupload (req.file dari Multer)
        let image_filename = req.file ? req.file.filename : null;
        
        let query;
        let values;

        if (image_filename) {
            // Update semua termasuk gambar baru
            query = `UPDATE projects SET project_name=$1, start_date=$2, end_date=$3, description=$4, technologies=$5, image_filename=$6 WHERE id=$7`;
            values = [project_name, start_date, end_date, description, technologiesString, image_filename, id];
        } else {
            // Update data teks saja, gambar lama dipertahankan
            query = `UPDATE projects SET project_name=$1, start_date=$2, end_date=$3, description=$4, technologies=$5 WHERE id=$6`;
            values = [project_name, start_date, end_date, description, technologiesString, id];
        }

        await dbClient.query(query, values);
        
        res.redirect('/home'); 

    } catch (error) {
        console.error('Error updating project:', error.stack);
        res.status(500).send('Failed to update project.');
    }
};

































