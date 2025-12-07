// ROUTES
const routes = {
    contact: "/kontak/about.html",
    berita1: "/project/berita1.html"
};

function openProject() {
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


// event submit form
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

    userId++; // next id

    alert("User saved! Check console & localStorage.");

    userForm.reset(); // reset form
});











// const routes = {
//     contact: "/kontak/about.html",
//     berita1: "/project/berita1.html"
// };

// function openProject() {
//     window.location.href = routes.berita1;
// }

// function contact() {
//     window.location.href = routes.contact;
// }


// function getData(e) {
//     e.preventDefault();

//     let name = document.getElementById("name").value;
//     let email = document.getElementById("email").value;

//     console.log("Halo nama saya " + name + " dan email saya adalah " + email);

//     alert("Data sudah masuk! Cek console (Inspect > Console).");
// }

