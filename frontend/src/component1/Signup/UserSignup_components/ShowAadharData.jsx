import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Form, Button, Image, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Logo from '../../../assets/logo comply.png';
import './../UserSignup.css';

const ShowAadharData = () => {

    const {state} = useLocation();
    const { data1 } = state;
    const [panNumber, setPanNumber] = useState("");
    const [panMessage, setPanMessage] = useState("");
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc";
    const [enteredAccountData, setEnteredAccountData] = useState({
        accountNo : "",
        ifsc : ""
    })

    function panNumberHandler(e) {
        let panNo = e.target.value;
        setPanNumber(panNo);
        if(panNo.length == 10){
            try{
                axios.post(
                    "https://kyc-api.surepass.io/api/v1/pan/pan", 
                    {
                        id_number : panNo
                    }, 
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type' : 'application/json' 
                        }
                    }
                ).then(response => {
                    if(response.data.success === true){
                        setPanMessage(response.data.data.full_name);
                    }
                    else{
                        setPanMessage("Please Enter Correct Pan Number");
                    }
                    setPanNumber(response.data.data.pan_number);
                });
            }catch(err){
                console.log(err);
            }
        }
    }

    function accountChangeHandler(e){
        setEnteredAccountData({...enteredAccountData, [e.target.name] : e.target.value});
    }

    // console.log(data1);

  return (
    <div>
        <Container className="LgnForm mx-auto shadow bg-white pt-4 pb-6 mb-2 px-6">
      <Row className="d-flex justify-content-center">
        <Col className='d-flex justify-content-center mb-5'>
          <Image className="rounded-circle mx-auto mb-2" src={Logo} height={80} width={80} />
        </Col>
      </Row>
      
      <Form>
      <Form.Group className="mb-3 showData">
          <Form.Label className="text-gray-700 mb-0 text-sm font-bold">Full Name</Form.Label>
          <Form.Control
            // onChange={aadharNumberHandler}
            required
            className="add-no-input appearance-none border rounded p-0 text-gray-700 leading-tight border-0 outline-0"
            id="username"
            type="text"
            placeholder="Aadhar No."
            name="aNumber"
            value={data1.full_name}
          />
        </Form.Group>
        <Form.Group className="mb-3 showData">
          <Form.Label className="text-gray-700 mb-0 text-sm font-bold">S/O</Form.Label>
          <Form.Control
            // onChange={aadharNumberHandler}
            required
            className="add-no-input appearance-none border rounded p-0 text-gray-700 leading-tight border-0 outline-0"
            id="username"
            type="text"
            placeholder="Aadhar No."
            name="aNumber"
            value={data1.care_of.slice(4)}
          />
        </Form.Group>
        <Form.Group className="mb-3 showData">
          <Form.Label className="text-gray-700 mb-0 text-sm font-bold">Date of Birth</Form.Label>
          <Form.Control
            // onChange={aadharNumberHandler}
            required
            className="add-no-input appearance-none border rounded p-0 text-gray-700 leading-tight border-0 outline-0"
            id="username"
            type="text"
            placeholder="Aadhar No."
            name="aNumber"
            value={data1.dob}
          />
        </Form.Group>
        <Form.Group className="mb-3 showData">
          <Form.Label className="text-gray-700 mb-0 text-sm font-bold">State</Form.Label>
          <Form.Control
            // onChange={aadharNumberHandler}
            required
            className="add-no-input appearance-none border rounded p-0 text-gray-700 leading-tight border-0 outline-0"
            id="username"
            type="text"
            placeholder="Aadhar No."
            name="aNumber"
            value={data1.address.state}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-gray-700 text-sm font-bold mb-2">Pan Number</Form.Label>
          <Form.Control
            onChange={panNumberHandler}
            required
            className="add-no-input shadow appearance-none border rounded w-100 py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="panNumber"
            type="text"
            placeholder="Enter the Pan No."
            name="panNumber"
            maxLength={10}
            spellcheck="false"
            // value={aadharNumber.aNumber}
          />
          <p className="pan-message">{panMessage.length ? `${panMessage}` : ''}</p> 
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-gray-700 text-sm font-bold mb-2">Account Number</Form.Label>
          <Form.Control
            onChange={accountChangeHandler}
            required
            className="add-no-input shadow appearance-none border rounded w-100 py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="panNumber"
            type="text"
            placeholder="Enter the Pan No."
            name="panNumber"
            maxLength={10}
            spellcheck="false"
            value={enteredAccountData.accountNo}
          />
          <p className="pan-message">{panMessage.length ? `${panMessage}` : ''}</p> 
        </Form.Group>
      </Form>
    </Container>
    </div>
  )
}

export default ShowAadharData