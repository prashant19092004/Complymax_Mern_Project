import React, { useEffect, useState } from 'react'

import { RxCross2 } from "react-icons/rx";
import axios from "axios";


const Trainers = () => {

    const [batchData, setBatchData] = useState({
        trainerName : "",
        mob : "",
        address : ""
    });
    const [trainerlist, setTrainerlist] = useState([]);
    

    function batchNameHandler(e) {
        setBatchData({...batchData ,[e.target.name] : e.target.value})
        console.log(batchData);
    }

    async function addBatchHandler(){
        try{
            await axios.post("http://localhost:9000/addtrainer", batchData)
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
        await axios.get("http://localhost:9000/trainers")
        .then((res)=> {
            setTrainerlist(res.data);
        })
    }

    // async function updateStatus(currentid) {
    //     console.log(currentid);
    //     await axios.post("http://localhost:9000/update_status", {
    //         id : currentid
    //     })
    //     .then((res)=> {
    //         setBatchlist(res.data);
    //         console.log("hii");
    //     })
    // }

    console.log(trainerlist);
    useEffect(()=> {
        getBatchList();
        hideAddBatch();
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
                            <label for="name" class="block mb-2 font-bold text-gray-600">Trainer Name</label>
                            <input type="text" id="name" name="trainerName" placeholder="Trainer Name" class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>
                        <div class="mb-5">
                            <label for="mob" class="block mb-2 font-bold text-gray-600">MOB</label>
                            <input type="text" id="contact" name="mob" placeholder="Contact No." class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>
                        <div class="mb-5">
                            <label for="address" class="block mb-2 font-bold text-gray-600">Address</label>
                            <input type="text" id="address" name="address" placeholder="Address" class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>

                        <button class="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg" onClick={addBatchHandler}>Submit</button>
                    </form>
                </div>
        </div>

        <div class="px-10 flex justify-end">
        <button class="p-3 bg-sky-600 rounded-md" onClick={showAddBatch}>Add Trainer</button>
        </div>
        
        <div class="min-w-full mx-auto md:max-w-lg p-10">
        <ul class="flex flex-col gap-5 text-xl">
            <li class='border-b flex border-black rounded-sm cursor-pointer '>
                <div class="w-1/12">
                    S.No.
                </div>
                <div class="w-3/12">
                    Name
                </div>
                <div class="w-3/12">
                    MOB
                </div>
                <div class="w-4/12">
                    Address
                </div>
            </li>
            {
                trainerlist.map((item, index) => {
                    
                    
                    return(
                        <li class="border-b flex border-black rounded-sm cursor-pointer">
                            <div class="w-1/12">
                                {++index}
                            </div>
                            <div class="w-3/12">
                                {item.name}
                            </div>
                            <div class="w-3/12">
                                {item.mob}
                            </div>
                            <div class="w-4/12">
                                {item.address}
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

export default Trainers