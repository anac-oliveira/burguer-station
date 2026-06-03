import './Produtos.css';
//import card_de_frango from '../../assets/card frango 5.png'
//import card_de_frango2 from '../../assets/card frango 2.png'
//import card_de_frango3 from '../../assets/card frango 3.png'
//import transferir from '../../assets/transferir (3) 1.png'
import whatsapp from '../../assets/Ícone Whatsapp Menu.png';
// import logo from '../../assets/inicio.png';
import { useEffect, useState } from 'react';
import type { Lanche } from '../../types/Lanche';
import { getLanche } from '../../services/lanchesService';
import CardProduto from '../../components/CardProduto/CardProduto';
import Carrossel from '../../components/Carrossel/Carrossel';
import Header from '../../components/Header/Header';
import { useLocation, useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import bs404 from '../../assets/Item não encontrado.png'





export default function Produtos() {

    const [lanche, setLanche] = useState<Lanche[]>([]);
    // o state é sempre formado por um par
    const location = useLocation();
    const { categoria } = useParams<{ categoria: string }>();

    const parametrosPesquisados = new URLSearchParams(location.search);
    const termo_pesquisado = parametrosPesquisados.get('query');


    const fetchLanche = async () => {
        try {
            const dados = await getLanche();
            // console.log("Dados retornados da API: ", dados);
            if (categoria) {
                const dados_filtrados = dados.filter(l => l.categorias.some(cat => cat.toLowerCase() === categoria.toLowerCase()));
                setLanche(dados_filtrados);
            }
            else if (termo_pesquisado) {
                const dados_filtrados = dados.filter(l => 
                    l.nome.toLowerCase().includes(termo_pesquisado.toLowerCase()) ||
                    l.descricao.toLowerCase().includes(termo_pesquisado.toLowerCase()) ||
                    l.categorias.some(cat => cat.toLowerCase().includes(termo_pesquisado.toLowerCase()))      
                );
                setLanche(dados_filtrados);
            } else{
                console.warn("Nenhuma categoria ou termo de busca definidos.");
                setLanche([]);
            }
        } catch (error) {
            console.error("Erro ao excutar getLanche: ", error);
        }
    }

    useEffect(() => {
        fetchLanche();
        console.log("Termo pesquisado: ", termo_pesquisado);

    }, [termo_pesquisado])

    return (
        <>
            <Header />
            <Carrossel />
            <main className="iconedefundo_cardapio">


                <h1 className="acessivel">lanches de frango</h1>
                <div className="titulo">
                    <span className='titulo_span'>
                        {
                            categoria
                            ? categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()
                            : termo_pesquisado
                            ? `Resultados para: "${termo_pesquisado}"`
                            : "Nenhum filtro aplicado"
                        }
                    </span>
                    <hr />
                </div>
                {/* <section>
                <div>
                    <img className={logo} src="../Menu/assets/Logo Menu.png" alt="" />
                </div>
            </section>

            <h1>LANCHES DE FRANGO</h1> */}

                <section className="cards">
                    {
                        lanche.map((lanche: Lanche) => {
                            return (
                                <CardProduto
                                    key={lanche.id}
                                    nome={lanche.nome}
                                    descricao={lanche.descricao}
                                    preco={lanche.preco}
                                    imagem={lanche.imagens[0] ?? ""} />
                            );
                        })
                    }
                    {
                        lanche.length == 0 &&
                        <div className='bs404' ><h3>O termo pesquisado<br /> não foi encontrado</h3>
                        <img src={bs404} alt="foto_termo_nao_encontrado" />
                        </div>
                    }




                </section>

                <section>
                    <a className="whatsapp" href="">
                        <img src={whatsapp} alt="" />
                    </a>


                </section>

            </main>
            <Footer />
        </>
    )
}
