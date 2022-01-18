import React, {Component} from 'react';
import Header from './HeaderComponent.js';
import Footer from './FooterComponent.js';
import Home from './HomeComponent.js';
import Products from './ProductsComponent';
import Search from './SearchComponent';
import ProductDetail from './ProductDetailComponent';
import UserDetail from './UserDetailComponent';
import Profile from './ProfileComponent';
import Favorites from './FavoriteComponent';
import UploadItem from './UploadItemComponent';
import History from './HistoryComponent';
import {Switch,Route,Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Modal,ModalBody,ModalHeader,Button, Label, Col, Row} from 'reactstrap';
import { postProduct, fetchProducts, editBid, editProduct, deleteProduct, increaseView, loginUser, logoutUser, 
  registerUser, editUser, editPassword, postBid, approveProduct, fetchBids, fetchUsers, fetchFavorites, postFavorite, deleteFavorite} from '../redux/ActionCreators';
import { Control, LocalForm, Errors  } from 'react-redux-form';

const required = (val) => val && val.length;
const requiredNum = (val) => !!(val);
const minLength = (len) => (val) => (val) && (val.length >= len);
const maxVal = (len) => (val) => !(val) || (val<= len);
const multiple = (num) => (val) => !(val) || (val%num===0);
const minVal = (len) => (val) => (val) && (val>= len);
const isNumber = (val) => !isNaN(Number(val));

const mapStateToProps= (state)=>{
  return{
    products: state.products,
    auth: state.auth,
    bids: state.bids,
    users: state.users,
    favorites: state.favorites
  };
}

