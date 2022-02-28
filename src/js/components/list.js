import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import {
    Button
} from "reactstrap";
import Note from "./note";
function List() {
    const [user, setUser] = useState();
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        let usr = localStorage.getItem('username');
        setUser(usr);
        $.get(`http://127.0.0.1:5552/api/list/`, (data) => {
            setList([...data]);
        });
    }, [])
    useEffect(()=>{
        $("#createNewBtn").on("click", (e)=>{
            navigate("/new")
        })
    },[])
   
    return (
        <Fragment>
          
            <span className="d-block pb-2 mb-0 h6 text-uppercase text-info font-weight-bold">
            <strong style={{ margin:"100px",color:"black"}}>Hi {user}, Click on the notes below to starting editing</strong>
            <Button color="success" id="createNewBtn" className="font-weight-bold" >New Note</Button>
          </span>
            <div>
                {
                    list.length>0?list.map((item) => {
                        if (item) {
                            return (
                                <Note key={item._id.toString()} documentId={item.documentId} content={item.data.ops[0].insert}/>
                            )
                        }

                    }):null
                }
            </div>
        </Fragment>
    )
}

export default List;