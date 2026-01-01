const Home = ({ setPage }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4" dir="rtl">
      <img src="logo.png" alt="Logo" className="w-64 mb-10 object-contain" />
      <div className="flex flex-col gap-6 w-full max-w-md">
        <button onClick={() => setPage('cashier')} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-2xl text-3xl font-bold shadow-xl transition-transform active:scale-95">
          الكاشير
        </button>
        <button onClick={() => setPage('admin')} 
          className="bg-gray-800 hover:bg-black text-white py-8 rounded-2xl text-3xl font-bold shadow-xl transition-transform active:scale-95">
          المحاسبة والمخازن
        </button>
      </div>
    </div>
  );
};
