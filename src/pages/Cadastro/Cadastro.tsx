import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Header from '../../components/Header/Header';
import { deleteLanche, enviarFotoParaAPI, getLanche, postLanche, putLanche } from '../../services/lanchesService';
import type { Lanche } from '../../types/Lanche';
import './Cadastro.css'
import Footer from '../../components/Footer/Footer';
import { formatosService } from '../../services/formatosService';
import ModalCustomizado from '../../components/ModalCustomizado/ModalCustomizado';
import { NumericFormat } from 'react-number-format';
import Excluir from '../../assets/trash-xmark 1.png';

export default function Cadastro() {

    const [lanches, setLanches] = useState<Lanche[]>([]);
    const [nomeLanche, setNomeLanche] = useState<string>("");
    const [categorias, setCategorias] = useState<string>("");
    const [bgImagemInputColor, setBgImagemInputColor] = useState<string>(" #ffffff");
    const [imagem, setImagem] = useState<File | undefined>();
    const [nomeDaImagem, setNomeDaImagem] = useState<string | undefined>();
    const [idParaEditar, setIdParaEditar] = useState<string>("");
    const [preco, setPreco] = useState<number | undefined>(undefined);
    const [descricao, setDescricao] = useState<string>("");

    const [clicouNaLixeira, setClicouNaLixeira] = useState<boolean>(false);
    const [idParaDeletar, setIdParaDeletar] = useState<string>("");
    const [aposConfirmacaoDeBoloRemovido, setAposConfirmacaoDeLancheRemovido] = useState<boolean>(false);
    const [propsModalDeErroOuSucesso, setPropsModalDeErroOuSucesso] = useState<{ exibir: boolean; titulo: string; corpo: string; }>({ exibir: false, titulo: "", corpo: "" });

    const topoRef = useRef<HTMLDivElement>(null);

    const focarTopo = () => {
        topoRef.current?.scrollIntoView({ behavior: "smooth" });
        topoRef.current?.focus();
    }

    const editarLanche = (lanche: Lanche) => {
        focarTopo();
        setIdParaEditar(lanche.id!);

        setNomeLanche(lanche.nome);
        setDescricao(lanche.descricao ?? "");
        setPreco(lanche.preco);
        setCategorias(lanche.categorias.join(", "));

        setImagem(undefined);
        setNomeDaImagem(lanche.imagens[0]);

        setBgImagemInputColor("#ffffff");
    };

    const cancelarEdicao = () => {
        limparDados();
        setIdParaEditar("");
    }


    const abrirModalParaConfirmarDelete = (id: string) => {
        setClicouNaLixeira(true);
        setIdParaDeletar(id);
    }

    const fecharModalConfirmacaoDelete = () => {
        setClicouNaLixeira(false);
    }

    const exibirModalDeErroOuSucesso = (titulo: string, corpo: string) => (
        setPropsModalDeErroOuSucesso({ exibir: true, titulo, corpo })
    );

    const removerItemAposCOnfirmacao = async (id: string) => {
        try {
            await deleteLanche(id);
            setAposConfirmacaoDeLancheRemovido(true);
            await fetchLanches();
            fecharModalConfirmacaoDelete();
        } catch (error) {
            exibirModalDeErroOuSucesso("Erro", "Erro ao deletar o lanche.");

        }
    }

    const fecharModalDeErroOuSucesso = () => {
        setPropsModalDeErroOuSucesso({ ...propsModalDeErroOuSucesso, exibir: false });
    };

    const carregarImagem = (img: ChangeEvent<HTMLInputElement>) => {
        const file = img.target.files?.[0];
        if (file?.type.includes("image")) {
            setImagem(file);
            setBgImagemInputColor(" #5cb85c")
        }
        else {
            setImagem(undefined);
            setBgImagemInputColor(" #ff2c2c");
        }
    }

    const limparDados = () => {
        setNomeLanche("");
        setCategorias("");
        setImagem(undefined);
        setNomeDaImagem(undefined);
        setPreco(undefined);
        setDescricao("");
        setBgImagemInputColor(" #ffffff");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nomeLanche || !categorias || !preco) {
            exibirModalDeErroOuSucesso("Campos obrigatórios", "Preencha o nome, categoria(s) e preço do lanche");
            return;
        }

        let uploadedFileName = nomeDaImagem;

        if (imagem) {
            uploadedFileName = await enviarFotoParaAPI(imagem);
        }

        const lanche: Lanche = {
            id: idParaEditar,
            nome: nomeLanche,
            descricao: descricao,
            preco,
            categorias: categorias.toLowerCase().split(",").map(c => c.trim()),
            imagens: uploadedFileName ? [uploadedFileName] : []
        };

        try {
            if (idParaEditar) {
                await putLanche(lanche);
                exibirModalDeErroOuSucesso("Sucesso", "Lanche atualizado");
            } else {
                await postLanche(lanche);
                exibirModalDeErroOuSucesso("Sucesso", "Novo lanche cadastrado com sucesso")
            }
            limparDados();
            setIdParaEditar("");
            fetchLanches();
        } catch {
            exibirModalDeErroOuSucesso("Erro", "Erro ao salvar novo lanche.");
        }
    };

    const fetchLanches = async () => {
        try {
            const dados = await getLanche();
            setLanches(dados);
        } catch (error) {
            console.error("Erro ao executar getLanches: ", error);
        }
    };

    useEffect(() => {
        fetchLanches();
    }, [])


    return (
        <>
            <Header />
            <main className="iconedefundo_cadastro">
                <form onSubmit={handleSubmit} className="container_cadastro">
                    <div className="titulo">
                        {idParaEditar ? <h2>Editando item</h2> : <h2>Cadastro</h2>}
                    </div>


                    <div className="container_busca">
                        <div ref={topoRef} tabIndex={-1} className="box_cadastro">
                            <div className="linha1">
                                <div>
                                    <label htmlFor="prod">Lanche</label>
                                    <input className="lanches"
                                        type="text"
                                        id="prod"
                                        placeholder="Insira o nome do lanche"
                                        value={nomeLanche}
                                        onChange={c => setNomeLanche(c.target.value)}>
                                    </input>
                                </div>

                                <div className='valor_img'>
                                    <div className='valor'>
                                        <label htmlFor="val">Valor</label>
                                        <NumericFormat
                                            id="valor"
                                            placeholder="Insira o preço (R$)"
                                            value={preco ?? ""}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix='R$ '
                                            decimalScale={2}
                                            fixedDecimalScale
                                            allowNegative={false}
                                            onValueChange={(values) => {
                                                setPreco(values.floatValue ?? undefined);
                                            }}
                                            inputMode="decimal"
                                        />
                                    </div>

                                    <div className="img">
                                        <label htmlFor="img">
                                            <span className='img_span'>Imagem</span>
                                            <div style={{ backgroundColor: bgImagemInputColor }}>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512">
                                                    <path fill="currentColor"
                                                        d="M232 344l0-316.7 106.3 106.3c3.1 3.1 8.2 3.1 11.3 0s3.1-8.2 0-11.3l-120-120c-3.1-3.1-8.2-3.1-11.3 0l-120 120c-3.1 3.1-3.1 8.2 0 11.3s8.2 3.1 11.3 0L216 27.3 216 344c0 4.4 3.6 8 8 8s8-3.6 8-8zm48-24l104 0c26.5 0 48 21.5 48 48l0 48c0 26.5-21.5 48-48 48L64 464c-26.5 0-48-21.5-48-48l0-48c0-26.5 21.5-48 48-48l104 0 0-16-104 0c-35.3 0-64 28.7-64 64l0 48c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-48c0-35.3-28.7-64-64-64l-104 0 0 16zm88 72a16 16 0 1 1 -32 0 16 16 0 1 1 32 0zm-16-32a32 32 0 1 0 0 64 32 32 0 1 0 0-64z" />
                                                </svg>
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="img"
                                            alt="imagem_do_lanche"
                                            accept="image/*"
                                            onChange={carregarImagem}
                                        />
                                    </div>
                                </div>

                                <div className="categoria_img">
                                    <div className="categoria">
                                        <label htmlFor="cat">Categoria</label>
                                        <input className="linhas_1e2"
                                            type="text"
                                            id="cat"
                                            placeholder="Frango, Vegetariano, Carne..."
                                            value={categorias}
                                            onChange={c => setCategorias(c.target.value)}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="cadastro_coluna2">
                                <label className="Descricaotexto" htmlFor="desc">Descrição</label>
                                <textarea
                                    id="desc"
                                    maxLength={200}
                                    placeholder="Escreva detalhes sobre o lanche"
                                    value={descricao}
                                    onChange={d => setDescricao(d.target.value)}
                                />



                            </div>
                        </div>
                    </div>
                    <button className='botaoSubmit' type='submit'>{idParaEditar ? "Atualizar dados" : "Cadastrar"}</button>
                    {idParaEditar && <button onClick={cancelarEdicao} className='botaoSubmit'>Cancelar</button>}
                </form>

                <section className="container_lista">
                    <h1></h1>
                    <h2>Lista</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Descrição</th>
                                <th>Preco</th>
                                <th>Editar</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                lanches.map((l: Lanche) => (
                                    <tr key={l.id}>
                                        <td data-cell="Lanche: ">{l.nome}</td>
                                        <td data-cell="Categoria: ">{l.categorias.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}</td>
                                        <td data-cell="Descrição: ">{l.descricao || "Não informada"}</td>

                                        <td data-cell="Valor: ">{formatosService.PrecoBR(l.preco) || "Não informada"}</td>
                                        <td>
                                            <svg onClick={() => editarLanche(l)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M460.3 39.6l12.1 12.1c15.6 15.6 15.6 40.9 0 56.6L440 140.7 371.3 72 403.7 39.6c15.6-15.6 40.9-15.6 56.6 0zM175.4 267.9L360 83.3 428.7 152 244.1 336.6c-5.3 5.3-12 9-19.3 10.7l-78.1 18 18-78.1c1.7-7.3 5.4-14 10.7-19.3zm217-239.6L164.1 256.6c-7.4 7.4-12.6 16.8-15 27l-20.9 90.6c-.6 2.7 .2 5.5 2.1 7.5s4.8 2.8 7.5 2.1l90.6-20.9c10.2-2.4 19.6-7.5 27-15L483.7 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 28.3c-21.9-21.9-57.3-21.9-79.2 0zM72 64C32.2 64 0 96.2 0 136L0 440c0 39.8 32.2 72 72 72l304 0c39.8 0 72-32.2 72-72l0-144c0-4.4-3.6-8-8-8s-8 3.6-8 8l0 144c0 30.9-25.1 56-56 56L72 496c-30.9 0-56-25.1-56-56l0-304c0-30.9 25.1-56 56-56l144 0c4.4 0 8-3.6 8-8s-3.6-8-8-8L72 64z" /></svg>
                                        </td>
                                        <td>
                                            <img onClick={() => abrirModalParaConfirmarDelete(l.id!)} src={Excluir} alt="Excluir" />
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </section>




            </main>
            <Footer />

            <ModalCustomizado
                mostrarModalQuando={clicouNaLixeira}
                aoCancelar={fecharModalConfirmacaoDelete}
                titulo='Confirmar exclusão'
                corpo="Tem certeza que deseja remover o bolo?"
                customizarBotoes={true}
                textoBotaoConfirmacao='Excluir'
                textoBotaoCancelamento='Cancelar'
                aoConfirmar={() => removerItemAposCOnfirmacao(idParaDeletar)}
                exibirConteudoCentralizado={true}
            />

            <ModalCustomizado
                mostrarModalQuando={aposConfirmacaoDeBoloRemovido}
                aoCancelar={() => setAposConfirmacaoDeLancheRemovido(false)}
                titulo='Sucesso'
                corpo='Lanche removido!'
            />

            <ModalCustomizado
                mostrarModalQuando={propsModalDeErroOuSucesso.exibir}
                aoCancelar={fecharModalDeErroOuSucesso}
                titulo={propsModalDeErroOuSucesso.titulo}
                corpo={propsModalDeErroOuSucesso.corpo}
                exibirConteudoCentralizado={true}
            />

        </>
    )
}

// import './Cadastro.css'
// import { useEffect, useState, type ChangeEvent } from 'react';
// import Footer from '../../components/Footer/Footer'
// import Header from '../../components/Header/Header'
// import type { Lanche } from '../../types/Lanche';
// import { formatosService } from '../../services/formatosService';
// import ModalCustomizado from '../../components/ModalCustomizado/ModalCustomizado';
// import { NumericFormat } from 'react-number-format';
// import { deleteLanche, enviarFotoParaAPI, getLanche, postLanche } from '../../services/lanchesService';

// export default function Cadastro() {

//     const [Lanches, setLanches] = useState<Lanche[]>([]);
//     const [clicouNaLixeira, setClicouNaLixeira] = useState<boolean>(false);
//     const [idParaDeletar, setIdParaDeletar] = useState<string>("");
//     const [aposConfirmacaoDeLancheRemovido, setAposConfirmacaoDeLancheRemovido] = useState<boolean>(false);
//     const [propsModalDeErroOuSucesso, setPropsModalDeErroOuSucesso] = useState<{ exibir: boolean, titulo: string, corpo: string }>({ exibir: false, titulo: "", corpo: "" });
//     const [nomeLanche, setNomeLanche] = useState<string>("");
//     const [categorias, setCategorias] = useState<string>("");
//     const [imagem, setImagem] = useState<File | undefined>(undefined);
//     const [preco, setPreco] = useState<number | undefined>(undefined);
//     const [descricao, setDescricao] = useState<string>("");
//     const [bgImageInputColor, setBgImageInputColor] = useState<string>(" #ffffff");

//     const abrirModalParaConfirmarDelete = (id: string) => {
//         setClicouNaLixeira(true);
//         setIdParaDeletar(id);
//     }

//     const fecharModalConfirmacaoDelete = () => {
//         setClicouNaLixeira(false);
//     }

//     const fecharModalDeErroOuSucesso = () => {
//         setPropsModalDeErroOuSucesso({ ...propsModalDeErroOuSucesso, exibir: false }); // ...spread operator
//     }

//     const exibirModalDeErroOuSucesso = (titulo: string, corpo: string) => {
//         setPropsModalDeErroOuSucesso({ exibir: true, titulo, corpo });
//     }

//     const removerItemAposConfirmacao = async (id: string) => {
//         try {
//             await deleteLanche(id);
//             setAposConfirmacaoDeLancheRemovido(true);
//             await fetchLanches();
//             fecharModalConfirmacaoDelete();
//         } catch (error) {
//             exibirModalDeErroOuSucesso("Erro", "Erro ao deletar o Lanche");
//         }
//     }

//     const fetchLanches = async () => {
//         try {
//             const dados = await getLanche();
//             console.log(dados);
//             setLanches(dados);
//         } catch (error) {
//             console.error("Erro ao executar getLanches: ", error);
//         }
//     }

//     const carregarImagem = (img: ChangeEvent<HTMLInputElement>) => {
//         const file = img.target.files?.[0];
//         if (file?.type.includes("image")) {
//             setImagem(file);
//             setBgImageInputColor("#5cb85c");
//         }
//         else {
//             setImagem(undefined);
//             setBgImageInputColor("#ff2c2c");
//         }
//     }

//     const limparDados = () => {
//         setNomeLanche("");
//         setCategorias("");
//         setImagem(undefined);
//         setPreco(undefined);
//         setDescricao("");
//         setBgImageInputColor("#ffffff");
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!nomeLanche || !categorias || !preco) {
//             exibirModalDeErroOuSucesso("Campos obrigatórios", "Preencha o nome, categorias e preço do Lanche");
//             return;
//         }

//         let uploadedFileName: string | undefined;

//         if (imagem) {
//             uploadedFileName = await enviarFotoParaAPI(imagem);
//             if (!uploadedFileName) {
//                 exibirModalDeErroOuSucesso("Erro", "Cadastro cancelado por falha no upload da imagem.");
//                 return;
//             }
//         }

//         const novoLanche: Lanche = {
//             id: undefined,
//             nome: nomeLanche,
//             descricao: descricao,
//             preco: preco,
//             categorias: categorias.toLowerCase().split(",").map(c => c.trim()),
//             imagens: uploadedFileName ? [uploadedFileName] : [],
//         }

//         try {
//             await postLanche(novoLanche);
//             exibirModalDeErroOuSucesso("Sucesso", "Novo Lanche cadastrado com sucesso!");
//             fetchLanches();
//             limparDados();
//         } catch (error) {
//             exibirModalDeErroOuSucesso("Erro", "Erro ao cadastrar o novo Lanche");
//         }

//     }

//     useEffect(() => {
//         fetchLanches();
//     }, [])



//     return (
//         <>
//             <Header />
//             <main>
//                 <h1 className="acessivel">tela de cadastro e listagem de produtos</h1>

//                 <form onSubmit={handleSubmit} className="container_cadastro">
//                     <h2>Cadastro</h2>
//                     <hr />

//                     <div className="box_cadastro">
//                         <div className="cadastro_coluna1">
//                             <div className="Lanches">
//                                 <label htmlFor="Lanche">Lanche</label>
//                                 <input
//                                     type="text"
//                                     id="Lanche"
//                                     placeholder='Insira o nome do Produto'
//                                     value={nomeLanche}
//                                     onChange={e => setNomeLanche(e.target.value)}
//                                 />
//                             </div>

//                             <div className="categoria_img">
//                                 <div className="categoria">
//                                     <label htmlFor="cat">Categoria</label>
//                                     <input
//                                         type="text"
//                                         id="cat"
//                                         placeholder='Chocolate, Morango, Coco...'
//                                         value={categorias}
//                                         onChange={c => setCategorias(c.target.value)}
//                                     />
//                                 </div>
//                                 <div className="img">
//                                     <label htmlFor="img">
//                                         <span>Imagem</span>
//                                         <div style={{ backgroundColor: bgImageInputColor }}>
//                                             <svg xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 448 512">
//                                                 <path fill="currentColor"
//                                                     d="M232 344l0-316.7 106.3 106.3c3.1 3.1 8.2 3.1 11.3 0s3.1-8.2 0-11.3l-120-120c-3.1-3.1-8.2-3.1-11.3 0l-120 120c-3.1 3.1-3.1 8.2 0 11.3s8.2 3.1 11.3 0L216 27.3 216 344c0 4.4 3.6 8 8 8s8-3.6 8-8zm48-24l104 0c26.5 0 48 21.5 48 48l0 48c0 26.5-21.5 48-48 48L64 464c-26.5 0-48-21.5-48-48l0-48c0-26.5 21.5-48 48-48l104 0 0-16-104 0c-35.3 0-64 28.7-64 64l0 48c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-48c0-35.3-28.7-64-64-64l-104 0 0 16zm88 72a16 16 0 1 1 -32 0 16 16 0 1 1 32 0zm-16-32a32 32 0 1 0 0 64 32 32 0 1 0 0-64z" />
//                                             </svg>
//                                         </div>
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="img"
//                                         accept='image/*'
//                                         onChange={carregarImagem}
//                                     />
//                                 </div>
//                             </div>


//                             <div className="valor">
//                                 <label htmlFor="val">Valor</label>
//                                 <NumericFormat
//                                     id='val'
//                                     placeholder='Insira o preço (R$)'
//                                     value={preco ?? ""}
//                                     thousandSeparator="."
//                                     decimalSeparator=','
//                                     prefix='R$ '
//                                     decimalScale={2}
//                                     fixedDecimalScale
//                                     allowNegative={false}
//                                     onValueChange={(values) => {
//                                         setPreco(values.floatValue ?? undefined);
//                                     }}
//                                     inputMode='decimal'
//                                 />
//                             </div>



//                         </div>
//                     </div>

//                     <div className="cadastro_coluna2">
//                         <label htmlFor="desc">Descrição</label>
//                         <textarea
//                             id="desc"
//                             maxLength={200}
//                             placeholder='Escreva detalhes sobre o Lanche'
//                             value={descricao}
//                             onChange={d => setDescricao(d.target.value)}
//                         />
//                     </div>
//                     <div>



//                     </div>
//                     <button className='botaoSubmit' type='submit'>Cadastrar</button>
//                 </form>

//                 <section className="container_lista">
//                     <h2>Lista</h2>
//                     <hr />

//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Lanche</th>
//                                 <th>Categoria</th>
//                                 <th>Descrição</th>
//                                 <th>Excluir</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 Lanches.map((b: Lanche) => (
//                                     <tr>
//                                         <td data-cell="Lanche: ">{b.nome}</td>
//                                         <td data-cell="Categoria: "> {b.categorias.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")} </td>
//                                         <td data-cell="Descrição: ">{b.descricao || "Não informado"}</td>
//                                         <td data-cell="Valor: "> {formatosService.PrecoBR(b.preco)} </td>
//                                         <td>
//                                             <svg onClick={() => abrirModalParaConfirmarDelete(b.id!)} xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 640 640">
//                                                 <path fill="currentColor"
//                                                     d="M247.4 79.1C251 70 259.9 64 269.7 64L370.3 64C380.1 64 388.9 70 392.6 79.1L412.2 128L227.8 128L247.4 79.1zM210.6 128L104 128C99.6 128 96 131.6 96 136C96 140.4 99.6 144 104 144L536 144C540.4 144 544 140.4 544 136C544 131.6 540.4 128 536 128L429.4 128L407.5 73.1C401.4 58 386.7 48 370.3 48L269.7 48C253.3 48 238.6 58 232.6 73.1L210.6 128zM128 192L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 192L496 192L496 512C496 538.5 474.5 560 448 560L192 560C165.5 560 144 538.5 144 512L144 192L128 192zM224 264C224 259.6 220.4 256 216 256C211.6 256 208 259.6 208 264L208 472C208 476.4 211.6 480 216 480C220.4 480 224 476.4 224 472L224 264zM328 264C328 259.6 324.4 256 320 256C315.6 256 312 259.6 312 264L312 472C312 476.4 315.6 480 320 480C324.4 480 328 476.4 328 472L328 264zM432 264C432 259.6 428.4 256 424 256C419.6 256 416 259.6 416 264L416 472C416 476.4 419.6 480 424 480C428.4 480 432 476.4 432 472L432 264z" />
//                                             </svg>
//                                         </td>
//                                     </tr>
//                                 ))
//                             }
//                         </tbody>
//                     </table>
//                 </section>
//             </main>
//             <Footer />


//             <ModalCustomizado
//                 mostrarModalQuando={clicouNaLixeira}
//                 aoCancelar={fecharModalConfirmacaoDelete}
//                 titulo='Confirmar exclusão'
//                 corpo='Tem certeza que deseja remover este item?'
//                 customizarBotoes={true}
//                 textoBotaoConfirmacao='Excluir'
//                 textoBotaoCancelamento='Cancelar'
//                 aoConfirmar={() => removerItemAposConfirmacao(idParaDeletar)}
//                 exibirConteudoCentralizado={true}
//             />

//             <ModalCustomizado
//                 mostrarModalQuando={aposConfirmacaoDeLancheRemovido}
//                 aoCancelar={() => setAposConfirmacaoDeLancheRemovido(false)}
//                 titulo='Sucesso'
//                 corpo='Lanche removido!'
//             />


//             <ModalCustomizado
//                 mostrarModalQuando={propsModalDeErroOuSucesso.exibir}
//                 aoCancelar={fecharModalDeErroOuSucesso}
//                 titulo={propsModalDeErroOuSucesso.titulo}
//                 corpo={propsModalDeErroOuSucesso.corpo}
//                 exibirConteudoCentralizado={true}
//             />
//         </>
//     )
// }