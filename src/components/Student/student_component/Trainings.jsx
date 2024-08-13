import React, { useEffect, useState } from 'react'

import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Admintraining = () => {

  const navigate = useNavigate();
    const [batchlist, setBatchlist] = useState([]);
    const [trainerlist, setTrainerlist] = useState([]);
    const [trainingslist, setTrainingslist] = useState([]);
    const [training_id, setTraining_id] = useState();



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

    function getForm(uid) {
      setTraining_id(uid);
      navigate('/student/classform', { state: { id: uid } });
    }
    

    console.log(trainingslist);
    useEffect(()=> {
        getBatchList();
        // hideAddBatch();
        getTrainersList();
        getTrainingsList();
    }, []);

    return (
    <div class="relative w-[100%]">

        
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
                        <li onClick={() => getForm(item._id)} class="border-b flex border-black rounded-sm cursor-pointer">
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