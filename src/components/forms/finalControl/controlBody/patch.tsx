import React, { useState } from 'react';
import TableHeader from './table/tableHeader';
import { patchData } from './table/defaultData';

export default function Patch({ data, onChange }) {
  const [values, setValues] = useState(data || patchData);
  const [tableData, setTableData] = useState(patchData);

  return (
    <div className="mb-5 w-full">
      <table className="patch test-table">
        <TableHeader />
        <tbody>
          {tableData.map((item, idx) => {
            return (
              <tr key={idx}>
                <td colSpan={2}> {item.standard} </td>
                <td> {item.requiredValue} </td>
                <td> {item.x1} </td>
                <td>{item.x2} </td>
                <td>{item.x3} </td>
                <td>{item.x4} </td>
                <td> {item.x5} </td>
                <td>{item.x6}</td>
                <td>{item.x7} </td>
                <td> {item.x8}</td>
                <td>{item.x9} </td>
                <td>{item.x10} </td>
                <td>{item.result} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
