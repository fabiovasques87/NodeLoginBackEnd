
import express from 'express';

import bcrypt from 'bcrypt';


import { PrismaClient } from '@prisma/client';  

const prisma = new PrismaClient();


const userRouter = express.Router();

const saltRounds = 10; 


userRouter.post('/cadastro', async (req, res) => {

    const { username, password, funcaoId } = req.body;
    // console.log('registros recebidos do servidor', username, password, funcaoId);
    try {
  
       // Hash da senha
       const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // if (!username || !password || !funcaoId) {
      //   return res.status(400).json({ error: 'Dados incompletos. Certifique-se de fornecer username, password e funcaoId.' });
      // }
  
        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });
  
        if (existingUser) {
          return res.status(400).json({ error: 'Usuário já existe.' });
        }  
  
        
  
      // Crie o usuário
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
  
   //converte o funcaoId
      const funcaoIdNumber = parseInt(funcaoId, 10);
  
      // Associe a função ao usuário
      await prisma.userFuncao.create({
        data: {
          userId: user.id,
          funcaoId:funcaoIdNumber,
        },
      });
     
      res.status(201).json({user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  });
  


  //get users
  userRouter.get('/users', async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      include: {
        userFuncao: {
          include: {
            funcao: true,
          },
        },
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter usuários.' });
  }
});


userRouter.put('/atualizar-usuario/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  // const {userId} = req.body;
  const { funcaoId } = req.body;

  try {
    const updatedUserFuncao = await prisma.userFuncao.updateMany({
      where: {
        userId
      },
      data: {
        funcaoId
      },
    });

    console.log('UsuárioFuncao atualizado:', updatedUserFuncao);
    res.status(200).json(updatedUserFuncao);
    // console.log(userId);
    // console.log(funcaoId);
  } catch (error) {
    console.error('Erro ao atualizar usuárioFuncao', error);
    res.status(500).json({ error: 'Erro ao atualizar usuárioFuncao.' });
  }
});

  

userRouter.put('/atualizar-usuario/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  // const {userId} = req.body;
  const { funcaoId } = req.body;

  try {
    const updatedUserFuncao = await prisma.userFuncao.updateMany({
      where: {
        userId
      },
      data: {
        funcaoId
      },
    });

    console.log('UsuárioFuncao atualizado:', updatedUserFuncao);
    res.status(200).json(updatedUserFuncao);
    // console.log(userId);
    // console.log(funcaoId);
  } catch (error) {
    console.error('Erro ao atualizar usuárioFuncao', error);
    res.status(500).json({ error: 'Erro ao atualizar usuárioFuncao.' });
  }
});




userRouter.delete('/excluir/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    // Encontrar e excluir os registros relacionados na tabela UserFuncao
    await prisma.userFuncao.deleteMany({
      where: { userId },
    });

    // Excluir o usuário pelo ID após ter excluído os registros relacionados
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'Usuário e registros relacionados excluídos com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
});

export default userRouter;



