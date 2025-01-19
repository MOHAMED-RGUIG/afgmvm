import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { toast } from 'react-toastify';
import { FaEdit ,FaFilePdf} from 'react-icons/fa';
export default function Product({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  function addtocart() {
    const selectedQuantity = parseInt(quantity, 10) || 1;
    dispatch(addToCart(product, selectedQuantity, isChecked));
    toast.success('Le produit est ajouté à la carte!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false
    });
  }
  const [imageSrc, setImageSrc] = useState('./greenheart.png');
  const [Btnstyle, setBtnstyle] = useState('category-btn2');
  const [BtnText, setBtnText] = useState('Exporter');
  const handleClick = () => {
    setImageSrc(prevSrc => prevSrc === './greenheart.png' ? './heart1.png' : './greenheart.png');
    setBtnstyle (prevSrc => prevSrc === 'category-btn2' ? 'category-btn3' : 'category-btn3');
    setBtnText (prevSrc => prevSrc === 'Ajouter' ? 'Ajoutée' : 'Ajoutée');

    addtocart();
  };

const handleCheckboxChange = () => {
  setIsChecked(!isChecked);
};
  //const calculatedPrice = isChecked ? 0 : product.PRI_0 * quantity;
 // const isMachineCategory = ['MACHINES','MACHINE A MODO MIO','FONTAINE','MACHINE BOUTIQUE','GUZZINI','MACHINE ESPRESSO','MACHINE FIRMA','MOULIN','FONTAINE'].includes(product.Designation_Famille_Stat1);
   // const isPub = ['ART. PUBLICITE'].includes(product.Designation_Famille_Stat1)

  return (
   <div className='mt-1 col-12 col-md-12 cart-product'>         
    <div style={{ backgroundColor: '#f3f3f3', borderTop: '0px solid #ffffff', width:'100%', padding:'0px !important' }} className='shop-card bg-body d-flex align-items-center'>
      {/*        <img src={product.Image} alt='product' className='img' style={{ height: '70px', width: '50px', overflow:'hidden', backgroundColor:'#f3f3f3 !important' }} />
 */}
      <div style={{ width: '20%' }} onClick={handleShow}>
      </div>
  
      <div className="product-tag1 d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
        <div >        <h3 className='pt-2 text-start block' style={{ fontSize:'12px', width:'100px' }}>{product.Date}</h3>
</div>
<div className="flex" >        <h3 className='pt-2 text-start flex' style={{ fontSize:'12px', width:'100px' }}>{product.Reference}</h3>
<h3 className='pt-2 text-start flex mx-auto' style={{ fontSize:'12px', width:'100px' }}>{product.Status}</h3>

</div>
       
        
<div className='flex'>   
       <h3 className='pt-2 text-start block mx-auto' style={{ fontSize:'12px', width:'100px' }}>{product.Status}</h3>
        
<div className='flex'> 
<button 
      alt="Edit" 
      style={{ height: '1px', background:'white',color:'black',display: 'flex',cursor: 'pointer',alignItems: 'center', justifyContent: 'center',width:'5px' }} 
      onClick={handleClick} 
      className={`${Btnstyle}`}>
      <FaEdit size={8} /> {/* Taille de l'icône */}
    </button>

    {/* Bouton avec icône et texte */}
    <button 
      alt="Edit" 
      style={{ height: '1px', background:'white',color:'black',cursor: 'pointer',display: 'flex', alignItems: 'center', justifyContent: 'center',width:'5px' }} 
      onClick={handleClick} 
      className={`${Btnstyle}`}>
      <FaFilePdf size={8} /> {/* Icone + espacement */}
    </button> 

    </div>
        </div>
  
     
      
      </div> 
  
    </div>    
  </div>
  
  );
}
