import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
  Badge,
  ListGroupItem,
  ListGroup
} from "reactstrap";
import Loading from "./LoadingComponent.js";
import { Link } from "react-router-dom";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 100000,
      cat: [
        "Stationary",
        "Electronic Gadgets",
        "Bicycles",
        "Clothes",
        "Sports",
        "Others",
        "Books"
      ]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const options = this.state.cat;
    let pos = -1;

    if (e.target.checked) {
      options.push(e.target.value);
    } else {
      let i = 0;
      for (; i < options.length; i++) {
        if (options[i] === e.target.value) {
          pos = i;
          break;
        } else {
        }
      }
      options.splice(pos, 1);
    }
    this.setState({ cat: options });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    var colors = ["warning", "danger", "success", "info", "secondary"];
    var nameRegex = new RegExp(this.state.name, "i");
    const list = this.props.products.map(product => {
      let category_matched = this.state.cat.some(
        category => category === product.cat
      );
      if (
        product.name.search(nameRegex) !== -1 &&
        product.price <= this.state.price &&
        category_matched
      )
        return (
          <ListGroupItem key={product._id} className="text-black">
            <Link to={`/products/${product._id}`}>
              <b>{`${product.name}  `}</b>
            </Link>
            <Badge color={colors[product.cat.length % 5]} pill>
              {" "}
              {product.cat}
            </Badge>
            {this.props.user.userinfo &&
            this.props.user.userinfo._id === product.owner._id ? (
              <React.Fragment>
                &nbsp; &nbsp;
                <span
                  onClick={() => {
                    this.props.changeSelected(product._id);
                    this.props.toggleEditModal();
                  }}
                  className="Option fa fa-pencil"
                />
                {"  "}&nbsp; &nbsp;{" "}
                <span
                  onClick={() => {
                    this.props.changeSelected(product._id);
                    this.props.toggleDeleteModal();
                  }}
                  className="Option fa fa-trash"
                />
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
            <br />{" "}
            <p className="ml-auto text-success">
              {" "}
              <b>
                {product.bid ? (
                  <React.Fragment>
                    Bidding range : <span>&#8377;</span> {product.price} -{" "}
                    {product.max_bid}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span>&#8377;</span> {product.price}
                  </React.Fragment>
                )}
              </b>
            </p>
            <p>
              Owner :{" "}
              <Link to={`products/${product._id}/owner`}>
                {product.owner.firstname + " " + product.owner.lastname}
              </Link>{" "}
            </p>
          </ListGroupItem>
        );
      else return <React.Fragment />;
    });
    if (this.props.productsLoading) {
      return (
        <div className="container loading white-text">
          <div className="row">
            <Loading />
          </div>
        </div>
      );
    } else if (this.props.productsErrMess) {
      return (
        <div className="container loading white-text">
          <div className="row heading">
            <div className="col-12">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.productsErrMess}</h3>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container loading white-text">
          <div className="row">
            <div className="col-12 heading">
              <h3 align="center">Search your product here : </h3>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Name of product</Label>
                      <Input
                        type="name"
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => {
                          this.setState({ name: e.target.value });
                        }}
                        placeholder="Enter name of the product"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="price">Maximum you can afford</Label>
                      <Input
                        type="price"
                        name="price"
                        defaultValue="100000"
                        id="price"
                        value={this.state.price}
                        onChange={e => {
                          this.setState({
                            price: isNaN(Number(e.target.value))
                              ? 100000
                              : Number(e.target.value)
                          });
                        }}
                        placeholder="Enter name of price"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6} md={2}>
                    Category :{" "}
                  </Col>
                </Row>
                <FormGroup check>
                  <Row>
                    <Col xs={6} md={3}>
                      <Label check for="Books">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Books"
                          value="Books"
                          name="cat"
                        />
                        Books
                      </Label>
                    </Col>
                    <Col xs={6} md={3}>
                      <Label check for="Stationary">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Stationary"
                          value="Stationary"
                          name="cat"
                        />
                        Stationary
                      </Label>
                    </Col>

                    <Col xs={6} md={3}>
                      <Label check for="Bicycles">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Bicycles"
                          value="Bicycles"
                          name="cat"
                        />
                        Bicycles
                      </Label>
                    </Col>
                    <Col xs={6} md={3}>
                      <Label check for="Electronic Gadgets">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Electronic Gadgets"
                          value="Electronic Gadgets Science"
                          name="cat"
                        />
                        Electronic Gadgets
                      </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={3}>
                      <Label check for="Clothes">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Clothes"
                          value="Clothes"
                          name="cat"
                        />
                        Clothes
                      </Label>
                    </Col>
                    <Col xs={6} md={3}>
                      <Label check for="Sports">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Sports"
                          value="Sports"
                          name="cat"
                        />
                        Sports
                      </Label>
                    </Col>
                    <Col xs={6} md={3}>
                      <Label check for="Others">
                        <Input
                          defaultChecked
                          type="checkbox"
                          onChange={this.onChange}
                          id="Others"
                          value="Others"
                          name="cat"
                        />
                        Others
                      </Label>
                    </Col>
                  </Row>
                </FormGroup>
              </Form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <br />
              <ListGroup>{list}</ListGroup>
            </div>
          </div>
          <br />
        </div>
      );
    }
  }
}

export default Search;
