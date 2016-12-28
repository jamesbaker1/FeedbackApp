import React from 'react';
import Moment from 'moment';
import Feedback_Row from './feedback_row.js';

import {DateRangePicker} from 'react-dates';

export default class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {  	
    this.props.updateDates(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), this.props.requestedFeedback, this.props.receivedFeedback);
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });  
  }

  render() {
    const { focusedInput } = this.state;
    const { start_date, end_date } = this.props.main;
    const Rows = this.props.feedback.map((feedback, index) => {
    	return <Feedback_Row key={index} feedback={feedback} department={"Other"} />
    });
    return (
      <div>
        <DateRangePicker
          {...this.props}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={Moment(start_date)}
          endDate={Moment(end_date)}
          isOutsideRange={() => false}
        />
        <table>
        	<thead>
					  <tr>
					    <th>Feedback</th>
					    <th>Department Category</th>
					  </tr>
				  </thead>
				  <tbody>
				  	{Rows}
			  	</tbody>
        </table>
      </div>
    );
  }
}