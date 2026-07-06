export default function TrueFalseBlock({ data, onChange }) {
  return (
    <div className="p-4 border rounded shadow-sm mb-4">
      <p className="font-semibold mb-3">{data.text}</p>
      <div className="flex gap-4">
        {data.options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name={data.id} 
              value={opt.value} 
              onChange={(e) => onChange(data.id, e.target.value)}
              className="form-radio"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}