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