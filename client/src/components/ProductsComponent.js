import React,{Component} from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardLink, CardTitle, CardSubtitle, Button 
  } from 'reactstrap';
import {Link} from 'react-router-dom';
import Loading from './LoadingComponent';

class Products extends Component {

    render() {
        const productsCards=this.props.products.map((product)=>{
            return (<div className="col-12 col-md-4">
          <Card>
        <CardImg top width="100%" height="200"  src={'/uploads/'+product.images[0].slice(22)} />
        <CardBody className="text-black">
          <CardTitle className="text-danger"><b>{product.name} &nbsp;
          {(this.props.user.userinfo&&(this.props.user.userinfo._id===product.owner._id))?(<React.Fragment><span onClick={()=>{this.props.changeSelected(product._id); this.props.toggleEditModal(); }} className="Option fa fa-pencil"/>
                          &nbsp; &nbsp; <span onClick={()=>{this.props.changeSelected(product._id); this.props.toggleDeleteModal();}} className="Option fa fa-trash"/>
                        </React.Fragment>):(<React.Fragment/>)}
          </b></CardTitle>
          <CardSubtitle className="text-success"><b>{product.bid?(<React.Fragment>Bidding range : <span>&#8377;</span> {product.price} - {product.max_bid}</React.Fragment>):<React.Fragment><span>&#8377;</span> {product.price}</React.Fragment>}</b></CardSubtitle>
          <CardText>{product.description.slice(0,100)+'....'}</CardText>
          <CardLink tag={Link} to={"/products/"+product._id} className="text-center">
            <Button className="button btn-block" color="info"><i className="fa fa-eye fa-lg"/>
                             {' '}&nbsp;View details
                            </Button>           
                        </CardLink>
        </CardBody>
          </Card>
          </div>);
        });

        return (
            <div className="container full">
            <div className="heading row row-content white-text justify-content-center">
            <div className="col-12">
            <h3 align="center">{this.props.title}</h3>
            </div>
            <div className="card-deck">
            {(this.props.productsLoading)?(<Loading />):((this.props.productsErrMess)?(<h3>{this.props.productsErrMess}</h3>):productsCards)}
            </div>
            </div>
            </div>
           
        );

    }
 

}

export default Products;