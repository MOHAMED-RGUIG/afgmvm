import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticles,updateArticle,deleteArticle } from '../actions/articlesAction';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ListArticles() {
  const dispatch = useDispatch();
  const { articles, error, loading } = useSelector(state => state.articles);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  // State for search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriticQuery, setsearchCriticQuery] = useState('');
  const [searchLocationQuery, setsearchLocationQuery] = useState('');
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch articles on component mount
  useEffect(() => {
    dispatch(getAllArticles());
    
  }, [dispatch]);
//DONNES POUR LES SELECTION 
const typeMAchines = [
  { label: "Utilité-SB01-Reservoirs Cylindrique Horizontale B01", code: "USRCHB01" },
  { label: "Utilité-SB02-Reservoirs Cylindrique Horizontale B02", code: "USRCHB02" },
  { label: "Utilité-SB03-Reservoirs Cylindrique Horizontale B03", code: "USRCHB03" },
  { label: "Utilité-SB04-Reservoirs Cylindrique Horizontale B04", code: "USRCHB04" },
  { label: "Utilité-Reservoirs Spherique SP01", code: "URSS01" },
  { label: "Utilité-PB01-Pompe GPL B01", code: "UPPGB01" },
  { label: "Utilité-PB02-Pompe GPL B02", code: "UPPGB02" },
  { label: "Utilité-PB03-Pompe GPL B03", code: "UPPGB03" }
];
const locations = [
  "A0", "A11", "A12", "A13", "A14", "A15", "A21", "A22", "A23", "A24", "A25",
  "A31", "A32", "A33", "A34", "A35", "A41", "A42", "A43", "A44", "A45", "A51",
  "A52", "A53", "A54", "A55", "A61", "A62", "A63", "A64", "A65", "A66", "A71",
  "A72", "A73", "A74", "A75", "B11", "B12", "B13", "B14", "B15", "B21", "B22",
  "B23", "B24", "B25", "B31", "B32", "B33", "B34", "B35", "B41", "B42", "B43",
  "B44", "B45", "B51", "B52", "B53", "B54", "B55", "B61", "B62", "B63", "B64",
  "B65", "B66", "C11", "C12", "C13", "C14", "C15", "C21", "C22", "C23", "C24",
  "C25", "C31", "C32", "C33", "C34", "C35", "C41", "C42", "C43", "C44", "C45",
  "C51", "C52", "C53", "C54", "C55", "C61", "C62", "C63", "C64", "C65", "D11",
  "D12", "D13", "D14", "D15", "D21", "D22", "D23", "D24", "D25", "D31", "D32",
  "D33", "D34", "D35", "D41", "D42", "D43", "D44", "D45", "D51", "D52", "D53",
  "D54", "D55", "D61", "D62", "D63", "D64", "D65", "D71", "D72", "D73", "D74",
  "D75"
];
const units = [
  "pcs",
  "kg", "g", "mg",
  "L", "mL", "cL", "m³", "cm³",
  "m", "cm", "mm", "in", "ft",
  "m²", "cm²", "mm²"
];
const dispositionAs = ["M1", "M2", "M3", "M4", "M5", "M6"];
const dispositionBs = ["1", "2", "3","4", "5", "6","7", "8", "9"] ;

const articleTypes = [    "E:Électronique",
"M:Mécanique",
"P:Pneumatique",
"H:Hydraulique",
"EP:Électro-pneumatique",
"EH:Électro-hydraulique"]


;


//
  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    const matchArticle = article.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCritic = searchCriticQuery === ''
      ? true
      : (article.is_critic === 1 ? 'oui' : 'non').includes(searchCriticQuery.toLowerCase());
    const matchLocation = article.location?.toLowerCase().includes(searchLocationQuery.toLowerCase());
  
    return matchArticle && matchCritic && matchLocation;
  });
  
  // Calculate the current articles to display
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        // Remplacez par l'URL de votre backend pour uploader l'image
        const response = await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setImagePath(response.data.path); // Le chemin renvoyé par le serveur
        setImage(file.name); // Nom de l'image pour l'affichage
    } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
    }
};


  // Ouvrir la popup pour l'article sélectionné
  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setShowPopup(true);
  };

  // Fermer la popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedArticle(null);
  };

  // Modifier l'article
  const handleUpdate = async () => {
    if (selectedArticle) {
      const updatedData = {
        title: selectedArticle.title,
        quantitySt: selectedArticle.quantitySt,
        unit: selectedArticle.unit,
        categorie: selectedArticle.categorie,
        quantitySecurity: selectedArticle.quantitySecurity,
        dispositionA: selectedArticle.dispositionA,
        dispositionB: selectedArticle.dispositionB,
        articleType: selectedArticle.articleType,
        image: imagePath,
        typeMachine: selectedArticle.typeMachine,
      };
  
      try {
        await dispatch(updateArticle(selectedArticle.idArticle, updatedData));
        dispatch(getAllArticles()); // Récupération des articles à jour
        setShowPopup(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
      }
    }
  };
  
  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setShowPopup1(true);
  };
