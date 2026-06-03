import './Home.css';
import whatsapp from "../../assets/Ícone Whatsapp Menu.png";
// import img_logo from "../../assets/Logo Menu.png";
import { Link } from 'react-router-dom';
import { categorias } from '../../data/categorias';
import type { CardCategoriaProps } from '../../types/CardCategoriaProps';
import CardCategoria from '../../components/CardCategoria/CardCategoria';
import Carrossel from '../../components/Carrossel/Carrossel';
import Footer from '../../components/Footer/Footer';

export default function Home() {
    return (
        <>
            <Carrossel/>
            <main className="iconedefundo_menu_home">
                <section>
                    <div>
                        {/* <img className="img_logo" src={img_logo} alt="logo" /> */}
                        {/* <img className="banners" src="../BurguerStation/assets/Group 5 (1).png" alt=""/>
                <img className="banners" src="../BurguerStation/assets/Group 5 (1).png" alt=""/>
                <img className="banners" src="../BurguerStation/assets/Group 5 (1).png" alt=""/> */}
                    </div>

                </section>


                <section className="secao_cards_home">

                    <h1 className="acessível">Pagina inicial</h1>
                    {
                        categorias.map((c: CardCategoriaProps) => (
                            <CardCategoria
                                key={c.titulo}
                                rota={c.rota}
                                titulo={c.titulo}
                                classeCss={c.classeCss}
                                svgIconeCategoria={c.svgIconeCategoria}
                            />
                        ))
                    }

                </section>

                <Link className="whatsapp" to="https://wa.me/5511999999999?text=Olá%20,%20gostaria%20de%20mais%20informações."
                    target="_blank">
                    <img src={whatsapp} alt="icone do whatsapp" />
                </Link>
            </main>
            <Footer/>

        </>
    )
}
