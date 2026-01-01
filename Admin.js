const Admin = ({ setPage, lang }) => {
    const [isAuth, setIsAuth] = React.useState(false);
    const [tab, setTab] = React.useState('products'); // products, orders, customers, categories
    const [items, setItems] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);
    const [currentPath, setCurrentPath] = React.useState([]); // لمسار الأقسام [id1, id2]
    
    // نموذج البيانات
    const [productForm, setProductForm] = React.useState({ 
        nameAr: '', nameEn: '', price: '', unit: 'حبة', qty: '', categoryId: '' 
    });
    const [catForm, setCatForm] = React.useState({ nameAr: '', nameEn: '', parentId: '' });

    const t = {
        ar: { products: "المنتجات", orders: "الطلبات", customers: "العملاء", cats: "الأقسام", add: "إضافة", save: "حفظ", cancel: "إلغاء", delete: "حذف", edit: "تعديل", unit: "الوحدة", qty: "الكمية", price: "السعر" },
        en: { products: "Products", orders: "Orders", customers: "Customers", cats: "Categories", add: "Add", save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit", unit: "Unit", qty: "Qty", price: "Price" }
    }[lang];

    const convertNumbers = (str) => {
        if (!str) return "";
        return str.toString().replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
    };

    const fetchData = async () => {
        let query = db.collection(tab);
        if (tab === 'categories') {
            const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : "root";
            query = query.where("parentId", "==", parentId);
        }
        const snap = await query.get();
        setItems(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    React.useEffect(() => { if (isAuth) fetchData(); }, [isAuth, tab, currentPath]);

    // --- نظام الأقسام اللانهائي ---
    const handleAddCategory = async () => {
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : "root";
        await db.collection("categories").add({ ...catForm, parentId });
        setShowModal(false);
        fetchData();
    };

    // --- إدارة المنتجات ---
    const handleAddProduct = async () => {
        const data = { 
            ...productForm, 
            price: parseFloat(convertNumbers(productForm.price)),
            qty: parseInt(convertNumbers(productForm.qty)) || 0 
        };
        if (editingItem) {
            await db.collection("products").doc(editingItem.id).update(data);
        } else {
            await db.collection("products").add(data);
        }
        setShowModal(false);
        setEditingItem(null);
        fetchData();
    };

    // --- تعديل الطلبات ---
    const updateOrder = async (orderId, newItems) => {
        const newTotal = newItems.reduce((a, b) => a + (b.qty * b.price), 0);
        await db.collection("orders").doc(orderId).update({ items: newItems, total: newTotal });
        fetchData();
    };

    if (!isAuth) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
                <input type="password" placeholder="Password" className="p-4 rounded-xl text-black text-center text-2xl" 
                    onChange={(e) => e.target.value === '5466' && setIsAuth(true)} />
            </div>
        );
    }

    return (
        <div className={`flex h-screen bg-gray-50 ${lang === 'en' ? 'ltr' : 'rtl'}`}>
            {/* القائمة الجانبية */}
            <div className="w-72 bg-slate-900 text-white p-6 flex flex-col gap-4">
                <img src="logo.png" className="w-20 mx-auto mb-6" />
                <button onClick={() => setTab('orders')} className={`p-4 rounded-xl text-right ${tab === 'orders' ? 'bg-blue-600' : ''}`}>📊 {t.orders}</button>
                <button onClick={() => setTab('customers')} className={`p-4 rounded-xl text-right ${tab === 'customers' ? 'bg-blue-600' : ''}`}>👥 {t.customers}</button>
                <button onClick={() => {setTab('categories'); setCurrentPath([]);}} className={`p-4 rounded-xl text-right ${tab === 'categories' ? 'bg-blue-600' : ''}`}>📂 {t.cats}</button>
                <button onClick={() => setTab('products')} className={`p-4 rounded-xl text-right ${tab === 'products' ? 'bg-blue-600' : ''}`}>📦 {t.products}</button>
                <div className="mt-auto">
                    <button onClick={() => setPage('home')} className="text-red-400 p-4 w-full text-right font-bold underline">خروج</button>
                </div>
            </div>

            {/* المحتوى */}
            <div className="flex-1 p-10 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">{t[tab]}</h1>
                        {tab === 'categories' && (
                            <div className="flex gap-2 mt-2 text-blue-600 font-bold">
                                <button onClick={() => setCurrentPath([])}>الرئيسية</button>
                                {currentPath.map((p, i) => (
                                    <span key={i}> {lang === 'ar' ? '←' : '→'} <button onClick={() => setCurrentPath(currentPath.slice(0, i+1))}>{lang === 'ar' ? p.nameAr : p.nameEn}</button></span>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => {setEditingItem(null); setShowModal(true)}} className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold">+ {t.add}</button>
                </div>

                {/* عرض البيانات حسب التاب */}
                <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b">
                            {tab === 'products' && (
                                <tr><th className="p-4">المنتج</th><th className="p-4">السعر</th><th className="p-4">الكمية</th><th className="p-4 text-center">إجراء</th></tr>
                            )}
                            {tab === 'categories' && (
                                <tr><th className="p-4">اسم القسم</th><th className="p-4 text-center">إجراء</th></tr>
                            )}
                            {tab === 'orders' && (
                                <tr><th className="p-4">رقم الطلب</th><th className="p-4">المبلغ</th><th className="p-4">إجراء</th></tr>
                            )}
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b hover:bg-slate-50 transition-all">
                                    {tab === 'products' && (
                                        <>
                                            <td className="p-4 font-bold">{lang === 'ar' ? item.nameAr : item.nameEn}</td>
                                            <td className="p-4">{item.price.toFixed(3)}</td>
                                            <td className="p-4">{item.qty} {item.unit}</td>
                                            <td className="p-4 text-center">
                                                <button className="text-blue-500 mx-2" onClick={() => {setEditingItem(item); setProductForm(item); setShowModal(true);}}>{t.edit}</button>
                                                <button className="text-red-500" onClick={() => handleDelete(item.id)}>{t.delete}</button>
                                            </td>
                                        </>
                                    )}
                                    {tab === 'categories' && (
                                        <>
                                            <td className="p-4 font-bold cursor-pointer text-blue-700" onClick={() => setCurrentPath([...currentPath, item])}>
                                                📁 {lang === 'ar' ? item.nameAr : item.nameEn}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="text-red-500" onClick={() => handleDelete(item.id)}>{t.delete}</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal الإضافة (يتغير حسب التاب) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-8">
                        <h2 className="text-2xl font-black mb-6">{editingItem ? t.edit : t.add}</h2>
                        
                        {tab === 'products' ? (
                            <div className="space-y-4">
                                <input type="text" placeholder="الاسم بالعربي" className="w-full p-4 border rounded-xl" defaultValue={productForm.nameAr} onChange={e => setProductForm({...productForm, nameAr: e.target.value})} />
                                <input type="text" placeholder="Name in English" className="w-full p-4 border rounded-xl ltr" defaultValue={productForm.nameEn} onChange={e => setProductForm({...productForm, nameEn: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="السعر" className="p-4 border rounded-xl font-bold" defaultValue={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                                    <select className="p-4 border rounded-xl" onChange={e => setProductForm({...productForm, unit: e.target.value})}>
                                        <option value="حبة">حبة</option><option value="كيلو">كيلو</option><option value="لتر">لتر</option><option value="ربطة">ربطة</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="الكمية" className="w-full p-4 border rounded-xl" defaultValue={productForm.qty} onChange={e => setProductForm({...productForm, qty: e.target.value})} />
                                <button onClick={handleAddProduct} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{t.save}</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input type="text" placeholder="اسم القسم بالعربي" className="w-full p-4 border rounded-xl" onChange={e => setCatForm({...catForm, nameAr: e.target.value})} />
                                <input type="text" placeholder="Category Name English" className="w-full p-4 border rounded-xl ltr" onChange={e => setCatForm({...catForm, nameEn: e.target.value})} />
                                <button onClick={handleAddCategory} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{t.save}</button>
                            </div>
                        )}
                        <button onClick={() => setShowModal(false)} className="w-full mt-4 text-gray-500">{t.cancel}</button>
                    </div>
                </div>
            )}
        </div>
    );
};
