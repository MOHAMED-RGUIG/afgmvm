import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listInventaire } from '../actions/listInventaireActions';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import Error from '../components/Error';
import Success from '../components/Success';
import emailjs from 'emailjs-com';


function Checkout({     title,quantitySt,unit,
    categorie,location,quantitySecurity,dispositionA,dispositionB,articleType,typeMachine,imagePath}) {
    const listInventairestate = useSelector(state => state.listInventaireReducer);
    const { loading, error, success } = listInventairestate;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const dispatch = useDispatch();
    const navigate = useNavigate();


    function tokenHandler() {
        
        dispatch(listInventaire( title,quantitySt,unit,
            categorie,location,quantitySecurity,dispositionA,dispositionB,articleType,typeMachine,imagePath,currentUser));
        //localStorage.removeItem('cartItems');
        toast.success('Your order is added successfully!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false
        });
        //navigate('/homescreen');
          // Call handleCheckout from Cartscreen
          

    
    }

    return (
        <div className='col-12 col-md-12 text-center justify-content-end' >
            {loading && (<Loading />)}
            {error && (<Error error='merci de tenter une autre fois' />)}
            {success && (<Success success='Votre inventaire été ajouté avec success' />)}
            <button className='btn5 col-11 col-md-11 mt-2 p-2'  onClick={tokenHandler}>AJOUTER</button>
        </div>
    );
}

export default Checkout;
