import React,{Component} from 'react';
import { Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import Loading from './LoadingComponent.js';

function Renderbid ({bid,i}) {
    const deadline = new Date( Date.parse(bid.updatedAt));
   
    return (
            <React.Fragment>
            <td>
            {i}
            </td>
            <td>
            <Link to={`/users/${bid.bidder._id}`}>
            {bid.bidder.firstname+' '+bid.bidder.lastname}
            </Link>
            </td>
            <td>
            {bid.bidder.email}
            </td>
            <td>
                {new Intl.DateTimeFormat('en-US',{year: 'numeric', month: 'short', day: '2-digit'}).format(new Date( Date.parse(bid.createdAt)))}
            </td>
            <td>
                {new Intl.DateTimeFormat('en-US',{year: 'numeric', month: 'short', day: '2-digit'}).format(deadline)}
            </td>
            <td>
                {
                    bid.amount
                }
            </td>
            </React.Fragment>
       );
}

class History extends Component {

    constructor(props){
        super(props);
        this.state={
         }
        this.i=1; 
    }
    componentDidMount() {
        window.scrollTo(0, 0)
      }

render(){
    let reqBids;
    if(this.props.bids.bids&&this.props.product)
       reqBids=this.props.bids.bids.filter((bid)=>(bid.product && (bid.product._id===this.props.product._id) ));
    if (this.props.bids.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (this.props.bids.errMess) {
        return(
            <div className="container loading">
                <div className="row heading text-white"> 
                    <div className="col-12">
                        <br/><br/><br/><br/>
                        <h3>{this.props.errMess}</h3>
                    </div>
                </div>
            </div>
        );
    }
    else if(this.props.bids.bids.length===0||!reqBids||reqBids.length===0){
        return (
            <div className="container loading">
                <div className="row heading"> 
                    <div className="col-12 text-center text-white">
                        <br/><br/><br/><br/>
                        <h4>{'No bids yet'}</h4> 
                        <h4>{'Wait for a user to bid'}</h4>
                    </div>
                </div>
            </div>
        );
    }
    else {
        const list = reqBids.map((bid) => {
            return (
                    <tr key={bid._id}>
                        <Renderbid bid={bid} 
                                     i={this.i++}
                        />
                    </tr>
            );
        });
    
        return(

        <div className="container mt-6 text-center align-self-center full">
            <div className="row text-center justify-content-center">
            <div className="col-12 heading white-text">
                <h3>Bid History for <Link to={`/products/${this.props.product._id}`}>{this.props.product.name}</Link></h3>
               <br/>
               <br/>
                <Table striped bordered hover responsive>
        <thead>
           <tr>
            <th>S.No.</th>
            <th>Name of bidder</th>
            <th>Email</th>
            <th>Bid made on</th>
            <th>Bid updated on</th>
            <th>Amount (in &#8377;)</th>
           </tr>
        </thead>
        <tbody>
            {list}
        </tbody>
        </Table>
            <br/>
            <br/>
            </div>
            </div>
            </div>
        );
        }
    }

}

export default History;