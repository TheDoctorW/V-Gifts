import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RegisterPage from './RegisterPage';
import InterestSelectionPage from './InterestSelectionPage';
import NavBar from '../components/NavBar';
import axios from 'axios';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    'Register your personal info',
    'Select your interests'
  ];
}





function RegisterStepperPage({ setAuth, ...props }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [interests, setInterets] = useState([]);

  const steps = getSteps();

  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // const handleReset = () => {
  //   setActiveStep(0);
  // };
  
  function getStepContent(index) {
    switch(index) {
      case 0:
        return (
          <RegisterPage 
            handleNext={handleNext} 
            setAuth={setAuth}
          />
        );
      case 1:
        return (
          <InterestSelectionPage 
            interests={interests}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      default:
        return;
      // case 2:
      //   return (
      //     <RegisterLastPage 
      //       handleBack={handleBack}
      //       handleNext={handleNext}
      //     />
      //   );
    }
  }

  useEffect((() => {
  axios.get("/user/get_interest")
  .then((response) => {
    const data = response.data;

    setInterets(data["interest_list"]);
  })
  .catch((err) => {

  });
}), []);

  return (
    <div className={classes.root}>
      <NavBar />
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                {label}
                {index === 1 ? 
                  <Typography variant="caption" style={{display: "block"}}>Optional</Typography>
                  : ""
                }
              </StepLabel>
            </Step>
        ))}
      </Stepper>
      <div>
        {getStepContent(activeStep)}
      </div>
    </div>
  );
}

export default RegisterStepperPage;