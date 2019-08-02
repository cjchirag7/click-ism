import React,{Component} from 'react';
import {Row,Col, Card, CardText, CardHeader, CardFooter, CardBody } from 'reactstrap';
import Loading from './LoadingComponent';
import {Link} from 'react-router-dom';
function RenderProduct({product,toggleEditModal,changeSelected,user}) {
    if (product != null)
        return(
        <Card>
       
       <CardHeader tag="h3" className="text-danger"><b>{product.name}</b> &nbsp; &nbsp; &nbsp;&nbsp;
       {(user.userinfo&&(user.userinfo._id===product.owner._id))?(<span className="fa fa-pencil Option" onClick={()=>{changeSelected(product._id);toggleEditModal();}}/>):(<React.Fragment/>)}
       <div className="ml-auto text-success"><b>{product.bid?(<React.Fragment>Bidding range : <span>&#8377;</span> {product.price} - {product.max_bid}</React.Fragment>):<React.Fragment><span>&#8377;</span> {product.price}</React.Fragment>}</b></div>
        </CardHeader>
        <CardBody>
          
          <CardText>
              <b> Category: </b> {product.cat} <br/><br/>
              {product.bid?(<React.Fragment><b>Minimum Increment in bidding price :</b> <span>&#8377;</span> {product.incr}</React.Fragment>):<React.Fragment/>}<br/><br/>
              <b> Owner : </b> <Link to={`${product._id}/owner`}>{product.owner.firstname+' '+product.owner.lastname}</Link> <br/><br/>
              <b> Email of owner : </b> {product.owner.email} <br/><br/>
              <b>Descrption: </b><br/> {product.description} <br/><br/>
              <b>Approved by admin: </b><br/> {product.approved?'Yes':'No'} <br/><br/>
              <b> No. of Views: </b> <br/> {product.views} <br/>
      </CardText><br/>
        </CardBody>
        <CardFooter className="text-muted">
        <Row>
        <Col md={6}>
        Created at : {new Intl.DateTimeFormat('en-US',{year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric',minute: 'numeric', hour12: true }).format(new Date( Date.parse(product.createdAt)))}    
        </Col>
        <Col md={6}>
        Last updated at : {new Intl.DateTimeFormat('en-US',{year: 'numeric', month: 'short', day: '2-digit',hour: 'numeric',minute: 'numeric', hour12: true}).format(new Date( Date.parse(product.updatedAt)))} 
        </Col>
        </Row>
        </CardFooter>
        </Card>
        );
    else
        return(
            <div></div>
        );
        }


class ProductDetail extends Component {


    componentDidMount() {
        window.scrollTo(0, 0);
        if(this.props.product&&this.props.user.isAuthenticated){
                this.props.increaseView(this.props.product._id,this.props.product.views);
          }
      }

render(){
  if (this.props.isLoading) {
    return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
    );
}
else if (this.props.errMess) {
    return(
        <div className="container loading">
            <div className="row heading"> 
                <div className="col-12">
                    <br/><br/><br/><br/>
                    <h3>{this.props.errMess}</h3>
                </div>
            </div>
        </div>
    );
}
else
    return(

        <div className="container full">
        <div className="row heading">
          <div className="col-12">
          <br/>        <br/>
          <RenderProduct product={this.props.product} isAdmin={this.props.isAdmin}
                    toggleEditModal={this.props.toggleEditModal}
                    changeSelected={this.props.changeSelected}
                    user={this.props.user}>
              </RenderProduct>

        <br/>
          </div>
        </div>
      </div>
        );
}

}

export default ProductDetail;