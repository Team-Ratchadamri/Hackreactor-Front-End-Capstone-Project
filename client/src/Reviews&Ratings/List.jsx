import React from "react";
import Tile from "./Tile.jsx";
import axios from "axios";
import MoreButton from "./MoreButton.jsx";
import AddButton from "./AddButton.jsx";
import Form from "./Form.jsx";
import Modal from "./Modal.jsx";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShowing: false,
      value: "Relevant",
      reviews: [],
      displayList: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.sortByHelpfulness = this.sortByHelpfulness.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
    this.renderList = this.renderList.bind(this);
    this.addMore = this.addMore.bind(this);
    this.updateHelpfulness = this.updateHelpfulness.bind(this);
    this.filterList = this.filterList.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.getList = this.getList.bind(this);
  }



  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productId !== this.props.productId || prevProps.filteredReviews !== this.props.filteredReviews) {
      axios
        .get("/reviews/", {
          params: {
            product_id: this.props.productId,
            page: 1,
            count: 1000,
            sort: "Relevant",
          },
        })
        .then(({ data }) => {
          // console.log("Data:", data.results);

          if (this.props.filteredReviews.length !== 0) {

            this.setState({ reviews: this.props.filteredReviews });
          } else {
            this.setState({
              reviews: data.results,
            });
          }
          this.renderList();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  sortByHelpfulness() {
    axios
      .get("/reviews/", {
        params: {
          product_id: this.props.productId,
          page: 1,
          count: 1000,
          sort: "helpful",
        },
      })
      .then(({ data }) => {
        // console.log("Helpful data:", data.results);

        if (this.props.filteredReviews.length !== 0) {
          this.setState({
            value: "Helpful",
            reviews: this.props.filteredReviews,
          });
        } else {
          this.setState({
            value: "Helpful",
            reviews: data.results,
          });
        }
        this.renderList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortByNewest() {
    axios
      .get("/reviews/", {
        params: {
          product_id: this.props.productId,
          page: 1,
          count: 1000,
          sort: "newest",
        },
      })
      .then(({ data }) => {
        if (this.props.filteredReviews.length !== 0) {
          this.setState({
            value: "Newest",
            reviews: this.props.filteredReviews,
          });
        } else {
          this.setState({
            value: "Newest",
            reviews: data.results,
          });
        }
        this.renderList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortByRelevant() {
    axios
      .get("/reviews/", {
        params: {
          product_id: this.props.productId,
          page: 1,
          count: 1000,
          sort: "relevant",
        },
      })
      .then(({ data }) => {
        // console.log("relevant data:", data.results);
        if (this.props.filteredReviews.length !== 0) {
          this.setState({
            value: "Relevant",
            reviews: this.props.filteredReviews,
          });
        } else {
          this.setState({
            value: "Relevant",
            reviews: data.results,
          });
        }
        this.renderList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getList() {
    axios
      .get("/reviews/", {
        params: {
          product_id: this.props.productId,
          page: 1,
          count: 1000,
          sort: "Relevant",
        },
      })
      .then(({ data }) => {
        // console.log("Data:", data.results);

        this.setState({ reviews: data.results });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderList() {
    let list = [];
    if (this.state.reviews[0]) {
      list.push(this.state.reviews[0]);
    }
    if (this.state.reviews[1]) {
      list.push(this.state.reviews[1]);
    }
    this.setState({ displayList: list });
  }

  addMore(review1, review2) {
    let currentList = [...this.state.displayList];
    if (review1) {
      currentList.push(review1);
    }
    if (review2) {
      currentList.push(review2);
    }
    this.setState({ displayList: currentList });
  }

  handleChange(event) {
    let sortType = event.target.value;

    // console.log("we sorting by:", sortType);

    if (sortType === "Newest") {
      // console.log("newest");
      this.sortByNewest();
    } else if (sortType === "Helpful") {
      // console.log("helpful");
      this.sortByHelpfulness();
    } else {
      // console.log("relevant");
      this.sortByRelevant();
    }
  }

  updateHelpfulness(reviewId) {
    // console.log(`we gonna update ${reviewId} this helpfulness bruh!`);
    let reviews = this.state.displayList.map((review) => {
      if (reviewId === review.review_id) {
        review.helpfulness += 1;
      }
      return review;
    });
    // console.log("reviews:", reviews);
    this.setState({ displayList: reviews });
  }

  filterList(reviews, filteredRatings) {
    let filteredReviews = reviews.filter((review) => {
      if (review.rating === filteredRatings[0].rating) {
        return review;
      }
    });
    return filteredReviews;
  }

  showModal() {
    this.setState({ modalShowing: true });
  }

  hideModal() {
    this.setState({ modalShowing: false });
  }

  render() {
    if (
      !this.props.characteristics ||
      !this.props.productId ||
      !this.props.reviews ||
      !this.props.ratings ||
      !this.state.reviews ||
      !this.state.displayList
    ) {
      // console.log('Undefined Area');
    }
    return (
      <div className="list-container">

          <div className="list-total-num-reviews">
            # of reviews for viewed product{this.state.reviews.length}
          </div>

          <label className="list-dropdown-title">
            Sort on
            <select
              className="list-dropdown"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <option value="Relevant">Relevant</option>
              <option value="Helpful">Helpful</option>
              <option value="Newest">Newest</option>
            </select>
          </label>

          <div className="list-tile-container">
            {this.state.displayList.map((review, id) => {
              return (
                <Tile
                  key={id}
                  review={review}
                  updateHelpfulness={this.updateHelpfulness}
                />
              );
            })}
          </div>
          <div className="list-button-container">
            <MoreButton
              reviews={this.state.reviews}
              displayList={this.state.displayList}
              addMore={this.addMore}
            />
            <AddButton showModal={this.showModal} />
          </div>

        <Modal isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <Form
            characteristics={this.props.characteristics}
            productId={this.props.productId}
            handleClose={this.hideModal}
            renderList={this.renderList}
            selections={this.props.selections}
            getList={this.getList}
          />
        </Modal>
      </div>
    );
  }
}

export default List;
