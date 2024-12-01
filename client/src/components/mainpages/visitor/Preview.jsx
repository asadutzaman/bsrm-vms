import React from "react";

const Preview = ({ data, onPrevStep }) => {
  return (
    <div>
      <div style={{ width : "100%", display : "flex" }}>
      <div style={{ width : "50%", flex : "1" }}>
      <img src={data.value5} alt="" style={{maxWidth: '120px', borderRadius : "5px"}} />
      </div>
      <div style={{ width : "50%",  flex : "1.9" }}>
      <p><strong>{data.label1}</strong> : {data.value1} </p>
      <p style={{ paddingTop : "10px" }}><strong>{data.label2}</strong> : {data.value2} </p>
      <p style={{ paddingTop : "10px" }}><strong>{data.label3}</strong> : {data.value3} </p>
      <p style={{ paddingTop : "10px" }}><strong>{data.label4}</strong> : {data.value4} </p>
      </div>
      </div>
      <div>
        {/* <button type="button" className="button is-warning mr-2" onClick={onPrevStep}>Go back</button> */}
        <button type="submit" className="button is-primary">
          Submit form
        </button>
      </div>
    </div>
  );
};

export default Preview;
