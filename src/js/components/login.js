
import React, { Component, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {
    Button
} from "reactstrap";
function Login () {
    const navigate = useNavigate();
    let handleClick = () => {
        let elemValue = document.getElementById("username").value
        if (elemValue == null || elemValue==""|| elemValue==undefined) {
            alert("Please enter username")
        }
        else {
            localStorage.setItem("username",elemValue);
            console.log("elemValue", elemValue);
            navigate("/list")
        }
    }
    useEffect(() => {
        let btn = document.getElementById("clickBtn")
        if (btn != null) {
            btn.addEventListener("click", handleClick)
        }
    });
    return (
        <div>
            <div className="form">
                <div className="box">
                    <h1 className="box-header">Enter to Collabrate</h1>
                    <div className="box-body">
                        <input type="text" id="username" name="username" placeholder="Your Name" className="email" />
                    </div>
                    <div className="button-container">
                        <Button id="clickBtn" onClick={handleClick}>Enter</Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login