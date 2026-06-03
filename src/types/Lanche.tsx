export interface Lanche {
    id: string | undefined;
    nome: string;
    descricao: string;
    preco: number;
    categorias: string[];
    imagens: string[]; //lista de string é mostrada dessa forma
}