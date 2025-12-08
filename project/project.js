// document.addEventListener("DOMContentLoaded", function () {

//     const form = document.getElementById("project-form");
//     const grid = document.getElementById("project-grid");

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();
//         addProject();
//     });

//     function addProject() {

//         // ambil input
//         const title = document.getElementById("input-title").value;
//         const start = document.getElementById("input-start").value;
//         const end = document.getElementById("input-end").value;
//         const desc = document.getElementById("input-desc").value;

//         // technologies checkbox
//         const techChecked = [...document.querySelectorAll("#input-tech input:checked")];
//         const techIcons = techChecked.map(t => getTechIcon(t.value)).join("");

//         // gambar
//         const fileInput = document.getElementById("input-image");
//         const file = fileInput.files[0];

//         const reader = new FileReader();
//         reader.onload = function (e) {

//             const imgSrc = file ? e.target.result : "/gambar/default.png";

//             // DURASI AUTO
//             const durasi = getDuration(start, end);

//             // buat card baru
//             const card = document.createElement("div");
//             card.classList.add("card");
//             card.innerHTML = `
//                 <img src="${imgSrc}" class="card-img">

//                 <div class="card-body">
//                     <h3>${title}</h3>
//                     <p class="duration">durasi: ${durasi}</p>
//                     <p class="desc">${desc}</p>

//                     <div class="icons">
//                         ${techIcons}
//                     </div>

//                     <div class="card-buttons">
//                         <button class="edit">edit</button>
//                         <button class="delete">delete</button>
//                     </div>
//                 </div>
//             `;

//             // append ke grid
//             grid.appendChild(card);

