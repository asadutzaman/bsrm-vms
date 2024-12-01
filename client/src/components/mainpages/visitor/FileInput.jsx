import PropTypes from 'prop-types';
import React, { useRef } from 'react';

const FileInput = ({ onChange, name, error, stepKey, fileName }) => {
  const fileInput = useRef();

  const openFilePicker = () => {
    fileInput.current.click();
  }

  const fileChangeHandler = (e) => {
    if(e.target.files[0]) {
      onChange(name, e.target.files[0], stepKey);
    }else {
      onChange(name, {}, stepKey);
    }
  }

  return(
    <div className="mb-5">
      <input type="file" name={name} ref={fileInput} onChange={fileChangeHandler} className="is-hidden" />
      <div className="is-flex" style={{alignItems: 'center'}}>
        {/* <button type="button" className="button is-info mr-3" onClick={openFilePicker}>Choose file</button> */}
       
      </div>
      {error && <div className="has-text-danger-dark">{error}</div>}
    </div>
  );
}

FileInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  stepKey: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
}

export default FileInput;