import React,{Component} from 'react';
import {Card,CardBody,CardHeader,Label,Row,Col,InputGroupAddon,CardText,Button,Modal,ModalBody,ModalHeader,FormGroup} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = (val) => {return val && val.toString().length};
const maxLength = (len) => (val) => {return !(val) || (val.toString().length <= len);}
const minLength = (len) => (val) => (val) && (val.toString().length >= len);
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const matchcreds = (original) => (val) =>  (val===original);
const ifminLength = (len) => (val) => !(val) || (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));

class Profile extends Component {

    constructor(props){
        super(props);
        this.state={
            isEditModalOpen: false,
            isPasswordModalOpen: false
        }
        this.toggleEditModal=this.toggleEditModal.bind(this);
        this.togglePasswordModal=this.togglePasswordModal.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
      }

    togglePasswordModal(){
        this.setState({
            isPasswordModalOpen: !this.state.isPasswordModalOpen
        });
    }

    toggleEditModal(){
            this.setState({isEditModalOpen: !this.state.isEditModalOpen});
          }
      

render(){
    if(this.props.auth.userinfo===null){
        return (
            <div className="row heading">
                Failed to fetch. Please reload the page
            </div>
        )
    }
    return(

        <div className="container mt-6 home text-center align-self-center">
            <div className="row text-center justify-content-center mt-2">
            
            <Card className="heading">
                
        <CardHeader><h3>My Profile</h3></CardHeader>
        <CardBody>
          <CardText>
          <h5> First Name : {'          '+this.props.auth.userinfo.firstname}</h5>
          <h5> Last Name : {'          '+this.props.auth.userinfo.lastname}</h5>
          <h5> Email : {'          '+this.props.auth.userinfo.email}</h5>
          <h5> Username : {'          '+this.props.auth.user.username}</h5>
          <h5> Address : {'Room No.          '+this.props.auth.userinfo.block+'-'+this.props.auth.userinfo.room+ ', '+this.props.auth.userinfo.hostel}</h5>{this.props.auth.userinfo.showroom?(' (Publicly Visible)'):(<React.Fragment/>)}
          <h5> Contact No. : {'  +91-'+this.props.auth.userinfo.phone}</h5>{this.props.auth.userinfo.showphone?(' (Publicly Visible)'):(<React.Fragment/>)}
          <h5> Facebook Profile Link : <a href={'https://www.facebook.com/'+this.props.auth.userinfo.facebookProfile}><span className="fa fa-facebook"></span></a></h5>{this.props.auth.userinfo.showfacebook?(' (Publicly Visible)'):(<React.Fragment/>)}
          
          </CardText>
          
          <Button color="info" onClick={this.toggleEditModal}>Edit &nbsp;{'   '}<span className="fa fa-pencil"/></Button>
        {' '}
{this.props.auth.userinfo.admin?<div/>:        <Button color="info" onClick={this.togglePasswordModal}>Change Password &nbsp;{'   '}<span className="fa fa-key"/></Button>}

        </CardBody>
          </Card>
            </div>
            <Modal isOpen={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
                     <ModalHeader toggle={this.toggleEditModal}>
                         Edit Profile
                     </ModalHeader>
                     <ModalBody>
                     <LocalForm model="user" onSubmit={(values) => {
                            this.toggleEditModal();
                            this.props.editUser(this.props.auth.userinfo._id, values.firstname, values.lastname, values.room, values.email, values.block, values.hostel, values.phone, values.facebookProfile, values.showfacebook, values.showphone, values.showroom );
                     }}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Control.text model=".username" id="username" name="username" 
                            defaultValue={this.props.auth.user.username}
                            className="form-control" placeholder="Username" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".username" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="firstname">First Name</Label>
                                <Control.text model=".firstname" id="firstname" name="firstname" 
                            defaultValue={this.props.auth.userinfo.firstname}
                            className="form-control" placeholder="firstname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".firstname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="lastname">Last Name</Label>
                                <Control.text model=".lastname" id="lastname" name="lastname" defaultValue={this.props.auth.userinfo.lastname}
                            className="form-control" placeholder="lastname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".lastname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="hostel">Hostel</Label>
                            <Control.select model=".hostel" id="hostel" className="form-control" defaultValue={this.props.auth.userinfo.hostel}>
                              <option>Jasper</option> <option>Amber</option>
                              <option>Topaz</option> <option>Sapphire</option>
                              <option>Diamond</option> <option>Emerald</option>
                              <option>Ruby</option> <option>Rosaline</option>
                            </Control.select>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="block">Block</Label>
                            <Control.select model=".block" id="block" className="form-control" defaultValue={this.props.auth.userinfo.block}>
                              <option>A</option> <option>B</option>
                              <option>C</option> <option>D</option>
                            </Control.select>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="room">Room No.</Label>
                                <Control.text model=".room" id="room" name="room" defaultValue={this.props.auth.userinfo.room}
                            className="form-control" placeholder="room" validators={{required,maxLength:maxLength(4),isNumber}} />
                            <Errors className="text-danger" model=".room" show="touched" messages={{required: 'Required',
                             maxLength:' Must be 4 characters or less',isNumber: ' Must be a number'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="email">E-mail</Label>
                                <Control.text model=".email" id="email" name="email" defaultValue={this.props.auth.userinfo.email}
                            className="form-control" placeholder="email" validators={{required,validEmail}} />
                            <Errors className="text-danger" model=".email" show="touched" messages={{required: 'Required',
                            validEmail: ' Enter a valid email'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="phone">Contact No.</Label>
                                <Control.text model=".phone" id="phone" name="phone" defaultValue={this.props.auth.userinfo.phone}
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
                                <Control.text model=".facebookProfile" id="facebookProfile" name="facebookProfile" defaultValue={this.props.auth.userinfo.facebookProfile}
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
                            defaultValue={this.props.auth.userinfo.showroom} 
                            className="form-control"/>
                            <Label check> Room Info</Label>
                            </FormGroup>
                            </Col>
                            <Col md={4}>
                            <FormGroup check inline>
                            <Control.checkbox model=".showphone" id="showphone" name="showphone" 
                            className="form-control" defaultValue={this.props.auth.userinfo.showphone}/>
                            <Label check htmlFor="showphone"> Contact No.</Label>
                            </FormGroup>
                            </Col>
                            <Col md={4}>
                            <FormGroup check inline>
                            <Control.checkbox model=".showfacebook" id="showfacebook" name="showfacebook" 
                            className="form-control" defaultValue={this.props.auth.userinfo.showfacebook}/>
                            <Label check htmlFor="showfacebook"> Facebook Profile</Label>
                            </FormGroup>
                            </Col>
                            </Row>
                            <br/>
                            <FormGroup>
                            <Button type="submit" value="submit" color="warning">Submit</Button>
                            </FormGroup>
                        </LocalForm>
                     </ModalBody>
               
          </Modal>

          <Modal isOpen={this.state.isPasswordModalOpen} toggle={this.togglePasswordModal}>
                     <ModalHeader toggle={this.togglePasswordModal}>
                         Change Password
                     </ModalHeader>
                     <ModalBody>
                     <LocalForm model="passwordform" onSubmit={(values) => {
                         if(values.newpassword===values.confirm){
                               this.togglePasswordModal();
                               this.props.editPassword(this.props.auth.userinfo._id, this.props.auth.user.username, 
                                values.newpassword);     
                               }
                        else {
                            alert("Your passwords didn't match. Please try again");
                        }
                                 }}>
                            <FormGroup>
                            <Label htmlFor="password">Current Password</Label>
                                <Control.password model=".password" id="password" name="password" 
                            className="form-control" placeholder="password" validators={{required,minLength: minLength(6),maxLength:maxLength(20),
                            matchcreds: matchcreds(this.props.auth.user.password)}} />
                            <Errors className="text-danger" model=".password" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 5 characters', maxLength:' Must be 20 characters or less',
                            matchcreds: ' Enter the correct password'}}/>
                            </FormGroup>

                            <FormGroup>
                            <Label htmlFor="newpassword">New password</Label>
                                <Control.password model=".newpassword" id="newpassword" name="newpassword" 
                            className="form-control" placeholder="New Password" validators={{required,minLength: minLength(6),maxLength:maxLength(20)
                            }}  />
                            <Errors className="text-danger" model=".newpassword" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 5 characters', maxLength:' Must be 20 characters or less'
                      }}/>
                            </FormGroup>
                            
                            <FormGroup>
                            <Label htmlFor="confirm">Confirm Password</Label>
                                <Control.password model=".confirm" id="confirm" name="confirm" 
                            className="form-control"
                            placeholder="Re-enter the new password" validators={{required,minLength: minLength(6),maxLength:maxLength(20)
                                 } } />
                            <Errors className="text-danger" model=".confirm" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 5 characters', maxLength:' Must be 20 characters or less'
                       }}/>
                            </FormGroup>
                            
                            <Button type="submit" value="submit" color="primary" >Submit</Button>
                        </LocalForm>
                     </ModalBody>               
          </Modal>
            </div>
        );
}

}

export default Profile;