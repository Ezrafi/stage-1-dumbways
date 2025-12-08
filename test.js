// ROUTES
const routes = {
    contact: "/kontak/contact.html",
    berita1: "/project/berita1.html"
};

function openBerita1() {
    window.location.href = routes.berita1;
}

function contact() {
    window.location.href = routes.contact;
}



// ---------------- USER FORM LOGIC ----------------

// ambil referensi form dan list
const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");

// baca data lama dari localStorage (kalau ada)
let users = JSON.parse(localStorage.getItem("users")) || [];

// tentukan ID user (kalau users kosong → mulai dari 1)
let userId = users.length + 1;


// function menyimpan ke localStorage
function submitUser() {
    localStorage.setItem("users", JSON.stringify(users));
}

// =====================
//  RENDER USERS (MAP)
// =====================
function renderUsers(filtered = users) {
    userList.innerHTML = filtered
        .map(user => {
            return `
                <li><strong>${user.name}</strong> — ${user.email}</li>
            `;
        })
        .join("");
}



// =====================================================
// 🔥🔥🔥  NEW FEATURE #1 — FILTER USER
// =====================================================
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const text = this.value.toLowerCase();

        const filteredUsers = users.filter(u =>
            u.name.toLowerCase().includes(text)
        );

        console.log("FILTER RESULT:", filteredUsers);

        renderUsers(filteredUsers);
    });
}



// =====================================================
// 🔥🔥🔥  NEW FEATURE #2 — SORTING (ASC & DESC)
// =====================================================

function sortAsc() {
    users.sort((a, b) => a.name.localeCompare(b.name));
    console.log("SORT A→Z:", users);
    submitUser();
    renderUsers();
}

function sortDesc() {
    users.sort((a, b) => b.name.localeCompare(a.name));
    console.log("SORT Z→A:", users);
    submitUser();
    renderUsers();
}



// =====================================================
// 🔥🔥🔥  NEW FEATURE #3 — FIND USER
// =====================================================
function findUserByEmail(email) {
    const result = users.find(u => u.email === email);
    console.log("HASIL FIND:", result);
    return result;
}



// =====================================================
// 🔥🔥🔥  NEW FEATURE #4 — FOREACH Logging
// =====================================================
function logAllUsers() {
    users.forEach(u => console.log("LOG USER:", u.name));
}



// =====================
// EVENT SUBMIT FORM
// =====================
userForm.addEventListener("submit", function (event) {
    event.preventDefault(); // cegah reload

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // 🔥 tambahan console log yang kamu minta:
    console.log("Halo nama saya " + name + " dan email saya adalah " + email);

    // buat object user
    const user = {
        id: userId,
        name: name,
        email: email
    };

    // masukkan user baru ke array
    users.push(user);

    console.log("NEW USER:", user);
    console.log("ALL USERS:", users);

    // simpan ke localStorage
    submitUser();

    // render ulang
    renderUsers();

    userId++; // next id

    alert("User saved! Check console & localStorage.");

    userForm.reset(); // reset form
});

// =====================
// TAMPILKAN LIST USER SAAT HALAMAN DIBUKA
// =====================
renderUsers();

//untuk file about.html //

// selanjutnya untuk berita1.html //

// =========================
// ADD PROJECT FEATURE
// =========================

const projectForm = document.getElementById("project-form");
const grid = document.getElementById("project-grid");

if (projectForm) {
    projectForm.addEventListener("submit", addProject);
}

function addProject(event) {
    event.preventDefault();

    const title = document.getElementById("input-title").value;
    const start = document.getElementById("input-start").value;
    const end = document.getElementById("input-end").value;
    const desc = document.getElementById("input-desc").value;

    // tech list
    const techNodes = document.querySelectorAll("#input-tech input:checked");
    const techList = [...techNodes].map(t => t.value);

    // image
    const imageInput = document.getElementById("input-image");
    const imageFile = imageInput.files[0];

    let imageURL = "/gambar/default.png";

    if (imageFile) {
        imageURL = URL.createObjectURL(imageFile);
    }

    // create card
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${imageURL}" class="card-img">

        <div class="card-body">
            <h3>${title}</h3>
            <p class="duration">durasi: ${start} – ${end}</p>
            <p class="desc">${desc}</p>

            <div class="icons">
                ${techList.includes("node") ? `<i class='fa-brands fa-node'></i>` : ""}
                ${techList.includes("next") ? `<i class='fa-solid fa-n'></i>` : ""}
                ${techList.includes("react") ? `<i class='fa-brands fa-react'></i>` : ""}
                ${techList.includes("ts") ? `<i class='fa-solid fa-code'></i>` : ""}
            </div>

            <div class="card-buttons">
                <button class="edit">edit</button>
                <button class="delete">delete</button>
            </div>
        </div>
    `;

    grid.appendChild(card);

    alert("Project added!");

    projectForm.reset();
}

