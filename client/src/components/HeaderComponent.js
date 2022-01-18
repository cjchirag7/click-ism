import React,{Component} from 'react';
import {Navbar, Form, FormGroup, Label, Input, Nav, NavbarToggler,Collapse,NavItem, NavbarBrand, Modal, ModalBody, ModalHeader, Button} from 'reactstrap';
import {Dropdown,Row, Col,DropdownItem,DropdownMenu,DropdownToggle, InputGroupAddon} from 'reactstrap';
import { NavLink,Link } from 'react-router-dom';
import { Control, LocalForm, Errors  } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);
const ifminLength = (len) => (val) => !(val) || (val.length >= len);
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const isNumber = (val) => !isNaN(Number(val));

  function Registerer(props){
    if(props.isSignedIn===false)
    return (
      <React.Fragment>
          &nbsp;
      <Button color="warning" outline onClick={props.toggleRegister}>                    
     <span className="fa fa-user-plus fa-lg"></span> Register
     </Button>
      </React.Fragment>
    );
    else return(
      <React.Fragment>
      </React.Fragment>
    );
  }

  
class Header extends Component{

    constructor(props){
        super(props);
        this.state={
         isNavOpen: false,
         isModalOpen: false,
         isRegisterOpen: false,
         dropdownOpen: false
           }
        this.toggleModal=this.toggleModal.bind(this);
        this.toggleNav=this.toggleNav.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleRegister=this.toggleRegister.bind(this);
        this.toggle=this.toggle.bind(this);
    }

    toggle(){
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }
    toggleNav(){
        if(window.innerWidth<1200){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }
    }

    toggleRegister(event){
      this.setState({
        isRegisterOpen: !this.state.isRegisterOpen
      });

    }

    handleLogin(event) {
      this.toggleModal();
      this.props.loginUser({username: this.username.value, password: this.password.value});
      event.preventDefault();
  }

