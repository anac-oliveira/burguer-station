import banner_1 from '../../assets/Banner1atualizadook.png'
import banner_2 from '../../assets/Banner2atualizadook.png'
import banner_3 from '../../assets/Banner3atualizadook.png'
import banner_4 from '../../assets/Banner4atualizadook.png'
import banner_5 from '../../assets/Banner5atualizadook.png';


export default function Carrossel() {
  return (
    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={banner_1} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={banner_2} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={banner_3} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={banner_4} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={banner_5} className="d-block w-100" alt="..." />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
