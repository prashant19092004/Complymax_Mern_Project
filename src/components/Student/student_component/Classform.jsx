import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Classform = () => {

    const navigate = useNavigate();
    const {state} = useLocation();
    const { id } = state;

    const training_id = {
        uid : id
    }

    const [trainerlist, setTrainerlist] = useState([]);
    const [training, setTraining ] = useState();
    const [classData, setClassData] = useState(
        {
            trainer_id : "",
            topic : "",
            feedback : "",
            trainer_entry_hour : "",
            trainer_entry_minute : "",
            trainer_entry_shift : "am",
            trainer_exit_hour : "",
            trainer_exit_minute : "",
            trainer_exit_shift : "am",
            training_id : id
        }
    )



    async function getTraining(){
        try{
            await axios.post("http://localhost:9000/searchtraining", training_id)
            .then((res) => {
                setTraining(res.data);
            })
        }catch(err){
            console.log(err);
        }
    }

    async function saveClassData(){
        try{
            await axios.post("http://localhost:9000/saveclass", classData)
            .then((res) => {
                console.log(res.data);
            })
        }catch(err){
            console.log(err);
        }

        setClassData(
            {
                trainer_id : "",
                topic : "",
                feedback : "",
                trainer_entry_hour : "",
                trainer_entry_minute : "",
                trainer_entry_shift : "am",
                trainer_exit_hour : "",
                trainer_exit_minute : "",
                trainer_exit_shift : "am",
                training_id : id
            }
        )
    }

    function changeHandler(e) {
        setClassData({...classData, [e.target.name] : e.target.value});
        console.log(classData);
    }

    async function getTrainersList() {
        await axios.get("http://localhost:9000/trainers")
        .then((res)=> {
            setTrainerlist(res.data);
        })
    }


    useEffect(() => {
        getTraining();
        getTrainersList();
    } , []);
  return (
    <div class="bg-white border border-4 rounded-lg shadow relative m-10">

    <div class="flex items-start justify-between p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold">
            Edit product
        </h3>
        
    </div>

    <div class="p-6 space-y-6">
        <form action="#">
            <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                    <label for="product-name" class="text-sm font-medium text-gray-900 block mb-2">Trainer</label>
                    {/* <input type="text" name="product-name" id="product-name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Apple Imac 27”" required=""/> */}
                    <select
                            name="trainer_id"
                            class="block border border-grey-light w-full p-3 rounded mb-4"
                            onChange={changeHandler}
                            // value={signupData.role}
                            required
                        >
                            <option value=""></option>
                            {
                                trainerlist?.map((item) => {
                                    return (
                                        <option value={item._id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                </div>
                <div class="col-span-6 sm:col-span-3">
                    <label for="category" class="text-sm font-medium text-gray-900 block mb-2">Feedback</label>
                    <input type="text" name="feedback" id="category" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" onChange={changeHandler} placeholder="Feedback" value={classData.feedback} required=""/>
                </div>
                <div class="col-span-6 sm:col-span-3">
                    <label for="brand" class="text-sm font-medium text-gray-900 block mb-2">Trainer Entry Time</label>
                    {/* <input type="text" name="brand" id="brand" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Apple" required=""/> */}
                    <div className='w-full'>
                        <input type='number' min={0} max={12} name='trainer_entry_hour' required class='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-12' onChange={changeHandler} value={classData.trainer_entry_hour} />
                        <label for='hour' className='pl-1 pr-2'>Hour</label>
                        
                        <input type='number' min={0} max={59} name='trainer_entry_minute' required class='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-12' onChange={changeHandler} value={classData.trainer_entry_minute} />
                        <label for='minute' className='pl-1 pr-2'>Minute</label>

                        <select
                            name="trainer_entry_shift"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-16"
                            onChange={changeHandler}
                            value={classData.trainer_entry_shift}
                            required
                        >
                            <option value="am">am</option>
                            <option value="pm">pm</option>
                        </select>
                    </div>
                </div>
                <div class="col-span-6 sm:col-span-3">
                <label for="brand" class="text-sm font-medium text-gray-900 block mb-2">Trainer Exit Time</label>
                    {/* <input type="text" name="brand" id="brand" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Apple" required=""/> */}
                    <div className='w-full'>
                        <input type='number' min={0} max={12} name='trainer_exit_hour' required class='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-12' onChange={changeHandler} value={classData.trainer_exit_hour} />
                        <label for='hour' className='pl-1 pr-2'>Hour</label>
                        
                        <input type='number' min={0} max={59} name='trainer_exit_minute' required class='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-12' onChange={changeHandler} value={classData.trainer_exit_minute}/>
                        <label for='minute' className='pl-1 pr-2'>Minute</label>

                        <select
                            name="trainer_exit_shift"
                            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 p-2.5 w-16"
                            onChange={changeHandler}
                            value={classData.trainer_exit_shift}
                            required
                        >
                            <option value="am">am</option>
                            <option value="pm">pm</option>
                        </select>
                    </div>
                </div>
                <div class="col-span-full">
                    <label for="product-details" class="text-sm font-medium text-gray-900 block mb-2">Topic</label>
                    <input id="product-details" name='topic' class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4" onChange={changeHandler} value={classData.topic} placeholder="Topic" />
                </div>
            </div>
        </form>
    </div>

    <div class="p-6 border-t border-gray-200 rounded-b">
        <button class="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={saveClassData} type="submit">Save all</button>
    </div>

</div>
  )
}

export default Classform