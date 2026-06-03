import type { CardCategoriaProps } from "../types/CardCategoriaProps";
import card_frango from "../assets/hambuguer frango.png";
import card_vegetarianos from "../assets/hamburguer vegetariano.png";
import card_carne from "../assets/hamburguer bovino.png";
import card_acompanhamentos from "../assets/Batata frita.png";
import card_sobremesas from "../assets/Sorvete.png";
import card_bebidas from "../assets/Bebida.png";

export const categorias: CardCategoriaProps[] = [

{
rota: "/produtos/frango",
titulo: "Frango",
classeCss: "card_frango",
svgIconeCategoria: 
   <img src= {card_frango} alt="Hamburguer de frango"/>
},
{
rota: "/produtos/vegetarianos",
titulo: "Vegetarianos",
classeCss: "card_vegetarianos",
svgIconeCategoria:
<img src= {card_vegetarianos} alt="Hamburguer vegetariano"/>
},

{
rota: "/produtos/carne",
titulo: "Carne",
classeCss: "card_carne",
svgIconeCategoria:
<img src= {card_carne} alt="Hamburguer de carne"/>
},

{
rota: "/produtos/acompanhamentos",
titulo: "Acompanhamentos",
classeCss: "card_acompanhamentos",
svgIconeCategoria:
<img src= {card_acompanhamentos} alt="Acompanhamentos" />
},

{
rota: "/produtos/sobremesas",
titulo: "Sobremesas",
classeCss: "card_sobremesas",
svgIconeCategoria:
<img src= {card_sobremesas} alt="Sobremesas"/>


},
{
rota: "/produtos/bebidas",
titulo: "Bebidas",
classeCss: "card_bebidas",
svgIconeCategoria:
<img src= {card_bebidas} alt="Bebidas"/>

},
];