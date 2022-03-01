import React, { Component, useCallback } from "react";
import Socket from "../socketconnector";
import Quill from "quill";
import { useParams } from "react-router-dom";
import TableElem from "./table";
import {
    ListGroup, ListGroupItem, Button
} from "reactstrap";
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']                                         // remove formatting button
];
const withRouter = WrappedComponent => props => {
    const params = useParams();
    // etc... other react-router-dom v6 hooks

    return (
        <WrappedComponent
            {...props}
            params={params}
        />
    );
};
class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.containerRef;
        this.state = {};
        this.handleTextChanges = this.handleTextChanges.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleUserList = this.handleUserList.bind(this);
        this.handleAPICall = this.handleAPICall.bind(this);
        this.saveInterval;
        this.userList = [];
    }
    componentDidMount() {
        let socket = new Socket();
        socket.init();
        this.socket = socket.socketObj;
        let comp = this.containerRef.current;
        const documentId = this.props.params.id;
        if (comp == null) return;
        else {
            comp.innerHTML = "";
            const editor = document.createElement("div");
            comp.append(editor);
            this.quill = new Quill(editor, {
                theme: "snow", modules: {
                    toolbar: toolbarOptions
                }
            });
            this.quill.disable();
            this.quill.setText("Loading...");
        }
        if (this.socket == null || this.quill == null) {
            return;
        }

        this.quill.on("text-change", this.handleTextChanges)
        this.socket.on("receive-changes", this.handleUpdate)
        this.socket.emit("get-document", documentId);
        this.socket.once("load-document", (document) => {
            this.quill.setContents(document);
            this.quill.enable();
        });

        this.saveInterval = setInterval(() => {
            console.log("saving data")
            this.socket.emit("save-document", this.quill.getContents());
        }, 5000);

        //getting user from client
        let user = localStorage.getItem("username");
        if (user) {
            if (!this.userList.includes(user)) this.userList.push(user)
            this.socket.emit("send-user-list", { userList: this.userList, docId: this.props.params.id });
        }
        this.socket.on("get-user-list", this.handleUserList)
        

        // listening to api result change socket event
        this.socket.on("api-result-change",this.handleAPICall)

        $("#docCloseBtn").on("click", () => {
            //closing the document
            this.socket.emit("user-inactive", { user, docId: this.props.params.id })
            localStorage.removeItem("username")
            window.location.href = "/";
        })
        $("#apiCall").on("click", () => {
            let value = $("#username_api").val();
            if(!value) {
                alert("Please enter a name in the input box");
                return;
            }
            $.get(`https://api.agify.io?name=${value}`, (result) => {
                this.handleAPICall(result);
                this.socket.emit("api-result",result)
            })
        })

    }
    handleUpdate(delta) {
        this.quill.updateContents(delta);
    }
    handleTextChanges(delta, oldDeta, source) {
        if (source != "user") return;
        this.socket.emit("send-changes", delta)
    }
    handleUserList({users,removedUser}) {
        if(removedUser) alert(`User ${removedUser} has stopped editing this note`)
        this.userList = users;
 
        console.log("this.userList=======", this.userList, users)
        this.setState({ users: this.userList });
    }
    handleAPICall(result){
        this.setState({api_results:[result]});
    }
    componentWillUnmount() {
        this.socket.disconnect();
        this.quill.off("text-change", this.handleTextChanges)
        this.socket.off("receive-changes", this.handleUpdate)
        this.socket.off("get-user-list", this.handleUserList)
        this.socket.off("api-result-change", this.handleUserList)
        clearInterval(this.saveInterval);
    }
    render() {
        this.containerRef = React.createRef();
        return (<div>
            <div className="box" style={{ width: "100%", border: "none" }}>
                <h3 className="box-header">Editing Note : {this.props.params.id}</h3>
                <div>
                    <Button id="docCloseBtn">Close</Button>
                    <Button id="apiCall">Call API</Button>
                    <input type="text" id="username_api" name="username_api" placeholder="Please enter a name" style = {{"margin":"15px"}} className="email" />
                    <TableElem result={this.state.api_results}/>
                </div>
                <div>
                    <p style={{ color: "black", fontSize: "18px" }}>Users Currently Editing</p>
                    <ListGroup>
                        {
                            this.state.users && this.state.users.length > 0 ?
                                this.state.users.map((user) => {
                                    return (<ListGroupItem key={user}>
                                        {user}
                                    </ListGroupItem>)
                                }) : null
                        }
                    </ListGroup>
                </div>
            </div>
            <div className="container" ref={this.containerRef}></div>
        </div>)
    }
}

export default withRouter(TextEditor);