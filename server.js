const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(cors());
app.use(express.json());

const banco = new sqlite3.Database("./banco.db", (erro) => {
    if (erro) {
        console.log("Erro ao abrir banco:", erro);
    } else {
        console.log("Banco de dados conectado!");
    }
});

// Criar a tabela
banco.run(`
    CREATE TABLE IF NOT EXISTS aulas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia TEXT NOT NULL,
        horario TEXT NOT NULL,
        componente TEXT NOT NULL
    )
`, (erro) => {
    if (erro) {
        console.log("Erro ao criar tabela:", erro);
    } else {
        console.log("Tabela aulas criada!");
    }
});

// Buscar aulas de um dia
app.get("/horario/:dia", (req, res) => {

    const dia = req.params.dia;

    const sql = `
        SELECT horario, componente
        FROM aulas
        WHERE dia = ?
        ORDER BY id
    `;

    banco.all(sql, [dia], (erro, aulas) => {

        if (erro) {
            console.log("Erro:", erro);

            return res.status(500).json({
                erro: "Erro ao buscar as aulas"
            });
        }

        res.json(aulas);
    });
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});