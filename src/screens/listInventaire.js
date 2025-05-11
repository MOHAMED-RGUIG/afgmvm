import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteFromCart } from '../actions/cartActions';
import Checkout from '../components/Checkout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QrScanner from "react-qr-scanner";
import axios from "axios";

function ListInventaire() {

   const [typeMachine,settypeMachine] =useState('');
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

    const cartstate = useSelector(state => state.cartReducer);
    const cartItems = cartstate.cartItems;
  
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const getDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Mois (0-11) +1 et avec zéro initial
        const day = String(today.getDate()).padStart(2, '0'); // Jour avec zéro initial
        return `${year}-${month}-${day}`; // Format YYYY-MM-DD
      };
    
      const DATEINV = getDate();
   
    const [title, settitle] = useState('');
    const [quantitySt, setquantitySt] = useState('');
    const [unit, setunit] = useState('');
    const [categorie, setcategorie] = useState('');
    const [location, setlocation] = useState('');
    const [dispositionA, setdispositionA] = useState('');
    const [dispositionB, setdispositionB] = useState('');
    const [quantitySecurity, setquantitySecurity] = useState('');
    const [articleType, setarticleType] = useState('');
    const [nOrdre, setnOrdre] = useState('');
    

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const dispatch = useDispatch();
/*
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            // Remplacez par l'URL de votre backend pour uploader l'image
            const response = await axios.post("https://afgmvmapi.onrender.com/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImagePath(response.data.path); // Le chemin renvoyé par le serveur
            setImage(file.name); // Nom de l'image pour l'affichage
        } catch (error) {
            console.error("Erreur lors de l'upload de l'image :", error);
        }
    };*/
