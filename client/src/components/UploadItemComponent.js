import React,{Component} from 'react';
import {Button, Label, Col, Row} from 'reactstrap';
import { Control, LocalForm, Errors  } from 'react-redux-form';
import Loading from './LoadingComponent';

const required = (val) => val && val.length;
const requiredNum = (val) => !!(val);
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);
const maxVal = (len) => (val) => !(val) || (val<= len);
const minVal = (len) => (val) => (val) && (val>= len);
const isNumber = (val) => !isNaN(Number(val));

class UploadItem extends Component {

    constructor(props){
        super(props);
        this.state={
        }

    }
    
    componentDidMount() {
        window.scrollTo(0, 0)
      }

render(){
    let uniqueName=(val) =>(!this.props.products.some((product)=>(product.name===val)));

    if (this.props.productsLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (this.props.productsErrMess) {
        return(
            <div className="container loading  white-text">
                <div className="row heading"> 
                    <div className="col-12">
                        <br/><br/><br/><br/>
                        <h3>{this.props.productsErrMess}</h3>
                    </div>
                </div>
            </div>
        );
    }
    else
 return (
    <div className="container  white-text">
    <div className="row justify-content-center heading">
    <div className="col-12">
  <h3 align="center">  Upload a product</h3>
  </div>
    </div>
    <div className="row row-content justify-content-center">
    <LocalForm onSubmit={(values) => {
        this.props.postProduct(values.name, values.cat, values.description, values.price, values.bid, values.max_bid, values.incr, values.images);
    }}>
                    <Row className="form-group">
                                <Label htmlFor="name" md={2}>Name </Label>
                                <Col md={4}>
                                    <Control.text model=".name" id="name" name="name"
                                        placeholder="Name of product"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3),uniqueName
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: ' Must be greater than 2 characters',
                                            uniqueName: ' There exists a product with this name already'
                                        }}
                                     />
                                </Col>
                                <Label htmlFor="cat" md={2}>Category</Label>
                                 <Col md={4}>
                            <Control.select model=".cat" id="cat" className="form-control" defaultValue="Stationary">
                              <option>Stationary</option> <option>Electronic Gadgets</option>
                              <option>Bicycles</option> <option>Clothes</option>
                              <option>Sports</option> <option>Books</option> 
                              <option>Others</option>
                               </Control.select>
                            </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="isbn" md={2}>ISBN No.</Label>
                                <Col md={4}>
                                    <Control.text model=".isbn" id="isbn" name="isbn"
                                        placeholder="ISBN no. of product"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(10), maxLength: maxLength(13), isNumber,
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".isbn"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: ' Must be greater than 9 numbers',
                                            maxLength: ' Must be 13 numbers or less',
                                            isNumber: ' Must be a number',
                                            }}
                                     />
                                </Col>
                                <Label htmlFor="copies" md={3}> Copies Available</Label>
                                <Col md={3}>
                                    <Control.text model=".copies" id="copies" name="copies"
                                        placeholder="Number of copies available"
                                        className="form-control"
                                        validators={{
                                            requiredNum, minVal: minVal(1), maxVal: maxVal(1000), isNumber
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".copies"
                                        show="touched"
                                        messages={{
                                            requiredNum: 'Required',
                                            minVal: ' Must be greater than 0',
                                            maxVal: ' Must be 1000 or less',
                                            isNumber: ' Must be a number'
                                        }}
                                     />
                                </Col>
                            </Row>

      
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="cat">Category</Label>
                            <Control.select defaultValue="Romance" model=".cat" id="cat" className="form-control">
                              <option>Romance</option> <option>Technology</option>
                              <option>Computer Science</option> <option>Management</option>
                              <option>Electronics</option> <option>Physics</option>
                              <option>Chemistry</option> <option>Mathematics</option>
                              <option>Fiction</option> <option>Philosophy</option>
                              <option>Language</option> <option>Arts</option>
                              <option>Other</option> 

                            </Control.select>
                            </Col>
                            <Col>
                            <Label htmlFor="floor">Floor </Label>
                            <Control.select defaultValue={0} model=".floor" id="floor" 
                            className="form-control" >
                              <option>0</option> <option>1</option>
                              <option>2</option> <option>3</option>
                              <option>4</option> <option>5</option>
                              <option>6</option> <option>7</option>
                              <option>8</option> 
                            </Control.select>
                            </Col>
                        </Row>
                        
                        <Row className="form-group text-center justify-content-center">
                                <Label htmlFor="shelf" md={3}> Shelf</Label>
                                <Col md={6}>
                                    <Control.text model=".shelf" id="shelf" name="shelf"
                                        placeholder="Shelf no. for locating product"
                                        className="form-control"
                                        validators={{
                                            requiredNum, minVal: minVal(1), maxVal: maxVal(100), isNumber
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".shelf"
                                        show="touched"
                                        messages={{
                                            requiredNum: 'Required',
                                            minVal: ' Must be greater than 0',
                                            maxVal: ' Must be 100 or less',
                                            isNumber: ' Must be a number'
                                        }}
                                     />
                                </Col>
                            </Row>

                     
                        <Row className="form-group">
                                <Label htmlFor="description" md={2}>Description</Label>
                                <Col md={10}>
                                    <Control.textarea model=".description" id="description" name="description"
                                        rows="12"
                                        placeholder="Some description of the product"
                                        className="form-control" />
                                </Col>
                            </Row>
                          <Row className="align-self-center">
                          <Col className="text-center">
                        <Button type="submit" className="bg-primary">
                            Submit
                        </Button>
                        </Col>
                        </Row>
                    </LocalForm>
                    </div>
                <br/>
    </div>
 );

}

}

export default UploadItem;