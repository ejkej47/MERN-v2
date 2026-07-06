export default function OpenTextListBlock({ data, onChange }) {
  const handleTextChange = (index, val) => {
    onChange(data.id, { index, value: val });
  };

  return (
    <div className="p-4 border rounded shadow-sm mb-4">
      <p className="font-semibold mb-3">{data.text}</p>
      <div className="flex flex-col gap-3">
        {Array.from({ length: data.count }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`${idx + 1}. unos`}
            onChange={(e) => handleTextChange(idx, e.target.value)}
            className="border rounded p-2 w-full"
          />
        ))}
      </div>
    </div>
  );
}