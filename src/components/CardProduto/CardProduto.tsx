import type { CardProdutoProps } from '../../types/CardProdutoProps';
import './CardProduto.css';
import lanche_default from '../../assets/Logo Menu.png';
import { formatosService } from '../../services/formatosService'


export default function CardProduto( {nome, descricao, preco, imagem, id}: CardProdutoProps ) {
  return (
    <div key={id} className="card_produto">
            <img className="prduto_img" src={(imagem.length > 0) ? `http://localhost:3000/static/${imagem}` : lanche_default} alt="Pão com gergelim, dois frangos, molho cremoso sabor queijo cheddar, maionese e alface" />
            <h2 className='nome_produto_'>{nome}</h2>
            <p>{(descricao.length > 0) ? descricao : "Descrição não informada"}</p>
            <span className='card_span'>{ formatosService.PrecoBR(preco) }</span><br/> 
    </div>
  )
}
