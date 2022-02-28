import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import {
    Button, Card, CardImg, CardBody,
    CardTitle, CardText
} from "reactstrap";


function Note(props) {
    const navigate =useNavigate()
    useEffect(()=>{
        let elements = $('[data-name="noteItem"]');
        elements.each((item,elem)=>{
            $(elem).on("click",()=>{
                let docId = $(elem).attr("data-id");
                navigate(`/documents/${docId}`)
            })
        })
    },[])
    let {documentId,content}=props;
    return (
        <Card style={{ margin: "100px" }}>
            <CardImg top width="100%" alt="banner" />
            <CardBody>
                <CardTitle className="h3 mb-2 pt-2 font-weight-bold text-secondary">Note Id: {documentId}</CardTitle>
                <CardText className="text-secondary mb-4" style={{ fontSize: '0.75rem' }}>{content + "..........."}</CardText>
                <Button color="success"  data-name="noteItem" data-id={documentId} className="font-weight-bold">Edit</Button>
            </CardBody>
        </Card>
    )

}

export default Note;