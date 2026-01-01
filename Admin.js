const Admin = ({ setPage }) => {
  const [pass, setPass] = React.useState('');
  const [isAuth, setIsAuth] = React.useState(false);
  const [tab, setTab] = React.useState('products');
  const [items, setItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({ nameAr: '', nameEn: '', price: '', unit: 'حبة', qty: '' });

  const fetchData = async () => {
    const querySnapshot = await db.collection(tab).get();
    setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  React.useEffect(() => { if (isAuth) fetchData(); }, [isAuth, tab]);

  const handleAddProduct = async () => {
    const cleanQty = form.qty.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    await db.collection("products").add({ ...form, qty: cleanQty });
    setShowModal(false);
    fetchData();
  };

  if (!isAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white" dir="rtl">
        <h2 className="text-2xl mb-4 font-bold">نظام الإدارة - كلمة المرور</h2>
        <input type="password" autoFocus className="p-4 rounded-xl text-black text-center text-3xl w-48 shadow-2xl" 
          onChange={(e) => e.target.value === '5466' && setIsAuth(true)} />
        <button onClick={() => setPage('home')} className="mt-4 text-gray-400">رجوع للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <div className="w-64 bg-gray-900 text-white p-6 shadow-2xl">
        <h1 className="text-xl font-bold mb-10 border-b border-gray-700 pb-4 text-center">الإدارة</h1>
        <div className="flex flex-col gap-3">
          {['products', 'orders', 'customers'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`p-4 rounded-xl text-right ${tab === t ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
              {t === 'products' ? 'المنتجات' : t === 'orders' ? 'الطلبات' : 'العملاء'}
            </button>
          ))}
          <button onClick={() => setPage('home')} className="mt-10 text-red-400 text-right p-4">تسجيل خروج</button>
        </div>
      </div>
      <div className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black">إدارة {tab}</h2>
          <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">+ إضافة</button>
        </div>
        <table className="w-full bg-white rounded-3xl overflow-hidden shadow">
          <thead className="bg-gray-50 border-b">
            <tr><th className="p-5 text-right">الاسم</th><th className="p-5 text-right">السعر</th><th className="p-5 text-center">إجراءات</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-5 font-bold">{item.nameAr}</td>
                <td className="p-5 text-blue-600 font-bold">{item.price} د.ك</td>
                <td className="p-5 text-center">
                  <button onClick={async () => { if(confirm('حذف؟')) { await db.collection(tab).doc(item.id).delete(); fetchData(); } }} className="text-red-500">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8">
            <h3 className="text-2xl font-bold mb-6">إضافة جديد</h3>
            <input type="text" placeholder="الاسم بالعربي" className="w-full p-4 border rounded-xl mb-4" onChange={e => setForm({...form, nameAr: e.target.value})} />
            <input type="text" placeholder="السعر" className="w-full p-4 border rounded-xl mb-4" onChange={e => setForm({...form, price: e.target.value})} />
            <input type="text" placeholder="الكمية" className="w-full p-4 border rounded-xl mb-4" onChange={e => setForm({...form, qty: e.target.value})} />
            <button onClick={handleAddProduct} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">حفظ</button>
            <button onClick={() => setShowModal(false)} className="w-full text-gray-500 mt-4">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};
