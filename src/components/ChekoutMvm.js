import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { creationMvm } from '../actions/mvmAction.js';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import Error from '../components/Error';
import Success from '../components/Success';
import emailjs from 'emailjs-com';


function CheckoutMvm({  typeMvm,
    quantityMvm,referenceArticle,nOrdre}) {
    const creationMvmstate = useSelector(state => state.creationMvmReducer);
    const { loading, error, success } = creationMvmstate;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const dispatch = useDispatch();
    const navigate = useNavigate();


    function tokenHandler() {
        if (  typeMvm.trim() && quantityMvm.trim() && referenceArticle.trim() && 
        nOrdre.trim()) 
        {
        dispatch(creationMvm(  typeMvm,
            quantityMvm,referenceArticle,nOrdre));
        //localStorage.removeItem('cartItems');
        toast.success('Your order is added successfully!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false
        });
        //navigate('/homescreen');
          // Call handleCheckout from Cartscreen
          

    }else{
        toast.error('Oops ! Merci de remplir le formulaire !', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false
        })
    }}

    return (
        <div className='col-12 col-md-12 text-center justify-content-end' >
            {loading && (<Loading />)}
            {error && (<Error error='merci de tenter une autre fois' />)}
            {success && (<Success success='Votre inventaire été ajouté avec success' />)}
            <button className='btn5 col-11 col-md-11 mt-2 p-2'  onClick={tokenHandler}>AJOUTER</button>
        </div>
    );
}

export default CheckoutMvm;