const mapDispatchToProps = dispatch => ({
  fetchProducts: () => { dispatch(fetchProducts())},
  fetchBids: () =>{ dispatch(fetchBids())},
  fetchUsers: () => { dispatch(fetchUsers())},
  increaseView: (_id, originalViews) => dispatch(increaseView(_id, originalViews)),
  postProduct: (name, cat, description, price, bid, max_bid, incr, images) => dispatch(postProduct(name, cat, description, price, bid, max_bid, incr, images)),
  editProduct: (_id,name, cat, description, price, bid, max_bid, incr, images) => dispatch(editProduct(_id,name, cat, description, price, bid, max_bid, incr, images)),
  deleteProduct: (_id) =>  dispatch(deleteProduct(_id)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  registerUser: (creds) => dispatch(registerUser(creds)),
  editUser: (_id, firstname, lastname, room, email, block, hostel, phone, facebookProfile, showfacebook, showphone, showroom) => dispatch(editUser(_id, firstname, lastname, room, email, block, hostel, phone, facebookProfile, showfacebook, showphone, showroom)),
  editPassword : (_id,username,password) => dispatch(editPassword(_id,username,password)),
  editBid: (bidId,amount) => dispatch(editBid(bidId,amount)),
  postBid: (productId,bidderId,amount) => (dispatch(postBid(productId,bidderId,amount))),
  fetchFavorites: () => dispatch(fetchFavorites()),
  postFavorite: (productId) => dispatch(postFavorite(productId)),
  deleteFavorite: (productId) => dispatch(deleteFavorite(productId)),
  approveProduct: (productId) => dispatch(approveProduct(productId))
});
let username='';
class Main extends Component {
  
  componentDidMount() {
    this.props.fetchProducts();
    this.props.fetchBids();
    const timer = JSON.parse(localStorage.getItem('timer'));
    if (timer && (Date.now() > timer)) {
      logoutUser();
     }
    this.timer = setInterval(() => {
      if(this.props.auth.isAuthenticated){
        let Newusername='';
        if(username==='')
        {
                 this.props.fetchFavorites();
          username=this.props.auth.user.username;
         }
        Newusername=this.props.auth.user.username;
        if(username!==Newusername)
        {
        username=Newusername;
        this.props.fetchFavorites();
        }
      }
    }, 1000);
      this.props.fetchUsers();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
}
    constructor(props){
        super(props);
        this.state={
          isDeleteModalOpen: false,
          isEditModalOpen: false,
          selectedProduct: null,
          bid: false,
        };
        this.toggleDeleteModal=this.toggleDeleteModal.bind(this);
        this.toggleEditModal=this.toggleEditModal.bind(this);
        this.changeSelected=this.changeSelected.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        }

      handleSubmitEdit(values) {
        if((values.bid&&(values.max_bid>values.price)&&(values.incr<=(values.max_bid-values.price)/2))||(!values.bid))
        {
        this.toggleEditModal();
        this.props.editProduct(this.state.selectedProduct._id,values.name, values.cat, values.description, values.price, values.bid, values.max_bid, values.incr, values.images);     
        }
        else if(values.max_bid<values.price)
        {
          alert('Maximum price should be greater than the minimum price');
        }
        else {
          alert('Incremental price can be at most half the range of bidding');
        }
      }
    
    changeSelected(_id){
      this.setState({selectedProduct:this.props.products.products.filter((product)=>(product._id===_id))[0]});
      this.setState({bid: this.props.products.products.filter((p)=>(p._id===_id))[0].bid});
    }

    toggleDeleteModal(){
      this.setState({isDeleteModalOpen: !this.state.isDeleteModalOpen})
    }
    
    toggleEditModal(){
      this.setState({isEditModalOpen: !this.state.isEditModalOpen});
    }

    render(){
      const ProductWithId = ({match}) => {
      let selectedProduct=this.props.products.products.filter((product) => (product._id)===(match.params.productId))[0]
      let notFoundErr=null;
      if(selectedProduct===undefined){
      notFoundErr=("\n\n Error 404 :  Product not found");
      }  
      return(
          <ProductDetail product={selectedProduct}
          isLoading={this.props.products.isLoading}
          errMess={this.props.products.errMess||notFoundErr}
          toggleEditModal={this.toggleEditModal}
          changeSelected={this.changeSelected}
          increaseView={this.props.increaseView}
          user={this.props.auth}
          approveProduct={this.props.approveProduct}
          addToView={this.addToView}
          postBid={this.props.postBid}
          bids={this.props.bids}
          editBid={this.props.editBid}
          favorite={
            this.props.auth.isAuthenticated?
            ((this.props.favorites.favorites===null) ? true : this.props.favorites.favorites.products.some((product) => product._id === match.params.productId))
            : false
          }
          postFavorite={this.props.postFavorite}
          />
          );
      };
    
      const UserWithId = ({match}) => {
        let selectedUser=this.props.users.users.filter((user) => ((user._id)===(match.params.userId)))[0];
        let notFoundErr=null;
        if(selectedUser===undefined){
        notFoundErr=("\n\n Error 404 :  User not found");
        }  
        return(
            <UserDetail user={selectedUser}
            isLoading={this.props.users.isLoading}
            errMess={this.props.users.errMess||notFoundErr}
            /> 
            );
        };
   
        const HistoryWithId =({match}) =>{
          let selectedProduct=this.props.products.products.filter((product)=>(product._id===(match.params.productId)))[0];          
          return (<History
                      bids={this.props.bids}
                      auth={this.props.auth}
                      product={selectedProduct}
                     />);
          }
        const OwnerProduct = ({match}) => {
          let selectedUser;
          let notFoundErr=null;
          
          let selectedProduct=this.props.products.products.filter((product) => ((product._id)===(match.params.productId)))[0];
          if(selectedProduct)
            selectedUser=selectedProduct.owner;
          else 
             notFoundErr=("\n\n Error 404 :  User not found");  
          if(selectedUser===undefined){
          notFoundErr=("\n\n Error 404 :  User not found");
          }  
          return(
              <UserDetail user={selectedUser}
              isLoading={this.props.products.isLoading}
              errMess={this.props.products.errMess||notFoundErr}
              /> 
              );
          };

      const PrivateRouteCommon = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
          this.props.auth.isAuthenticated
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/home',
                state: { from: props.location }
              }} />
        )} />
      );

      const PrivateRouteAdmin = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
          this.props.auth.isAuthenticated&&this.props.auth.userinfo.admin
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/home',
                state: { from: props.location }
              }} />
        )} />
      );

      const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
          this.props.auth.isAuthenticated&&!this.props.auth.userinfo.admin
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/home',
                state: { from: props.location }
              }} />
        )} />
      );

      let uniqueName= (defaultName)=>(val) =>(!this.props.products.products.some((product)=>(product.name===val))||(val===defaultName))

    return ( 
          <div className="App">
          <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser}
          registerUser={this.props.registerUser}
          />
          <Switch location={this.props.location}>
                      <Route exact path='/home' component={() => <Home 
                      products={this.props.products.products.filter((product)=>(product.approved))}
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
            />} />
                  <Route exact path='/search' component={() => <Search 
                      products={this.props.products.products.filter((product)=>(product.approved))}
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
              />}
                />

                      <Route exact path='/books' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Books"&&product.approved))}
                      title="Books"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>
