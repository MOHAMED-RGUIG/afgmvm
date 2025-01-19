import React from 'react'
import { Link } from 'react-router-dom'
function MenuImportation() {
  return (
    <div className='col-9 col-md-9 col-xs-9 mx-auto mt-5 pt-1 mb-5' >  
          <div className="container Body-Home">
  <div className="row">
  <div className="col-md-6">
      <Link to="/csv" className="home-link link-lstinv">
        <span className="bi bi-boxes d-block icon-home"></span>
        <h5>Importer fichier Csv</h5>
        <span className="bi bi-arrow-right arrow-crea-inv"></span>
      </Link>
    </div>
    <div className="col-md-6">
      <Link to="/excel" className="home-link  link-lstinv">
      <span className="bi bi-boxes d-block icon-home"></span>
        <h5>Importer fichier Excel</h5>
        <span className="bi bi-arrow-right arrow-crea-inv"></span>
      </Link>
    </div>
    {/* Row for the first two buttons */}
    
    
  </div>
  </div>       
  </div>
    
  )
}

export default MenuImportation