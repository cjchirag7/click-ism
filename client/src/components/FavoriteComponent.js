import React from 'react';
import {  Card, CardImg, CardText, CardBody,
    CardLink, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import  Loading  from './LoadingComponent';

function RenderMenuItem({ product, deleteFavorite}) {
    return(
        (
        <Card className="mt-2 mb-2">
      <CardImg top width="100%" height="200"  src={'/uploads/'+product.images[0].slice(22)}
       onMouseOver={e => {
        if(product.images[1])
        e.currentTarget.src = '/uploads/'+product.images[1].slice(22)}} 
        onMouseOut={e => {
          e.currentTarget.src = '/uploads/'+product.images[0].slice(22)}}   
      />

      <CardBody className="text-black">
        <CardTitle className="text-danger"><b>{product.name} &nbsp;
              <Button outline color="danger" onClick={() => {
          deleteFavorite(product._id);
          }}>
                    <span className="fa fa-times"></span>
       </Button>
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
        ));
}

const Favorites = (props) => {

    if (props.favorites.isLoading) {
        return(
            <div className="container">
                <div className="row heading white-text">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.favorites.errMess) {
        return(
            <div className="container full">
                <div className="row heading white-text">
                    <h4>{props.favorites.errMess}</h4>
                </div>
            </div>
        )
    }
    else if (props.favorites.favorites&&props.favorites.favorites.products) {

        const favorites = props.favorites.favorites.products.map((product) => {
            return (
                <div key={product._id} className="col-12 col-md-4 white-text">
                    <RenderMenuItem product={product} deleteFavorite={props.deleteFavorite} />
                </div>
            );
        });
        console.log(props.favorites);
        return(

            <div className="container full">
                <div className="row heading">
                    <div className="col-12 white-text justify-content-center">
                        <h3 align="center">My Favorites</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                <div className="card-deck">
            {favorites}
            </div>
                </div>
            </div>
        );
    }
    else {
        console.log(props.favorites);
        return(
            <div className="container full">
                <div className="row heading white-text justify-content-center">
                    <h4 align="center" >You have no favorites</h4>
                </div>
            </div>
        )
    }
}

export default Favorites;