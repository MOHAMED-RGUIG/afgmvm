import axios from 'axios';
export const getAllMouvements = () => async dispatch => {
    dispatch({ type: 'GET_MOUVEMENTS_REQUEST' });

    try {
        const response = await axios.get(`https://afgmvmapi.onrender.com/api/mvm/getallmouvements`, {
           
        });
        dispatch({ type: 'GET_MOUVEMENTS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_MOUVEMENTS_FAILED', payload: error.message });
    }
};
