import React, { useEffect, useState } from 'react'

import { RxCross2 } from "react-icons/rx";
import axios from "axios";


const Admintraining = () => {

    const [batchData, setBatchData] = useState({
        training_name : "",
        batch_id : "",
        trainer_id : ""
    });
    const [batchlist, setBatchlist] = useState([]);
    const [trainerlist, setTrainerlist] = useState([]);
    const [trainingslist, setTrainingslist] = useState([]);
    

    function batchNameHandler(e) {
        setBatchData({...batchData ,[e.target.name] : e.target.value})
        console.log(batchData);
    }

    async function addBatchHandler(){
        try{
            await axios.post("http://localhost:9000/addtraining", batchData)
            .then((res) => {
                console.log("hii")
            })
        }
        catch(e){
            console.log(e);
        }
    }

    function showAddBatch() {
        let addBatchForm = document.querySelector("#addBatchForm");
        addBatchForm.style.scale = 1;
    }

    function hideAddBatch() {
        let addBatchForm = document.querySelector("#addBatchForm");
        addBatchForm.style.scale = 0;
    }

    async function getBatchList() {
        await axios.get("http://localhost:9000/batches")
        .then((res)=> {
            setBatchlist(res.data);
        })
    }

    async function getTrainingsList() {
        await axios.get("http://localhost:9000/trainings")
        .then((res)=> {
            setTrainingslist(res.data);
        })
    }

    async function getTrainersList() {
        await axios.get("http://localhost:9000/trainers")
        .then((res)=> {
            setTrainerlist(res.data);
        })
    }

    async function updateStatus(currentid) {
        console.log(currentid);
        await axios.post("http://localhost:9000/update_status", {
            id : currentid
        })
        .then((res)=> {
            setBatchlist(res.data);
            console.log("hii");
        })
    }

    console.log(trainingslist);
    useEffect(()=> {
        getBatchList();
        hideAddBatch();
        getTrainersList();
        getTrainingsList();
    }, []);

    return (
    <div class="relative w-[100%]">
        <div class="w-[100%] absolute flex justify-center transition-all ease-linear duration-[0.2s]" id='addBatchForm'>
                
                <div class="bg-white p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
                    <div class="flex justify-end mb-4">
                    <RxCross2 onClick={hideAddBatch}/>
                    </div>
                    <form action="">
                        <div class="mb-5">
                            <label for="training name" class="block mb-2 font-bold text-gray-600">Training</label>
                            <input type="text" id="training" name="training_name" placeholder="Training Name" class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>
                        <select
                            name="batch_id"
                            class="block border border-grey-light w-full p-3 rounded mb-4"
                            onChange={batchNameHandler}
                            // value={signupData.role}
                            required
                        >
                            
                            {
                                batchlist?.map((item) => {
                                    return (
                                        <option value={item._id}>{item.batch_name} {item.semester}</option>
                                    )
                                })
                            }
                        </select>
                        <select
                            name="trainer_id"
                            class="block border border-grey-light w-full p-3 rounded mb-4"
                            onChange={batchNameHandler}
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

                        <button class="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg" onClick={addBatchHandler}>Submit</button>
                    </form>
                </div>
        </div>

        <div class="px-10 flex justify-end">
        <button class="p-3 bg-sky-600 rounded-md" onClick={showAddBatch}>Add Batch</button>
        </div>
        
        <div class="min-w-full mx-auto md:max-w-lg p-10">
        <ul class="flex flex-col gap-5 text-xl">
            <li class='border-b flex border-black rounded-sm cursor-pointer '>
                <div class="w-1/12">
                    S.No.
                </div>
                <div class="w-3/12">
                                Training
                            </div>
                            <div class="w-3/12">
                                Trainer
                            </div>
                            <div class="w-3/12">
                                Batch
                            </div>
                            <div class="w-2/12" >
                                Semester
                            </div>
            </li>
            {
                trainingslist?.map((item, index) => {
                    
                    
                    return(
                        <li class="border-b flex border-black rounded-sm cursor-pointer">
                            <div class="w-1/12">
                                {++index}
                            </div>
                            <div class="w-3/12">
                                {item.subject_name}
                            </div>
                            <div class="w-3/12">
                                {item.trainer.name}
                            </div>
                            <div class="w-3/12">
                                {item.batch.batch_name}
                            </div>
                            <div class="w-2/12" >
                                {item.semester}
                            </div>
                        </li>
                    )
                })
            }
            
        </ul>
</div>
    </div>
  )
}

export default Admintraining