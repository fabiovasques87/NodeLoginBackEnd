import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const server = express();
const port = 7000;

server.use(express.json());
server.use(cookieParser());


import cors from 'cors';

const tokenExpirySeconds = 10;
const saltRounds = 10; 
const maxAge = tokenExpirySeconds * 1000; // Converta para milissegundos

server.use(cors());

const secretKey = '<F@bio102030>';

const prisma = new PrismaClient();

// Função para verificar a senha
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


server.post('/login', async (req, res) => {
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



server.post('/cadastrar-usuario', async (req, res) => {

  const { username, password, funcaoId } = req.body;

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

    // Associe a função ao usuário
   
    res.status(201).json({user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});




// Rota para fazer login
// server.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Verifique se o usuário existe no banco de dados usando o Prisma
//     const user = await prisma.user.findUnique({
//       where: {
//         username,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({ message: 'Usuário não encontrado' });
//     }

//     // Verifique a senha
//     const passwordMatch = await verifyPassword(password, user.password);

//     if (passwordMatch) {
//       // Crie um token de autenticação
//       const token = jwt.sign({ username: user.username }, secretKey);

//       // Armazene o token em um cookie httpOnly
//       res.cookie('token', token, { 
//         httpOnly: true,
//         maxAge: maxAge,
//       });

//       return res.status(200).json({ message: 'Autenticado com sucesso', token });
//     } else {
//       return res.status(401).json({ message: 'Senha incorreta' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Erro de servidor' });
//   }
// });

// Rota protegida que requer autenticação
// server.get('/dashboard', (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Acesso não autorizado' });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Token inválido' });
//     }

//     return res.status(200).json({ message: 'Página de dashboard', user: decoded });
//   });
// });


const checkPermission = (requiredPermission) => (req, res, next) => {
  // Verifique se o usuário tem a permissão necessária
  if (req.user.funcoes.some((funcao) => funcao.nome === requiredPermission)) {
    next(); // Permissão concedida
  } else {
    res.status(403).json({ message: 'Acesso não autorizado' }); // Permissão negada
  }
};


// Uso:
// server.get('/dashboard', checkPermission('adm'), (req, res) => {
//   // Faça algo apenas se o usuário tiver a permissão de administrador
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Acesso não autorizado' });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Token inválido' });
//     }

//     return res.status(200).json({ message: 'Página de dashboard', user: decoded });
//   });
// });

server.get('/dashboard', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // O token foi verificado com sucesso, e 'decoded' contém as informações do token
    // Você pode verificar as informações específicas, como o campo 'role', para controlar o acesso

    if (decoded.role === 'adm') {
      // O usuário tem a permissão de administrador
      return res.status(200).json({ message: 'Página de admin', user: decoded });
    } else if (decoded.role === 'user') {
      // O usuário tem a permissão de usuário
      return res.status(200).json({ message: 'Página de usuário', user: decoded });
    } else {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
  });
});

server.get('/cadastro', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // O token foi verificado com sucesso, e 'decoded' contém as informações do token
    // Você pode verificar as informações específicas, como o campo 'role', para controlar o acesso

    if (decoded.role === 'adm') {
      // O usuário tem a permissão de administrador
      return res.status(200).json({ message: 'Página de admin', user: decoded });
    } else if (decoded.role === 'user') {
      // O usuário tem a permissão de usuário
      return res.status(200).json({ message: 'Página de usuário', user: decoded });
    } else {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
