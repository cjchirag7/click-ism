import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardText } from 'reactstrap';
import Loading from './LoadingComponent';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className='container'>
          <div className='row'>
            <Loading />
          </div>
        </div>
      );
    } else if (this.props.errMess) {
      return (
        <div className='container loading white-text'>
          <div className='row heading'>
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
    } else
      return (
        <div className='container mt-6 home text-center align-self-center'>
          <div className='row text-center justify-content-center mt-2'>
            <br />
            <Card className='heading'>
              <CardHeader>
                <h3>User Details</h3>
              </CardHeader>
              <CardBody>
                <CardText>
                  <h5>
                    {' '}
                    First Name : {'          ' + this.props.user.firstname}
                  </h5>
                  <h5>
                    {' '}
                    Last Name : {'          ' + this.props.user.lastname}
                  </h5>
                  <h5> Email : {'          ' + this.props.user.email}</h5>
                  <h5> Username : {'          ' + this.props.user.username}</h5>
                  {this.props.user.showroom ? (
                    <h5>
                      {' '}
                      Address :{' '}
                      {'Room No.          ' +
                        this.props.user.block +
                        '-' +
                        this.props.user.room +
                        ', ' +
                        this.props.user.hostel}
                    </h5>
                  ) : (
                    <React.Fragment />
                  )}
                  {this.props.user.showphone ? (
                    <h5> Contact No. : {'  +91-' + this.props.user.phone}</h5>
                  ) : (
                    <React.Fragment />
                  )}
                  {this.props.user.showfacebook ? (
                    <h5>
                      {' '}
                      Facebook Profile Link :{' '}
                      <a
                        href={
                          'https://www.facebook.com/' +
                          this.props.user.facebookProfile
                        }
                      >
                        <span className='fa fa-facebook'></span>
                      </a>
                    </h5>
                  ) : (
                    <React.Fragment />
                  )}
                </CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      );
  }
}

export default UserDetail;
