export const getAllMouvementsReducer = (state = { mouvements: [] , loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_MOUVEMENTS_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'GET_MOUVEMENTS_SUCCESS':
            return {
                ...state,
                loading: false,
                mouvements: action.payload,
                error: null
            };
        case 'GET_MOUVEMENTS_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload // Ensure the payload is now a serializable object
            };
        default:
            return state;
    }
};

export const creationMvmReducer = (state={},action)=>{

    switch(action.type){
        case 'PLACE_CREATEMVM_REQUEST': return{
            loading :true
        }
        case 'PLACE_CREATEMVM_SUCCESS': return{
            loading :false,
            success:true
        }
        case 'PLACE_CREATEMVM_FAILED': return{
            loading :false,
            error:action.payload
        }
        default : return state
    }
}


export const getRefMvmReducer = (state = { getRefMvm: [], loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_REFMVM_REQUEST':
            return {
                ...state,
                loading: true,
            };
            case 'GET_REFMVM_SUCCESS':
                console.log('Données reçues dans le reducer:', action.payload);  // Vérifier ici
                return {
                    ...state,
                    loading: false,
                    getRefmvm: action.payload,
                    error: null,
                };
        case 'GET_REFMVM_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


export const getQtStByRefReducer = (state = { qtstbyref: [], loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_QTSTBYREF_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'GET_QTSTBYREF_SUCCESS':
            return {
                ...state,
                loading: false,
                qtstbyref: action.payload,
                error: null,
            };
        case 'GET_QTSTBYREF_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const getAllMouvementsGraphiqueReducer = (state = { reference: [], loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_MOUVEMENTS_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'GET_MOUVEMENTS_SUCCESS':
            return {
                ...state,
                loading: false,
                reference: action.payload,
                error: null,
            };
        case 'GET_MOUVEMENTS_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


  const initialState3 = {
    mouvements: [],
    loading: false,
    error: null,
  };
  
  export const deleteMvmReducer = (state = initialState3, action) => {
    switch (action.type) {
      case 'DELETE_MOUVEMENT_REQUEST':
        return { ...state, loading: true };
      case 'DELETE_MOUVEMENT_SUCCESS':
        return {
          ...state,
          loading: false,
          mouvements: state.mouvements.filter((item) => item.idMvm !== action.payload),
        };
      case 'DELETE_MOUVEMENT_FAILED':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  //
  const initialState1 = {
    mouvements: [], // Make sure this matches the expected structure in your component
    loading: false,
    error: null
};

  export const updateMvmReducer = (state = initialState1, action) => {
    switch (action.type) {
      case 'UPDATE_ARTICLE_SUCCESS':
        return {
          ...state,
          loading: false,
          mouvements: state.mouvements.map((mouvement) =>
          mouvement.idMvm === action.payload.idMvm ? action.payload : mouvement
          ),
        };
      case 'SET_MOUVEMENTS':
        return {
          ...state,
            mouvements: action.payload,
        };
      // Autres cas...
      default:
        return state;
    }
  };