  handleLogout() {
      this.props.logoutUser();
  }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }

    render(){
        return (
            <React.Fragment>
                 <Navbar color="danger" dark expand="xl" fixed="top">
                    <div className="container">
                     <NavbarToggler onClick={this.toggleNav}></NavbarToggler>
                     <NavbarBrand className="mr-auto text-warning brand" href="/home">
                     Click ISM
                     </NavbarBrand>
                     <Collapse isOpen={this.state.isNavOpen} navbar>
                     <Nav navbar>
                        <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link text-warning" to="/home">
                               <span className="fa fa-home fa-lg"/> Home
                           </NavLink>
                        </NavItem>
                        <Dropdown  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle color="Warning" >
                            <div className="text-warning">
                                <span className="fa fa-gift fa-lg"/> Products
                                                   &nbsp; <i className="fa fa-caret-down fa-sm" aria-hidden="true"></i>

                                                </div>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/books">Books</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/bicycles" >Bicycles</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/stationary" >Stationary</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/electronics" >Electronic Gadgets</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/clothes" >Clothes</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/sports" >Sports</DropdownItem>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/others" >Others</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link text-warning" to="/search">
                                <span className="fa fa-search fa-lg"/> Search
                            </NavLink>
                        </NavItem>
                        

                            {
                            (this.props.auth.isAuthenticated)?(
                            <React.Fragment>
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-warning" to="/profile">
                                     <span className="fa fa-user-circle-o fa-lg"/> My Profile
                                </NavLink>
                                </NavItem>
                                <NavItem className="ml-2" onClick={this.toggleNav}>
                                <NavLink className="nav-link text-warning" to="/favorites">
                                   <span className="fa fa-heart fa-lg"/> My favorites
                                </NavLink>
                                </NavItem>
                            </React.Fragment>
                            ):
                            (<div/>)
                        }
                        {
                            (this.props.auth.isAuthenticated&&!this.props.auth.userinfo.admin)?(
                                <React.Fragment>
                                 <NavItem className="ml-2" onClick={this.toggleNav}>
                                 <NavLink className="nav-link text-warning" to="/upload_product">
                                    <span className="fa fa-upload fa-lg"/> Upload item
                                 </NavLink>
                                 </NavItem>
                                 <NavItem className="ml-2" onClick={this.toggleNav}>
                                 <NavLink className="nav-link text-warning" to="/uploads">
                                    <span className="fa fa-list fa-lg"/> My uploads
                                 </NavLink>
                                 </NavItem>
                                 </React.Fragment>

                            ):
                            (<div/>)
                        }
                         {
                            (this.props.auth.isAuthenticated&&this.props.auth.userinfo.admin)?(
                              <React.Fragment>
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-warning" to="/pending">
                                     <span className="fa fa-clock-o fa-lg"/> Products pending
                                </NavLink>
                                </NavItem>
                               {
                                   /*
                                 <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-warning" to="/stats">
                                   <span className="fa fa-info-circle fa-lg"/> Stats
                                </NavLink>
                                </NavItem>
                             
                                   */
                               }  </React.Fragment>
                            ):
                            (<div/>)
                        }
                     </Nav>
                     <Nav className="ml-auto" navbar>
                     <NavItem>
                                    { !this.props.auth.isAuthenticated ?
                        <Button outline color="warning" onClick={this.toggleModal}>
                                            <span className="fa fa-sign-in fa-lg"></span> Login
                                            {this.props.auth.isLoading ?
                                                <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                : null
                                            }
                                        </Button>
                                        :
                                        <div>
                                        <div className="navbar-text text-warning mr-1">{this.props.auth.user && this.props.auth.user.username}</div>
                                        <Button outline color="warning" onClick={this.handleLogout}>
                                            <span className="fa fa-sign-out fa-lg"></span> Logout
                                            {this.props.auth.isLoading ?
                                                <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                : null
                                            }
                                        </Button>
                                        </div>
                                    }


                    <Registerer isSignedIn={this.props.auth.isAuthenticated} toggleRegister={()=>{this.toggleRegister()}}/>
                     </NavItem>
                      </Nav>
                     </Collapse>
                    </div>
                 </Navbar>
                 <Modal isOpen={!this.props.auth.isAuthenticated&&this.state.isModalOpen} toggle={this.toggleModal}>
                     <ModalHeader toggle={this.toggleModal}>
                         Sign In
                     </ModalHeader>
                     <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            <Button type="submit" value="submit" color="warning">Login</Button>
                        </Form>
                    </ModalBody>
                     </Modal>
                 <Modal isOpen={this.state.isRegisterOpen} toggle={this.toggleRegister}>
                     <ModalHeader toggle={this.toggleRegister}>
                         Register 
                     </ModalHeader>
                     <ModalBody>
                     <LocalForm model="user" onSubmit={(values) => {
                           this.toggleRegister();
                            this.props.registerUser({
                              username: values.username,
                               password: values.password,
                               email: values.email,
                               room: values.room,
                               block: values.block,
                               hostel: values.hostel,
                               phone: values.phone,
                               showroom: values.showroom,
                               showfacebook: values.showfacebook,
                               showphone: values.showphone,
                               facebookProfile: values.facebookProfile,
                               firstname: values.firstname,
                               lastname: values.lastname });
                           }}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Control.text model=".username" id="username" name="username" 
                            className="form-control" placeholder="Username" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".username" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="password">Password</Label>
                                <Control.password model=".password" id="password" name="password" 
                            className="form-control" placeholder="password" validators={{required,minLength: minLength(6),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".password" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 5 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="firstname">First Name</Label>
                                <Control.text model=".firstname" id="firstname" name="firstname" 
                            className="form-control" placeholder="firstname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".firstname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="lastname">Last Name</Label>
                                <Control.text model=".lastname" id="lastname" name="lastname" 
                            className="form-control" placeholder="lastname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".lastname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="hostel">Hostel</Label>
                            <Control.select model=".hostel" id="hostel" className="form-control" defaultValue="Jasper">
                              <option>Jasper</option> <option>Amber</option>
                              <option>Topaz</option> <option>Sapphire</option>
                              <option>Diamond</option> <option>Emerald</option>
                              <option>Ruby</option> <option>Rosaline</option>
                              <option>Opal</option>
                            </Control.select>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="block">Block</Label>
                            <Control.select model=".block" id="block" className="form-control" defaultValue="A">
                              <option>A</option> <option>B</option>
                              <option>C</option> <option>D</option>
                            </Control.select>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="room">Room No.</Label>
                                <Control.text model=".room" id="room" name="room" 
                            className="form-control" placeholder="room" validators={{required,maxLength:maxLength(4),isNumber}} />
                            <Errors className="text-danger" model=".room" show="touched" messages={{required: 'Required',
                             maxLength:' Must be 4 characters or less',isNumber: ' Must be a number'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="email">E-mail</Label>
                                <Control.text model=".email" id="email" name="email" 
                            className="form-control" placeholder="email" validators={{required,validEmail}} />
                            <Errors className="text-danger" model=".email" show="touched" messages={{required: 'Required',
                            validEmail: ' Enter a valid email'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="phone">Contact No.</Label>
                                <Control.text model=".phone" id="phone" name="phone" 
                            className="form-control" placeholder="phone" validators={{required,minLength:minLength(10),maxLength: maxLength(10),isNumber}} />
                            <Errors className="text-danger" model=".phone" show="touched" messages={{required: 'Required',
                             minLength:' Should be a valid 10 digit no.',maxLength:' Donot write country code',isNumber: ' Must be a number'}}/>
                            </FormGroup>
                            <FormGroup>    
                            <Row>
                                <Col md={12}>
                                 <Label htmlFor="facebookProfile">Facebook Profile Link (Optional)</Label>
                                 </Col>
                                 <Col md={6}>
                                 <InputGroupAddon addonType="prepend">https://www.facebook.com/</InputGroupAddon>
                                 </Col>
                                <Col md={6}>
                                <Control.text model=".facebookProfile" id="facebookProfile" name="facebookProfile" 
                            className="form-control" placeholder="facebookProfile" validators={{minLength: ifminLength(15),maxLength: maxLength(30)}} />

                            <Errors className="text-danger" model=".facebookProfile" show="touched" messages={{
                             minLength:' Should have at least 15 characters, otherwise donot enter this field',maxLength:' Should not exceed 30 characters'}}/>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <Row>
                            <Label> Check the info. you want to keep public :</Label>
                            </Row>
                            <Row>
                            <Col md={4}>
                            <FormGroup check inline>                            
                            <Control.checkbox model=".showroom" id="showroom" name="showroom" 
                            className="form-control" defaultValue={false}/>
                            <Label check> Room Info</Label>
                            </FormGroup>
                            </Col>
                            <Col md={4}>
                            <FormGroup check inline>
                            <Control.checkbox model=".showphone" id="showphone" name="showphone" 
                            className="form-control" defaultValue={false}/>
                            <Label check htmlFor="showphone"> Contact No.</Label>
                            </FormGroup>
                            </Col>
                            <Col md={4}>
                            <FormGroup check inline>
                            <Control.checkbox model=".showfacebook" id="showfacebook" name="showfacebook" 
                            className="form-control" defaultValue={false}/>
                            <Label check htmlFor="showfacebook"> Facebook Profile</Label>
                            </FormGroup>
                            </Col>
                            </Row>
                            <br/>
                            <FormGroup>
                            <Button type="submit" value="submit" color="warning">Sign Up</Button>
                            </FormGroup>
                        </LocalForm>
                     </ModalBody>
                 </Modal>
                </React.Fragment>
        );
    }
}

export default Header;