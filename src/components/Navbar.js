import React, { useState,useEffect, useRef  }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../actions/userActions';

function Navbar() {
  const cartstate = useSelector(state => state.cartReducer);
  const userstate = useSelector(state => state.loginUserReducer);
  const { currentUser } = userstate;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      
    <div className="d-flex text-start sticky">
    <div ref={sidebarRef} className={`sidebar p-4  side-light border-end ${sidebarOpen ? 'open' : ''}`}>
       
        
         
          <div className="list-group list-group-flush p-1">
          {currentUser ? (
            <>
                    <a className="nav-link pb-5" type="button" aria-expanded="false">
                      {currentUser.NOMUSR}
                      <p style={{ fontSize:'13px' ,color:'#183F7F'}}>{currentUser.EMAILUSR}</p>
                    </a>
                    <a href="/menu" className="list-group-item list-group-item-action bg-light"><i className="bi bi-house-door p-2"></i>Menu</a>
                    <a href="/cart" className="list-group-item list-group-item-action bg-light"><i className="bi bi-heart p-2"></i>Création Article</a>
                    <a href="/creationMvm" className="list-group-item list-group-item-action bg-light"><i className="bi bi-heart p-2"></i>Création Mvm</a>
                    <a href="/listArticle" className="list-group-item list-group-item-action bg-light"><i className="bi bi-house-door p-2"></i>Liste Article</a>
                    <a href="/listMvm" className="list-group-item list-group-item-action bg-light"><i className="bi bi-house-door p-2"></i>Liste Mvm</a>
                    <a href="/statistique" className="list-group-item list-group-item-action bg-light"><i className="bi bi-house-door p-2"></i>Statistiques</a>
                    <a href="/menuImportation" className="list-group-item list-group-item-action bg-light"><i className="bi bi-heart p-2"></i>Importation</a>
                    <a href="/" className="list-group-item list-group-item-action bg-light" onClick={() => dispatch(logoutUser())}><i className="bi bi-box-arrow-right p-2"></i>Logout</a>
            </>
          ) : (<>
            <a href="/cart" className="list-group-item list-group-item-action bg-light"><i className="bi bi-house-door p-2"></i>Acceuil</a>
            <a href="/" className="list-group-item list-group-item-action bg-light"><i className="bi bi-person p-2"></i>Connexion</a></>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1">
        <nav className="navbar navbar-expand-lg bg-body rounded header">
          <div className="container-fluid">
          <button className="navbar-toggler" type="button" onClick={toggleSidebar} data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"  aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"> </span>
          </button>
        
            <a className="navbar-brand mx-auto" href="/cart">
              <img src="./logo.png" alt="Afriqua gaz logo" style={{ height: '90px',paddingLeft:'30px' }} />
            </a>
            {currentUser ? (
              <ul className="navbar-nav ml-auto px-3">
                <li className="nav-item text-start">
                  <a className="nav-link m-auto" href="/cart" style={{ marginTop:'0px' }}  >
                  {currentUser.NOMUSR}
                    <img src="../user.png"  alt="Cart" style={{ height: '40px',paddingLeft:'7px' }} />
                    
                  </a>
                </li>
              </ul>
            ) : (
              <a className="nav-link" aria-current="page" href="/login" style={{ textDecoration: 'none' }}><i className="bi bi-person p-2"></i></a>
            )}
          </div>
        </nav>
      </div>
    </div>
    </div>
  );
}

export default Navbar;