//suppression
  const confirmDelete = () => {
    if (selectedArticle) {
      dispatch(deleteArticle(selectedArticle.idArticle));
      dispatch(getAllArticles());
      setShowPopup1(false);
      setSelectedArticle(null);
    }
  };

  const handleClosePopup1 = () => {
    setShowPopup1(false);
    setSelectedArticle(null);
  };

  const exportToExcel = () => {
    // Préparation des données pour l'exportation
    const dataToExport = filteredArticles.map((article) => ({
      Date: new Date(article.dateCreationArticle).toLocaleDateString('fr-FR'),
      Heure: new Date(article.dateCreationArticle).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      title: article.title,
      Référence: article.reference,
      QuantitéStock: article.quantitySt,
      unit: article.unit,
      categorie: article.categorie,
      location: article.location,
      is_critic: article.is_critic ? 'Oui' : 'Non',
      quantitySecurity:article.quantitySecurity,
      dispositionA:article.dispositionA,
      dispositionB:article.dispositionB,
      articleType:article.articleType,
      typeMachine:article.typeMachine,
      Utilisateur: article.NOMUSR,
    }));
  
    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Articles');
  
    // Téléchargement du fichier Excel
    XLSX.writeFile(workbook, 'Articles.xlsx');
  };

  const exportToPDF = () => {
    // Initialisation de jsPDF
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = '../logo.png';
    logoImg.onload = () => {
      doc.addImage(logoImg, 'JPG', 25, 15, 60, 20); // x, y, width, height
      doc.setFontSize(15);
      doc.setFont("poppins", "bold");
      doc.setTextColor('#003f7e');
   
      doc.setFontSize(25); // Set font size
      doc.setFont("helvetica", "bold"); // Set font to Helvetica and make it bold
      doc.setTextColor('#003f7e'); // Set text color to blue (RGB format)
    doc.text('LISTE DES ARTICLES',55, 62);
  
    // Préparation des données pour le tableau
    const tableColumn = ['Date','Nom', 'Ref','QtStock','Critic','Type','Machine', 'User'];
    const tableRows = filteredArticles.map((article) => [
      new Date(article.dateCreationArticle).toLocaleDateString('fr-FR'),
      article.title,
      article.reference,
      article.quantitySt,
 
      article.is_critic ? 'Oui' : 'Non',
      article.articleType,
      article.typeMachine,
      article.NOMUSR,
    ]);
  
    // Ajout du tableau avec jspdf-autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY:67,
      headStyles: { fillColor: '#003f7e' },  // Light grey background
      styles: { fontSize: 10 },
    });
  
    // Enregistrement du fichier
    doc.save('articles.pdf');
  }
  };


  return (
    <div className='justify-content-center mx-auto'>
      <div className="col-12 col-md-12 mt-5 mb-3 headerhomescreen">
        <h2 className='mt-5'>Liste des articles</h2>
      </div>

      {/*------------------ Search Bars------------------- */}
      <div className='search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto'>
        <input
          className="form-control text-center"
          id="search-input"
          type='search'
          placeholder='Rechercher réference'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
   <Link to="/cart" className="mt-3 p-2 btn4 btn-warning btn-sm me-2 rounded-pill shadow-sm">
          <i className="bi bi-plus me-1 mt-5"></i>
        </Link>

      </div>
      <div className='search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto'>
        <input
          className="form-control text-center"
          id="search-input"
          type='search'
          placeholder='Rechercher critique'
          value={searchCriticQuery}
          onChange={(e) => setsearchCriticQuery(e.target.value)}
        />
      </div>
      <div className='search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto'>
        <input
          className="form-control text-center"
          id="search-input"
          type='search'
          placeholder='Rechercher emplacemenet'
          value={searchLocationQuery}
          onChange={(e) => setsearchLocationQuery(e.target.value)}
        />
      </div>
      {/* -------------------------Articles Table -----------------------*/}
      <div className="table-responsive bg-white rounded shadow-sm p-3">
  <table className="table table-bordered table-striped table-hover border rounded custom-table">
    <thead className="custom-thead table-dark">
      <tr>
        <th>Référence</th>
        <th>Image</th>
        <th>Qt Stock</th>
        <th>Qt Sécurité</th>
        <th>Critique</th>
        <th>Emplacement</th>
        <th>Utilisateur</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentArticles.map((article) => (
        <tr key={article.id}>
          <td>{article.reference}</td>
          <td>
            <img
              src={article.image}
              alt={article.reference}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
              }}
            />
          </td>
          <td>{article.quantitySt}</td>
          <td>{article.quantitySecurity}</td>
          <td>{article.is_critic === 1 ? 'Oui' : 'Non'}</td>
          <td>{article.location}</td>
          <td>{article.NOMUSR}</td>
          <td>
          <button onClick={() => handleEditClick(article)} className="btn10 btn-warning btn-sm me-2 rounded-pill shadow-sm">
                    <i className="bi bi-pencil-fill me-1 p-1"></i>
                  </button>


{currentUser?.TYPUSR === 'admin' && (
                    <button className="btn11 btn-danger btn-sm rounded-pill shadow-sm"   onClick={() => handleDeleteClick(article)}>
                      <i className="bi bi-trash-fill me-1 p-1"></i>
                    </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{showPopup1 && selectedArticle && (
         <div className="popup-overlay">
         <div className="popup-content1">
           <h5>Confirmer la suppression</h5>
           <p>Voulez-vous vraiment supprimer "{selectedArticle.reference}" ?</p>
           <div className='d-flex gap-3'>
           <button className="btn5 btn-danger mt-2" onClick={confirmDelete}>
             Oui, Supprimer
           </button>
           <button className="btn5 btn-secondary mt-2" onClick={handleClosePopup1}>
             Annuler
           </button>    </div>
         </div>
       </div>
      )}

      {/* Popup */}
      {showPopup && selectedArticle && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className='headerhomescreen'>      <h2 className='mt-4 mb-5 p-4 shadow-sm rounded'>Modifier l'article</h2></div>
      
        
            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>Nom de l'article</label>
              <input  className="form-control text-center"
                type="text"
                value={selectedArticle.title}
                onChange={(e) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>Qauntité en Stock</label>
              <input  className="form-control text-center"
                type="number"
                value={selectedArticle.quantitySt}
                onChange={(e) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    quantitySt: e.target.value,
                  })
                }
              />
            </div>  


          <div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">Unit</label>
  <select
    className="form-control text-center"
    value={selectedArticle.unit}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        unit: e.target.value,
      })
    }
  >
    {/* Option par défaut */}
    <option value="" disabled>
      Sélectionnez une unité
    </option>
    {/* Options dynamiques */}
    {units.map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ))}
  </select>
