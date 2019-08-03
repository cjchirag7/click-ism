import React,{Component} from 'react';
import {Row,Col, Card, CardText, CardHeader, CardFooter, CardBody, Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators} from 'reactstrap';
import Loading from './LoadingComponent';
import {Link} from 'react-router-dom';
function RenderProduct({product,toggleEditModal,changeSelected,user,favorite,postFavorite}) {
    if (product != null)
        return(
        <Card>
       
       <CardHeader tag="h3" className="text-danger"><b>{product.name}</b> &nbsp; &nbsp;
       {(user.userinfo)?(          
                                    (favorite) ?
                                        <span className="fa fa-heart Option" onClick={() => favorite ? alert('Already favorite') : postFavorite(product._id)}></span>
                                        : 
                                        <span className="fa fa-heart-o Option" onClick={() => favorite ? alert('Already favorite') : postFavorite(product._id)}></span>
                                    

):(<React.Fragment/>)}
          &nbsp; &nbsp;
        
        &nbsp;&nbsp;
       {(user.userinfo&&(user.userinfo._id===product.owner._id))?(<span className="fa fa-pencil Option" onClick={()=>{changeSelected(product._id);toggleEditModal();}}/>):(<React.Fragment/>)}
       <div className="ml-auto text-success"><b>{product.bid?(<React.Fragment>Bidding range : <span>&#8377;</span> {product.price} - {product.max_bid}</React.Fragment>):<React.Fragment><span>&#8377;</span> {product.price}</React.Fragment>}</b></div>
        </CardHeader>
        <CardBody>
          
          <CardText>
              <b> Category: </b> {product.cat} 
              {product.bid?(<React.Fragment><br/><br/><b>Minimum Increment in bidding price :</b> <span>&#8377;</span> {product.incr}</React.Fragment>):<React.Fragment/>}<br/><br/>
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

var items=[];
class ProductDetail extends Component {

    constructor(props){
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
        items=[];
        if(this.props.product){
        let imageArr=this.props.product.images.filter((name)=>(!!name));
        for(let i=0; i<imageArr.length; i++)
        {
            items.push({
                id: i,
              altText: this.props.product.images[i].slice(22),
              src: ('https://click-ism.s3.us-east-2.amazonaws.com/'+this.props.product.images[i].slice(22))
            })
        }
      }
    
    }
  
    componentDidMount() {
        window.scrollTo(0, 0);
        if(this.props.product&&this.props.user.isAuthenticated){
                this.props.increaseView(this.props.product._id,this.props.product.views);
          }
      }

      onExiting() {
        this.animating = true;
      }
    
      onExited() {
        this.animating = false;
      }
    
      next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
      }

render(){
    const { activeIndex } = this.state;
 
    const slides = items.map((item) => {
        return (
          <CarouselItem
            className="custom-tag"
            tag="div"
            key={item.src}
            onExiting={this.onExiting}
            onExited={this.onExited}
          >
            <img src={item.src} alt={item.altText} className="d-block mx-auto"/>
          </CarouselItem>
        );
      });

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
         <div className="heading">
            <style>
              {
                `.custom-tag {
                    max-width: 100vw;
                  }`
              }
            </style>
            <Carousel
              activeIndex={activeIndex}
              next={this.next}
              previous={this.previous}
            >
              <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
              {slides}
              <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} className="indicator"/>
              <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} className="indicator"/>
            </Carousel>
          </div>
        <div className="row">
          <div className="col-12">
          <br/>        <br/>
          <RenderProduct product={this.props.product} isAdmin={this.props.isAdmin}
                    toggleEditModal={this.props.toggleEditModal}
                    changeSelected={this.props.changeSelected}
                    user={this.props.user}
                    postFavorite={this.props.postFavorite}
                    favorite={this.props.favorite}>
              </RenderProduct>

        <br/>
          </div>
        </div>
      </div>
        );
}

}

export default ProductDetail;