import { BrowserRouter, Route, Routes } from "react-router-dom"
import Produtos from "./pages/Produtos/Produtos"
import Home from "./pages/Home/Home"
import Cadastro from "./pages/Cadastro/Cadastro"
import RotaProtegida from "./components/RotaProtegida/RotaProtegida"
import Login from "./pages/Login/Login"
import Avaliacao from "./pages/Avaliacao/Avaliacao"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/produtos/cadastro" element={
            <RotaProtegida>
              <Cadastro />
            </RotaProtegida>
          } />
          <Route path="/produtos/:categoria" element={<Produtos />} />
          <Route path="/produtos/pesquisa" element={<Produtos />} />
          <Route path="/avaliacao/:id" element={<Avaliacao />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
