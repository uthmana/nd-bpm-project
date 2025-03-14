import React from 'react';

export default function TableHeader() {
  return (
    <thead>
      <tr>
        <td rowSpan={2} colSpan={2}>
          Test Standard
        </td>
        <td rowSpan={2} colSpan={1}>
          Gerekli <br /> Değer/ <br />
          <em>
            Required <br /> Value
          </em>
        </td>
        <td rowSpan={1} colSpan={10} className="text-center">
          <b>Test Değeri </b>/ Test Value
        </td>
        <td rowSpan={2} colSpan={1}>
          Ortalama/
          <br />
          <em>Average</em>
        </td>
      </tr>

      <tr>
        <td>x1</td>
        <td>x2</td>
        <td>x3</td>
        <td>x4</td>
        <td>x5</td>
        <td>x6</td>
        <td>x7</td>
        <td>x8</td>
        <td>x9</td>
        <td>10</td>
      </tr>
    </thead>
  );
}
