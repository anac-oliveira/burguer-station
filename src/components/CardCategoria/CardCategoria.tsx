import { Link } from 'react-router-dom';
import './CardCategoria.css';
import type { CardCategoriaProps } from '../../types/CardCategoriaProps';
import plus from "../../assets/mais.png";

export default function CardCategoria({ rota, titulo, classeCss, svgIconeCategoria}: CardCategoriaProps) {

    return (
        
        
        <Link to={rota} className={`card_categoria ${classeCss}`} >     
                <img className="plus" src={plus} alt=""/>
                
                {svgIconeCategoria}
                
                <h2 className='h2Home'>{titulo}</h2>
            </Link>
    )

}