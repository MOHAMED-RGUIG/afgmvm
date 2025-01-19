import React, { useState } from 'react';
import axios from 'axios';

function Importcsv() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://afgmvmapi.onrender.com/api/csv/importcsv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to import CSV');
        }
    };

    return (
        <div>
           <h2 className="pt-5">Import des articles (fichier CSV)</h2>
            <form onSubmit={handleSubmit1} className='pt-4 col-4 col-xl-4 mx-auto'>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button className='btn5 w-50 col-3 col-xl-3 mt-3' type="submit">Import</button>
            </form>
        </div>
    );
}

export default Importcsv;
