import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de caminhos para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Permite que o React (porta 5173) acesse este servidor (porta 3000)
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// --- SEU CÓDIGO CUSTOMIZADO (IA, VALIDAÇÕES) ENTRA AQUI ---
server.get('/api/status', (req, res) => {
  res.json({ message: 'Servidor Raízes operando na força ancestral! 🌿' });
});

// Rotas padrão do Banco de Dados
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🌱 Servidor Raízes rodando em: http://localhost:${PORT}`);
});