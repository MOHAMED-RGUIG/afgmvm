import axios from 'axios';
export const creationMvm = ( typeMvm,
    quantityMvm,referenceArticle,nOrdre) => async (dispatch, getState) => {
    dispatch({ type: 'PLACE_CREATEMVM_REQUEST' });
    const currentUser = getState().loginUserReducer.currentUser;
    try {
        const response = await axios.post('https://afgmvmapi.onrender.com/api/mvm/creationMvm', {  typeMvm,
        quantityMvm,referenceArticle,nOrdre,currentUser});
        console.log(currentUser);
        console.log(response);
        dispatch({ type: 'PLACE_CREATEMVM_SUCCESS' });
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Network error';
        dispatch({ type: 'PLACE_CREATEMVM_FAILED', payload: errorMessage });
    }
};


export const getRefMvm= () => async (dispatch) => {
    dispatch({ type: 'GET_REFMVM_REQUEST' });

    try {
        const response = await axios.get(`https://afgmvmapi.onrender.com/api/mvm/getRefMvm`, {
           
        });
        dispatch({ type: 'GET_REFMVM_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({
            type: 'GET_REFMVM_FAILED',
            payload: { message: error.message, code: error.code },
        });
    }
};

export const getQtStByRef = (reference) => async (dispatch) => {
    dispatch({ type: 'GET_QTSTBYREF_REQUEST' });

    try {
        const response = await axios.get(`https://afgmvmapi.onrender.com/api/mvm/qtstbyref`, {
            params: { reference }, // Passer la référence comme paramètre
        });
        dispatch({ type: 'GET_QTSTBYREF_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({
            type: 'GET_QTSTBYREF_FAILED',
            payload: { message: error.message, code: error.code },
        });
    }
};
//////
export const getAllMouvements = () => async dispatch => {
    dispatch({ type: 'GET_MOUVEMENTS_REQUEST' });

    try {
        const response = await axios.get(`https://afgmvmapi.onrender.com/api/mvm/getallmouvements`);
        dispatch({ type: 'GET_MOUVEMENTS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_MOUVEMENTS_FAILED', payload: error.message });
    }
};

export const getAllMouvementsGraphique = (reference = '') => async dispatch => {
  dispatch({ type: 'GET_MOUVEMENTS_REQUEST' });

  try {
      const response = await axios.get(`https://afgmvmapi.onrender.com/api/mvm/getallmouvementsgraphique`, {
          params: { reference }, // Passer la référence comme paramètre
      });
      dispatch({ type: 'GET_MOUVEMENTS_SUCCESS', payload: response.data });
  } catch (error) {
      dispatch({ type: 'GET_MOUVEMENTS_FAILED', payload: error.message });
  }
};


export const updateMvm = (idMvm, updatedData) => async (dispatch, getState) => {
    dispatch({ type: 'UPDATE_MOUVEMENT_REQUEST' });
    try {
      const response = await axios.put(
        `https://afgmvmapi.onrender.com/api/mvm/updatemouvements/${idMvm}`,
        updatedData
      );
  
      // Ajout des nouvelles données à l'état Redux
      const updatedMvm = response.data;
  
      dispatch({
        type: 'UPDATE_MOUVEMENT_SUCCESS',
        payload: updatedMvm,
      });
  
      // Optionnel : mettre à jour la liste des articles dans le store
      const { mouvements } = getState();
      const updatedMouvements = mouvements.map((mouvement) =>
        mouvement.idMvm === idMvm ? updatedMouvements : mouvement
      );
  
      dispatch({
        type: 'SET_MOUVEMENTS',
        payload: updatedMouvements,
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_MOUVEMENT_FAILED', payload: error.message });
    }
  };
  
export const deleteMvm = (idMvm) => async (dispatch) => {
    try {
      dispatch({ type: 'DELETE_MOUVEMENT_REQUEST' });
      await axios.delete(`https://afgmvmapi.onrender.com/api/mvm/deletemouvement/${idMvm}`);
      dispatch({ type: 'DELETE_MOUVEMENT_SUCCESS', payload: idMvm });
    } catch (error) {
      dispatch({
        type: 'DELETE_MOUVEMENT_FAILED',
        payload: error.response?.data?.message || error.message,
      });
    }
  };
