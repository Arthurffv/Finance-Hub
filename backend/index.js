require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
res.send('Finance Hub Backend está funcionado! 🚀');
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({
            message: "Conexão com o banco de dados bem-sucedida!",
            hora_do_banco: result.rows[0].now,
        });
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: "Falha na conexão com o banco de dados.",
            detalhes: err.message, 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse em: http://localhost:3000`);
    console.log(`Teste a conexão com o banco de dados em: http://localhost:${PORT}/db-test`);
});