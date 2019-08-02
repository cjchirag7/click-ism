import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import  Products  from './products.js';
import Auth from './auth.js';
import Bids from './bids.js';
import Users from './users.js';
import Favorites from './favorites.js';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const ConfigureStore = ()=>{
    const store=createStore(
        combineReducers({
            products: Products,
            auth: Auth,
            bids: Bids,
            users: Users,
            favorites: Favorites
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
}