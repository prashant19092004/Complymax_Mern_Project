import React, { useEffect, useState } from 'react'

import { RxCross2 } from "react-icons/rx";
import axios from "axios";


const Batches = () => {

    const [batchData, setBatchData] = useState({
        batchName : "",
        semester : ""
    });
    const [batchlist, setBatchlist] = useState([]);
    

    function batchNameHandler(e) {
        setBatchData({...batchData ,[e.target.name] : e.target.value})
        console.log(batchData);
    }

    async function addBatchHandler(){
        try{
            await axios.post("http://localhost:9000/addbatch", batchData)
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

    console.log(batchlist);
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
                            <label for="batchname" class="block mb-2 font-bold text-gray-600">Name</label>
                            <input type="text" id="name" name="batchName" placeholder="Batch Name" class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>
                        <div class="mb-5">
                            <label for="semester" class="block mb-2 font-bold text-gray-600">Semester</label>
                            <input type="text" id="semester" name="semester" placeholder="Semester" class="border border-gray-300 shadow p-3 w-full rounded mb-" onChange={batchNameHandler}/>
                        </div>

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
                    Batch Id
                </div>
                <div class="w-3/12">
                    Batch Name
                </div>
                <div class="w-3/12">
                    Created Date
                </div>
                <div class="w-2/12">
                    Status
                </div>
            </li>
            {
                batchlist.map((item, index) => {
                    
                    var visitDate = item.created_date;
                    let d = visitDate.split('T')[0];
                    return(
                        <li class="border-b flex border-black rounded-sm cursor-pointer">
                            <div class="w-1/12">
                                {index++}
                            </div>
                            <div class="w-3/12">
                                12345678
                            </div>
                            <div class="w-3/12">
                                {item.batch_name}
                            </div>
                            <div class="w-3/12">
                                {d}
                            </div>
                            <div class="w-2/12" style={{color : item.status ? 'blue' : 'red' }} onClick={()=>updateStatus(item._id)}>
                                {item.status ? 'Active' : 'Inactive'}
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

export default Batches