import './Header.css';
import icone_inicio from '../../assets/inicio.png';
import img_logo from '../../assets/Logo Menu.png';
import { Nav, Navbar } from 'react-bootstrap';
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Header() {

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Checa login baseado no cookie 'auth_hash'
  const isLoggedIn = useMemo(() => !!Cookies.get('auth_hash'), []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return; // ignora buscas vazias
    navigate(`/produtos/pesquisa?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    Cookies.remove('auth_hash');
    navigate('/');
    window.location.reload();
  };

  return (
    <header>
      <Navbar expand="md" className="container_geral container_header">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            {/* 1/3: Logo */}
            {
              isLoggedIn ? (
                <Nav.Item>
                  <Link to={"/"} title="Ir para a página inicial">
                    <img className="login_header" src={icone_inicio} />
                  </Link>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Link to={"/produtos/cadastro"} title="Cadastrar produtos">
                    <img className="logo_header" src={img_logo} />
                  </Link>
                </Nav.Item>
              )
            }

            {/* 2/3: Barra de pesquisa */}
            <Nav.Item className="busca">
              <svg className="icone_lupa" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <path fill="currentColor"
                  d="M368 208a160 160 0 1 0 -320 0 160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z" />
              </svg>
              <input
                className="input-pesquisa"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="pesquisar"
              />
            </Nav.Item>

            {/* 3/3: Botões direito */}
            {isLoggedIn ? (
              <Nav.Item className="botoes_direita">
                <Link to={"/produtos/cadastro"} title="Cadastrar produtos">
                  <svg className="add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M240 48c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 192-192 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0 0 192c0 8.8 7.2 16 16 16s16-7.2 16-16l0-192 192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-192 0 0-192z" />
                  </svg>
                </Link>
                <button onClick={handleLogout} title="Sair / Finalizar sessão">
                  <svg className="logout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M18.3 261.7c-3.1-3.1-3.1-8.2 0-11.3l144-144c2.3-2.3 5.7-3 8.7-1.7l0 0c3 1.2 4.9 4.2 4.9 7.4l0 88c0 4.4 3.6 8 8 8l120 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32l-120 0c-4.4 0-8 3.6-8 8l0 88c0 3.2-1.9 6.2-4.9 7.4s-6.4 .6-8.7-1.7l-144-144zM151 95L7 239c-9.4 9.4-9.4 24.6 0 33.9l0 0 144 144c6.9 6.9 17.2 8.9 26.2 5.2S192 409.7 192 400l0-80 112 0c26.5 0 48-21.5 48-48l0-32c0-26.5-21.5-48-48-48l-112 0 0-80c0-9.7-5.8-18.5-14.8-22.2S157.9 88.2 151 95zM328 464c-4.4 0-8 3.6-8 8s3.6 8 8 8l88 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-88 0c-4.4 0-8 3.6-8 8s3.6 8 8 8l88 0c44.2 0 80 35.8 80 80l0 256c0 44.2-35.8 80-80 80l-88 0z" />
                  </svg>
                </button>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Link to={"/"} title="Ir para a página inicial">
                  <img className="login_header" src={icone_inicio} />
                </Link>
              </Nav.Item>
            )}

          </Nav>
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
      </Navbar>
    </header >
  );
}