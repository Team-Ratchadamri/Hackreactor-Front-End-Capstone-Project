import React from 'react';
import Banner from './Overview/Banner.jsx'
import Overview from './Overview/Overview.jsx';
import Cards from './Cards/index.jsx';
import ReviewsSection from './Reviews&Ratings/ReviewsSection.jsx';
import axios from 'axios';
import QuestionsList from './QandA/QuestionsList.jsx';

class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    currentProduct: {}
  }
  //BIND FUNCTIONS IN HERE
  this.updateStyle = this.updateStyle.bind(this);
  }

  // set default start up productId
  componentDidMount() {
    axios.get('/products/37318')
      .then((response)=>{
        this.setState({currentProduct: response.data});
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  updateStyle(productId) {
    axios.get(`/products/${productId}`)
      .then((response)=>{
        this.setState({currentProduct: response.data});
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  // componentDidMount() {
  //   update(37311)
  // }


render () {
return (
  <div>
    <Banner />
    <div>
      <Overview product={this.state.currentProduct}/>
    </div>
    <div>
    <Cards product={this.state} pageChange={this.updateStyle}/>
    </div>
    <div>
    <QuestionsList currentProductID={this.state.currentProduct.id} />
    </div>

    <div>
    REVIEWS HERE
    <ReviewsSection productId={this.state.currentProduct.id}/>
    </div>
  </div>
)
}
}

export default App;