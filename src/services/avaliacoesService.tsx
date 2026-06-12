import axios from "axios";

export interface Avaliacao {
  id?: string;
  lancheId: string;
  nota: number; // 1-5 estrelas
  usuario: string; // "Anônimo" ou nome fornecido
  data: string; // data formatada ou ISO string
  comentario: string;
}

export const getAvaliacoesPorLanche = async (lancheId: string): Promise<Avaliacao[]> => {
  try {
    const resposta = await axios.get(`http://localhost:3000/avaliacoes?lancheId=${lancheId}`);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações da API, tentando localStorage...", error);
    // Fallback para localStorage
    const local = localStorage.getItem(`avaliacoes_${lancheId}`);
    if (local) {
      return JSON.parse(local);
    }
    return [];
  }
};

export const postAvaliacao = async (avaliacao: Avaliacao): Promise<Avaliacao> => {
  try {
    const resposta = await axios.post("http://localhost:3000/avaliacoes", avaliacao);
    // Também salvar localmente como backup
    try {
      const lancheId = avaliacao.lancheId;
      const local = localStorage.getItem(`avaliacoes_${lancheId}`);
      const list: Avaliacao[] = local ? JSON.parse(local) : [];
      list.push(resposta.data);
      localStorage.setItem(`avaliacoes_${lancheId}`, JSON.stringify(list));
    } catch (e) {
      console.warn("Erro ao salvar no localStorage", e);
    }
    return resposta.data;
  } catch (error) {
    console.error("Erro ao enviar avaliação para a API, salvando localmente...", error);
    
    // Se a API falhar, gerar um ID fictício e salvar no localStorage
    const novaAvaliacao = {
      ...avaliacao,
      id: `local_${Date.now()}`
    };
    const lancheId = avaliacao.lancheId;
    const local = localStorage.getItem(`avaliacoes_${lancheId}`);
    const list: Avaliacao[] = local ? JSON.parse(local) : [];
    list.push(novaAvaliacao);
    localStorage.setItem(`avaliacoes_${lancheId}`, JSON.stringify(list));
    return novaAvaliacao;
  }
};