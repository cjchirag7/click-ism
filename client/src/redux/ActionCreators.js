import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../baseUrl'

export const addProduct = (product) => ({
  type: ActionTypes.ADD_PRODUCT,
  payload: product
});

export const postProduct = (name, cat, description, price, bid, max_bid, incr, images) => (dispatch) => {
  let newProduct = new FormData();
  newProduct.append('name', name);
  newProduct.append('cat', cat);
  newProduct.append('price', price);
  newProduct.append('bid', bid);
  if(max_bid)
            newProduct.append('max_bid', max_bid);
  if(incr)
            newProduct.append('incr', incr);
  newProduct.append('description', description);
  newProduct.append('images', images[0]);  
  newProduct.append('images', images[1]);  
  newProduct.append('images', images[2]);  
  newProduct.append('images', images[3]);  
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'products', {
        method: "POST",
        body: newProduct,
        headers: {
          'Authorization': bearer
        }
     //   ,        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(response => { alert('Product uploaded successfully.\nPending for approval by admin.');
      return  dispatch(addProduct(response));})
    .catch(error =>  { alert('Your product could not be added\nError: '+error.message); });
};

export const increaseView = (_id,originalViews) => (dispatch) => {
  let views=JSON.parse(localStorage.getItem("viewed"));
  if(!views||views.indexOf(_id)===-1){
    if(views)
      {
        views.push(_id);
      }
    else views=[_id];
        localStorage.setItem("viewed",JSON.stringify(views));
    return fetch(baseUrl + 'products/views/' + _id, {
      method: "POST"
    //  ,     credentials: 'same-origin'
      ,      body: JSON.stringify({views: originalViews+1}),
      headers: {
        "Content-Type": "application/json"
      } })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => (dispatch(editProductdispatch(response))))
  .catch(error =>  {  
  alert('Your product could not be edited\nError: '+error.message); });
  }

}

export const approveProduct = (_id) => (dispatch) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'products/approve/' + _id, {
      method: "POST",
      headers: {
        'Authorization': bearer
      }
    //  ,     credentials: 'same-origin'
    })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => (dispatch(editProductdispatch(response))))
  .catch(error =>  {  
  alert('Your product could not be edited\nError: '+error.message); });
  }


export const editProduct = (_id,name, cat, description, price, bid, max_bid, incr, images) => (dispatch) => {

  const newProduct = {
    name: name, cat: cat,
    description: description, price: price,
     max_bid: max_bid, bid: bid, 
     incr: incr, images: images
  };
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'products/' + _id, {
      method: "PUT"
    //  ,     credentials: 'same-origin'
      ,      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      } })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => (dispatch(editProductdispatch(response))))
  .catch(error =>  {  
  alert('Your product could not be edited\nError: '+error.message); });
};

export const editPassword = (_id,username,password) => (dispatch) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'users/password/' + _id, {
    method: "PUT"
  //  ,     credentials: 'same-origin'
    ,      body: JSON.stringify({password: password}),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    } })
.then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error('Error ' + response.status + ': ' + response.statusText+'\n ');
      error.response = response;
      throw error;
    }
  },
  error => {
        throw error;
  })
.then(response => response.json())
.then(response => { 
  let newCreds={username: username, password: password};
  localStorage.removeItem('creds');
  localStorage.setItem('creds', JSON.stringify(newCreds));
  alert('Password changed successfully');
  return dispatch(editPasswordDispatch(newCreds));})
.catch(error =>  {  
alert('Your password could not be changed\nError: '+error.message); });
}

export const editUser = (_id, firstname, lastname, room, email, block, hostel, phone, facebookProfile, showfacebook, showphone, showroom) => (dispatch) => {
  const newUser = {
firstname: firstname,
lastname: lastname,
room: room,
email: email,
block: block,
hostel: hostel,
phone: phone,
facebookProfile: facebookProfile,
showfacebook: showfacebook,
showphone: showphone,
showroom: showroom
  };
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'users/' + _id, {
      method: "PUT"
    //  ,     credentials: 'same-origin'
      ,      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      } })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => { 
    localStorage.removeItem('userinfo');
    localStorage.setItem('userinfo', JSON.stringify(response));
    return dispatch(editUserdispatch(response));})
  .catch(error =>  {  
  alert('Your profile could not be edited\nError: '+error.message+'\n May be someone has already registered with that Email ID or username'); });
};

