import axios from 'axios';

// Aponta para o seu servidor local (sim, eu sei que fazer isso é ruim, mas é só para funionar local por enquanto mesmo)
const API_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
});
export const api = {
  auth: {
    me: async () => {
      // Pega o primeiro usuário do db.json
      try {
        const response = await apiClient.get('/usuarios/1');
        return response.data;
      } catch (error) {
        console.error("Erro auth:", error);
        return { full_name: "Visitante", tipo_participante: "visitante" };
      }
    }
  },
  entities: {
    // Função auxiliar genérica para listar qualquer coisa
    list: async (entity) => {
      const response = await apiClient.get(`/${entity}`);
      return response.data;
    },
    // Mantendo compatibilidade com o código antigo que chama api.entities.Saber.list()
    Saber: {
      list: async () => {
        const response = await apiClient.get('/saberes');
        return response.data;
      }
    },
    Comunidade: {
      list: async () => {
        const response = await apiClient.get('/comunidades');
        return response.data;
      }
    },
    CartaAberta: {
      list: async () => {
        const response = await apiClient.get('/cartas');
        return response.data;
      }
    }
  }
};