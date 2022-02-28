import React, { Component } from "react";
import TextEditor from "./texteditor"
import Login from "./login";
import List from "./list";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";
import { v4 } from "uuid";
class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

            <Router>
                <Routes>
                    <Route path="/" exact element={<Login />} />
                    <Route path="/list" exact element={<List />} />
                    <Route path="/new" exact element={<Navigate to={`/documents/${v4()}`} />} />
                    <Route path="/documents/:id" element={<TextEditor />} />
                </Routes>
            </Router>

        )
    }
}

export default Main;