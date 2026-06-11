import type { CardProdutoProps } from '../../types/CardProdutoProps';
import './CardProduto.css';
import lanche_default from '../../assets/Logo Menu.png';
import { formatosService } from '../../services/formatosService'


export default function CardProduto( {nome, descricao, preco, imagem, id}: CardProdutoProps ) {
  // console.log("Imagem: " + imagem);
  const imageUrl = imagem.length > 0
    ? `http://localhost:5103/Uploads/${imagem}`
    : lanche_default;
  return (
    <div key={id} className="card_produto">
            <img className="prduto_img" src={imageUrl} alt={nome} />
            <h2 className='nome_produto_'>{nome}</h2>
            <p>{(descricao.length > 0) ? descricao : "Descrição não informada"}</p>
            <span className='card_span'>{ formatosService.PrecoBR(preco) }</span><br/> 
    </div>
  )
}
