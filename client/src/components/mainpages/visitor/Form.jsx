import axios from 'axios';
import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import validate from '../utils/validate';
import Preview from './Preview';
import Step from './Step';

const Form = () => {
  const [step, setStep] = useState(1);
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [formData, setFormData] = useState({
    stepOne: {
      fullName: {
        label: 'FULL NAME',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter Full name'
      },
      mobileNo: {
        label: 'MOBILE NO',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter mobile no'
      },
      company: {
        label: 'COMPANY',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter company'
      },
      address: {
        label: 'ADDRESS',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter address'
      }
    },
    stepTwo: {
      emp_mobile: {
        label: 'MOBILE NO',
        value: '',
        required: true,
        type: 'select',
        choices: [
          { value: '', label: 'Choose number' },
          { value: '01700704436', label: '01700704436' },
          { value: '01766789538', label: '01766789538' }
        ]
      },
      emp_name: {
        label: '',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter employee name'
      },
      designation: {
        label: '',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter designation'
      },
      department: {
        label: '',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter department'
      },
    },
    stepThree: {
      image: {
        value: {},
        required: true,
        file: true,
        fileName: 'No file chosen',
        type: 'file',
        allowedTypes: ['png', 'jpg', 'jpeg'],
        maxFileSize: 1024
      }
    },
    stepFour: {
      cardno: {
        label: 'CARD NO',
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Enter card no'
      },
    }
  });
  const [errors, setErrors] = useState({});

  const changeHandler = (step, e) => {
    e.persist();

    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [e.target.name]: {
          ...prev[step][e.target.name],
          value: e.target.value
        }
      }
    }));
  }

  const fileChangeHandler = (name, file, step) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [name]: {
          ...prev[step][name],
          value: file,
          fileName: file.name ? file.name : 'No file chosen'
        }
      }
    }));
  }

  const stepChangeHandler = (values, e) => {
    e.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
console.log(formData)
    const data = new FormData();
    data.append('fullName', formData.stepOne.fullName.value);
    data.append('mobileNo', formData.stepOne.mobileNo.value);
    data.append('company', formData.stepOne.company.value);
    data.append('address', formData.stepOne.address.value);
    data.append('emp_mobile', formData.stepTwo.emp_mobile.value);
    data.append('emp_name', formData.stepTwo.emp_name.value);
    data.append('designation', formData.stepTwo.designation.value);
    data.append('department', formData.stepTwo.department.value);
    data.append('image', formData.stepThree.image.value);
    data.append('cardno', formData.stepFour.cardno.value);
// api call
    try {
      await axios.post('/api/visitorinfo', {...formData}, {
        headers: {Authorization: token}
    })
     alert('Visitor Request Submitted Successfully!');
    window.location.href = '/welcome';
  } catch (err) {
      alert(err.response.data.msg)
  }
  }

  return(
    <div className="wrapper">
      {step === 1 && <h1>Visitor Information</h1>}
      {step === 2 && <h1>Information Whom I Want to Visit</h1>}
      {step === 3 && <h1>Take a Photo</h1>}
      {step === 4 && <h1>Visitor Card</h1>}
      {step === 5 && <h1>Visitor Profile</h1>}
      
    <div  className={step === 5 ? "visitorinfo-page preview" : "visitorinfo-page"}>
    <form onSubmit={submitHandler}>
      {step === 1 && <Step 
        data={formData.stepOne}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        errors={errors}
        stepKey="stepOne"
        step={1}
      />}
      {step === 2 && <Step 
        data={formData.stepTwo}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        errors={errors}
        stepKey="stepTwo"
        onPrevStep={(step) => setStep(step)}
        step={2}
      />}
      {step === 3 && <Step 
        data={formData.stepThree}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        onFileChange={fileChangeHandler}
        errors={errors}
        stepKey="stepThree"
        onPrevStep={(step) => setStep(step)}
        step={3}
      />}
      {step === 4 && <Step 
        data={formData.stepFour}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        onFileChange={fileChangeHandler}
        errors={errors}
        stepKey="stepFour"
        onPrevStep={(step) => setStep(step)}
        step={4}
      />}
      {step === 5 && <Preview 
        onPrevStep={() => setStep(step - 1)}
        data={{
           label1: 'Full name', value1: formData.stepOne.fullName.value ,
           label2: 'Mobile No', value2: formData.stepOne.mobileNo.value ,
           label3: 'Company', value3: formData.stepOne.company.value ,
           label4: 'Address', value4: formData.stepOne.address.value ,
           label5: 'Image', value5: URL.createObjectURL(formData.stepThree.image.value), image: true ,
}}
      />}
    </form>
    </div>
    </div>
  );
}

export default Form;