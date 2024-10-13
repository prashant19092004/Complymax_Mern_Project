import React, { useEffect, useState } from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
  const [firstDigit, setFirstDigit] = useState(null);
  const [secondDigit, setSecondDigit] = useState(null);
  const [thirdDigit, setThirdDigit] = useState(null);
  
  const randomNum = () => {
    return Math.floor(Math.random() * 9) + 1;
  };

  useEffect(() => {
    let i = 0;
    const time = 30;

    const loop3 = setInterval(() => {
      if (i > 40) {
        clearInterval(loop3);
        setThirdDigit(4);
      } else {
        setThirdDigit(randomNum());
        i++;
      }
    }, time);

    const loop2 = setInterval(() => {
      if (i > 80) {
        clearInterval(loop2);
        setSecondDigit(0);
      } else {
        setSecondDigit(randomNum());
        i++;
      }
    }, time);

    const loop1 = setInterval(() => {
      if (i > 100) {
        clearInterval(loop1);
        setFirstDigit(4);
      } else {
        setFirstDigit(randomNum());
        i++;
      }
    }, time);

    return () => {
      clearInterval(loop1);
      clearInterval(loop2);
      clearInterval(loop3);
    };
  }, []);

  return (
    <div className="error d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f2f2f2' }}>
      <div className="text-center">
        <div className="d-flex justify-content-center mb-3">
          <div className="clip mx-1">
            <div className="shadow">
              <span className="digit h1">{thirdDigit}</span>
            </div>
          </div>
          <div className="clip mx-1">
            <div className="shadow">
              <span className="digit h1">{secondDigit}</span>
            </div>
          </div>
          <div className="clip mx-1">
            <div className="shadow">
              <span className="digit h1">{firstDigit}</span>
            </div>
          </div>
        </div>
        <div className="msg h4">OH!<span className="triangle"></span></div>
        <h2 className="mt-3">Sorry! Page not found</h2>
      </div>
    </div>
  );
};

export default ErrorPage;
