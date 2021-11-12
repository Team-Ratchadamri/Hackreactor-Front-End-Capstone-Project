import React from 'react';
import Question from './Question.jsx';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';
import QuestionSubmissionForm from './QuestionSubmissionForm.jsx';
import Modal from './Modal.jsx';

class QuestionsList extends React.Component {
  constructor(props){
    super(props);
    this.state={
      questions: [],
      moreQuestionsClicked: false,
      modalShowing: false,
      search: '',
      filtered: []
    };
    this.showModal=this.showModal.bind(this);
    this.hideModal=this.hideModal.bind(this);
  }

showModal(){
  this.setState({modalShowing: true});
}

hideModal(){
  this.setState({modalShowing: false});
}

  componentDidUpdate(prevProps) {
    if (prevProps.currentProductID !== this.props.currentProductID) {
    //console.log('currentProductID: ', this.props.currentProductID);
    axios.get(`/qa/questions/${this.props.currentProductID}`)
      .then((response)=>{
       // console.log('componentDidMount response: ', response.data.results);
        this.setState({questions: response.data.results.sort((a, b) => b.question_helpfulness - a.question_helpfulness)});
        //console.log('questions: ', this.state.questions);
      })
      .catch((err)=>{
        console.log('error in QList componentDidMount: ', err);
      })
    }
  }

  filterQuestions(arr, searchQuery) {
    return arr.filter((el)=>{
      return el.question_body.toLowerCase().indexOf(searchQuery.toLowerCase()) !==-1
    });
  }

 handleSearch(search){
   //console.log('handleSearch invoked with search query: ', search);
   var filteredQuestions=this.filterQuestions(this.state.questions, search);
   this.setState({filtered: filteredQuestions});
   //console.log('current filtered value: ', this.state.filtered);
 }

 handleQuestionSubmission(question, nickname, email){
   console.log('inside of handleQuestionSubmission heres the question, nickname, and email: ', question, nickname, email);
   var data={
     body: question,
     name: nickname,
     email: email,
     product_id: this.props.currentProductID
   };
   var currentID=this.props.currentProductID;
   console.log('current id in handleQSubmission: ', currentID);
   axios.post(`/qa/questions/`, data)
   .then((response)=>{
    console.log('handleQuestionSubmission successful post ');
    //this.setState({questions: response.data.results.sort((a, b) => b.question_helpfulness - a.question_helpfulness)});
   // console.log('questions: ', this.state.questions);
  })
  .catch((err)=>{
    console.log('error in handleQuestionSubmission: ', err);
  })
 }

 handleMoreQuesitionsClick(){
   this.setState({
     moreQuestionsClicked: true
   });
 }

 handleFewerQuesitionsClick(){
   this.setState({
     moreQuestionsClicked: false
   });
 }

  render(){
    if(this.state.questions.length===0){
      return(
        <div className= 'qa-widget-home'>
          <h5 className='header'>Questions And Answers</h5>
          {/* <SearchBar handleSearch={this.handleSearch.bind(this)}/> */}
          <button className='add-questions-btn' onClick={this.showModal}>Add Question +</button>
          <Modal className='modal-question-submission' isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <QuestionSubmissionForm handleQuestionSubmission={this.handleQuestionSubmission.bind(this)}/>
          </Modal>
        </div>
      );
    }

    if(this.state.filtered.length===0){
    if(this.state.moreQuestionsClicked){
      return(
        <div className='qa-widget-home'>
          <h5 className='header'>Questions And Answers</h5>
          <SearchBar handleSearch={this.handleSearch.bind(this)}/>
          <div className='questions-list'>
            {this.state.questions.map((question, i)=>{
              return(
                <Question key={i} question={question} answersList={question.answers}/>
              );
            })}
          </div>
          <button className='more-questions-btn' onClick={this.handleFewerQuesitionsClick.bind(this)}>See Fewer Answered Questions</button>
          <button className='add-questions-btn' onClick={this.showModal}>Add Question +</button>
          <Modal className='modal-question-submission' isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <QuestionSubmissionForm handleQuestionSubmission={this.handleQuestionSubmission.bind(this)}/>
          </Modal>
        </div>
      );
    } else {
      //default if no search and questions isn't empty
      return(
        <div className='qa-widget-home'>
          <h5 className='header'>Questions And Answers</h5>
          <SearchBar handleSearch={this.handleSearch.bind(this)}/>
          <div className='questions-list'>
            {this.state.questions.slice(0,2).map((question, i)=>{
            return(
              <Question key={i} question={question} answersList={question.answers}/>
            );
            })}
          </div>
          <button className='more-questions-btn' onClick={this.handleMoreQuesitionsClick.bind(this)}>See More Questions</button>
          <button className='add-questions-btn' onClick={this.showModal}>Add Question +</button>
          <Modal className='modal-question-submission' isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <QuestionSubmissionForm handleQuestionSubmission={this.handleQuestionSubmission.bind(this)} />
          </Modal>
        </div>
      );
    }
  } else {
    if(this.state.moreQuestionsClicked){
      return(
        <div className='qa-widget-home'>
          <h5 className='header'>Questions And Answers</h5>
          <SearchBar handleSearch={this.handleSearch.bind(this)}/>
          <div className='questions-list'>
            {this.state.filtered.map((question, i)=>{
              return(
                <Question key={i} question={question} answersList={question.answers}/>
              );
            })}
          </div>
          <button className='more-questions-btn' onClick={this.handleFewerQuesitionsClick.bind(this)}>See Fewer Answered Questions</button>
          <button className='add-questions-btn' onClick={this.showModal}>Add Question +</button>
          <Modal className='modal-question-submission' isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <QuestionSubmissionForm handleQuestionSubmission={this.handleQuestionSubmission.bind(this)}/>
          </Modal>
        </div>
      );
    } else {
      return(
        <div className='qa-widget-home'>
          <h1 className='header'>Questions And Answers</h1>
          <SearchBar handleSearch={this.handleSearch.bind(this)}/>
          <div className='questions-list'>
            {this.state.filtered.slice(0,2).map((question, i)=>{
            return(
              <Question key={i} question={question} answersList={question.answers}/>
            );
            })}
          </div>
          <button className='more-questions-btn' onClick={this.handleMoreQuesitionsClick.bind(this)}>See More Questions</button>
          <button className='add-questions-btn' onClick={this.showModal}>Add Question +</button>
          <Modal className='modal-question-submission' isShowing={this.state.modalShowing} handleClose={this.hideModal}>
          <QuestionSubmissionForm handleQuestionSubmission={this.handleQuestionSubmission.bind(this)} />
          </Modal>
        </div>
      );
    }
  }
  }
}

export default QuestionsList;