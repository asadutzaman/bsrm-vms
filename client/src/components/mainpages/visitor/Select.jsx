import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

const Select = ({ name, value, onChange, choices, error }) => {
  const state = useContext(GlobalState);
  const employees = state.employeeAPI.employee;
  return(
    <div className="mb-5">
      <div className={error ? "select is-fullwidth is-danger inputt" : "select is-fullwidth inputt"}>
        <select 
          name={name}
          value={value}
          onChange={onChange}
        >
          {employees[0].map((choice, index) => (
            <option key={index} value={choice.mobile}>{choice.mobile}</option>
          ))}
        </select>
      </div>  
      {error && <div className="has-text-danger-dark">{error}</div>}
    </div>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })).isRequired,
  error: PropTypes.string
}

export default Select;