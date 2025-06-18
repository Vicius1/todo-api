require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API To-do rodando!' });
});

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});