export const deleteProduct = (_id) => (dispatch) => {
  
  const bearer = 'Bearer ' + localStorage.getItem('token');    
  return fetch(baseUrl + 'products/' + _id, {
      method: "DELETE"
    //  ,       credentials: "same-origin"
      ,       headers: {
        'Authorization': bearer
      }
  })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => dispatch(deleteProductdispatch(response)))
  .catch(error =>  {alert('Your product could not be deleted\nError: '+error.message); });
};

export const fetchProducts = () => (dispatch) => {
    dispatch(productsLoading(true));
    return fetch(baseUrl+'products')
        .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(products => dispatch(addProducts(products)))
    .catch(error => dispatch(productsFailed(error.message)));
}


export const fetchUsers = () => (dispatch) => {

  dispatch(usersLoading(true));
  return fetch(baseUrl+'users')
      .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
  .then(response => response.json())
  .then(users => dispatch(addUsers(users)))
  .catch(error => dispatch(usersFailed(error.message)));
}


export const productsLoading = () => ({
    type: ActionTypes.PRODUCTS_LOADING
});

export const productsFailed = (errmess) => ({
    type: ActionTypes.PRODUCTS_FAILED,
    payload: errmess
});

export const addProducts = (products) => ({
    type: ActionTypes.ADD_PRODUCTS,
    payload: products
});

export const addUsers = (users) => ({
  type: ActionTypes.ADD_USERS,
  payload: users
});

export const usersLoading = () => ({
  type: ActionTypes.USERS_LOADING
});

export const editProductdispatch = (products) => ({
  type: ActionTypes.EDIT_PRODUCT,
  payload: products
});

export const freezeProductdispatch = (bid) => ({
  type: ActionTypes.FREEZE_BID,
  payload: bid
});

export const editUserdispatch = (USER) => ({
  type: ActionTypes.EDIT_USER,
  payload: USER
});

export const editPasswordDispatch = (CREDS) => ({
  type: ActionTypes.EDIT_PASSWORD,
  payload: CREDS
})

export const deleteProductdispatch = (resp) => ({
  type: ActionTypes.DELETE_PRODUCT,
  payload: resp
});

export const requestLogin = (creds) => {
  return {
      type: ActionTypes.LOGIN_REQUEST,
      creds
  }
}

export const receiveLogin = (response) => {
  return {
      type: ActionTypes.LOGIN_SUCCESS,
      token: response.token,
      userinfo: response.userinfo
  }
}

export const loginError = (message) => {
  return {
      type: ActionTypes.LOGIN_FAILURE,
      message
  }
}

export const loginUser = (creds) => (dispatch) => {

  dispatch(requestLogin(creds));
  return fetch(baseUrl + 'users/login', {
      method: 'POST',
      headers: { 
          'Content-Type':'application/json' 
      },
      body: JSON.stringify(creds)
  })
  .then(response => {
      if (response.ok) {
          return response;
      } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
      },
      error => {
          throw error;
      })
  .then(response => response.json())
  .then(response => {
      if (response.success) {
        const time_to_login = Date.now() + 3600000;
          // If login was successful, set the token in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('creds', JSON.stringify(creds));
          localStorage.setItem('timer',JSON.stringify(time_to_login));
          localStorage.setItem('viewed', JSON.stringify([]));
          localStorage.setItem('userinfo', JSON.stringify(response.userinfo));    
          setTimeout(()=>{fetchFavorites()},0);
          setTimeout(()=>{
            logoutUser();
            alert('Your JWT token has expired. \nPlease log in again to continue.');
           },3600*1000);
          // },25*1000); 
          // Dispatch the success action
          dispatch(receiveLogin(response));
      
      }
      else {
          var error = new Error('Error ' + response.status);
          error.response = response;
          throw error;
      }
  })
  .catch(error => {
    alert(error.message+"\n Username and password didn't match");
     return dispatch(loginError(error.message));})
};

