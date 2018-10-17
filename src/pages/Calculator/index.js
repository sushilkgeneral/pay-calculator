import React, { Component } from 'react';
import DropDown from '../../components/DropDown'

class Calculator extends Component{
    state = {
        startTime: null,
        endTime: null,
        bedTime: null,
        pay: null,
        error: null
    };

    handleChange = (timeType, selectedOption) => {
        let mergeObject = { pay: null, error: null }; //resetting calculated pay & error if any
        mergeObject[timeType] = selectedOption;

        if(timeType==='startTime' && this.state.endTime && this.state.endTime.value<=selectedOption.value) {
            // if end time is previously selected & start time is modified to a time later than end time,
            // reset end time
            mergeObject.endTime = null;
        }

        this.setState(mergeObject);
    };



    calculatePay = () => {
        const { startTime, endTime, bedTime } = this.state;
        if(!startTime) {
            this.setState({error: 'Start time is Required'})
        } else if (!endTime) {
            this.setState({error: 'End time is Required'})
        } else if (!bedTime) {
            this.setState({error: 'Bed time is Required'})
        } else {
            this.setState({pay: `$${this.getPay()}`, error: null})
        }
    };

    render() {
        return (
            <div className='calculator'>
                <h1>Pay Calculator</h1>
                {this.state.error ? <div className='error'>{this.state.error}</div> : null}
                <div className='time-selectors'>
                    <DropDown value={this.state.startTime}
                              placeholder={'Select Start Time'}
                              options={this.getOptions()}
                              handleChange={(val) => {this.handleChange('startTime', val)}}
                    />
                    <DropDown disabled={!this.state.startTime}
                              value={this.state.endTime}
                              placeholder={'Select End Time'}
                              options={this.getEndOptions()}
                              handleChange={(val) => {this.handleChange('endTime', val)}}
                    />
                    <DropDown value={this.state.bedTime}
                              placeholder={'Select Bed Time'}
                              options={this.getOptions()}
                              handleChange={(val) => {this.handleChange('bedTime', val)}}
                    />
                </div>
                <button onClick={this.calculatePay}>Calculate</button>
                {this.state.pay ? <div className='charge'>Nightly Charge: {this.state.pay}</div> : null}
            </div>
        )
    }

    getOptions = () => {
        return [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4].map((hour, idx) => {
            return {label: (hour<12 && hour>4) ? `${hour}:00 pm` : `${hour}:00 am`, value: idx}
        })
    };

    getEndOptions = () => {
        const startOptions = this.getOptions();
        let endOptions = [];

        if(this.state.startTime) {
            endOptions = startOptions.slice(this.state.startTime.value+1);
        }

        return endOptions;

    };

    getPay = () => {
        const { startTime, endTime, bedTime } = this.state;

        const startTimeVal = startTime.value;
        const endTimeVal = endTime.value;
        const bedTimeVal = bedTime.value;

        let twelveDollarHours = 0, eightDollarHours = 0, sixteenDollarHours = 0;

        if (bedTimeVal>=7) {
            //bedtime is at/past midnight
            if (startTimeVal<7) {
                //start time is before midnight
                if(endTimeVal>=7) {
                    //end time is after midnight
                    twelveDollarHours = 7 - startTimeVal;
                    sixteenDollarHours = endTimeVal - 7
                } else {
                    //end time is before midnight
                    twelveDollarHours = endTimeVal-startTimeVal;
                }
            } else {
                //start time is after midnight
                sixteenDollarHours = endTimeVal - startTimeVal;
            }
        } else {
            // bed time is before midnight
            if (bedTimeVal>startTimeVal && bedTimeVal<endTimeVal) {
                //bedtime is during hours worked
                if  (endTimeVal<7) {
                    // end time is before midnight
                    twelveDollarHours = bedTimeVal-startTimeVal;
                    eightDollarHours = endTimeVal-bedTimeVal;
                } else {
                    // end time is at/after midnight
                    twelveDollarHours = bedTimeVal-startTimeVal;
                    eightDollarHours = 7-bedTimeVal;
                    sixteenDollarHours = endTimeVal-7;
                }
            } else {
                // bedtime is outside of the hours worked
                if (startTimeVal<bedTimeVal) {
                    // sitter left before bedTime
                    twelveDollarHours = endTimeVal-startTimeVal;
                } else {
                    // sitter arrived after bed time
                    if (startTimeVal<7) {
                        // start time is before midnight
                        if(endTimeVal>=7) {
                            // end time is at/after midnight
                            eightDollarHours = 7-startTimeVal;
                            sixteenDollarHours = endTimeVal-7;
                        } else {
                            // end time is before midnight
                            eightDollarHours = endTimeVal-startTimeVal;
                        }
                    } else {
                        // start time is at/after midnight
                        sixteenDollarHours = endTimeVal-startTimeVal;
                    }
                }
            }
        }

        return twelveDollarHours*12 + eightDollarHours*8 + sixteenDollarHours*16;
    };
}

export default Calculator;