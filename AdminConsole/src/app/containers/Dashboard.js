import React, { Component } from 'react';
import { StatsCard } from '../components';
import { Panel } from '../components/common';
import {
  MenuItem,
  DropdownButton,
  PageHeader, ListGroup, ListGroupItem,
  Button,
  Well,
  Collapse,
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { browserHistory } from 'react-router';
import RequireAuth from '../components/RequireAuth';
import DashboardFeedbackCard from '../components/DashboardFeedbackCard';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Filtering
      selectedGroup: { id: 0, name: 'all', parent: -1 },
      selectedCategory: 'all',
      selectedTime: 'all',
      searchTerm: '',

      //Sorting
      sortBy: 'votes',
    };
  }

  renderKeyStats = () => {
    const filteredFeedback = this.props.feedback.list.filter(this.filterFeedback).sort(this.sortFeedback);
    const filteredSolutions =
      this.props.solutions.list
      .filter((solution) => filteredFeedback.some((feedback) => feedback.id === solution.feedbackId))
      .filter(this.filterSolutions);
    const percentOfTopFive = [0,0,0,0,0].reduce((count, item, index) => {
      if (filteredFeedback.length <= index) return count;
      else if(filteredFeedback[index].officialReply) return (count + 1);
      else return count;
    },0)/5*100;

    return (
      <div
        className="row"
        style={{marginBottom: '5px', paddingLeft:15}}>
        <div className="col-md-4">
          <StatsCard
            statValue={filteredFeedback.length || 0}
            statLabel={'New Feedback Submitted!'}
            icon={<i className="fa fa-comments-o"></i>}
            backColor={'red'}
          />
        </div>
        <div className="col-md-4">
          <StatsCard
            statValue={filteredSolutions.length}
            statLabel={'New solutions Proposed!'}
            icon={<i className="fa fa-tasks"></i>}
            backColor={'violet'}
          />
        </div>
        <div className="col-md-4">
          <StatsCard
            statValue={percentOfTopFive}
            statLabel={'% of Top 5 With Responses'}
            icon={<i className="fa fa-check"></i>}
            backColor={'blue'}
          />
        </div>
      </div>
    );
  }

  filterSolutions = (solution) => {
    if (this.state.selectedTime !== 'all') {
      const solutionDate = new Date(solution.date);
      const daysAgo = (Date.now() - solutionDate.getTime())/1000/60/60/24;
      if (this.state.selectedTime === 'lastWeek' && daysAgo > 7)
        return false;
      if (this.state.selectedTime === 'lastMonth' && daysAgo > 30)
        return false;
    }
    return true;
  }

  filterFeedback = (feedback) => {
    //First Filter by Date
    if (this.state.selectedTime !== 'all') {
      const feedbackDate = new Date(feedback.date);
      const daysAgo = (Date.now() - feedbackDate.getTime())/1000/60/60/24;
      if (this.state.selectedTime === 'lastWeek' && daysAgo > 7)
        return false;
      if (this.state.selectedTime === 'lastMonth' && daysAgo > 30)
        return false;
    }
    //Then Filter by Category (all, facilities, hr, other)
    if (this.state.selectedCategory !== 'all' && this.state.selectedCategory !== feedback.category) {
      return false; 
    }
    //Then Filter by Group
    if (this.state.selectedGroup.name !== 'all' && this.state.selectedGroup.name !== feedback.group) {
      return false; 
    }
    //Then Filter by Search
    if (this.state.searchTerm !== '' && !feedback.text.includes(this.state.searchTerm)) {
      return false; 
    }
    return true;
  }

  sortFeedback = (a, b) => {
    if (this.state.sortBy === "MostVotes")
      return b.upvotes - a.upvotes;
    else {
      return new Date(b.date) - new Date(a.date);
    }
  }

  renderFeedbackList = () => {
    return (
      <div className='row' style={{paddingLeft:15}}>
        <Panel title="Feedback List">
          {console.log(this.props.feedback.list[0])}
          {this.props.feedback.list
          .filter(this.filterFeedback)
          .sort(this.sortFeedback)
          .map(feedback =>
            <div key={feedback.id}>
              <DashboardFeedbackCard feedback={feedback} />
            </div>
          )}
        </Panel>
      </div>
    );
  }

  renderTimeControls = () => {
    return (
      <Panel title="Filter by Time">
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'all'})}>All</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'lastWeek'})}>Last Week</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'lastMonth'})}>Last Month</button>
      </Panel>
    );
  }

  renderCategoryControls = () => {
    return (
      <Panel title="Filter by Feedback Category">
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'all'})}>All</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'facilities'})}>Facilities</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'hr'})}>HR</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'other'})}>Other</button>
      </Panel>
    );
  }

  createStylingArray = (currentGroups, lastGroup) => {
    const newGroup = this.props.groupStructure.filter(group => group.id === lastGroup.parent);
    if (newGroup.length) {
      return this.createStylingArray([...currentGroups, ...newGroup], newGroup[0]);
    } else
      return currentGroups;
  }

  renderGroupControls = () => {
    // Step #1 - Create the one dimensional styling array
    const stylingArray = this.createStylingArray([this.state.selectedGroup], this.state.selectedGroup);
    console.log('STYLING ARRAY: ', stylingArray);
    
    // Step #2 - Create the two dimensional output array
    let outputArray = []; 
    stylingArray.forEach((selectedNode, index) => {
      outputArray.push(this.props.groupStructure.filter(group => group.parent === selectedNode.parent));
    });
    console.log('OUTPUT ARRAY: ', outputArray);

    outputArray = outputArray.reverse();

    const bottomRow = this.props.groupStructure.filter(group => group.parent === this.state.selectedGroup.id);
    if (bottomRow.length) outputArray.push(bottomRow);

    const groupsToRender = outputArray.map(row =>
      <div className="row">
        {
          row.map(group =>
            <div className="col-md-3">
              <button onClick={() => this.setState({ selectedGroup: group })}>
                {group.name}
              </button>
            </div>
          )
        }
      </div>
    );

    // Step #3 - Render the output array
    return (
      <Panel title="Filter by Group" className='container-fluid'>
        {groupsToRender}
      </Panel>
    );
  }

  renderSearch = () => {
    return (
      <Panel title='Search to Filter'>
        <input className="form-control" value={this.state.searchTerm} onChange={(event) => this.setState({searchTerm: event.target.value})} />
      </Panel>
    );
  }

  renderSort = () => {
    return (
      <Panel title='Sort by...'>
        <button className="btn btn-default" onClick={() => this.setState({sortBy: 'MostVotes'})}>Most Votes</button>
        <button className="btn btn-default" onClick={() => this.setState({sortBy: 'MostRecent'})}>Most Recent</button>
      </Panel>
    );
  }

  render() {
    return(
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-8'>
            {/* Left Side - Data: Key Stats and Feedback Cards */}
            {this.renderKeyStats()}
            {this.renderFeedbackList()}
          </div>
          <div className='col-md-4'>
            {/* Right Side - Controls: Time, Category, Group */}
            {this.renderSearch()}
            {this.renderSort()}
            {this.renderTimeControls()}
            {this.renderCategoryControls()}
            {this.renderGroupControls()}
          </div>
        </div>     
      </div>
    );
  }  
}

function mapStateToProps(state) {
  const { feedback, solutions } = state;
  const groupStructure = [
    {id: 1, name: '1', parent: 0},
    {id: 2, name: '2', parent: 0},
    {id: 3, name: '3', parent: 0},
    {id: 4, name: '4', parent: 0},
    {id: 5, name: '11', parent: 1},
    {id: 6, name: '12', parent: 1},
    {id: 7, name: '13', parent: 1},
    {id: 8, name: '14', parent: 1},
    {id: 9, name: '111', parent: 5},
    {id: 10, name: '112', parent: 5},
    {id: 11, name: '113', parent: 5},
    {id: 12, name: '114', parent: 5},
  ];
  return { feedback, solutions, groupStructure };
}

export default connect(mapStateToProps, {})(RequireAuth(Dashboard));
