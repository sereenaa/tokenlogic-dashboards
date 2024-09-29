import React, { useState, useEffect } from 'react';

const AaveCompositionTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aaveStkbptCompositionQuery?type=all`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  // Calculate the current rows to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <table className="table-auto w-full text-table">
        <thead>
          <tr>
            <th className="py-1 text-left">#</th>
            <th className="py-1 text-left">Address</th>
            <th className="py-1 text-left">Number of Staked BPTs</th>
            <th className="py-1 text-left">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td className="py-1 text-left">{indexOfFirstRow + index + 1}</td>
              <td className="py-1 text-left">{row.address}</td>
              <td className="py-1 text-left">{parseFloat(row.num_stk_lp_tokens).toFixed(2)}</td>
              <td className="py-1 text-left">{parseFloat(row.perc).toFixed(4)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        rowsPerPage={rowsPerPage}
        totalRows={data.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ rowsPerPage, totalRows, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-between mb-4">
      <ul className="pagination flex items-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(1)}
            className="page-link cursor-pointer text-black hover:text-black"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link cursor-pointer text-black hover:text-black"
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
        </li>
        <li>
          <select
            value={currentPage}
            onChange={(e) => paginate(Number(e.target.value))}
            className="page-select cursor-pointer text-table bg-background"
          >
            {pageNumbers.map(number => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link cursor-pointer text-table bg-background"
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(totalPages)}
            className="page-link cursor-pointer text-black hover:text-black"
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AaveCompositionTable;