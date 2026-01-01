import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [pass, setPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [tab, setTab] = useState('products');
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // حقول إضافة منتج جديد
  const [form, setForm] = useState({ nameAr: '', nameEn: '', price: '', unit: 'حبة', qty: '' });

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, tab));
    setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => { if (isAuth) fetchData(); }, [isAuth, tab]);

  const handleAddProduct = async () => {
    // تحويل الأرقام العربية لإنجليزية تلقائياً قبل الحفظ
    const cleanQty = form.qty.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    await addDoc(collection(db, "products"), { ...form, qty: cleanQty });
    setShowModal(false);
    fetchData();
  };

  if (!isAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white" dir="rtl">
        <h2 className="text-2xl mb-4 font-bold">نظام الإدارة - كلمة المرور</h2>
        <input type="password" autoFocus className="p-4 rounded-xl text-black text-center text-3xl w-48 shadow-2xl" 
          onChange={(e) => e.target.value === '5466' && setIsAuth(true)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* القائمة الجانبية */}
      <div className="w-72 bg-gray-900 text-white p-6 shadow-2xl">
        <h1 className="text-xl font-bold mb-10 border-b border-gray-700 pb-4 text-center">المحاسبة والمخازن</h1>
        <div className="flex flex-col gap-3">
          {[
            {id: 'orders', n: 'الطلبات'},
            {id: 'customers', n: 'العملاء'},
            {id: 'products', n: 'المنتجات'},
            {id: 'categories', n: 'الأقسام'}
          ].map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`text-right p-4 rounded-xl font-bold transition-all ${tab === item.id ? 'bg-blue-600 shadow-lg scale-105' : 'hover:bg-gray-800 text-gray-400'}`}>
              {item.n}
            </button>
          ))}
        </div>
      </div>

      {/* المحتوى */}
      <div className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-gray-800">إدارة {tab === 'products' ? 'المنتجات' : tab}</h2>
          <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-transform active:scale-95">
            + إضافة جديد
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-5">الاسم</th>
                <th className="p-5">السعر</th>
                <th className="p-5">الكمية / الوحدة</th>
                <th className="p-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-5 font-bold">{item.nameAr} <br/><span className="text-gray-400 text-sm">{item.nameEn}</span></td>
                  <td className="p-5 text-blue-600 font-bold">{item.price} د.ك</td>
                  <td className="p-5">{item.qty} {item.unit}</td>
                  <td className="p-5 text-center">
                    <button className="text-blue-500 mx-2 font-bold">تعديل</button>
                    <button onClick={async () => { if(window.confirm('حذف؟')) { await deleteDoc(doc(db, tab, item.id)); fetchData(); } }} className="text-red-500 mx-2 font-bold">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* شاشة الإضافة المنبثقة (Modal) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 border-b pb-4">إضافة منتج جديد</h3>
            <div className="space-y-4">
              <input type="text" placeholder="اسم المنتج (عربي)" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, nameAr: e.target.value})} />
              <input type="text" placeholder="Product Name (English)" className="w-full p-4 border rounded-xl text-left" dir="ltr" onChange={e => setForm({...form, nameEn: e.target.value})} />
              <div className="flex gap-4">
                <input type="number" placeholder="سعر البيع" className="w-1/2 p-4 border rounded-xl" onChange={e => setForm({...form, price: e.target.value})} />
                <select className="w-1/2 p-4 border rounded-xl" onChange={e => setForm({...form, unit: e.target.value})}>
                  <option>حبة</option><option>كيلو</option><option>لتر</option><option>جرام</option><option>ربطة</option><option>كرتون</option><option>تنكة</option>
                </select>
              </div>
              <input type="text" placeholder="الكمية (أرقام)" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, qty: e.target.value})} />
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={handleAddProduct} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg">حفظ وإضافة</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold text-lg">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}