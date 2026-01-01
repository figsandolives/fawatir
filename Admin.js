const Admin = ({ setPage }) => {
    const [pass, setPass] = React.useState('');
    const [isAuth, setIsAuth] = React.useState(false);
    const [tab, setTab] = React.useState('products'); // products, orders, customers
    const [items, setItems] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    
    // نموذج إضافة منتج
    const [form, setForm] = React.useState({ nameAr: '', nameEn: '', price: '', qty: '', category: 'عام' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await db.collection(tab).orderBy(tab === 'orders' ? 'date' : 'nameAr', 'desc').get();
            setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        if (isAuth) fetchData();
    }, [isAuth, tab]);

    const handleAddProduct = async () => {
        if (!form.nameAr || !form.price) return alert("يرجى ملء البيانات الأساسية");
        
        await db.collection("products").add({
            ...form,
            price: parseFloat(form.price),
            qty: form.qty || 0,
            createdAt: new Date()
        });
        
        setShowModal(false);
        setForm({ nameAr: '', nameEn: '', price: '', qty: '', category: 'عام' });
        fetchData();
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            await db.collection(tab).doc(id).delete();
            fetchData();
        }
    };

    if (!isAuth) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans" dir="rtl">
                <img src="logo.png" className="w-32 mb-8 opacity-50" />
                <h2 className="text-3xl mb-6 font-black tracking-widest">نظام الإدارة المحمي</h2>
                <input 
                    type="password" 
                    placeholder="كلمة المرور"
                    autoFocus 
                    className="p-5 rounded-2xl text-black text-center text-4xl w-64 shadow-2xl outline-none border-4 border-blue-500" 
                    onChange={(e) => e.target.value === '5466' && setIsAuth(true)} 
                />
                <button onClick={() => setPage('home')} className="mt-8 text-gray-400 hover:text-white transition-colors text-lg">العودة للرئيسية</button>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
            {/* القائمة الجانبية Side Menu */}
            <div className="w-72 bg-slate-900 text-white p-8 flex flex-col shadow-2xl">
                <div className="flex flex-col items-center mb-10 border-b border-slate-700 pb-8">
                    <img src="logo.png" className="w-20 mb-4" />
                    <span className="text-xl font-black">لوحة التحكم</span>
                </div>
                
                <div className="flex flex-col gap-4 flex-1">
                    {[
                        { id: 'products', n: 'المخزون والمنتجات', icon: '📦' },
                        { id: 'orders', n: 'سجل المبيعات', icon: '📊' },
                        { id: 'customers', n: 'قاعدة العملاء', icon: '👥' }
                    ].map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setTab(item.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl text-right font-bold transition-all ${tab === item.id ? 'bg-blue-600 shadow-lg scale-105' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            {item.n}
                        </button>
                    ))}
                </div>

                <button onClick={() => setPage('home')} className="bg-red-900/50 hover:bg-red-800 p-4 rounded-xl text-red-200 font-bold transition-colors">
                    تسجيل الخروج
                </button>
            </div>

            {/* المحتوى الرئيسي Main Content */}
            <div className="flex-1 p-10 overflow-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 capitalize">
                            {tab === 'products' ? 'إدارة المنتجات' : tab === 'orders' ? 'سجل الطلبات' : 'العملاء'}
                        </h2>
                        <p className="text-slate-500 mt-2">إجمالي العناصر: {items.length}</p>
                    </div>

                    {tab === 'products' && (
                        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition-transform active:scale-95">
                            + إضافة منتج جديد
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-2xl text-slate-400 animate-pulse font-bold">جاري تحميل البيانات...</div>
                ) : (
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-right border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {tab === 'products' ? (
                                        <>
                                            <th className="p-6 text-slate-600 font-bold">اسم المنتج</th>
                                            <th className="p-6 text-slate-600 font-bold">السعر</th>
                                            <th className="p-6 text-slate-600 font-bold">الكمية بالمخزن</th>
                                            <th className="p-6 text-slate-600 font-bold text-center">الإجراءات</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="p-6 text-slate-600 font-bold">رقم الطلب</th>
                                            <th className="p-6 text-slate-600 font-bold">التفاصيل</th>
                                            <th className="p-6 text-slate-600 font-bold">المبلغ الإجمالي</th>
                                            <th className="p-6 text-slate-600 font-bold">التاريخ</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        {tab === 'products' ? (
                                            <>
                                                <td className="p-6">
                                                    <div className="font-black text-slate-800 text-lg">{item.nameAr}</div>
                                                    <div className="text-slate-400 text-sm italic">{item.nameEn}</div>
                                                </td>
                                                <td className="p-6 font-black text-blue-600 text-xl">{parseFloat(item.price).toFixed(3)} د.ك</td>
                                                <td className="p-6">
                                                    <span className={`px-4 py-1 rounded-full font-bold ${item.qty < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {item.qty} {item.unit || 'حبة'}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 transition-colors font-bold px-4">حذف</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-6 font-mono font-bold text-slate-500">#{item.id.slice(0,6)}</td>
                                                <td className="p-6">
                                                    {item.items?.map((p, idx) => (
                                                        <span key={idx} className="bg-slate-100 px-2 py-1 rounded text-xs ml-1">{p.name} (x{p.qty})</span>
                                                    ))}
                                                </td>
                                                <td className="p-6 font-black text-green-600 text-xl">{parseFloat(item.total).toFixed(3)} د.ك</td>
                                                <td className="p-6 text-slate-500">{item.date?.toDate ? item.date.toDate().toLocaleString('ar-KW') : 'قيد المعالجة'}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* نافذة الإضافة الماركة Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-300">
                        <h3 className="text-3xl font-black mb-8 text-slate-800 border-b pb-4">إضافة منتج للمخزن</h3>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2">الاسم بالعربي</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none" 
                                        onChange={e => setForm({...form, nameAr: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2">الاسم بالإنجليزي</label>
                                    <input type="text" dir="ltr" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none" 
                                        onChange={e => setForm({...form, nameEn: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2">سعر البيع (د.ك)</label>
                                    <input type="number" step="0.001" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-bold" 
                                        onChange={e => setForm({...form, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2">الكمية الحالية</label>
                                    <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-bold" 
                                        onChange={e => setForm({...form, qty: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button onClick={handleAddProduct} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95">حفظ البيانات</button>
                            <button onClick={() => setShowModal(false)} className="px-8 bg-slate-100 text-slate-500 py-5 rounded-2xl font-bold">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
