import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getAvaliacoesPorLanche, postAvaliacao } from "../../services/avaliacoesService";
import type { Avaliacao as IAvaliacao } from "../../services/avaliacoesService";
import type { Lanche } from "../../types/Lanche";
import { getLancheById } from "../../services/lanchesService";


import { formatosService } from "../../services/formatosService";
import lanche_default from "../../assets/Logo Menu.png";
import "./Avaliacao.css";

export default function Avaliacao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lanche, setLanche] = useState<Lanche | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<IAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorLanche, setErrorLanche] = useState("");

  // Form states
  const [nome, setNome] = useState("");
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [formError, setFormError] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) {
      setErrorLanche("ID de produto inválido.");
      setLoading(false);
      return;
    }

    const carregarDados = async () => {
      try {
        const dadosLanche = await getLancheById(id);
        setLanche(dadosLanche);
        
        const dadosAvaliacoes = await getAvaliacoesPorLanche(id);
        setAvaliacoes(dadosAvaliacoes);
      } catch (err) {
        console.error(err);
        setErrorLanche("Não foi possível carregar as informações do produto.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSucesso(false);

    if (!comentario.trim()) {
      setFormError("O comentário não pode ficar vazio.");
      return;
    }

    if (!id) return;

    setEnviando(true);
    try {
      const novaAvaliacao: IAvaliacao = {
        lancheId: id,
        nota,
        usuario: nome.trim() || "Anônimo",
        data: new Date().toLocaleDateString("pt-BR"),
        comentario: comentario.trim()
      };

      const salva = await postAvaliacao(novaAvaliacao);
      
      // Atualizar lista local
      setAvaliacoes((prev) => [salva, ...prev]);
      
      // Feedback visual de sucesso e resetar form
      setSucesso(true);
      setNome("");
      setNota(5);
      setComentario("");
      
      // Auto ocultar mensagem de sucesso após 4 segundos
      setTimeout(() => {
        setSucesso(false);
      }, 4000);
    } catch (err) {
      console.error(err);
      setFormError("Erro ao enviar sua avaliação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Cálculo da nota média e total
  const mediaNotas = avaliacoes.length > 0 
    ? (avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <>
        <Header />
        <main className="avaliacao_container_main d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (errorLanche || !lanche) {
    return (
      <>
        <Header />
        <main className="avaliacao_container_main d-flex flex-column justify-content-center align-items-center min-vh-100 text-center px-3">
          <h3 className="text-danger mb-3">{errorLanche || "Produto não encontrado"}</h3>
          <button className="btn btn-warning px-4 py-2" onClick={() => navigate(-1)}>
            Voltar para o Cardápio
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const lancheImagem = lanche.imagens && lanche.imagens.length > 0
    ? `http://localhost:3000/static/${lanche.imagens[0]}`
    : lanche_default;

  return (
    <>
      <Header />
      <main className="avaliacao_container_main px-3 py-5">
        <div className="avaliacao_wrapper max-width-container">
          
          {/* Botão de Voltar */}
          <button onClick={() => navigate(-1)} className="btn_voltar mb-4 d-inline-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Voltar para o Cardápio
          </button>

          <div className="avaliacao_grid">
            
            {/* Lado Esquerdo - Detalhes do Produto */}
            <div className="card_detalhes_produto shadow-sm">
              <div className="imagem_wrapper">
                <img src={lancheImagem} alt={lanche.nome} className="img-fluid rounded-3" />
              </div>
              <div className="info_wrapper text-center mt-3">
                <h1 className="nome_produto_tit">{lanche.nome}</h1>
                <p className="descricao_produto">
                  {lanche.descricao || "Sem descrição disponível."}
                </p>
                <div className="preco_produto">{formatosService.PrecoBR(lanche.preco)}</div>
                
                {/* Resumo Estatístico das Avaliações */}
                <div className="rating_summary_card mt-4 p-3 rounded-3">
                  <div className="summary_title">Média de Avaliações</div>
                  <div className="summary_stars_row">
                    <span className="summary_rating_num">{mediaNotas}</span>
                    <span className="summary_star_icon">★</span>
                  </div>
                  <div className="summary_total">{avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"}</div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Avaliar e Comentários */}
            <div className="secao_interacao">
              
              {/* Formulário de Avaliação */}
              <div className="card_formulario_avaliacao shadow-sm mb-4">
                <h2 className="titulo_secao">Deixe sua Avaliação</h2>
                
                {sucesso && (
                  <div className="alert alert-success alert_sucesso_animado d-flex align-items-center gap-2 mb-3 show" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <span>Avaliação enviada com sucesso! Obrigado pelo feedback.</span>
                  </div>
                )}

                {formError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  
                  {/* Nome do Usuário */}
                  <div className="form-group">
                    <label htmlFor="nome_usuario" className="form_label">Seu Nome (Opcional)</label>
                    <input
                      id="nome_usuario"
                      type="text"
                      className="form-control form_input"
                      placeholder="Ex: João Silva (ou deixe vazio para Anônimo)"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      maxLength={50}
                    />
                  </div>

                  {/* Classificação por Estrelas */}
                  <div className="form-group">
                    <label className="form_label">Sua Nota</label>
                    <div className="star_selector_container d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((index) => {
                        const active = hoverNota !== null ? index <= hoverNota : index <= nota;
                        return (
                          <button
                            key={index}
                            type="button"
                            className={`star_btn ${active ? "active" : ""}`}
                            onClick={() => setNota(index)}
                            onMouseEnter={() => setHoverNota(index)}
                            onMouseLeave={() => setHoverNota(null)}
                            aria-label={`Avaliar com ${index} estrelas`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Campo de Comentário */}
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="comentario" className="form_label mb-0">Comentário</label>
                      <span className={`char_counter ${comentario.length >= 450 ? "text-danger" : ""}`}>
                        {comentario.length}/500
                      </span>
                    </div>
                    <textarea
                      id="comentario"
                      className={`form-control form_input textarea_comentario ${formError ? "is-invalid" : ""}`}
                      placeholder="Diga-nos o que achou do sabor, dos ingredientes e da entrega..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value.slice(0, 500))}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Botão de Envio */}
                  <button type="submit" className="btn_enviar_avaliacao w-100" disabled={enviando}>
                    {enviando ? "Enviando..." : "Enviar Avaliação"}
                  </button>

                </form>
              </div>

              {/* Seção de Listagem de Comentários */}
              <div className="card_lista_comentarios shadow-sm">
                <h2 className="titulo_secao mb-4">Comentários e Avaliações ({avaliacoes.length})</h2>
                
                {avaliacoes.length === 0 ? (
                  <div className="comentarios_vazio text-center py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-muted mb-2" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    </svg>
                    <p className="vazio_text">Nenhum comentário postado ainda.</p>
                    <p className="vazio_subtext">Seja o primeiro a avaliar este produto!</p>
                  </div>
                ) : (
                  <div className="comentarios_lista_wrapper d-flex flex-column gap-3">
                    {avaliacoes.map((item) => (
                      <div key={item.id} className="comentario_item_card p-3 rounded-3 shadow-sm">
                        
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                          {/* Nome e Avatar */}
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar_circle">
                              {item.usuario.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="comentario_autor">{item.usuario}</div>
                              <div className="comentario_data">{item.data}</div>
                            </div>
                          </div>
                          
                          {/* Estrelas */}
                          <div className="comentario_estrelas d-flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              <span
                                key={starIdx}
                                className={`comentario_star ${starIdx <= item.nota ? "filled" : ""}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Texto do comentário */}
                        <p className="comentario_texto mb-0">{item.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


