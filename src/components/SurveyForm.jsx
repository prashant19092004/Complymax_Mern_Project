import React, { useState } from 'react';

function SurveyForm() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        color: '',
        animal: [],
        message: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? 
                checked ? [...prevData[name], value] : prevData[name].filter(item => item !== value)
                : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Do something with the form data, for example, send it to the server
        console.log(formData);
    };

    return (
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl">
            <h2 className="text-2xl font-medium mb-4">Survey</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input type="text" id="name" name="name"
                        className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400" 
                        value={formData.name} onChange={handleChange} required />
                </div>
                {/* Other form fields go here */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Submit</button>
            </form>
        </div>
    );
}

export default SurveyForm;
