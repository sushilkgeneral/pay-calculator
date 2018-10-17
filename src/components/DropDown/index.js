import React from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const dropDown = (props) => {
    return (
        <Dropdown disabled={props.disabled}
                  value={props.value}
                  onChange={props.handleChange}
                  options={props.options}
                  placeholder={props.placeholder}
        />
    )
};

export default dropDown;