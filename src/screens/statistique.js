import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticles } from '../actions/articlesAction';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend  } from 'recharts';
import { getAllMouvementsGraphique } from '../actions/mvmAction';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function Statistique() {
  const dispatch = useDispatch();
  const { articles, error, loading } = useSelector(state => state.articles);
  const { mouvements } = useSelector(state => state.mouvements);

  // État pour la référence de l'article
  const [reference, setReference] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [filteredMouvements, setFilteredMouvements] = useState([]);
  useEffect(() => {
    // Filtrer les mouvements par référence et date
    if (mouvements) {
      let filtered = mouvements;
  
      // Filtrer par référence d'article
      if (reference) {
        filtered = filtered.filter(m => m.referenceArticle === reference);
      }
  
      // Filtrer par date
      if (dateDebut && dateFin) {
        const startDate = new Date(dateDebut);
        const endDate = new Date(dateFin);
        filtered = filtered.filter(m => {
          const dateMvm = new Date(m.mvmDate);
          return dateMvm >= startDate && dateMvm <= endDate;
        });
      }
  
      setFilteredMouvements(filtered);
    }
  }, [mouvements, reference, dateDebut, dateFin]);
  const handleResetFilters = () => {
    setReference('');
    setDateDebut('');
    setDateFin('');
    setFilteredMouvements(mouvements);
  };  

  const totalEntree = filteredMouvements.reduce(
    (acc, m) => acc + (m.quantityEntree || 0),
    0
  );
  const totalSortie = filteredMouvements.reduce(
    (acc, m) => acc + (m.quantitySortie || 0),
    0
  );

  // Récupérer tous les articles
  useEffect(() => {
    dispatch(getAllMouvementsGraphique());
    dispatch(getAllArticles());
  }, [dispatch]);

  const handleSearch1 = () => {
    dispatch(getAllMouvementsGraphique(reference));
  };

  // Fonction pour filtrer l'article par référence
  const handleSearch = () => {
    const article = articles.find(article => article.reference === reference);
    setSelectedArticle(article);
  };

  // Si aucun article n'est sélectionné, afficher les statistiques de tous les articles
  const totalArticles = articles.length;
  const criticalArticles = articles.filter(article => article.is_critic === 1).length;
  const nonCriticalArticles = totalArticles - criticalArticles;
  const handleShowAllStats = () => {
    setSelectedArticle(null);
    setReference('');
  };

  const data = [
    { name: 'Les articles critiques', value: criticalArticles },
    { name: 'Les articles non critiques', value: nonCriticalArticles },
  ];

  const COLORS = ['#dc3545', '#183F7F'];
/*
  const mouvementsData = mouvements.reduce((acc, mouvement) => {
    const existing = acc.find(item => item.name === mouvement.referenceArticle);
    if (existing) {
      existing.Entree += mouvement.quantityEntree || 0;
      existing.Sortie += mouvement.quantitySortie || 0;
    } else {
      acc.push({
        name: mouvement.referenceArticle,
        Entree: mouvement.quantityEntree || 0,
        Sortie: mouvement.quantitySortie || 0,
      });
    }
    return acc;
  }, []);
*/

const totalMvm = totalEntree + totalSortie;
// Préparer les données pour les graphiques
const mouvementsData = reference
  ? mouvements
      .filter(mouvement => mouvement.referenceArticle === reference)
      .map(mouvement => ({
        name: mouvement.mvmDate.split('T')[0], // Utiliser la date comme clé
        Entree: mouvement.quantityEntree || 0,
        Sortie: mouvement.quantitySortie || 0,
      }))
  : mouvements.reduce((acc, mouvement) => {
      const existing = acc.find(item => item.name === mouvement.referenceArticle);
      if (existing) {
        existing.Entree += mouvement.quantityEntree || 0;
        existing.Sortie += mouvement.quantitySortie || 0;
      } else {
        acc.push({
          name: mouvement.referenceArticle,
          Entree: mouvement.quantityEntree || 0,
          Sortie: mouvement.quantitySortie || 0,
        });
      }
      return acc;
    }, []);

const globalData = [
  { name: 'Entrée', value: totalEntree },
  { name: 'Sortie', value: totalSortie },
];
const COLORS1 = ['#198754', '#dc3545'];


  return (
    <div className="justify-content-center mx-auto col-12 col-md-12 col-lg-12">
      <div className="col-12 col-md-12 mt-5 mb-5 headerhomescreen">
        <h2 className="mt-5">Statistiques</h2>
      </div>

      {/* Champ de recherche pour référence d'article */}
      <div className="w-50 search-bar d-flex col-md-12 mt-5 mb-3 gap-3">
       
        <input
          type="text"
          className="form-control  "
          placeholder="Entrez la référence de l'article"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <button  className="btn15 btn-primary mt-2 rounded" onClick={handleSearch}>
          Rechercher
        </button>
         {/* Bouton pour voir les statistiques de tous les articles */}
      <button className="btn15 btn-primary mt-2 rounded" onClick={handleShowAllStats}>
        Tous 
      </button>

      </div>

      {/* Affichage des statistiques pour tous les articles ou l'article sélectionné */}
      <div className="d-flex align-items-center mx-auto">
        <div style={{ marginLeft: '20px', height: '400px' }} className="col-5 col-xl-5 col-md-5 text-center mb-5 mt-2 shadow-lg p-3 mb-5 bg-white rounded">
          <PieChart width={500} height={400}>
            <Pie
              data={selectedArticle ? [
                { name: 'QtSecurity', value: selectedArticle.quantitySecurity},
                { name: 'QtSt', value: selectedArticle.quantitySt  }
               
              ] : data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div style={{ marginLeft: '20px', height: '400px' }} className="col-6 col-xl-6 col-md-6 text-center mb-5 mt-2 shadow-lg p-3 mb-5 bg-white rounded">
          {selectedArticle ? (
            <>
              <h2 className="mb-5 mt-3 shadow p-5 mb-5 bg-white rounded" style={{ fontFamily: 'poppins', fontWeight: '700' }}>
                Article : {selectedArticle.reference}
              </h2>
              <h1 className="fs-4 text-start" style={{ color: '#dc3545' }}>
                Critique : <span className="fw-bold"> {selectedArticle.is_critic === 1 ? 'Oui' : 'Non'} <hr /></span>
              </h1>
              <h1 className="fs-4 text-start" style={{ color: '#183F7F' }}>
                Quantité disponible : <span className="fw-bold"> {selectedArticle.quantitySt} <hr /></span>
              </h1>
              <h1 className="fs-4 text-start" style={{ color: '#183F7F' }}>
                Quantité de sécurité : <span className="fw-bold"> {selectedArticle.quantitySecurity} <hr /></span>
              </h1>
            </>
          ) : (
            <>
              <h2 className="mb-5 mt-3 shadow p-5 mb-5 bg-white rounded" style={{ fontFamily: 'poppins', fontWeight: '700' }}>
                Statistiques Générale
              </h2>
              <h1 className="fs-4 text-dark text-start pt-1">
                Nombre Total des articles : <span className="fw-bold"> {totalArticles} <hr /></span>
              </h1>
              <h1 className="fs-4 text-start" style={{ color: '#dc3545' }}>
                Nombre des articles critiques : <span className="fw-bold"> {criticalArticles} <hr /></span>
              </h1>
              <h1 className="fs-4 text-start" style={{ color: '#183F7F' }}>
                Nombre des articles non critiques : <span className="fw-bold"> {nonCriticalArticles} <hr /></span>
              </h1>
            </>
          )}
        </div>
      </div>
      <div className="container">
      <div className="col-12 col-md-12 mt-5 mb-5 headerhomescreen">
      <h2 className="mt-5">Mouvements des Articles</h2>
</div>
<div className="d-flex mt-4 mb-4 search-bar w-100">
  <input
    type="text"
    className="form-control"
    placeholder="Entrez la référence de l'article"
    value={reference}
    onChange={(e) => setReference(e.target.value)}
  />
  <button className="btn15 btn-primary ms-2 rounded" onClick={handleSearch1}>
    Rechercher
  </button>
  <button className="btn15 btn-secondary ms-2 rounded" onClick={handleResetFilters}>
    Réinitialiser
  </button>
</div>
<div className="d-flex gap-3 mb-4 search-bar">
  <input
    type="date"
    className="form-control"
    value={dateDebut}
    onChange={(e) => setDateDebut(e.target.value)}
  />
  <input
    type="date"
    className="form-control"
    value={dateFin}
    onChange={(e) => setDateFin(e.target.value)}
  />
</div>

      {/* Graphique des mouvements */}
   {/* Graphique global des entrées et sorties */}
   <div className="d-flex justify-content-center mt-4 mb-5">

   <div style={{ marginLeft: '20px', height: '400px' ,paddingTop:'50px'}} className="col-6 col-xl-6 col-md-6 text-center mb-5 mt-2 shadow-lg p-5 mb-5 bg-white rounded">
<div className='pt-5 mt-2 text-start'>
  <h2 style={{color:'#183F7F',fontSize:'40px'}}> L'article : {reference}</h2><hr></hr>
   {globalData.map((item, index) => (
    <h4
  
      key={index}
      style={{ color: item.name === 'Entrée' ? '#198754' : '#dc3545' }}
    >
      {`Total des ${item.name === 'Entrée' ? 'entrées' : 'sorties'}`} : <span className="fw-bold">{item.value}</span>
      <hr></hr></h4>
  ))}</div><h2 className='text-start' style={{fontSize:'30px'}}>Total mouvements : {totalMvm}</h2></div>
    {/* Recherche par date */}
  
        <PieChart width={500} height={400}>
          <Pie
            data={globalData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {globalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      
      </div>

  
    </div>    
    </div>
  );
}
