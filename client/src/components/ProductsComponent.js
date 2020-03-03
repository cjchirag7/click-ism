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

class Products extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const productsCards = this.props.products.map(product => {
      let favorite;
      if (!this.props.favorites || !this.props.favorites.products)
        favorite = false;
      else
        favorite = this.props.favorites.products.some(
          p => p._id === product._id
        );
      return (
        <div className='col-12 col-md-4'>
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
                  {this.props.user.userinfo ? (
                    favorite ? (
                      <span
                        className='fa fa-heart Option'
                        onClick={() =>
                          favorite
                            ? alert('Already favorite')
                            : this.props.postFavorite(product._id)
                        }
                      ></span>
                    ) : (
                      <span
                        className='fa fa-heart-o Option'
                        onClick={() =>
                          favorite
                            ? alert('Already favorite')
                            : this.props.postFavorite(product._id)
                        }
                      ></span>
                    )
                  ) : (
                    <React.Fragment />
                  )}
                  &nbsp; &nbsp;
                  {this.props.user.userinfo &&
                  this.props.user.userinfo._id === product.owner._id ? (
                    <React.Fragment>
                      <span
                        onClick={() => {
                          this.props.changeSelected(product._id);
                          this.props.toggleEditModal();
                        }}
                        className='Option fa fa-pencil'
                      />
                      &nbsp; &nbsp;{' '}
                      <span
                        onClick={() => {
                          this.props.changeSelected(product._id);
                          this.props.toggleDeleteModal();
                        }}
                        className='Option fa fa-trash'
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
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
        </div>
      );
    });

    return (
      <div className='container full'>
        <div className='heading row row-content white-text justify-content-center'>
          <div className='col-12'>
            <h3 align='center'>{this.props.title}</h3>
          </div>
          {this.props.products.length === 1 ? (
            this.props.productsLoading ? (
              <Loading />
            ) : this.props.productsErrMess ? (
              <h3>{this.props.productsErrMess}</h3>
            ) : (
              productsCards
            )
          ) : this.props.productsLoading ? (
            <Loading />
          ) : this.props.productsErrMess ? (
            <h3>{this.props.productsErrMess}</h3>
          ) : this.props.products.length === 0 ? (
            <div className='justify-content-center'>
              <br />
              <br />
              <br />
              <br />
              <h5 align='center'>There are no products in this list.</h5>
            </div>
          ) : (
            productsCards
          )}
        </div>
      </div>
    );
  }
}

export default Products;
