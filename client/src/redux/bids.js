import * as ActionTypes from './ActionTypes';

const Bids = (state = { isLoading: true,
    errMess: null,
    bids:[]}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_BIDS:
            return {...state, isLoading: false, errMess: null, bids: action.payload};

        case ActionTypes.BIDS_LOADING:
            return {...state, isLoading: true, errMess: null, bids: []}

        case ActionTypes.BIDS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        case ActionTypes.ADD_BID:
            var bid = action.payload;
            return { ...state, bids: state.bids.concat(bid)};

        case ActionTypes.FREEZE_BID:
            var newbid = action.payload;
            return { ...state, bids: state.bids.map((bid)=>
                {
                if(bid._id===newbid._id)
                {
                    return newbid;
                }
            else {
                    return bid;
            }
                 })
                }

        default:
            return state;
    }
};
export default Bids;