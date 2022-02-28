import React, {useState, useEffect} from "react";
import './App.css'


/**
 * For this web application, I decided to make up my own data source as I could not find one that included all
 * the necessary details for my idea. Therefore, all names and likenesses are made up.
 * If the data resembles any person, it is purely coincidental.
 */

function App() {
    const [data, setData] = useState([])
    const [doc, setDoc] = useState(0)
    const [sortBy, setSortBy] = useState([])
    const [sortData, setSortData] = useState([])


    /**
     * Gets the data from the excel file Data.xlsx
     */

    useEffect(() => {
            fetch("/getData").then(
                res => res.json()
            ).then(
                data => {
                    setData(data)
                    setSortData([])
                    //console.log(data)
                }
            )
        }, []
    );

    /**
     * For similar doctors, I decided that two sorting methods will be best.
     * The first method "distance", shows all doctors who are in the same specialty sorted by closest distance to the
     * doctor selected. Distance is calculated using Pythagorean theorem.
     * The second method "rating", shows all doctors who are in the same specialty sorted by highest rating to
     * smallest rating.
     * */


    const sort = async (e) => {
        e.preventDefault();
        console.log(doc)
        console.log(data[doc])
        var selected = data[doc]
        console.log(sortBy)
        if (sortBy === 'distance') {
            console.log("distance")
            const json = {doctor: selected, data: data}
            //console.log(json)
            const requestOptions = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(json)
            }
            const response = await fetch('/sortDataDistance', requestOptions)
            const log = await response.json()
            console.log(log.status)
            if (log.status === 401) {
                console.log("Error")
            }
            setSortData(log)
            console.log(log)
        } else {
            console.log("rating")
            const json = {doctor: selected, data: data}
            //console.log(json)
            const requestOptions = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(json)
            }
            const response = await fetch('/sortDataRating', requestOptions)
            const log = await response.json()
            console.log(log.status)
            if (log.status === 401) {
                console.log("Error")
            }
            setSortData(log)
            console.log(log)


        }

    }


    /*
    * Rendered Code
    *
    * */

    return (
        <div style={{marginLeft:'30px'}}>
            <h1>Doctor Search:</h1>
            <form onSubmit={sort}>
                <select  requiredvalue={doc}
                        onChange={(e) => setDoc(e.target.value)}>
                    {data.map((x, y) =>
                        <option value={y}>{x.name}, {x.specialty}</option>
                    )}
                </select>
                <h3 style={{marginTop:'10px'}}>Sort By: </h3>
                <select style={{marginTop:'-25px'}} placeholder={"Sorting Method"} requiredvalue={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}>

                    <option value="rating"> Rating</option>
                    <option value="distance"> Distance</option>
                </select>
                <button style={{marginLeft:'5px'}}>
                    Search
                </button>
            </form>

            {(typeof data[doc] === 'undefined') ? (
                <h6></h6>
            ) : (
                <div>

                <h1 style={{marginTop:'10px'}}>{data[doc].name} {data[doc].specialty}</h1>
                        <h2 style={{marginTop:'-20px'}}>
                            {data[doc].phoneNumber}, {data[doc].address}, {data[doc].state} {data[doc].zipCode},
                            Rating: {data[doc].rating}</h2>
                </div>
                )}
            {(typeof sortData.data === 'undefined') ? (
                <p> Make a selection</p>
            ) : (sortData.data.map(doctor => {
                return (
                    <div style={{marginLeft:'30px'}}>
                        <h2 style={{marginTop:'10px'}}>{doctor.name} {doctor.specialty}</h2>
                        <h3 style={{marginTop:'-20px'}}>
                            {doctor.phoneNumber}, {doctor.address}, {doctor.state} {doctor.zipCode},
                            Rating: {doctor.rating}</h3>
                    </div>
                )
            }))}
        </div>
    )
}


export default App