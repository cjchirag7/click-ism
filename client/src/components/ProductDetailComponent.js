import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardText,
  CardHeader,
  CardFooter,
  CardBody,
  Carousel,
  CarouselItem,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  CardLink,
  CarouselControl,
  Form,
  FormGroup,
  Label,
  Input,
  CarouselIndicators
} from 'reactstrap';
import Loading from './LoadingComponent';
import { Link } from 'react-router-dom';
function RenderProduct({
  toggleModal,
  product,
  toggleEditModal,
  toggleBidEdit,
  changeSelected,
  user,
  favorite,
  postFavorite,
  approveProduct,
  bids
}) {
  let reqBid = bids.filter(bid => bid.product && (bid.product._id === product._id) );
  if (product != null)
    return (
      <Card>
        <CardHeader tag='h3' className='text-danger'>
          <b>{product.name}</b> &nbsp; &nbsp;
          {user.userinfo ? (
            favorite ? (
              <span
                className='fa fa-heart Option'
                onClick={() =>
                  favorite
                    ? alert('Already favorite')
                    : postFavorite(product._id)
                }
              ></span>
            ) : (
              <span
                className='fa fa-heart-o Option'
                onClick={() =>
                  favorite
                    ? alert('Already favorite')
                    : postFavorite(product._id)
                }
              ></span>
            )
          ) : (
            <React.Fragment />
          )}
          &nbsp; &nbsp; &nbsp;&nbsp;
          {user.userinfo && user.userinfo._id === product.owner._id ? (
            <span
              className='fa fa-pencil Option'
              onClick={() => {
                changeSelected(product._id);
                toggleEditModal();
              }}
            />
          ) : (
            <React.Fragment />
          )}
          <div className='ml-auto text-success'>
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
          </div>
        </CardHeader>
        <CardBody>
          <CardText>
            <b> Category: </b> {product.cat}
            {product.bid ? (
              <React.Fragment>
                <br />
                <br />
                <b>
                  Minimum Increment in bidding price :
                </b> <span>&#8377;</span> {product.incr}
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
            <br />
            <br />
            <b> Owner : </b>{' '}
            <Link to={`${product._id}/owner`}>
              {product.owner.firstname + ' ' + product.owner.lastname}
            </Link>{' '}
            <br />
            <br />
            <b> Email of owner : </b> {product.owner.email} <br />
            <br />
            <b>Descrption: </b>
            <br /> {product.description} <br />
            <br />
            <b>Approved by admin: </b>
            <br /> {product.approved ? 'Yes' : 'No'} <br />
            <br />
            <b> No. of Views: </b> <br /> {product.views} <br />
            <br />
            <b> Highest bid: </b> <br />{' '}
            {reqBid[0] ? (
              <React.Fragment>&#8377; {reqBid[0].amount}</React.Fragment>
            ) : (
              'No bids yet'
            )}{' '}
            <br />
            {user.userinfo && user.userinfo.admin && !product.approved ? (
              <div className='text-center'>
                <br />
                <Button
                  color='success'
                  onClick={() => {
                    approveProduct(product._id);
                  }}
                >
                  Approve <i className='fa fa-check' />
                </Button>
              </div>
            ) : (
              <React.Fragment />
            )}
            {user.userinfo &&
            !user.userinfo.admin &&
            product.approved &&
            product.owner._id === user.userinfo._id ? (
              <div className='text-center'>
                <br />
                <CardLink tag={Link} to={`/bid_history/${product._id}`}>
                  <Button color='warning'>
                    View bid history <i className='fa fa-history' />
                  </Button>
                </CardLink>
              </div>
            ) : (
              <React.Fragment />
            )}
            {user.userinfo &&
            !user.userinfo.admin &&
            product.owner._id !== user.userinfo._id &&
            product.bid ? (
              reqBid.some(bid => bid.bidder._id === user.userinfo._id) ? (
                <React.Fragment>
                  <br />
                  <b> My bid: </b> <br />
                  &#8377;{' '}
                  {
                    reqBid.filter(
                      bid =>
                        bid.bidder._id === user.userinfo._id &&
                        bid.product._id === product._id
                    )[0].amount
                  }{' '}
                  &nbsp; &nbsp;&nbsp; &nbsp;
                  <span
                    className='fa fa-pencil Option'
                    onClick={() => {
                      toggleBidEdit(
                        reqBid.filter(
                          bid =>
                            bid.bidder._id === user.userinfo._id &&
                            bid.product._id === product._id
                        )[0]
                      );
                    }}
                  />{' '}
                  <br />
                  <br />
                </React.Fragment>
              ) : (
                <div className='text-center'>
                  <br />
                  <Button
                    color='warning'
                    onClick={() => {
                      toggleModal();
                    }}
                  >
                    Bid <i className='fa fa-dollar' />
                  </Button>
                </div>
              )
            ) : (
              <React.Fragment />
            )}
          </CardText>
          <br />
        </CardBody>
        <CardFooter className='text-muted'>
          <Row>
            <Col md={6}>
              Created at :{' '}
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              }).format(new Date(Date.parse(product.createdAt)))}
            </Col>
            <Col md={6}>
              Last updated at :{' '}
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              }).format(new Date(Date.parse(product.updatedAt)))}
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  else return <div></div>;
}