<PrivateRouteAdmin exact path='/pending' component={() => <Products
                      products={this.props.products.products.filter((product)=>(!product.approved))}
                      title="Pending Products"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<PrivateRoute exact path='/uploads' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.owner && (product.owner._id===this.props.auth.userinfo._id)))}
                      title="My Uploads"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>
                      
                      <Route exact path='/stationary' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Stationary"&&product.approved))}
                      title="Stationary"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<Route exact path='/electronics' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Electronic Gadgets"&&product.approved))}
                      title="Electronic Gadgets"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<Route exact path='/bicycles' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Bicycles"&&product.approved))}
                      title="Bicycles"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<Route exact path='/clothes' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Clothes"&&product.approved))}
                      title="Clothes"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<Route exact path='/sports' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Sports"&&product.approved))}
                      title="Sports"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>

<Route exact path='/others' component={() => <Products
                      products={this.props.products.products.filter((product)=>(product.cat==="Others"&&product.approved))}
                      title="Others"
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      user={this.props.auth}
                      toggleEditModal={this.toggleEditModal}
                      toggleDeleteModal={this.toggleDeleteModal}
                      changeSelected={this.changeSelected}
                      favorites={
                        this.props.auth.isAuthenticated?
                        (this.props.favorites.favorites)
                        : false
                      }
                      postFavorite={this.props.postFavorite}
/>}/>
                      
                      <Route exact path='/products/:productId' component={ProductWithId} />
                      <Route path='/products/:productId/owner' component={OwnerProduct} />
                      <PrivateRouteCommon exact path='/profile' component={() => <Profile
                      auth={this.props.auth}
                      editUser={this.props.editUser} 
                      editPassword={this.props.editPassword}/>}
                      />
                      <PrivateRoute exact path='/upload_product' component={() =>(
                      <UploadItem
                      isAdmin={(this.props.auth.userinfo==null)?false:(this.props.auth.userinfo.admin)}
                      postProduct={this.props.postProduct}
                      products={this.props.products.products}
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      />
                      )}/>
                       <PrivateRoute exact path='/bid_history/:productId' component={HistoryWithId}
                />
                {/*             <PrivateRouteAdmin exact path='/logs' component={() => <Log
                      bids={this.props.bids}
                     />}
                      />
                         <PrivateRouteAdmin exact path='/list_students' component={() => <UserList
                      users={this.props.users.users.filter((user)=>(!user.admin))}
                      usersLoading={this.props.users.isLoading}
                      usersErrMess={this.props.users.errMess}
                     />}
                      />
                         <PrivateRouteAdmin exact path='/list_admins' component={() => <UserList
                      users={this.props.users.users.filter((user)=>(user.admin))}
                      usersLoading={this.props.users.isLoading}
                      usersErrMess={this.props.users.errMess}
                     />}
                      />
                       <PrivateRouteAdmin exact path='/bid' component={() => <Bid
                      auth={this.props.auth}
                      products={this.props.products.products}
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      users={this.props.users.users}
                      usersLoading={this.props.users.isLoading}
                      usersErrMess={this.props.users.errMess}
                      postBid={this.props.postBid}
                       />} />
                      <PrivateRouteAdmin exact path='/return' component={() => <Return
                      bids={this.props.bids}
                      auth={this.props.auth}
                      freezeBid={this.props.freezeBid}
                      />} />*/}
                     <PrivateRouteCommon exact path="/favorites" component={() => <Favorites 
                     favorites={this.props.favorites}
                      deleteFavorite={this.props.deleteFavorite} 
                      fetchFavorites={this.props.fetchFavorites}/>}

                    />
                      <Route path='/users/:userId' component={UserWithId}/>
                      {/*<PrivateRouteAdmin path='/stats' component={() => <Stats
                      bids={this.props.bids}
                      products={this.props.products.products}
                      productsLoading={this.props.products.isLoading}
                      productsErrMess={this.props.products.errMess}
                      users={this.props.users.users}
                      usersLoading={this.props.users.isLoading}
                      usersErrMess={this.props.users.errMess}
                      />}/>*/}
                      <Redirect to="/home"/>
          </Switch>
        <Footer/>
        <Modal isOpen={this.state.isDeleteModalOpen} toggle={this.toggleDeleteModal}>
                     <ModalHeader toggle={this.toggleDeleteModal}>
                         Confirm Deletion
                     </ModalHeader>
                     <ModalBody>
                       Product details : <br/><br/>
                        Name : {this.state.selectedProduct?this.state.selectedProduct.name:''} <br/>
                        Category : {this.state.selectedProduct?this.state.selectedProduct.cat:''} <br/>
                        {this.state.selectedProduct?(this.state.selectedProduct.bid?('Bidding Range : '+this.state.selectedProduct.price+' - '+this.state.selectedProduct.max_bid):('Price : '+this.state.selectedProduct.price)):''} <br/> <br/>
                        Are you sure you wish to delete this product ? <br/><br/>
         <Button color="danger" onClick={()=>{
           this.props.deleteProduct(this.state.selectedProduct._id);
           this.toggleDeleteModal();}}>Yes</Button>{' '}  
         <Button color="warning" onClick={()=>{
           this.toggleDeleteModal();
         }}>No</Button>
                     </ModalBody>
          </Modal>
          {this.state.selectedProduct?(
                 <Modal isOpen={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
                     <ModalHeader toggle={this.toggleEditModal}>
                         Edit a product
                     </ModalHeader>
                     <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmitEdit(values)}>
                    <Row className="form-group">
                                <Label htmlFor="name" md={2}>Name </Label>
                                <Col md={10}>
                                    <Control.text model=".name" id="name" name="name"
                                        defaultValue={this.state.selectedProduct.name}
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3),
                                            uniqueName: uniqueName(this.state.selectedProduct.name)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            uniqueName: ' There exists a product with this name already'
                                        }}
                                     />
                                </Col>
                            </Row> 
                            <Row className="form-group">                   
                            <Col md={4}>
                            <Control.checkbox model=".bid" id="bid" name="bid" 
                            className="form-control" disabled={false}
                            checked={this.state.bid}
                            defaultChecked={this.state.bid}
                            onChange={(e)=>{this.setState({bid: !this.state.bid})}}/>
                            </Col>
                            <Col md={8}>
                            <Label check htmlFor="bid"> Allow Bidding</Label>
                            </Col>
                            </Row>
                            {
                              (this.state.bid) ? (
                                <React.Fragment>
                                <Row className="form-group">
                                <Label htmlFor="price" md={4}>Minimum Price (in &#8377;) </Label>
                                <Col md={8}>
                                    <Control.text model=".price" id="price" name="price"
                                        defaultValue={this.state.selectedProduct.price}
                                        className="form-control"
                                        validators={{
                                            requiredNum, minVal: minVal(10),isNumber
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".price"
                                        show="touched"
                                        messages={{
                                            requiredNum: ' Required',
                                            minVal: ' Must be greater than 10 Rs.',
                                            isNumber: ' Must be a number'
                                         }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                            <Label htmlFor="max_bid" md={4}>Maximum Price (in &#8377;) </Label>
                            <Col md={8}>
                                <Control.text model=".max_bid" id="max_bid" name="max_bid"
                                    defaultValue={this.state.selectedProduct.max_bid}
                                    className="form-control"
                                    validators={{
                                        requiredNum, maxVal: maxVal(100000),isNumber
                                    }}
                                     />
                                <Errors
                                    className="text-danger"
                                    model=".max_bid"
                                    show="touched"
                                    messages={{
                                        requiredNum: ' Required',
                                        maxVal: ' Must be less than 100000 Rs.',
                                        isNumber: ' Must be a number'
                                     }}
                                 />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="incr" md={4}>Minimum Increment (in &#8377;) </Label>
                            <Col md={8}>
                                <Control.text model=".incr" id="incr" name="incr"
                                    defaultValue={this.state.selectedProduct.incr}
                                    className="form-control"
                                    validators={{
                                        requiredNum, minVal: minVal(10),maxVal: maxVal(10000),multiple: multiple(10),
                                        isNumber
                                    }}
                                     />
                                <Errors
                                    className="text-danger"
                                    model=".incr"
                                    show="touched"
                                    messages={{
                                        requiredNum: ' Required',
                                        minVal: ' Must be greater than 10 Rs.',
                                        maxVal: ' Must be less than 10000 Rs.',
                                        multiple: ' Must be a multiple of 10',
                                        isNumber: ' Must be a number'
                                     }}
                                 />
                            </Col>
                        </Row>
                        </React.Fragment>
                              ) :
                              (
                                <Row className="form-group">
                                <Label htmlFor="price" md={4}>Price (in &#8377;) </Label>
                                <Col md={8}>
                                    <Control.text model=".price" id="price" name="price"
                                        defaultValue={this.state.selectedProduct.price}
                                        className="form-control"
                                        validators={{
                                            requiredNum, minVal: minVal(10),isNumber
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".price"
                                        show="touched"
                                        messages={{
                                            requiredNum: ' Required',
                                            minVal: ' Must be greater than 10 Rs.',
                                            isNumber: ' Must be a number'
                                         }}
                                     />
                                </Col>
                            </Row>
                              )

                            }

                                        
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="cat">Category</Label>
                            <Control.select model=".cat" id="cat" className="form-control" defaultValue={this.state.selectedProduct.cat}>
                              <option>Stationary</option> <option>Electronic Gadgets</option>
                              <option>Bicycles</option> <option>Clothes</option>
                              <option>Sports</option> <option>Books</option> 
                              <option>Others</option>
                                                          </Control.select>
                            </Col>
                        </Row>
                     
                        <Row className="form-group">
                                <Label htmlFor="description" md={2}>Description</Label>
                                <Col md={10}>
                                    <Control.textarea model=".description" id="description" name="description"
                                        rows="12"
                                        defaultValue={this.state.selectedProduct.description}
                                        className="form-control" />
                                </Col>
                            </Row>
                          <Row>
                          <Col className="ml-auto mr-auto">
                        <Button type="submit" className="bg-primary">
                            Submit
                        </Button>
                        </Col>
                        </Row>
                    </LocalForm>
                </ModalBody>
               
          </Modal>):(<React.Fragment/>)}

          </div>
           );     
    }
    }

    export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));

