const routes = {
    contact: "/kontak/about.html"
};

function contact() {
    window.location.href = routes.contact;
}
function getData(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    console.log("Halo nama saya " + name + " dan email saya adalah " + email);

    alert("Data sudah masuk! Cek console (Inspect > Console).");
}

