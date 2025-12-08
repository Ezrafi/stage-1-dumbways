// function editProject(id) {
//     window.location.href = `/project/berita1.html?id=${id}`;
// }

// // Ambil ID dari URL
// const params = new URLSearchParams(window.location.search);
// const projectId = parseInt(params.get("id"));

// // Ambil data project dari localStorage
// let projects = JSON.parse(localStorage.getItem("projects")) || [];

// // Cari project sesuai ID
// let project = projects.find(p => p.id === projectId);

// if (!project) {
//     alert("Project tidak ditemukan!");
//     window.location.href = "/project/myproject.html";
// }

// // === MASUKKAN DATA KE HALAMAN ===

// // title
// document.querySelector(".title").textContent = project.title;

// // image
// document.querySelector(".main-image").src = project.image;

// // duration (tanggal dan bulan)
// document.querySelector(".info-box:nth-child(1) p:nth-child(2)").innerHTML =
//     `<i class="fa-solid fa-calendar"></i> ${project.start} - ${project.end}`;

// document.querySelector(".info-box:nth-child(1) p:nth-child(3)").innerHTML =
//     `<i class="fa-solid fa-clock"></i> ${project.duration}`;

// // technologies
// const techBox = document.querySelector(".info-box:nth-child(2)");
// techBox.innerHTML = "<h3>Technologies</h3>";
// project.technologies.forEach(t => {
//     techBox.innerHTML += `<p><i class="fa-solid fa-check"></i> ${t}</p>`;
// });

// // description
// document.querySelector(".description p").textContent = project.description;
