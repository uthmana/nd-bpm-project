import React, { useState } from 'react';
import TableHeader from './table/tableHeader';
import TextArea from 'components/fields/textArea';

export default function Mikrokapsul({ data, variant = 'input', onChange }) {
  const [tableData, setTableData] = useState(data);

  const handleValues = (event, index) => {
    const newList = tableData.map((item, idx) => {
      if (idx === index) {
        const newVal = { [event.target?.name]: event.target?.value };
        return { ...item, ...newVal };
      }
      return item;
    });
    setTableData(newList);
    onChange(newList);
  };

  return (
    <div className="test--table__wrapper mb-5 w-full">
      <table className="mikrokapsul test-table">
        <TableHeader />
        <tbody>
          {tableData.map((item: any, idx) => {
            const {
              id,
              createdAt,
              createdBy,
              updatedAt,
              updatedBy,
              description,
              finalControlId,
              ...newItem
            } = item;

            return (
              <tr key={idx}>
                <td
                  rowSpan={3}
                  className={`w-[20px] text-center font-bold [writing-mode:vertical-lr] ${
                    idx !== 0 && idx !== 3 ? 'hidden' : ''
                  }`}
                >
                  {idx == 0 ? 'Yüksüz Test' : 'Yüklü Test'}
                </td>
                <td> {item.standard} </td>
                {Object.entries(newItem).map(([key, value]: any, index) => {
                  if (index < 1) {
                    return;
                  }
                  return (
                    <td key={index} className={`mikrokapsul-${variant}`}>
                      {variant !== 'input' ? (
                        <> {value} </>
                      ) : (
                        <TextArea
                          label=""
                          onChange={(e) => handleValues(e, idx)}
                          id={key}
                          name={key}
                          placeholder=""
                          extra="!h-full w-full !px-[2px] text-xs !rounded-none text-center"
                          value={value}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
