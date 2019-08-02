import * as ActionTypes from './ActionTypes';

const Products = (state = { isLoading: true,
    errMess: null,
    products:[]}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PRODUCTS:
            return {...state, isLoading: false, errMess: null, products: action.payload};

        case ActionTypes.PRODUCTS_LOADING:
            return {...state, isLoading: true, errMess: null, products: []}

        case ActionTypes.PRODUCTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        case ActionTypes.ADD_PRODUCT:
            var product = action.payload;
            return { ...state, products: state.products.concat(product)};

        case ActionTypes.EDIT_PRODUCT:
            var newproduct = action.payload;
            return { ...state, products: state.products.map((product)=>
                {
                if(product._id===newproduct._id)
                {
                    return newproduct;
                }
            else {
                    return product;
            }
                 })
                }

        case ActionTypes.DELETE_PRODUCT:
        var resp = action.payload;
        return { ...state, products: state.products.filter((product)=>{
            return product._id!==resp._id}) }

        default:
            return state;
    }
};
export default Products;