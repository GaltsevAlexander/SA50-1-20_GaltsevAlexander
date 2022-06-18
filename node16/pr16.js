const mysql = require("mysql");

const express = require("express");
const app = express();

app.set("view engine", "hbs");

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "galtsev",
    database: "laba3",
    password: "1234"
});

pool.getConnection(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

const urlencodedParser = express.urlencoded({ extended: false });

app.get("/", function (req, res) {
    pool.query("SELECT student_name.surname, student_name.name, student_name.second_name, student_group.Gruppa, student_speciality.name_spl FROM student_name JOIN student_group ON student_name.stud_group=student_group.id JOIN student_speciality on student_group.special=student_speciality.number;", function (err, data) {
        if (err) return console.log(err);
        res.render("baza.hbs", {
            student_name: data
        });
    });
});

app.get("/create", function (req, res) {
    pool.query("SELECT * FROM student_group", function (err, data) {
        if (err) return console.log(err);
        res.render("create.hbs", {
            student_group: data
        });
    });
});

app.post("/create", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const second_name = req.body.second_name;
    const name = req.body.name;
    const surname = req.body.surname;
    const stud_group = req.body.stud_group;
    const birthday = req.body.birthday;
    pool.query("INSERT INTO student_name (second_name, name, surname, stud_group, birthday ) VALUES (?,?,?,?,?)", [second_name, name, surname, stud_group, birthday], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/groupcreate", function (req, res) {
    pool.query("SELECT * FROM student_speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("groupcreate.hbs", {
            student_speciality: data
        });
    });
});

app.post("/groupcreate", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const Gruppa = req.body.Gruppa;
    const course = req.body.course;
    const special = req.body.special;
    pool.query("INSERT INTO student_group (Gruppa, course, special) VALUES (?,?,?)", [Gruppa, course, special], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/specialitycreate", function (req, res) {
    pool.query("SELECT * FROM student_speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("specialitycreate", {
            student_speciality: data
        });
    });
});

app.post("/specialitycreate", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const name_spl = req.body.name_spl;
    pool.query("INSERT INTO student_speciality (name_spl) VALUES (?)", [name_spl], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});