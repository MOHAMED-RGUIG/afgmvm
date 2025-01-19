import axios from 'axios';
import Papa from 'papaparse';

//
export const getAllArticles = () => async dispatch => {
    dispatch({ type: 'GET_ARTICLES_REQUEST' });

    try {
        const response = await axios.get(`https://afgmvmapi.onrender.com/api/articles/getallarticles`, {
           
        });
        dispatch({ type: 'GET_ARTICLES_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_ARTICLES_FAILED', payload: error.message });
    }
};

export const updateArticle = (idArticle, updatedData) => async (dispatch, getState) => {
    dispatch({ type: 'UPDATE_ARTICLE_REQUEST' });
    try {
      const response = await axios.put(
        `https://afgmvmapi.onrender.com/api/articles/updatearticles/${idArticle}`,
        updatedData
      );
  
      // Ajout des nouvelles données à l'état Redux
      const updatedArticle = response.data;
  
      dispatch({
        type: 'UPDATE_ARTICLE_SUCCESS',
        payload: updatedArticle,
      });
  
      // Optionnel : mettre à jour la liste des articles dans le store
      const { articles } = getState();
      const updatedArticles = articles.map((article) =>
        article.idArticle === idArticle ? updatedArticle : article
      );
  
      dispatch({
        type: 'SET_ARTICLES',
        payload: updatedArticles,
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_ARTICLE_FAILED', payload: error.message });
    }
  };
  

export const getAllImgProducts = () => async dispatch => {
    dispatch({ type: 'GET_IMGPRODUCTS_REQUEST' });

    try {
        const response = await axios.get('../product_2024-06-03_164500.csv'); // Update with your CSV file path
        const parsedData = Papa.parse(response.data, {
            header: true,
            skipEmptyLines: true,
        });
        dispatch({ type: 'GET_IMGPRODUCTS_SUCCESS', payload: parsedData.data });
    } catch (error) {
        dispatch({ type: 'GET_IMGPRODUCTS_FAILED', payload: error.message });
    }
};



export const deleteArticle = (idArticle) => async (dispatch) => {
  try {
    dispatch({ type: 'DELETE_ARTICLE_REQUEST' });
    await axios.delete(`https://afgmvmapi.onrender.com/api/articles/deletearticle/${idArticle}`);
    dispatch({ type: 'DELETE_ARTICLE_SUCCESS', payload: idArticle });
  } catch (error) {
    dispatch({
      type: 'DELETE_ARTICLE_FAILED',
      payload: error.response?.data?.message || error.message,
    });
  }
};

