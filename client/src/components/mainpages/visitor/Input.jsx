import PropTypes from 'prop-types';
import React from 'react';

const Input = ({ type = 'text', placeholder, name, value, onChange, error, label }) => {
  return(
    <div>
      <label style={{ fontFamily : "Helvetica", color: "#7C7C7C", fontSize : "12px" }}>{label}</label>
      <input
        className={error ? "is-danger" : "input"} 
        type={type} 
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      {error && <div className="has-text-danger-dark">{error}</div>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onChange: PropTypes.func.isRequired
}

export default Input;