//             alert("Project berhasil ditambahkan!");
//             form.reset();
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         } else {
//             reader.onload();
//         }
//     }

//     // fungsi ikon
//     function getTechIcon(tech) {
//         switch (tech) {
//             case "node": return `<i class="fa-brands fa-node-js"></i>`;
//             case "next": return `<i class="fa-solid fa-n"></i>`;
//             case "react": return `<i class="fa-brands fa-react"></i>`;
//             case "ts": return `<i class="fa-solid fa-code"></i>`;
//             default: return "";
//         }
//     }

//     // hitung durasi waktu
//     function getDuration(start, end) {
//         const s = new Date(start);
//         const e = new Date(end);

//         if (!start || !end) return "-";

//         const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
//         return diff + " hari";
//     }
// });

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("project-form");
    const grid = document.getElementById("project-grid");
    const btnSubmit = document.getElementById("btn-submit");
    
    let editMode = false;
    let editCardElement = null;
    let projectCounter = 3; // karena sudah ada 3 card default

    // Setup event listener untuk card yang sudah ada
    setupExistingCards();

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        if (editMode) {
            updateProject();
        } else {
            addProject();
        }
    });

    function setupExistingCards() {
        // Setup delete buttons untuk card yang sudah ada
        for (let i = 1; i <= 3; i++) {
            const deleteBtn = document.getElementById(`btn-delete-${i}`);
            const editBtn = document.getElementById(`btn-edit-${i}`);
            const card = document.getElementById(`project-card-${i}`);
            
            if (deleteBtn) {
                deleteBtn.addEventListener("click", function() {
                    deleteProject(card);
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener("click", function() {
                    editProject(card);
                });
            }
        }
    }

    function addProject() {
        // ambil input
        const title = document.getElementById("input-title").value;
        const start = document.getElementById("input-start").value;
        const end = document.getElementById("input-end").value;
        const desc = document.getElementById("input-desc").value;

        if (!title || !start || !end || !desc) {
            alert("Harap isi semua field!");
            return;
        }

        // technologies checkbox
        const techChecked = [...document.querySelectorAll("#input-tech input:checked")];
        const techIcons = techChecked.map(t => getTechIcon(t.value)).join("");

        // gambar
        const fileInput = document.getElementById("input-image");
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.onload = function (e) {

            const imgSrc = file ? e.target.result : "/gambar/default.png";

            // DURASI AUTO
            const durasi = getDuration(start, end);

            projectCounter++;

            // buat card baru
            const card = document.createElement("div");
            card.classList.add("card");
            card.id = `project-card-${projectCounter}`;
            card.dataset.startDate = start;
            card.dataset.endDate = end;
            card.dataset.techValues = techChecked.map(t => t.value).join(",");
            
            card.innerHTML = `
                <img src="${imgSrc}" class="card-img">

                <div class="card-body">
                    <h3>${title}</h3>
                    <p class="duration">durasi: ${durasi}</p>
                    <p class="desc">${desc}</p>

                    <div class="icons">
                        ${techIcons}
                    </div>

                    <div class="card-buttons">
                        <button class="edit">edit</button>
                        <button class="delete">delete</button>
                    </div>
                </div>
            `;

            // Setup event listeners untuk button baru
            const deleteBtn = card.querySelector(".delete");
            const editBtn = card.querySelector(".edit");
            
            deleteBtn.addEventListener("click", function() {
                deleteProject(card);
            });
            
            editBtn.addEventListener("click", function() {
                editProject(card);
            });

            // append ke grid
            grid.appendChild(card);

            alert("Project berhasil ditambahkan!");
            form.reset();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reader.onload();
        }
    }

    function deleteProject(card) {
        if (confirm("Apakah Anda yakin ingin menghapus project ini?")) {
            card.remove();
            alert("Project berhasil dihapus!");
        }
    }

    function editProject(card) {
        // Scroll ke form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Ambil data dari card
        const title = card.querySelector("h3").textContent;
        const desc = card.querySelector(".desc").textContent.trim();
        const imgSrc = card.querySelector(".card-img").src;
        const startDate = card.dataset.startDate || "";
        const endDate = card.dataset.endDate || "";
        const techValues = card.dataset.techValues ? card.dataset.techValues.split(",") : [];

        // Isi form dengan data card
        document.getElementById("input-title").value = title;
        document.getElementById("input-start").value = startDate;
        document.getElementById("input-end").value = endDate;
        document.getElementById("input-desc").value = desc;

        // Check technologies yang sesuai
        document.querySelectorAll("#input-tech input[type='checkbox']").forEach(checkbox => {
            checkbox.checked = techValues.includes(checkbox.value);
        });

        // Set mode edit
        editMode = true;
        editCardElement = card;
        btnSubmit.textContent = "Update Project";
        btnSubmit.style.backgroundColor = "#f39c12";
        
        alert("Mode Edit: Ubah data dan klik 'Update Project'");
    }

    function updateProject() {
        // ambil input
        const title = document.getElementById("input-title").value;
        const start = document.getElementById("input-start").value;
        const end = document.getElementById("input-end").value;
        const desc = document.getElementById("input-desc").value;

        if (!title || !start || !end || !desc) {
            alert("Harap isi semua field!");
            return;
        }

        // technologies checkbox
        const techChecked = [...document.querySelectorAll("#input-tech input:checked")];
        const techIcons = techChecked.map(t => getTechIcon(t.value)).join("");

        // gambar
        const fileInput = document.getElementById("input-image");
        const file = fileInput.files[0];

        const durasi = getDuration(start, end);

        function performUpdate(imgSrc) {
            // Update data di card
            editCardElement.dataset.startDate = start;
            editCardElement.dataset.endDate = end;
            editCardElement.dataset.techValues = techChecked.map(t => t.value).join(",");
            
            // Update tampilan card
            if (imgSrc) {
                editCardElement.querySelector(".card-img").src = imgSrc;
            }
            editCardElement.querySelector("h3").textContent = title;
            editCardElement.querySelector(".duration").textContent = `durasi: ${durasi}`;
            editCardElement.querySelector(".desc").textContent = desc;
            editCardElement.querySelector(".icons").innerHTML = techIcons;

            // Reset mode
            editMode = false;
            editCardElement = null;
            btnSubmit.textContent = "submit";
            btnSubmit.style.backgroundColor = "";
            
            alert("Project berhasil diupdate!");
            form.reset();
        }

        // Jika ada file baru, baca dulu
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                performUpdate(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Gunakan gambar yang sudah ada
            performUpdate(null);
        }
    }

    // fungsi ikon
    function getTechIcon(tech) {
        switch (tech) {
            case "node": return `<i class="fa-brands fa-node-js"></i>`;
            case "next": return `<i class="fa-solid fa-n"></i>`;
            case "react": return `<i class="fa-brands fa-react"></i>`;
            case "ts": return `<i class="fa-solid fa-code"></i>`;
            default: return "";
        }
    }

    // hitung durasi waktu
    function getDuration(start, end) {
        const s = new Date(start);
        const e = new Date(end);

        if (!start || !end) return "-";

        const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
        
        if (diff < 30) {
            return diff + " hari";
        } else if (diff < 365) {
            const months = Math.floor(diff / 30);
            return months + " bulan";
        } else {
            const years = Math.floor(diff / 365);
            return years + " tahun";
        }
    }
});

// Fungsi global untuk membuka halaman berita (dipanggil dari onclick di HTML)
function openBerita1() {
    window.location.href = "/project/berita1.html";
}

function openProject() {
    window.location.href = "/project/berita1.html";
}