const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setImagePath(response.data.path); // Lien Cloudinary
        setImage(response.data.path);     // pour l'afficher immédiatement

    } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
    }
};



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };


  const handleError = (error) => {
    console.error("Erreur du QR code : ", error);
  };


    const generateOrderPDF = (orderGroup) => {
         // Add Poppins font to jsPDF
  

        const doc = new jsPDF();
        const logoImg = new Image();
        logoImg.src = '../logo.jpg'; // Ensure the path is correct
    
        // Calculate total price and quantity
        const totalQuantity = orderGroup.items.reduce((total, item) => total + item.QTY, 0);
        const totalP = orderGroup.items.reduce((total, item) => total + item.NETPRI, 0);
        const totalPrice = orderGroup.items.reduce((total, item) => total + item.TOTLIN, 0);
    
        logoImg.onload = () => {
            doc.addImage(logoImg, 'JPG', 25, 15, 30, 20); // x, y, width, height
            doc.setFontSize(15);
            doc.setFont("poppins", "bold");
            doc.setTextColor('#003f7e');
            doc.text(`TOP CLASS ESPRESSO`, 120, 20);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
        
            doc.text(`E :` + currentUser.EMAILUSR, 120, 35);
            doc.text(`P:   ` + currentUser.TELEP, 120, 40);
            doc.text(`DETAIL COMMANDE`, 15, 55);
    
            const columns = ["", ""];
            const rows = [
                ["Chargé de compte :", currentUser.NOMUSR],
                ["Date :", orderGroup.orderInfo.ORDDAT],
                ["Client Code :", orderGroup.orderInfo.BPCORD],
                ["Raisons Social :", orderGroup.orderInfo.BPCNAME]
            ];
    
            doc.autoTable({
                startY: 60,
                head: [columns],
                body: rows,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 100 }
                }
            });
            doc.setFontSize(25); // Set font size
            doc.setFont("helvetica", "bold"); // Set font to Helvetica and make it bold
            doc.setTextColor('#003f7e'); // Set text color to blue (RGB format)
            doc.text(`BON DE COMMANDE`, 65, 110);
    
            const tableColumns = ['Référence','Désignation','Quantité', 'Prix unitaire','Total HT'];
            const tableRows = orderGroup.items.map(item => [item.ITMREF,item.ITMDES, item.QTY, item.GRAT == 1 ? 'Gratuit' : `${item.NETPRI.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,`${item.TOTLIN.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]);
    
            doc.autoTable({
                startY: 120,
                head: [tableColumns],
                styles: { cellPadding: 1, fontSize: 10 },
                body: tableRows,
                foot: [[ '','', '',  `Total HT`, `${totalPrice.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`]],
                headStyles: { fillColor: '#063970' },  // Light grey background
                footStyles: { fillColor: '#063970' },
                didDrawPage: function (data) {
                    // Calculate the position for the custom text
                    let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                    let textY = data.cutitleor.y + 35; // Add 10 units below the table
                    let textX = data.settings.margin.left + 30;
                    // Add custom text after the table foot
                    doc.setFontSize(15); 
                    doc.setFont("helvetica", "bold"); // Set font to Helvetica and make it bold
                    doc.setTextColor('#000000'); // Set text color to blue (RGB format)
                    doc.text("VISA", textX, textY);
                }
            });
    
            // Save the PDF as a base64 string
            const pdfData = doc.output('datauristring').split(',')[1];
            const uniqueId = new Date().toISOString();
            // Send the PDF to the server
            fetch('https://topclassapi2.onrender.com/send-email', {
                method: 'POST',
                headetitle: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email:['rguigmed107@gmail.com', 'mohamedrguig26@gmail.com', currentUser.EMAILUSR], // Replace with recipient email
                    subject: `Nouvelle commande ${uniqueId}`,
                    text: `Vous avez une nouvelle commande .Pour plus d'information merci d'ouvrir le pdf ci-dessous.`,
                    pdfData: pdfData,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            doc.save(`order_${orderGroup.orderInfo.ORDDAT}.pdf`);
            alert('Your order PDF is exported and sent via email!');
        };
    };
    
    
    return (
        <div className='justify-content-center mx-auto'>
      
            <div className="col-12 col-md-12 mt-5 mb-3 headerhomescreen">
            <h2 className='mt-5'>Création Article</h2></div>

            <div className='col-md-10 text-center col-10 mx-auto bg-white cart-client-infos'>
                
                <form>
                  
                <div className="text-start w-100 col-xl-10 col-10 col-md-10 pb-2 mx-auto">
                <input
                        required
                        type='text'
                        placeholder='nom article'
                        className='form-control col-xl-10 col-8 col-md-8 mx-auto'
                        value={title}
                        onChange={(e) => { settitle(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    /> 
                         <input
                        required
                        type='text'
                        placeholder='Quantité article'
                        className='form-control col-xl-10 col-8 col-md-8 mx-auto'
                        value={quantitySt}
                        onChange={(e) => { setquantitySt(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    /> 
                             <select
                        required
                        id="Selectionner unit"
                        className='form-control mt-2 mx-auto'
                        value={unit}
                        onChange={(e) => { setunit(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>Choisissez l'unit</option>
                        {units.map((unit, index) => (
                <option key={index} value={unit}>
                    {unit}
                </option>
            ))}
                    </select>
                    <select
                        required
                        id="Selectionner catégorie"
                        className='form-control mt-2 mx-auto'
                        value={categorie}
                        onChange={(e) => { setcategorie(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>Choisissez la catégorie</option>
                        <option value="categorie 1">categorie 1</option>
                        <option value="categorie 2">categorie 2</option>
                        <option value="categorie 3">categorie 3</option>
                    </select>
                    <select
            required
            id="Selectionner emplacement"
            className="form-control mt-2 mx-auto"
            value={location}
            onChange={(e) => setlocation(e.target.value)}
            style={{ width: '90%', fontSize: '13px' }}
        >
            <option value="" disabled>Choisissez l'emplacement</option>
            {locations.map((loc, index) => (
                <option key={index} value={loc}>
                    {loc}
                </option>
            ))}
        </select>
   

                    {/*reference générer à partir du id et la location */}

                    {/*is_critic => if qtstock =< qtsecurity so is_critic = true*/}

                    <input
                        required
                        type='text'
                        placeholder='Quantité sécurity'
                        className='form-control col-xl-10 col-8 col-md-8 mx-auto'
                        value={quantitySecurity}
                        onChange={(e) => { setquantitySecurity(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    />

                                        <select
                        required
                        id="Selectionner Disposition A"
                        className='form-control mt-2 mx-auto'
                        value={dispositionA}
                        onChange={(e) => { setdispositionA(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>Choisissez la disposition A</option>
                        {dispositionAs.map((dispositiona, index) => (
                <option key={index} value={dispositiona}>
                    {dispositiona}
                </option>
            ))}
                    </select> 

                    <select
                        required
                        id="Selectionner Disposition A"
                        className='form-control mt-2 mx-auto'
                        value={dispositionB}
                        onChange={(e) => { setdispositionB(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>Choisissez la disposition B</option>
                        {dispositionBs.map((dispositionb, index) => (
                <option key={index} value={dispositionb}>
                    {dispositionb}
                </option>
            ))}
                    </select> 
                    
                    <select
                        required
                        id="Selectionner TypeArticle"
                        className='form-control mt-2 mx-auto'
                        value={articleType}
                        onChange={(e) => { setarticleType(e.target.value) }}
                        style={{ width: '90%', fontSize: '13px' }}
                    >
                        <option value="" disabled>Choisissez le type article</option>
                        {articleTypes.map((articleType, index) => (
                <option key={index} value={articleType}>
                    {articleType}
                </option>
            ))}
                    </select> 

                    <select
    required
    id="Selectionner Type Machine"
    className="form-control mt-2 mx-auto"
    value={typeMachine}
    onChange={(e) => settypeMachine(e.target.value)}
    style={{ width: '90%', fontSize: '13px' }}
>
    <option value="" disabled>Choisissez le type de machine</option>
    {typeMAchines.map((typ, index) => (
        <option key={index} value={typ.code}>
            {typ.label} - {typ.code}
        </option>
    ))}
</select>

<input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control col-xl-10 col-8 col-md-8 mx-auto"
                style={{ width: "90%", fontSize: "13px" }}
            />

            

             
            
                </div></form>
            </div>

            <footer className="menubar-area fot footer-fixed mt-2 cart-footer" style={{ backgroundColor: 'rgb(255,255,255)' }}>
                <div className='flex-container col-12'>
                  
                    <div className="menubar-nav d-flex justify-content-end col-10 mx-auto">
                        <Checkout title={title}  quantitySt={quantitySt} unit={unit}
                         categorie={categorie} location={location}  quantitySecurity={quantitySecurity} 
                         dispositionA={dispositionA} dispositionB={dispositionB} articleType={articleType} 
                         typeMachine={typeMachine} imagePath={imagePath}   />
                    </div>
                </div>
            </footer>  

        </div>
    );
}

export default ListInventaire;

    {/*
    const handleCheckout = () => {
    const titleInput = document.querySelector('input[placeholder="Libelé inventaire"]');
    const REFINVnput = document.querySelector('input[placeholder="Reference inventaire"]');
    const DATEINVInput = document.querySelector('input[type="date"]');
    // Check if any of the fields are empty
  
    const istitleValid = titleInput.value.trim() !== '';
    const isREFINVValid = REFINVnput.value.trim() !== '';
    const isDATEINVValid = DATEINVInput.value.trim() !== '';

    if(istitleValid){
        console.log('tru');
    }
    if ( istitleValid && isREFINVValid && isDATEINVValid) {
            // Proceed with your checkout logic
            // ...
        
              // Perform checkout logic
        const orderGroup = {
            items: cartItems.map(item => ({
                QTY: item.quantity,
                NETPRI: item.PRI_0,
                TOTLIN: item.price ,
                ITMDES: item.ITMDES1_0,
                ITMREF :item.ITMREF_0,
                GRAT: item.isChecked ? 1 : 0 // Assuming isChecked indicates if the item is free
            })),
            orderInfo: {
                ORDDAT: DATEINV,
                BPCORD: REFINV,
                BPCNAME:title
            }
        };
        generateOrderPDF(orderGroup);
        } else
               // Show an alert and focus on the fititlet empty field
         {
            alert('Please enter the "Raison Social".');
            console.log('Please enter')
        }
        
    
    };*/}
