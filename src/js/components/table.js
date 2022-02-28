import React from "react";
import {
    Table
} from "reactstrap";
export default function TableElem({ result }) {
    console.log("got result",result)
    return (
        result && result.length > 0 ? <div>
            <Table>
                <thead>
                    <tr>
                        {
                            Object.keys(result[0]).map((col) => {
                                return <th key={col}>{col}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        result.map((row, index) => {
                            return <tr key={"row" + index}>
                                {
                                    Object.keys(row).map((rowData, index) => {
                                        return <td key={"td" + index}>{row[rowData]}</td>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </Table>

        </div> : null
    )
}