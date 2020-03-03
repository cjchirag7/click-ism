import React, { Component } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
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
const items = [
  {
    id: 1,
    altText: 'Auction',
    src: require('../images/Wallpaper_2.jpg'),
    caption: 'First online bidding platform to sell your stuff'
  },
  {
    id: 2,
    altText: 'Slide 2',
    src: require('../images/Wallpaper_3.jpg'),
    caption: 'Just a click away to buy your favorites'
  },
  {
    id: 3,
    altText: 'Slide 3',
    src: require('../images/Wallpaper_1.jpg'),
    caption: '.......................Sell your stuff and earn money'
  }
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const featured = this.props.products.slice(0, 3);
    const featuredCards = featured.map(product => {
      let favorite;
      if (!this.props.favorites || !this.props.favorites.products)
        favorite = false;
      else
        favorite = this.props.favorites.products.some(
          p => p._id === product._id
        );
      return (
        <div className='col-12 col-md-4 mt-2 mb-2'>
          <Card>
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
                  {product.name} &nbsp;&nbsp;
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
    const slides = items.map(item => {
      return (
        <CarouselItem
          className='custom-tag'
          tag='div'
          key={item.src}
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <img src={item.src} alt={item.altText} className='d-block mx-auto' />
          <CarouselCaption
            captionHeader={item.caption}
            className='text-danger'
            style={{ fontWeight: 'bold', fontSize: '72' }}
          />
        </CarouselItem>
      );
    });

    return (
      <div className='container align-self-center'>
        <div className='heading d-none d-md-block'>
          <style>
            {`.custom-tag {
                    width: 100%;
                    max-height: 500px;
                  }`}
          </style>
          <Carousel
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
          >
            <CarouselIndicators
              items={items}
              activeIndex={activeIndex}
              onClickHandler={this.goToIndex}
            />
            {slides}
            <CarouselControl
              direction='prev'
              directionText='Previous'
              onClickHandler={this.previous}
              className='indicator'
            />
            <CarouselControl
              direction='next'
              directionText='Next'
              onClickHandler={this.next}
              className='indicator'
            />
          </Carousel>
        </div>
        <div className='heading row row-content white-text'>
          <p>
            The first website to sell your old as well as new items with bidding
            allowed, in IIT (ISM). You will find various categories of products
            here : Stationary, Electronic Gadgets, Bicycles, Books, Clothes,
            Sports, etc. You will see a list of featured products below, based
            upon the no. of views{' '}
          </p>
          <p>
            So, what are you waiting for, just Register and login to get into
            the store. Upload your old stuff, kept in your rooms, it may help
            someone in need. Earn huge profits by allowing auction on your
            items. Don't miss this opportunity. Just go for it.{' '}
          </p>
        </div>
        <div className='row row-content white-text justify-content-center'>
          <div className='col-12'>
            <h3 align='center'>Featured Products</h3>
          </div>

          {this.props.productsLoading ? (
            <Loading />
          ) : this.props.productsErrMess ? (
            <h3>{this.props.productsErrMess}</h3>
          ) : (
            featuredCards
          )}
        </div>
      </div>
    );
  }
}

export default Home;
