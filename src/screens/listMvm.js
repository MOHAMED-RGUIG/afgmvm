import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMouvements ,updateMvm,deleteMvm} from '../actions/mvmAction';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ListMvm() {
  const dispatch = useDispatch();
  const { mouvements } = useSelector(state => state.mouvements);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // State for search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByTypeMvm, setSearchByTypeMvm] = useState(''); // For typeMvm search
  const [searchByNomUsr, setSearchByNomUsr] = useState('');
  // State for date range filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const mouvementsPerPage = 10;
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMvm, setSelectedMvm] = useState(null);

  // Fetch mouvements on component mount
  useEffect(() => {
    dispatch(getAllMouvements());
  }, [dispatch]);
  const exportToExcel = () => {
    // Préparation des données pour l'exportation
    const dataToExport = filteredmouvements.map((mouvement) => ({
      Date: new Date(mouvement.mvmDate).toLocaleDateString('fr-FR'),
      Heure: new Date(mouvement.mvmDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      Type: mouvement.typeMvm,
      Quantité: mouvement.quantityMvm,
      Référence: mouvement.referenceArticle,
      "N° Ordre": mouvement.nOrdre,
      quantityEntree:mouvement.quantityEntree,
      quantitySortie:mouvement.quantitySortie,
      Utilisateur: mouvement.NOMUSR,
    }));
  
    // Création de la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mouvements');
  
    // Téléchargement du fichier Excel
    XLSX.writeFile(workbook, 'mouvements.xlsx');
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
    doc.text('LISTE DES MOUVEMENTS',55, 62);
  
    // Préparation des données pour le tableau
    const tableColumn = ['Date', 'Heure', 'Type', 'Quantité', 'Référence', 'N° Ordre','Quantité Entree','Quantité Sortie', 'Utilisateur'];
    const tableRows = filteredmouvements.map((mouvement) => [
      new Date(mouvement.mvmDate).toLocaleDateString('fr-FR'),
      new Date(mouvement.mvmDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      mouvement.typeMvm,
      mouvement.quantityMvm,
      mouvement.referenceArticle,
      mouvement.nOrdre,
      mouvement.quantityEntree,
      mouvement.quantitySortie,
      mouvement.NOMUSR,
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
    doc.save('mouvements.pdf');
  }
  };

  // 🔍 Filter mouvements based on search query, date range, and typeMvm
  const filteredmouvements = mouvements.filter((mouvement) => {
    const mvmDate = new Date(mouvement.mvmDate);

    // Vérification de la plage de dates
    const isWithinDateRange = (!dateFrom || mvmDate >= new Date(dateFrom)) && (!dateTo || mvmDate <= new Date(dateTo));

    // Vérification des autres filtres
    const matchesSearchQuery =
      mouvement.referenceArticle?.toLowerCase().includes(searchQuery.toLowerCase()) ;
    const matcheNomUsr =   mouvement.NOMUSR?.toLowerCase().includes(searchByNomUsr.toLowerCase());

    // Vérification du filtre typeMvm
    const matchesTypeMvm = mouvement.typeMvm?.toLowerCase().includes(searchByTypeMvm.toLowerCase());

    return isWithinDateRange && matchesSearchQuery && matchesTypeMvm && matcheNomUsr;
  });

  // Pagination logic
  const indexOfLastmouvement = currentPage * mouvementsPerPage;
  const indexOfFirstmouvement = indexOfLastmouvement - mouvementsPerPage;
  const currentmouvements = filteredmouvements.slice(indexOfFirstmouvement, indexOfLastmouvement);

  // Calculate total pages
  const totalPages = Math.ceil(filteredmouvements.length / mouvementsPerPage);

  const handleEditClick = (mouvement) => {
    setSelectedMvm(mouvement);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMvm(null);
  };

    // Modifier l'article
    const handleUpdate = async () => {
      if (selectedMvm) {
        const updatedData = {
          typeMvm: selectedMvm.typeMvm,
          quantityMvm: selectedMvm.quantityMvm,
          nOrdre: selectedMvm.nOrdre,      
        };
    
        try {
          await dispatch(updateMvm(selectedMvm.idMvm, updatedData));
          dispatch(getAllMouvements()); // Récupération des articles à jour
          setShowPopup(false);
        } catch (error) {
          console.error('Erreur lors de la mise à jour :', error);
        }
      }
    };
    
    const handleDeleteClick = (mouvement) => {
      setSelectedMvm(mouvement);
      setShowPopup1(true);
    };
  //suppression
  const confirmDelete = async () => {
    if (selectedMvm) {
      try {
        await dispatch(deleteMvm(selectedMvm.idMvm));
        dispatch(getAllMouvements()); // Recharge les mouvements après suppression
        setShowPopup1(false);
        setSelectedMvm(null);
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };
    const handleClosePopup1 = () => {
      setShowPopup1(false);
      setSelectedMvm(null);
    };
  
  return (
    <div className="justify-content-center mx-auto">
      <div className="col-12 col-md-12 mt-5 mb-3 headerhomescreen">
        <h2 className="mt-5">Liste des mouvements</h2>
      </div>

      {/* Search Bar */}
      <div className="search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto">
        <input
          className="form-control text-center"
          type="search"
          placeholder="Rechercher réference"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
       <Link to="/creationMvm" className="mt-3 p-2 btn4 btn-warning btn-sm me-2 rounded-pill shadow-sm">
          <i className="bi bi-plus me-1 mt-5"></i>
        </Link>
      </div>

      {/* TypeMvm Search */}
      <div className="search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto">
        <input
          className="form-control text-center"
          type="search"
          placeholder="Rechercher par Type de Mvm"
          value={searchByTypeMvm}
          onChange={(e) => setSearchByTypeMvm(e.target.value)}
        />
      </div>

      {/* nomusr Search */}
      <div className="search-bar d-flex col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto">
        <input
          className="form-control text-center"
          type="search"
          placeholder="Rechercher par NOM USR"
          value={searchByNomUsr}
          onChange={(e) => setSearchByNomUsr(e.target.value)}
        />
      </div>
      {/* Date Range Filter */}
      <div className="d-flex justify-content-between col-10 col-xl-10 col-md-10 text-center mb-2 mx-auto">
        <div className='d-flex '>
          <label className='p-3'>Du: </label>
          <input
            type="date"
            className="form-control"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className='d-flex '>
          <label className='p-3'>Au:</label>
          <input
            type="date"
            className="form-control"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* mouvements Table */}
      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table table-bordered table-striped table-hover border rounded custom-table">
          <thead className="custom-thead table-dark">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Qt</th>
              <th>Référence</th>
              <th>n° Ordre</th>
              <th>Utilisateur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentmouvements.map((mouvement) => (
              <tr key={mouvement.idMvm}>
                <td>
                  {new Date(mouvement.mvmDate).toLocaleDateString('fr-FR')}{' '}
                  {new Date(mouvement.mvmDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>{mouvement.typeMvm}</td>
                <td>{mouvement.quantityMvm}</td>
                <td>{mouvement.referenceArticle}</td>
                <td>{mouvement.nOrdre}</td>
                <td>{mouvement.NOMUSR}</td>
                <td>
                  <button onClick={() => handleEditClick(mouvement)}  className="btn10 btn-warning btn-sm me-2 rounded-pill shadow-sm">
                    <i className="bi bi-pencil-fill me-1"></i>
                  </button>
                  {currentUser?.TYPUSR === 'admin' && (
                    <button className="btn11 btn-danger btn-sm rounded-pill shadow-sm"  onClick={() => handleDeleteClick(mouvement)}>
                      <i className="bi bi-trash-fill me-1"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup1 && selectedMvm && (
         <div className="popup-overlay">
         <div className="popup-content1">
           <h5>Confirmer la suppression</h5>
           <p>Voulez-vous vraiment supprimer cette mouvement pour "{selectedMvm.referenceArticle}" ?</p>
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
      {showPopup && selectedMvm && (
        <div className="popup-overlay">
          <div className="popup-content2">
            <div className='headerhomescreen'>      <h2 className='mt-4 mb-5 p-4 shadow-sm rounded'>Modifier le mouvement</h2></div>
      
        
            <div className="search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto">
  <label className="text-start">Type Mouvement</label>
  <select
    className="form-control text-center"
    value={selectedMvm.typeMvm}
    onChange={(e) =>
      setSelectedMvm({
        ...selectedMvm,
        typeMvm: e.target.value,
      })
    }
  >
    <option value="" disabled>Sélectionnez un type de mouvement</option>
    <option value="Entree">Entrée</option>
    <option value="Sortie">Sortie</option>
  </select>
</div>

            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>Qauntité du mouvement</label>
              <input  className="form-control text-center"
                type="number"
                value={selectedMvm.quantityMvm}
                onChange={(e) =>
                  setSelectedMvm({
                    ...selectedMvm,
                    quantityMvm: e.target.value,
                  })
                }
              />
            </div>          
            <div  className='search-bar col-10 col-xl-10 col-md-10 text-start mb-2 mx-auto'>
              <label className='text-start'>N°ordre</label>
              <input  className="form-control text-center"
                type="text"
                value={selectedMvm.nOrdre}
                onChange={(e) =>
                  setSelectedMvm({
                    ...selectedMvm,
                    nOrdre: e.target.value,
                  })
                }
              />
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
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination custom-pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Précédent
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Suivant
              </button>
            </li>
          </ul>
        </nav>
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
