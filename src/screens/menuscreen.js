import React from 'react'
import { Link } from 'react-router-dom'
function menuscreen() {
  return (

    
  


            <div className="container Body-Home">
  <div className="row">
  <div className="col-md-6">
      <Link to="/creationMvm" className="home-link link-lstinv">
        <span className="bi bi-boxes d-block icon-home"></span>
        <h5>CREATION MOUVEMENT</h5>
        <span className="bi bi-arrow-right arrow-crea-inv"></span>
      </Link>
    </div>
    <div className="col-md-6">
      <Link to="/cart" className="home-link  link-lstinv">
      <span className="bi bi-boxes d-block icon-home"></span>
        <h5>CREATION ARTICLE</h5>
        <span className="bi bi-arrow-right arrow-list-inv"></span>
      </Link>
    </div>
    {/* Row for the first two buttons */}
    <div className="col-md-6">
      <Link to="/listArticle" className="home-link link-creinv">
        <span className="bi bi-journal-check icon-home"></span><br></br>
        <h5>LISTE ARTICLES</h5>
        <span className="bi bi-arrow-right arrow-list-inv"></span>
      </Link>
    </div>
    <div className="col-md-6">
      <Link to="/listMvm" className="home-link link-creinv">
        <span className="bi bi-journal-check icon-home"></span><br></br>
        <h5>LISTE MOUVEMENT</h5>
        <span className="bi bi-arrow-right arrow-crea-inv"></span>
      </Link>
    </div>
  
  </div>

  <div className="row">
    {/* Row for the third and fourth buttons */}
   
    <div className="col-md-6">
      <Link to="/statistique" className="home-link  link-valinv">
        <span className="bi bi-ui-checks d-block icon-home"></span>
        <h5>STATISTIQUES</h5>
        <span className="bi bi-arrow-right arrow-val-inv"></span>
      </Link>
    </div>
    <div className="col-md-6">
      <Link to="/menuImportation" className="home-link link-expinv">
        <span className="bi bi-file-earmark-arrow-down d-block icon-home"></span>
        <h5>IMPORTER <br></br>DES ARTICLES</h5>
        <span className="bi bi-arrow-right arrow-export-inv"></span>
      </Link>
    </div>
  </div>
</div>
        
  )
}

export default menuscreen