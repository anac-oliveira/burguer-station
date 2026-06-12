import axios from "axios";
import type { Lanche } from "../types/Lanche";

const API_BASE = "http://localhost:5103/api"
export const getLanche = async (): Promise<Lanche[]> => {
    try {
          const resposta = await axios.get(`${API_BASE}/produtos`);
          return resposta.data;
    } catch (error) {
      console.error("Erro ao buscar os dados: ", error);
      throw error;
    }
    //try = contém o código que pode gerar um erro.
    //catch = executa um código de tratamento quando o erro ocorre.
}

export const getLancheById = async (id: string): Promise<Lanche> => {
  try {
    const resposta = await axios.get(`${API_BASE}/produtos/${id}`);
    return resposta.data;
  } catch (error) {
    console.error(`Erro ao buscar o lanche com ID ${id}: `, error);
    // Fallback: busca todos os lanches e filtra pelo id
    try {
      const todosLanches = await getLanche();
      const lancheEncontrado = todosLanches.find(l => String(l.id) === String(id));
      if (lancheEncontrado) {
        return lancheEncontrado;
      }
    } catch (fallbackError) {
      console.error("Erro no fallback de buscar todos os lanches", fallbackError);
    }
    throw error;
  }
};


export const deleteLanche = async (idLanche: string): Promise<void> => {
  try {
   axios.delete(`${API_BASE}/Produtos/${idLanche}`);
  } catch (error) {
    console.error("Erro ao deletar o lanche: ", error);
    throw error;
  }
}

export const enviarFotoParaAPI = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
     return res.data.caminhoImagem ?? res.data.CaminhoImagem;
  } catch (error) {
    console.error("Erro no upload da imagem: ", error);
    return undefined;
  }
};

export const postLanche = async (lanche: Lanche): Promise<void> => {
  try {
    await axios.post(`${API_BASE}/produtos`, lanche);
  } catch (error) {
    console.error("Erro ao cadastrar o lanche:", error);
    throw error;
  }
};

export const putLanche = async (lanche: Lanche): Promise<void> => {
  try {
    if (!lanche.id) {
      throw new Error("ID do lanche não informado");
    }
     await axios.put(`${API_BASE}/produtos/${lanche.id}`, lanche);
  } catch (error) {
    console.error("Erro ao atualizar o lanche", error);
    throw error;
  }
}