</div>



<div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">Categorie</label>
  <select
    className="form-control text-center"
    value={selectedArticle.categorie}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        categorie: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez une catégorie</option>
    {/* Remplacer par les options disponibles pour la catégorie */}
    {/* Exemple fictif pour les catégories */}
    <option value="cat1">Catégorie 1</option>
    <option value="cat2">Catégorie 2</option>
    <option value="cat3">Catégorie 3</option>
  </select>
</div>

            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>Quantité de securité</label>
              <input  className="form-control text-center"
                type="number"
                value={selectedArticle.quantitySecurity}
                onChange={(e) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    quantitySecurity: e.target.value,
                  })
                }
              />
            </div>
           
<div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">DispositionA</label>
  <select
    className="form-control text-center"
    value={selectedArticle.dispositionA}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        dispositionA: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez une disposition A</option>
    {dispositionAs.map((disposition) => (
      <option key={disposition} value={disposition}>
        {disposition}
      </option>
    ))}
  </select>
</div>


<div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">DispositionB</label>
  <select
    className="form-control text-center"
    value={selectedArticle.dispositionB}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        dispositionB: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez une disposition B</option>
    {dispositionBs.map((disposition) => (
      <option key={disposition} value={disposition}>
        {disposition}
      </option>
    ))}
  </select>
</div>

<div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">Type d'article</label>
  <select
    className="form-control text-center"
    value={selectedArticle.articleType}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        articleType: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez un type d'article</option>
    {articleTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>
            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>Image</label>
              <input
                type="file"
                accept="image/*"
            
                onChange={handleImageUpload}
                className="form-control col-xl-10 col-8 col-md-8 mx-auto"
                style={{ width: "90%", fontSize: "13px" }}
            />

           
            </div>
            
            <div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">Type de machine</label>
  <select
    className="form-control text-center"
    value={selectedArticle.typeMachine}
    onChange={(e) =>
      setSelectedArticle({
        ...selectedArticle,
        typeMachine: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez un type de machine</option>
    {typeMAchines.map((machine) => (
      <option key={machine.code} value={machine.code}>
        {machine.label}
      </option>
    ))}
  </select>
</div>
          
        
            <div className='d-flex gap-3'>
            <button className="btn5 mt-2 btn-primary" onClick={handleUpdate}>
              Modifier
            </button>
            <button className="btn5 mt-2 btn-secondary" onClick={handleClosePopup}>
              Annuler
            </button></div>
          </div>
        </div>
      )}
{/*
            <button className="btn2 btn-primary btn-sm me-2 rounded-pill shadow-sm">
              <i className="bi bi-arrow-repeat me-1"></i>
            </button>* */}

{/* -------------------- Pagination -------------------------------*/}
      <div className="d-flex justify-content-center mt-4">
  <nav>
    <ul className="pagination custom-pagination">
      {/* Précédent */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Précédent
        </button>
      </li>

      {/* Pages */}
      {Array.from({ length: totalPages }, (_, index) => (
        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        </li>
      ))}

      {/* Suivant */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </li>
    </ul>
  </nav>

  {/*--------------------------- Bouton Excel & pdf----------------------- */}
  <button style={{height:'40px',width:'25%',color:'#198754'}}  className="btn7 btn-success btn-sm me-2" onClick={exportToExcel}>
    <i className="bi bi-file-earmark-excel me-1"></i>
  </button>
  <button style={{height:'40px',width:'25%',color:'#af2d1f'}}  className="btn8 btn-danger btn-sm me-2" onClick={exportToPDF}>
    <i className="bi bi-file-earmark-pdf me-1"></i>
  </button> 
</div>
    </div>
  );
}



