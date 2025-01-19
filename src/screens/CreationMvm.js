import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { getQtStByRef, getRefMvm } from '../actions/mvmAction';
import { BarcodeScanner } from 'react-qr-barcode-scanner'; 
import CheckoutMvm from '../components/ChekoutMvm';

function CreationMvm() {
    const [reference, setReference] = useState('');
    const [TypeMvm, setTypeMvm] = useState('');
    const [quantityMvm, setQuantityMvm] = useState('');
    const [nOrdreMvm, setNOrdreMvm] = useState('');

    const dispatch = useDispatch();
    const getRefMvmState = useSelector((state) => state.getRefMvmReducer);
    const { getRefmvm } = getRefMvmState;

    const getQtStByRefState = useSelector((state) => state.getQtStByRefReducer);
    const { qtstbyref, error, loading } = getQtStByRefState;

    // Charger les références d'articles
    useEffect(() => {
        dispatch(getRefMvm());
    }, [dispatch]);

    // Charger les quantités de stock lorsque la référence change
    useEffect(() => {
        if (reference) {
            dispatch(getQtStByRef(reference));
        }
    }, [reference, dispatch]);

    // Transformer les options pour `react-select`
    const options = getRefmvm?.map((item) => ({
        value: item.reference,
        label: `${item.reference}`,
    }));
    const handleBarcodeScan = (result) => {
        if (result) {
            const scannedReference = result.text; // Prendre le texte scanné (référence)
            setReference(scannedReference); // Mettre à jour la référence avec le code-barres scanné
        }
    }; 

    return (
        <div className="justify-content-center mx-auto">
           <div className="col-12 col-md-12 mt-5 mb-3 headerhomescreen">
        <h2 className="mt-5">Création mouvement</h2>
      </div>

            <div className="col-md-10 text-center col-10 mx-auto bg-white cart-client-infos">
               
                <form>
                    {/* Champ de recherche et sélection */}
                    <Select
                    options={options || []} // Assure que `options` est toujours un tableau
                    placeholder="Rechercher et sélectionner une référence..."
                    value={options?.find((option) => option.value === reference) || null}
                    onChange={(selectedOption) => setReference(selectedOption?.value || '')}
                    isSearchable
                    className="form-control mt-2 mx-auto"
                    styles={{
                        control: (base) => ({
                            ...base,
                            border: 'none',
                            boxShadow: 'none',
                            backgroundColor: '#eef3ff',
                            width: '100%',
                            fontSize: '13px',
                        }),
                        indicatorSeparator: () => ({
                            display: 'none',
                        }),
                    }}
                />

                {/* Affichage de la quantité en stock */}
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p>Erreur de récupération des données</p>
                ) : reference && qtstbyref && qtstbyref.length > 0 ? (
                    <div
                        className="flex items-center justify-center qtst"
                        style={{
                            height: '60px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <h5 style={{ marginRight: '1rem', fontWeight: 'bold' }}>Qt stock:</h5>
                        <ul
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            {qtstbyref.map((item, index) => (
                                <li key={index} style={{ fontSize: '1.2rem' }}>
                                    {item.quantitySt}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Aucune donnée disponible</p>
                )}

                    {loading && <p>Chargement...</p>}
                    {error && <p className="text-danger">Erreur : {error.message}</p>}

                    {/* Sélectionner le type de mouvement */}
                    <select
                        required
                        id="Selectionner Type mouvement"
                        className="form-control mt-2 mx-auto"
                        value={TypeMvm}
                        onChange={(e) => setTypeMvm(e.target.value)}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>
                            Choisissez le type du mouvement
                        </option>
                        <option value="Entree">Entrée</option>
                        <option value="Sortie">Sortie</option>
                    </select>

                    <div className="text-start w-100 col-xl-10 col-10 col-md-10 pb-2 mx-auto">
                        {/* Quantité de mouvement */}
                        <input
                            required
                            type="number"
                            placeholder="Quantité mouvement"
                            className="form-control col-xl-10 col-8 col-md-8 mx-auto"
                            value={quantityMvm}
                            onChange={(e) => setQuantityMvm(e.target.value)}
                            style={{ width: '90%', fontSize: '13px' }}
                        />

                        {/* Numéro d'ordre */}
                        <input
                            required
                            type="text"
                            placeholder="N°ordre"
                            className="form-control col-xl-10 col-8 col-md-8 mx-auto"
                            value={nOrdreMvm}
                            onChange={(e) => setNOrdreMvm(e.target.value)}
                            style={{ width: '90%', fontSize: '13px' }}
                        />
                    </div>
                </form>
            </div>

            <footer
                className="menubar-area fot footer-fixed mt-2 cart-footer"
                style={{ backgroundColor: 'rgb(255,255,255)' }}
            >
                <div className="flex-container col-12">
                    <div className="menubar-nav d-flex justify-content-end col-10 mx-auto">
                        <CheckoutMvm typeMvm={TypeMvm}
    quantityMvm={quantityMvm} referenceArticle={reference} nOrdre={nOrdreMvm} />
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CreationMvm;