var items = [];
class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      isModalOpen: false,
      bidEdit: false,
      amount: 0,
      oldBid: ''
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleBidEdit = this.toggleBidEdit.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    items = [];
    if (this.props.product) {
      let imageArr = this.props.product.images.filter(name => !!name);
      for (let i = 0; i < imageArr.length; i++) {
        items.push({
          id: i,
          altText: this.props.product.images[i].slice(22),
          src:
            'https://click-ism-20.s3.ap-south-1.amazonaws.com/' +
            this.props.product.images[i].slice(22)
        });
      }
    }
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  toggleBidEdit(bid) {
    this.setState({
      bidEdit: !this.state.bidEdit
    });
    this.setState({ oldBid: bid });
    this.setState({ amount: bid.amount });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.product && this.props.user.isAuthenticated) {
      this.props.increaseView(this.props.product._id, this.props.product.views);
    }
    if (this.props.product) this.setState({ amount: this.props.product.price });
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
    let bidOptions = [];
    if (this.props.product && this.props.product.bid) {
      let times =
        (this.props.product.max_bid - this.props.product.price) /
        this.props.product.incr;
      for (let i = 0; i <= times; i++) {
        bidOptions.push(
          <option>
            {this.props.product.price + i * this.props.product.incr}
          </option>
        );
      }
    }

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
        </CarouselItem>
      );
    });

    if (this.props.isLoading || this.props.bids.isLoading) {
      return (
        <div className='container'>
          <div className='row'>
            <Loading />
          </div>
        </div>
      );
    } else if (this.props.errMess) {
      return (
        <div className='container loading'>
          <div className='row heading white-text'>
            <div className='col-12'>
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.errMess}</h3>
            </div>
          </div>
        </div>
      );
    } else if (this.props.bids.errMess) {
      return (
        <div className='container loading'>
          <div className='row heading white-text'>
            <div className='col-12'>
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.bids.errMess}</h3>
            </div>
          </div>
        </div>
      );
    } else
      return (
        <div className='container full'>
          <div className='heading'>
            <style>
              {`.custom-tag {
                    max-width: 100vw;
                    max-height: 700px;
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
          <div className='row'>
            <div className='col-12'>
              <br /> <br />
              <RenderProduct
                product={this.props.product}
                isAdmin={this.props.isAdmin}
                toggleEditModal={this.props.toggleEditModal}
                changeSelected={this.props.changeSelected}
                user={this.props.user}
                postFavorite={this.props.postFavorite}
                favorite={this.props.favorite}
                approveProduct={this.props.approveProduct}
                toggleModal={this.toggleModal}
                bids={this.props.bids.bids}
                toggleBidEdit={this.toggleBidEdit}
              ></RenderProduct>
              <br />
              <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                  Bid for a product
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      this.props.postBid(
                        this.props.product._id,
                        this.props.user.userinfo._id,
                        this.state.amount
                      );
                    }}
                  >
                    <FormGroup>
                      <Label htmlFor='username'>Username of bidder</Label>
                      <Input
                        type='text'
                        id='username'
                        name='username'
                        value={
                          this.props.user.user
                            ? this.props.user.user.username
                            : ''
                        }
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor='product'>Name of product</Label>
                      <Input
                        type='product'
                        id='product'
                        name='product'
                        value={this.props.product.name}
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor='amount'>
                        Amount you want to bid (in &#8377;) :
                      </Label>
                      <Input
                        type='select'
                        name='amount'
                        id='amount'
                        value={this.state.amount}
                        onChange={e => {
                          this.setState({ amount: e.target.value });
                        }}
                      >
                        {bidOptions}
                      </Input>
                    </FormGroup>
                    <Button type='submit' value='submit' color='warning'>
                      Bid
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
              <Modal isOpen={this.state.bidEdit} toggle={this.toggleBidEdit}>
                <ModalHeader toggle={this.toggleBidEdit}>
                  Edit your Bid
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      this.props.editBid(
                        this.state.oldBid._id,
                        this.state.amount
                      );
                    }}
                  >
                    <FormGroup>
                      <Label htmlFor='username'>Username of bidder</Label>
                      <Input
                        type='text'
                        id='username'
                        name='username'
                        value={
                          this.props.user.user
                            ? this.props.user.user.username
                            : ''
                        }
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor='product'>Name of product</Label>
                      <Input
                        type='product'
                        id='product'
                        name='product'
                        value={this.props.product.name}
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor='amount'>
                        Amount you want to bid (in &#8377;) :
                      </Label>
                      <Input
                        type='select'
                        name='amount'
                        id='amount'
                        value={this.state.amount}
                        onChange={e => {
                          this.setState({ amount: e.target.value });
                        }}
                      >
                        {bidOptions}
                      </Input>
                    </FormGroup>
                    <Button type='submit' value='submit' color='warning'>
                      Bid
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </div>
      );
  }
}

export default ProductDetail;
