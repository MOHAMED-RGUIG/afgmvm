export const getAllArticlesReducer = (state = { articles: [] , loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_ARTICLES_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'GET_ARTICLES_SUCCESS':
            return {
                ...state,
                loading: false,
                articles: action.payload,
                error: null
            };
        case 'GET_ARTICLES_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload // Ensure the payload is now a serializable object
            };
        default:
            return state;
    }
};
const initialState = {
    imgProducts: [], // Make sure this matches the expected structure in your component
    loading: false,
    error: null
};

export const getAllImgProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_IMGPRODUCTS_REQUEST':
            return { ...state, loading: true };
        case 'GET_IMGPRODUCTS_SUCCESS':
            return { ...state, loading: false, imgProducts: action.payload };
        case 'GET_IMGPRODUCTS_FAILED':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
const initialState1 = {
    articles: [], // Make sure this matches the expected structure in your component
    loading: false,
    error: null
};

  export const updateArticleReducer = (state = initialState1, action) => {
    switch (action.type) {
      case 'UPDATE_ARTICLE_SUCCESS':
        return {
          ...state,
          loading: false,
          articles: state.articles.map((article) =>
            article.idArticle === action.payload.idArticle ? action.payload : article
          ),
        };
      case 'SET_ARTICLES':
        return {
          ...state,
          articles: action.payload,
        };
      // Autres cas...
      default:
        return state;
    }
  };

  // reducers/itemReducer.js
const initialState3 = {
    articles: [],
    loading: false,
    error: null,
  };
  
  export const deleteArticleReducer = (state = initialState3, action) => {
    switch (action.type) {
      case 'DELETE_ARTICLE_REQUEST':
        return { ...state, loading: true };
      case 'DELETE_ARTICLE_SUCCESS':
        return {
          ...state,
          loading: false,
          articles: state.articles.filter((item) => item.idArticle !== action.payload),
        };
      case 'DELETE_ARTICLE_FAILED':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  