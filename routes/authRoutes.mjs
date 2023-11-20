import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import express from 'express';
import { PrismaClient } from '@prisma/client';  

const prisma = new PrismaClient();


const authRouter = express.Router();

const tokenExpirySeconds = 10;
const maxAge = tokenExpirySeconds * 1000; // Converta para milissegundos

const secretKey = '<F@bio102030>';


const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };
  
  
  authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          userFuncao: {
            include: {
              funcao: true,
            },
          },
        },
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }
  
      const passwordMatch = await verifyPassword(password, user.password);
  
      if (passwordMatch) {
        const funcao = user.userFuncao[0].funcao.nome; // Assumindo que um usuário tem apenas uma função. Você pode ajustar conforme necessário.
  
        const token = jwt.sign({ username: user.username, role: funcao }, secretKey);
  
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: maxAge,
        });
  
        return res.status(200).json({ message: 'Autenticado com sucesso', token });
      } else {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro de servidor' });
    }
  });

export default authRouter;



