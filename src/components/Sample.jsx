import React, { useRef ,useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import bg from "../assets/bgtu.jpg";

const Sample = () => {
  const divRef = useRef(null);
  const [data, setData] = useState({
	reff: "",
	date: "",
	notification: "",
  });
  const changeHandler = (e) => {
	setData({ ...data, [e.target.name]: e.target.value });
	  };

  const printDocument = () => {
    const input = divRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
      
      );
    
    });
  };

  return (
    <div>
      
    </div>
  );
};

export default Sample;
