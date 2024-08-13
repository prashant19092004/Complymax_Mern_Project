import React, { useEffect, useState } from 'react'

import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useLocation } from 'react-router-dom';


const ShowRecord = () => {

    const {state} = useLocation();
    const { id } = state;

    const training_id = {
        uid : id
    }

    const [training, setTraining] = useState([]);


    async function fetchTraining() {
        try{
            await axios.post("http://localhost:9000/gettraining", training_id)
            .then((res) => {
                setTraining(res.data);
            })
        }catch(error){
            console.log(error);
        }
    }


    

    console.log(training);
    useEffect(()=> {
        // getBatchList();
        // hideAddBatch();
        fetchTraining();
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
                                Trainer Entry
                            </div>
                            <div class="w-3/12">
                                Trainer Exit
                            </div>
                            <div class="w-3/12">
                                Topic
                            </div>
                            <div class="w-2/12" >
                                Feedback
                            </div>
            </li>
            {
                training.classes?.map((item, index) => {
                    
                    
                    return(
                        <li class="border-b flex border-black rounded-sm cursor-pointer">
                            <div class="w-1/12">
                                {++index}
                            </div>
                            <div class="w-3/12 flex gap-1">
                                <div className='text-right'>
                                    {item.trainer_entry_hour}
                                </div>
                                <div>:</div>
                                <div>
                                    {item.trainer_entry_minute}
                                </div>
                                <div className='text-left'>
                                    {item.trainer_entry_shift}
                                </div>
                            </div>
                            <div class="w-3/12 flex gap-1">
                                <div>
                                    {item.trainer_exit_hour}
                                </div>
                                <div>:</div>
                                <div>
                                    {item.trainer_exit_minute}
                                </div>
                                <div>
                                    {item.trainer_exit_shift}
                                </div>
                            </div>
                            <div class="w-3/12">
                                {item.class_topic}
                            </div>
                            <div class="w-2/12 " >
                                {item.feedback}
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

export default ShowRecord