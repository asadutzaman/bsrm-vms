import React, { useState } from "react";

function VisitorInfo() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    company: "",
    address: "",
    emp_mobile: "",
    emp_name: "",
    designation: "",
    department: "",
    cardno: "",
  });

  const [count, setCount] = useState(1);

  const formUpdate = (e) => {
    setForm({
      ...form,
      [e.target.name]: [e.target.value],
    });
  };

  console.log(form);

  return (
    <div className="wrapper">
        {count === 1 ? (
            <h1>Visitor Information</h1>
        ):null}
      {count === 2 ? (
            <h1>Information whom i want to visit</h1>
        ):null}
      {count === 3 ? (
            <h1>Visitor card</h1>
        ):null}
      
      <div className="visitorinfo-page">
        <form autoComplete="off">

{count === 1 ? (
    <div>
          <label>FULL NAME</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter full name"
            value={form.name}
            onChange={formUpdate}
          />
          <label>MOBILE NO</label>
          <input
            type="number"
            name="mobile"
            required
            placeholder="Enter mobile no"
            value={form.mobile}
            onChange={formUpdate}
          />
          <label>COMPANY</label>
          <input
            type="text"
            name="company"
            aria-required
            placeholder="Enter company"
            value={form.company}
            onChange={formUpdate}
          />
          <label>ADDRESS</label>
          <input
            type="text"
            name="address"
            aria-required
            placeholder="Enter address"
            value={form.address}
            onChange={formUpdate}
          />
          <div className="row">
            <button onClick={() => setCount(count + 1)} type="submit">
              NEXT
            </button>
          </div>
          </div>
):null}
            

{count === 2 ? (
    <div>
          <label>MOBILE NO</label>
          <select name="emp_mobile" onChange={formUpdate}>
            <option value="01700704436">01700704436</option>
            <option value="01766789538"></option>
            <option value="01911249430">01911249430</option>
          </select>
          <input
            type="text"
            name="emp_name"
            aria-required
            placeholder="Enter employee name"
            value={form.emp_name}
            onChange={formUpdate}
          />
           <input
            type="text"
            name="designation"
            aria-required
            placeholder="Enter designation"
            value={form.designation}
            onChange={formUpdate}
          />
           <input
            type="text"
            name="department"
            aria-required
            placeholder="Enter department"
            value={form.department}
            onChange={formUpdate}
          />
          <div className="row">
            <button onClick={() => setCount(count + 1)} type="submit">
              NEXT
            </button>
          </div>
         </div>
):null}

          
{count === 3 ? (
<div>
          <label>CARD NO</label>
          <input
            type="text"
            name="cardno"
            aria-required
            placeholder="Enter cardno"
            value={form.cardno}
            onChange={formUpdate}
          />
          <div className="row">
            <button onClick={() => setCount(count)} type="submit">
              SUBMIT
            </button>
          </div>
          </div>
):null}
        </form>
      </div>
    </div>
  );
}

export default VisitorInfo;