export const registerUser = (creds) => (dispatch) => {


  return fetch(baseUrl + 'users/signup', {
      method: 'POST',
      headers: { 
          'Content-Type':'application/json' 
      },
      body: JSON.stringify(creds)
  })
  .then(response => {
      if (response.ok) {
          return response;
      } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
      },
      error => {
          throw error;
      })
  .then(response => response.json())
  .then(response => {
      if (response.success) {
          // If Registration was successful, alert the user
          alert('Registration Successful');
        }
      else {
          var error = new Error('Error ' + response.status);
          error.response = response;
          throw error;
      }
  })
  .catch(error => alert(error.message+'\n'+
      'May be someone has already registered with that username or email \nTry Entering a new username or email '))
};

export const addBid = (bid) => ({
  type: ActionTypes.ADD_BID,
  payload: bid
});

export const postBid = (productId,bidderId,amount) => (dispatch) => {
    const newBid = {
    product: productId,
    bidder: bidderId,
    amount: amount 
    };
    console.log(newBid);
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'bids', {
        method: "POST",
        body: JSON.stringify(newBid),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        }
        ,        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(response => { alert('Product bidd successfully');
      return  dispatch(addBid(response));})
    .catch(error =>  {
      alert('Product could not be bidd\nError: '+error.message+'\n'); });
};

export const editBid = (bidId,amount) => (dispatch) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + 'bids/' + bidId, {
      method: "PUT"
    //  ,     credentials: 'same-origin'
    , headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      } ,
    body : JSON.stringify({amount: amount})})
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => { 
    alert('Bit edited successfully');
    return dispatch(freezeProductdispatch(response));})
  .catch(error =>  {  
  alert('Bid could not be edited\nError: '+error.message); });
};

export const fetchBids = () => (dispatch) => {
  let bidUrl;
  const bearer = 'Bearer ' + localStorage.getItem('token');
  bidUrl='bids';
  dispatch(bidsLoading(true));
  return fetch(baseUrl+bidUrl,{
     headers: {
        'Authorization': bearer
       }
  })
      .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
  .then(response => response.json())
  .then(bids => dispatch(addBids(bids)))
  .catch(error => dispatch(bidsFailed(error.message)));
}



export const bidsLoading = () => ({
  type: ActionTypes.BIDS_LOADING
});

export const bidsFailed = (errmess) => ({
  type: ActionTypes.BIDS_FAILED,
  payload: errmess
});

export const addBids = (bids) => ({
  type: ActionTypes.ADD_BIDS,
  payload: bids
});

export const usersFailed = (errmess) => ({
  type: ActionTypes.USERS_FAILED,
  payload: errmess
});


export const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST
  }
}

export const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS
  }
}


export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout())
  localStorage.removeItem('token');
  localStorage.removeItem('creds');  
  localStorage.removeItem('userinfo');  
  localStorage.removeItem('viewed');
  localStorage.removeItem('timer');
  dispatch(receiveLogout())
}

export const postFavorite = (productId) => (dispatch) => {

  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'favorites/' + productId, {
      method: "POST",
      body: JSON.stringify({"_id": productId}),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(favorites => { dispatch(addFavorites(favorites)); })
  .catch(error => dispatch(favoritesFailed(error.message)));
}

export const deleteFavorite = (productId) => (dispatch) => {

  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'favorites/' + productId, {
      method: "DELETE",
      headers: {
        'Authorization': bearer
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(favorites => { dispatch(addFavorites(favorites)); })
  .catch(error => dispatch(favoritesFailed(error.message)));
};

export const fetchFavorites = () => (dispatch) => {
  dispatch(favoritesLoading(true));

  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'favorites', {
      headers: {
          'Authorization': bearer
      },
  })
  .then(response => {
      if (response.ok) {
          return response;
      }
      else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
  },
  error => {
      var errmess = new Error(error.message);
      throw errmess;
  })
  .then(response => response.json())
  .then(favorites => dispatch(addFavorites(favorites)))
  .catch(error => dispatch(favoritesFailed(error.message)));
}

export const favoritesLoading = () => ({
  type: ActionTypes.FAVORITES_LOADING
});

export const favoritesFailed = (errmess) => ({
  type: ActionTypes.FAVORITES_FAILED,
  payload: errmess
});

export const addFavorites = (favorites) => ({
  type: ActionTypes.ADD_FAVORITES,
  payload: favorites
});