import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const Client_signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    contact : ""
  });
  const navigate = useNavigate();
  const changeHandle = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };
  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(signupData);
    if (signupData.password !== signupData.confirm_password) {
      return toast.error("password !== confirm password does not match");
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/adminsignup`,
        signupData
      )
      .then((res) => {
        console.log(res);
        console.log("Hii");
        navigate("/client_login");
        toast.success(res.data.message);
      })
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  function addfocus(e){
    let parent = e.target.parentNode.parentNode;
    parent.classList.add("focus")
}

/*=== Remove focus ===*/
function remfocus(e){
    let parent = e.target.parentNode.parentNode
    if(e.target.value == ""){
        parent.classList.remove("focus")
    }
}

  return (
    <div className="bg-grey-lighter min-h-screen d-flex flex-column">
      <Container className="max-w-sm mx-auto d-flex flex-column flex-1 align-items-center justify-content-center px-2">
        <Card className="bg-white p-4 rounded shadow-md text-black w-100">
          <Card.Body>
            <Card.Title className="mb-4 text-center">Establishment Registration</Card.Title>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name"
                  name="name"
                  onChange={changeHandle}
                  required
                  value={signupData.name}
                />
              </Form.Group>

              <Form.Group controlId="formContact" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Contact No."
                  name="contact"
                  onChange={changeHandle}
                  required
                  value={signupData.contact}
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={changeHandle}
                  required
                  value={signupData.email}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={changeHandle}
                  required
                  value={signupData.password}
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirm_password"
                  onChange={changeHandle}
                  required
                  value={signupData.confirm_password}
                />
              </Form.Group>

              {/* Uncomment the select if needed
              <Form.Group controlId="formRole" className="mb-3">
                <Form.Control
                  as="select"
                  name="role"
                  onChange={changeHandle}
                  value={signupData.role}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </Form.Control>
              </Form.Group>
              */}

              <Button
                variant="primary"
                type="submit"
                onClick={submitHandle}
                className="w-100"
              >
                Create Account
              </Button>
            </Form>

            <div className="text-center text-muted mt-4">
              By signing up, you agree to the{' '}
              <a href="#" className="text-decoration-none">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-decoration-none">
                Privacy Policy
              </a>.
            </div>
          </Card.Body>
        </Card>

        <div className="text-muted mt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none text-primary">
            Log in
          </Link>
        </div>
      </Container>
    </div>
    // <div class="l-form">
    //         <div class="shape1"></div>
    //         <div class="shape2"></div>

    //         <div class="form">
    //             {/* <img src={login_pic} alt="" class="form__img" /> */}

    //             <form action="" onSubmit={loginSubmitHandle} class="form__content">
    //                 <h1 class="form__title">Welcome</h1>

    //                 <div class="form__div form__div-one">
    //                     <div class="form__icon">
    //                         <i class='bx bx-user-circle'></i>
    //                     </div>

    //                     <div class="form__div-input">
    //                         <label for="" class="form__label">Email</label>
    //                         <input 
    //                         type="text" 
    //                         name='name' 
    //                         onChange={changeHandle} 
    //                         required 
    //                         value={signupData.name} 
    //                         id='name' 
    //                         class="form__input" 
    //                         onFocus={addfocus} 
    //                         onBlur={remfocus} />
    //                     </div>
    //                 </div>

    //                 <div class="form__div form__div-one">
    //                     <div class="form__icon">
    //                         <i class='bx bx-user-circle'></i>
    //                     </div>

    //                     <div class="form__div-input">
    //                         <label for="" class="form__label">Email</label>
    //                         <input 
    //                         type="email" 
    //                         name='email' 
    //                         onChange={changeHandle} 
    //                         required 
    //                         value={signupData.email} 
    //                         id='email' 
    //                         class="form__input" 
    //                         onFocus={addfocus} 
    //                         onBlur={remfocus} />
    //                     </div>
    //                 </div>

    //                 <div class="form__div">
    //                     <div class="form__icon">
    //                         <i class='bx bx-lock' ></i>
    //                     </div>

    //                     <div class="form__div-input">
    //                         <label for="" class="form__label">Password</label>
    //                         <input type="password" name='password' onChange={changeHandle} required value={loginData.password} id='password' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
    //                     </div>
    //                 </div>
                    
    //                 {
    //                   (role === 'Supervisor' || role === 'Client') ? '' : <Link to="/reset-password" className="form__forgot">Forgot Password?</Link>
    //                 }

    //                 <input type="submit" class="form__button" value="Login" />

    //             </form>
    //         </div>

    //     </div>
  );
};

export default Client_signup;
