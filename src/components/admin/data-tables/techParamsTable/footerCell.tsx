import { MdAdd, MdCancel } from 'react-icons/md';

export const FooterCell = ({ table }) => {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;

  const removeRows = () => {
    meta.removeSelectedRows(
      table.getSelectedRowModel().rows.map((row) => row.index),
    );
    table.resetRowSelection();
  };

  return (
    <div className="footer-buttons">
      {selectedRows.length > 0 ? (
        <button
          className="remove-button flex items-center justify-center"
          onClick={removeRows}
        >
          <MdCancel className="mr-1 h-5 w-5" /> Kaldır
        </button>
      ) : (
        <button
          className="add-button flex items-center justify-center"
          onClick={meta?.addRow}
        >
          <MdAdd className="mr-1 h-5 w-5" /> Ekle
        </button>
      )}
    </div>
  );
};
