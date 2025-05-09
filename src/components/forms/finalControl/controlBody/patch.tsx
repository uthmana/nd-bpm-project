import React, { ReactNode, useState } from 'react';
import TableHeader from './table/tableHeader';
import TextArea from 'components/fields/textArea';

export default function Patch({ data, onChange, variant = 'input' }) {
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
      <table className="patch test-table">
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
                {Object.entries(newItem).map(([key, value]: any, index) => {
                  if (index === 0) {
                    return (
                      <td key={index} colSpan={2}>
                        <> {value as ReactNode} </>
                      </td>
                    );
                  }

                  return (
                    <td key={index} className={`patch-${variant}`}>
                      {variant !== 'input' ? (
                        <> {value as ReactNode} </>
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
