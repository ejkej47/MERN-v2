export default function OtherBlock({ data, onChange }) {
  return (
    <div className="p-4 border rounded shadow-sm mb-4 bg-gray-50 text-gray-500 flex justify-center items-center">
      [Ovo je {data.type} tip bloka: {data.custom_component}]
    </div>
  );
}