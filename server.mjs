import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRouter from './routes/authRoutes.mjs'
import userRouter from './routes/userRoutes.mjs';

const server = express();
const port = 7000;

server.use(express.json());
server.use(cookieParser());

// Configurando o middleware de análise de corpo para JSON
server.use(bodyParser.json());

import cors from 'cors';



server.use(cors());



server.use('/auth', authRouter);
server.use('/users', userRouter);





server.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});