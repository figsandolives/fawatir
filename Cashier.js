const Cashier = ({ setPage, lang }) => {
    const [view, setView] = React.useState('main'); // main, new_invoice, customer_selection, print
    const [orderType, setOrderType] = React.useState('pickup'); // pickup, delivery
    const [cart, setCart] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [selectedCustomer, setSelectedCustomer] = React.useState(null);
    const [selectedAddress, setSelectedAddress] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showAddCustomer, setShowAddCustomer] = React.useState(false);
    const [deliveryFee, setDeliveryFee] = React.useState(0);

    // نموذج عميل جديد
    const [custForm, setCustForm] = React.useState({ name: '', phone: '', code: '965', region: '', addressDetail: '' });

    const regions = [
    { name: 'السرة', price: 0.5 },
    { name: 'الزهراء', price: 1 }, { name: 'السلام', price: 1 }, { name: 'حطين', price: 1 }, { name: 'الفيحاء', price: 1 }, { name: 'القادسية', price: 1 }, { name: 'مشرف', price: 1 }, { name: 'كيفان', price: 1 }, { name: 'الروضة', price: 1 }, { name: 'العديلية', price: 1 }, { name: 'الخالدية', price: 1 }, { name: 'النزهة', price: 1 }, { name: 'الدعية', price: 1 }, { name: 'المنصورية', price: 1 }, { name: 'قرطبة', price: 1 }, { name: 'الشامية', price: 1 }, { name: 'الرميثية', price: 1 }, { name: 'عبدالله السالم', price: 1 }, { name: 'الجابرية', price: 1 }, { name: 'بيان', price: 1 }, { name: 'الصديق', price: 1 }, { name: 'الشهداء', price: 1 }, { name: 'اليرموك', price: 1 },
    { name: 'الفروانية', price: 2 }, { name: 'خيطان', price: 2 }, { name: 'بنيد القار', price: 2 }, { name: 'الدسمة', price: 2 }, { name: 'حولي', price: 2 }, { name: 'ميدان حولي', price: 2 }, { name: 'مبارك الكبير', price: 2 }, { name: 'القصور', price: 2 }, { name: 'الرابية', price: 2 }, { name: 'العمرية', price: 2 }, { name: 'الرقعي', price: 2 }, { name: 'غرناطة', price: 2 }, { name: 'القرين', price: 2 }, { name: 'الشويخ', price: 2 }, { name: 'المسيلة', price: 2 }, { name: 'الكويت', price: 2 }, { name: 'اشبيليا', price: 2 }, { name: 'السالمية', price: 2 }, { name: 'شرق', price: 2 }, { name: 'الرحاب', price: 2 }, { name: 'المرقاب', price: 2 }, { name: 'صباح السالم', price: 2 }, { name: 'الفردوس', price: 2 }, { name: 'صباح الناصر', price: 2 }, { name: 'المسايل', price: 2 }, { name: 'الاندلس', price: 2 }, { name: 'العارضية', price: 2 }, { name: 'سلوى', price: 2 }, { name: 'العدان', price: 2 }, { name: 'الشعب', price: 2 },
    { name: 'هدية', price: 3 }, { name: 'الصليبيخات', price: 3 }, { name: 'الجهراء', price: 3 }, { name: 'الفنطاس', price: 3 }, { name: 'سعد العبدالله', price: 3 }, { name: 'الفنيطيس', price: 3 }, { name: 'الدوحة', price: 3 }, { name: 'العقيلة', price: 3 }, { name: 'جابر العلي', price: 3 }, { name: 'جابر الاحمد', price: 3 }, { name: 'عبدالله مبارك', price: 3 }, { name: 'المهبولة', price: 3 }, { name: 'المنقف', price: 3 }, { name: 'الاحمدي', price: 3 }, { name: 'الصليبية', price: 3 }, { name: 'الصباحية', price: 3 }, { name: 'فهد الاحمد', price: 3 }, { name: 'صبحان', price: 3 }, { name: 'ابو فطيرة', price: 3 }, { name: 'ابو الحصانية', price: 3 }, { name: 'الظهر', price: 3 }, { name: 'ابو حليفة', price: 3 }, { name: 'الفحيحيل', price: 3 }, { name: 'جليب الشيوخ', price: 3 },
    { name: 'ام الهيمان', price: 4 }, { name: 'المطلاع', price: 5 }, { name: 'صباح الاحمد', price: 6 }, { name: 'الوفرة', price: 8 }
];


    const t = {
        ar: { search: "بحث...", next: "التالي", back: "رجوع", addCust: "إضافة عميل جديد", selectCust: "اختيار عميل", delivery: "توصيل منزل", pickup: "استلام فرع", name: "الاسم", phone: "الهاتف", total: "الإجمالي" },
        en: { search: "Search...", next: "Next", back: "Back", addCust: "Add New Customer", selectCust: "Select Customer", delivery: "Delivery", pickup: "Pickup", name: "Name", phone: "Phone", total: "Total" }
    }[lang];

    React.useEffect(() => {
        db.collection("products").get().then(s => setProducts(s.docs.map(d => ({...d.data(), id: d.id}))));
        db.collection("customers").get().then(s => setCustomers(s.docs.map(d => ({...d.data(), id: d.id}))));
    }, []);

    const addToCart = (p) => {
        const exist = cart.find(x => x.id === p.id);
        if (exist) setCart(cart.map(x => x.id === p.id ? { ...exist, qty: exist.qty + 1 } : x));
        else setCart([...cart, { id: p.id, name: lang === 'ar' ? p.nameAr : p.nameEn, price: p.price, qty: 1 }]);
    };

    const handleSaveCustomer = async () => {
        const newCust = {
            name: custForm.name,
            phone: custForm.code + custForm.phone,
            addresses: [{ region: custForm.region, detail: custForm.addressDetail }],
            orderCount: 0
        };
        const doc = await db.collection("customers").add(newCust);
        setCustomers([...customers, { ...newCust, id: doc.id }]);
        setSelectedCustomer({ ...newCust, id: doc.id });
        setSelectedAddress(newCust.addresses[0]);
        setShowAddCustomer(false);
    };

    if (view === 'print') {
        return (
            <div className="bg-white min-h-screen p-8 text-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="max-w-2xl mx-auto border-2 border-dashed p-6">
                    <div className="text-center mb-6">
                        <img src="logo.png" className="w-20 mx-auto" />
                        <h1 className="text-2xl font-black">مخبز التين والزيتون</h1>
                        <p>{selectedCustomer?.name} - {selectedCustomer?.phone}</p>
                        {orderType === 'delivery' && <p>{selectedAddress?.region} - {selectedAddress?.detail}</p>}
                    </div>
                    <table className="w-full mb-4">
                        {cart.map(item => (
                            <tr key={item.id} className="border-b">
                                <td>{item.name} x{item.qty}</td>
                                <td className="text-left">{(item.qty * item.price).toFixed(3)}</td>
                            </tr>
                        ))}
                    </table>
                    <div className="text-xl font-bold border-t pt-2 flex justify-between">
                        <span>{t.total}:</span>
                        <span>{(cart.reduce((a, b) => a + (b.qty * b.price), 0) + deliveryFee).toFixed(3)} د.ك</span>
                    </div>
                    <button onClick={() => window.print()} className="mt-8 w-full bg-black text-white py-3 no-print">طباعة الفاتورة</button>
                    <button onClick={() => setView('main')} className="mt-2 w-full text-gray-400 no-print">{t.back}</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen flex flex-col bg-slate-50 ${lang === 'en' ? 'ltr' : 'rtl'}`}>
            {/* Header */}
            <div className="bg-white p-4 shadow flex justify-between items-center px-10">
                <button onClick={() => setPage('home')} className="font-bold text-blue-600">🏠 الرئيسية</button>
                <img src="logo.png" className="h-12" />
                <button onClick={() => setView('new_invoice')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">{t.addCust} +</button>
            </div>

            {view === 'new_invoice' && (
                <div className="flex flex-1 overflow-hidden">
                    {/* Products Grid */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-4">
                            {products.map(p => (
                                <button key={p.id} onClick={() => addToCart(p)} className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-blue-500 hover:scale-95 transition-all">
                                    <div className="font-black text-xl">{lang === 'ar' ? p.nameAr : p.nameEn}</div>
                                    <div className="text-blue-600 font-bold">{p.price.toFixed(3)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Cart Sidebar */}
                    <div className="w-96 bg-white border-r p-6 flex flex-col shadow-xl">
                        <h2 className="text-2xl font-black mb-4">السلة</h2>
                        <div className="flex-1 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between border-b py-2 font-bold">
                                    <span>{item.name} x{item.qty}</span>
                                    <span>{(item.qty * item.price).toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setView('customer_selection')} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-xl mt-4">
                            {t.next}
                        </button>
                    </div>
                </div>
            )}

            {view === 'customer_selection' && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl p-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black">{t.selectCust}</h2>
                            <button onClick={() => setShowAddCustomer(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">+ {t.addCust}</button>
                        </div>

                        {!showAddCustomer ? (
                            <>
                                <input type="text" placeholder={t.search} className="w-full p-5 border-2 rounded-2xl mb-6 text-xl" onChange={e => setSearchTerm(e.target.value)} />
                                <div className="grid gap-4">
                                    {customers.filter(c => c.phone.includes(searchTerm) || c.name.includes(searchTerm)).map(c => (
                                        <div key={c.id} className="border-2 p-6 rounded-3xl hover:border-blue-500 cursor-pointer transition-all" onClick={() => { setSelectedCustomer(c); setOrderType('delivery'); }}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-2xl font-black">{c.name}</div>
                                                    <div className="text-slate-500 font-bold text-lg">{c.phone}</div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {c.addresses.map((addr, idx) => (
                                                        <button key={idx} onClick={() => { setSelectedAddress(addr); setView('print'); }} className="bg-slate-100 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white font-bold">
                                                            {addr.region}: {addr.detail}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <input type="text" placeholder="اسم الزبون" className="w-full p-4 border rounded-xl" onChange={e => setCustForm({...custForm, name: e.target.value})} />
                                <div className="flex gap-2">
                                    <input type="text" className="w-20 p-4 border rounded-xl text-center font-bold" defaultValue="965" onChange={e => setCustForm({...custForm, code: e.target.value})} />
                                    <input type="text" placeholder="رقم الهاتف" className="flex-1 p-4 border rounded-xl" onChange={e => setCustForm({...custForm, phone: e.target.value})} />
                                </div>
                                <select className="w-full p-4 border rounded-xl" onChange={e => {
                                    const reg = regions.find(r => r.name === e.target.value);
                                    setCustForm({...custForm, region: e.target.value});
                                    setDeliveryFee(reg ? reg.price : 0);
                                }}>
                                    <option>اختر المنطقة</option>
                                    {regions.map((r, i) => <option key={i} value={r.name}>{r.name}</option>)}
                                </select>
                                <textarea placeholder="تفاصيل العنوان (قطعة، شارع، منزل...)" className="w-full p-4 border rounded-xl h-32" onChange={e => setCustForm({...custForm, addressDetail: e.target.value})}></textarea>
                                <button onClick={handleSaveCustomer} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl">حفظ ومتابعة</button>
                                <button onClick={() => setShowAddCustomer(false)} className="w-full text-slate-400">إلغاء</button>
                            </div>
                        )}
                        <button onClick={() => setView('new_invoice')} className="mt-8 w-full text-red-500 font-bold">رجوع للطلبات</button>
                    </div>
                </div>
            )}
        </div>
    );
};
