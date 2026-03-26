export default function DJCard() {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
      
      <div className="h-24 bg-gray-200 rounded mb-3 flex items-center justify-center">
        👤
      </div>

      <p className="text-xs">Wedding</p>
      <p className="text-blue-500 text-xs mb-2">$/Price/hr</p>

      <button className="bg-blue-500 text-white w-full py-1 rounded text-sm">
        View
      </button>

    </div>
  );
}