import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, Label, Col, Row } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import Loading from './LoadingComponent';

const required = val => val && val.length;
const requiredNum = val => !!val;
const minLength = len => val => val && val.length >= len;
const maxVal = len => val => !val || val <= len;
const minVal = len => val => val && val >= len;
const isNumber = val => !isNaN(Number(val));
const multiple = num => val => !val || val % num === 0;

/*let fileAdder=(e)=>{
    this.setState({imageFiles: this.state.imageFiles.concat(e.target.files)})
};*/

class UploadItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: false,
      images: [],
      imageFiles: []
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(image) {
    console.log(image);
    this.setState({
      images: this.state.images.concat(image)
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let uniqueName = val =>
      !this.props.products.some(product => product.name === val);

    if (this.props.productsLoading) {
      return (
        <div className='container'>
          <div className='row'>
            <Loading />
          </div>
        </div>
      );
    } else if (this.props.productsErrMess) {
      return (
        <div className='container loading  white-text'>
          <div className='row heading'>
            <div className='col-12'>
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.productsErrMess}</h3>
            </div>
          </div>
        </div>
      );
    } else
      return (
        <div className='container  white-text'>
          <div className='row justify-content-center heading'>
            <div className='col-12'>
              <h3 align='center'> Upload a product</h3>
            </div>
          </div>
          <div className='row row-content justify-content-center'>
            <LocalForm
              onSubmit={values => {
                if (
                  (values.bid &&
                    Number(values.max_bid) > Number(values.price) &&
                    Number(values.incr) <=
                      Number(values.max_bid - values.price) / 2) ||
                  !values.bid
                ) {
                  var input = document.querySelector('input[type="file"]');
                  this.props.postProduct(
                    values.name,
                    values.cat,
                    values.description,
                    values.price,
                    values.bid,
                    values.max_bid,
                    values.incr,
                    input.files
                  );
                } else if (Number(values.max_bid) < Number(values.price)) {
                  alert(
                    'Maximum price should be greater than the minimum price'
                  );
                } else {
                  alert(
                    'Incremental price can be at most half the range of bidding'
                  );
                }
              }}
            >
              <Row className='form-group'>
                <Label htmlFor='name' md={2}>
                  Name{' '}
                </Label>
                <Col md={4}>
                  <Control.text
                    model='.name'
                    id='name'
                    name='name'
                    placeholder='Name of product'
                    className='form-control'
                    validators={{
                      required,
                      minLength: minLength(3),
                      uniqueName
                    }}
                  />
                  <Errors
                    className='text-danger'
                    model='.name'
                    show='touched'
                    messages={{
                      required: 'Required',
                      minLength: ' Must be greater than 2 characters',
                      uniqueName:
                        ' There exists a product with this name already'
                    }}
                  />
                </Col>
                <Label htmlFor='cat' md={2}>
                  Category
                </Label>
                <Col md={4}>
                  <Control.select
                    model='.cat'
                    name='cat'
                    id='cat'
                    className='form-control'
                    defaultValue='Stationary'
                  >
                    <option>Stationary</option>{' '}
                    <option>Electronic Gadgets</option>
                    <option>Bicycles</option> <option>Clothes</option>
                    <option>Sports</option> <option>Books</option>
                    <option>Others</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Col md={4}>
                  <Control.checkbox
                    model='.bid'
                    id='bid'
                    name='bid'
                    className='form-control'
                    disabled={false}
                    checked={this.state.bid}
                    defaultChecked={this.state.bid}
                    onChange={e => {
                      this.setState({ bid: !this.state.bid });
                    }}
                  />
                </Col>
                <Col md={8}>
                  <Label check htmlFor='bid'>
                    {' '}
                    Allow Bidding
                  </Label>
                </Col>
              </Row>
              {this.state.bid ? (
                <React.Fragment>
                  <Row className='form-group'>
                    <Label htmlFor='price' md={4}>
                      Minimum Price (in &#8377;){' '}
                    </Label>
                    <Col md={8}>
                      <Control.text
                        model='.price'
                        id='price'
                        name='price'
                        defaultValue={10}
                        className='form-control'
                        validators={{
                          requiredNum,
                          minVal: minVal(10),
                          isNumber
                        }}
                      />
                      <Errors
                        className='text-danger'
                        model='.price'
                        show='touched'
                        messages={{
                          requiredNum: ' Required',
                          minVal: ' Must be greater than 10 Rs.',
                          isNumber: ' Must be a number'
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className='form-group'>
                    <Label htmlFor='max_bid' md={4}>
                      Maximum Price (in &#8377;){' '}
                    </Label>
                    <Col md={8}>
                      <Control.text
                        model='.max_bid'
                        id='max_bid'
                        name='max_bid'
                        defaultValue={100000}
                        className='form-control'
                        validators={{
                          requiredNum,
                          maxVal: maxVal(100000),
                          isNumber
                        }}
                      />
                      <Errors
                        className='text-danger'
                        model='.max_bid'
                        show='touched'
                        messages={{
                          requiredNum: ' Required',
                          maxVal: ' Must be less than 100000 Rs.',
                          isNumber: ' Must be a number'
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className='form-group'>
                    <Label htmlFor='incr' md={4}>
                      Minimum Increment (in &#8377;){' '}
                    </Label>
                    <Col md={8}>
                      <Control.text
                        model='.incr'
                        id='incr'
                        name='incr'
                        defaultValue={10}
                        className='form-control'
                        validators={{
                          requiredNum,
                          minVal: minVal(10),
                          maxVal: maxVal(10000),
                          multiple: multiple(10),
                          isNumber
                        }}
                      />
                      <Errors
                        className='text-danger'
                        model='.incr'
                        show='touched'
                        messages={{
                          requiredNum: ' Required',
                          minVal: ' Must be greater than 10 Rs.',
                          maxVal: ' Must be less than 10000 Rs.',
                          multiple: ' Must be a multiple of 10',
                          isNumber: ' Must be a number'
                        }}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              ) : (
                <Row className='form-group'>
                  <Label htmlFor='price' md={4}>
                    Price (in &#8377;){' '}
                  </Label>
                  <Col md={8}>
                    <Control.text
                      model='.price'
                      id='price'
                      name='price'
                      defaultValue={10}
                      className='form-control'
                      validators={{
                        requiredNum,
                        minVal: minVal(10),
                        isNumber
                      }}
                    />
                    <Errors
                      className='text-danger'
                      model='.price'
                      show='touched'
                      messages={{
                        requiredNum: ' Required',
                        minVal: ' Must be greater than 10 Rs.',
                        isNumber: ' Must be a number'
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <ImageUploader
                  withIcon={true}
                  label='Maximum 4 images, Recommended height : 500px, only .gif,.jpg,.png,.jpeg allowed'
                  buttonText='Choose images'
                  withLabel={true}
                  onChange={this.onDrop}
                  labelClass='text-secondary'
                  imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                  maxFileSize={5242880}
                  withPreview
                  className='uploader'
                  name='images'
                />
              </Row>
              <Row className='form-group'>
                <Label htmlFor='description' md={2}>
                  Description
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model='.description'
                    id='description'
                    name='description'
                    rows='12'
                    placeholder='Some description of the product'
                    className='form-control'
                  />
                </Col>
              </Row>
              <Row className='align-self-center'>
                <Col className='text-center'>
                  <Button type='submit' className='bg-primary'>
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </div>
          <br />
        </div>
      );
  }
}

export default UploadItem;
