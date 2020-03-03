import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Loading from './LoadingComponent';

function RenderMenuItem({ product, deleteFavorite }) {
  return (
    <Card className='mt-2 mb-2'>
      <CardImg
        top
        width='100%'
        height='200'
        src={
          'https://click-ism-20.s3.ap-south-1.amazonaws.com/' +
          product.images[0].slice(22)
        }
        onMouseOver={e => {
          if (product.images[1])
            e.currentTarget.src =
              'https://click-ism-20.s3.ap-south-1.amazonaws.com/' +
              product.images[1].slice(22);
        }}
        onMouseOut={e => {
          e.currentTarget.src =
            'https://click-ism-20.s3.ap-south-1.amazonaws.com/' +
            product.images[0].slice(22);
        }}
      />

      <CardBody className='text-black'>
        <CardTitle className='text-danger'>
          <b>
            {product.name} &nbsp;
            <Button
              outline
              color='danger'
              onClick={() => {
                deleteFavorite(product._id);
              }}
            >
              <span className='fa fa-times'></span>
            </Button>
          </b>
        </CardTitle>
        <CardSubtitle className='text-success'>
          <b>
            {product.bid ? (
              <React.Fragment>
                Bidding range : <span>&#8377;</span> {product.price} -{' '}
                {product.max_bid}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span>&#8377;</span> {product.price}
              </React.Fragment>
            )}
          </b>
        </CardSubtitle>
        <CardText>{product.description.slice(0, 100) + '....'}</CardText>
        <CardLink
          tag={Link}
          to={'/products/' + product._id}
          className='text-center'
        >
          <Button className='button btn-block' color='info'>
            <i className='fa fa-eye fa-lg' /> &nbsp;View details
          </Button>
        </CardLink>
      </CardBody>
    </Card>
  );
}

class Favorites extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    if (this.props.favorites.isLoading) {
      return (
        <div className='container'>
          <div className='row heading white-text'>
            <Loading />
          </div>
        </div>
      );
    } else if (this.props.favorites.errMess) {
      return (
        <div className='container full'>
          <div className='row heading white-text'>
            <h4>{this.props.favorites.errMess}</h4>
          </div>
        </div>
      );
    } else if (
      this.props.favorites.favorites &&
      this.props.favorites.favorites.products
    ) {
      const favorites = this.props.favorites.favorites.products.map(product => {
        return (
          <div key={product._id} className='col-12 col-md-4 white-text'>
            <RenderMenuItem
              product={product}
              deleteFavorite={this.props.deleteFavorite}
            />
          </div>
        );
      });
      console.log(this.props.favorites);
      return (
        <div className='container full'>
          <div className='row heading'>
            <div className='col-12 white-text justify-content-center'>
              <h3 align='center'>My Favorites</h3>
              <hr />
            </div>
          </div>
          <div className='row'>{favorites}</div>
        </div>
      );
    } else {
      console.log(this.props.favorites);
      return (
        <div className='container full'>
          <div className='row heading white-text justify-content-center'>
            <h4 align='center'>You have no favorites</h4>
          </div>
        </div>
      );
    }
  }
}

export default Favorites;
