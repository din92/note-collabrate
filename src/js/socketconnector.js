"use strict";
import io from "socket.io-client";


class SocketConnector {
  constructor() {
    this.socketObj ;
  }
  init(){
    this.socketObj = io('http://127.0.0.1:5552/logicio');
  }
  
}


export default SocketConnector;