import express from "express";
// import { engine } from 'express-handlebars';

const app = express();
const PORT = 3000;

// PAKAI .hbs
// app.engine('hbs', engine({ extname: '.hbs' }));
app.set("view engine", "hbs");
app.set("views", "src/views");

app.use(express.static("src/assets"));
app.use(express.static("gambar"));


app.get('/', (req, res) => {
    res.render("home");
});
app.get('/projectdetail', (req, res) => {
    res.render("projectdetail");
});

app.get('/detail', (req, res) => { 
    res.render("detail");
});

app.listen(3000);
console.log('Server is running on http://localhost:3000');