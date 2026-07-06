export default function MatrixRatingBlock({ data, onChange }) {
  // Pomoćna funkcija za čuvanje stanja unutar matrice
  const handleCellChange = (row, val) => {
    // Slaćemo objekat nazad engine-u, npr: { "Partner": 3, "Roditelji": 5 }
    onChange(data.id, { row, value: val }); 
  };

  return (
    <div className="p-4 border rounded shadow-sm mb-4 overflow-x-auto">
      <p className="font-semibold mb-3">{data.text}</p>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Osoba / Tehnika</th>
            {data.columns.map((col, idx) => (
              <th key={idx} className="border-b p-2 text-center text-sm">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="border-b p-2 font-medium">{row}</td>
              {data.columns.map((col, cIdx) => (
                <td key={cIdx} className="border-b p-2 text-center">
                  <select 
                    className="border rounded p-1"
                    onChange={(e) => handleCellChange(`${row}_${col}`, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>-</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}