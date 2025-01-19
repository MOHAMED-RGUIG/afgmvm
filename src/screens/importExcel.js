import React, { useState } from 'react';
import axios from 'axios';

function ImportExcel() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Veuillez sélectionner un fichier Excel');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://afgmvmapi.onrender.com/api/excel/import-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Échec de l\'importation du fichier Excel');
        }
    };

    return (
        <div className="import-excel">
             <h2 className="pt-5">Importer des articles (fichier Excel)</h2>
             <form onSubmit={handleSubmit1} className='pt-4 col-4 col-xl-4 mx-auto'>
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                <button className='btn5 w-50 col-3 col-xl-3 mt-3' type="submit">Importer</button>
            </form>
        </div>
    );
}

export default ImportExcel;
