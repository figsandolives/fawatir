const Cashier = ({ setPage }) => {
    const [view, setView] = React.useState('main'); // main, new_invoice, delivery_selection, print
    const [products, setProducts] = React.useState([]);
    const [cart, setCart] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [orderType, setOrderType] = React.useState(''); 
    const [deliveryFee, setDeliveryFee] = React.useState(0);
    const [selectedRegion, setSelectedRegion] = React.useState('');

    const regions = [
        { name: 'السرة', price: 0.5 },
        { name: 'الزهراء', price: 1 }, { name: 'السلام', price: 1 }, { name: 'حطين', price: 1 }, { name: 'الفيحاء', price: 1 }, { name: 'القادسية', price: 1 }, { name: 'مشرف', price: 1 }, { name: 'كيفان', price: 1 }, { name: 'الروضة', price: 1 }, { name: 'العديلية', price: 1 }, { name: 'الخالدية', price: 1 }, { name: 'النزهة', price: 1 }, { name: 'الدعية', price: 1 }, { name: 'المنصورية', price: 1 }, { name: 'قرطبة', price: 1 }, { name: 'الشامية', price: 1 }, { name: 'الرميثية', price: 1 }, { name: 'عبدالله السالم', price: 1 }, { name: 'الجابرية', price: 1 }, { name: 'بيان', price: 1 }, { name: 'الصديق', price: 1 }, { name: 'الشهداء', price: 1 }, { name: 'اليرموك', price: 1 },
        { name: 'الفروانية', price: 2 }, { name: 'خيطان', price: 2 }, { name: 'بنيد القار', price: 2 }, { name: 'الدسمة', price: 2 }, { name: 'حولي', price: 2 }, { name: 'ميدان حولي', price: 2 }, { name: 'مبارك الكبير', price: 2 }, { name: 'القصور', price: 2 }, { name: 'الرابية', price: 2 }, { name: 'العمرية', price: 2 }, { name: 'الرقعي', price: 2 }, { name: 'غرناطة', price: 2 }, { name: 'القرين', price: 2 }, { name: 'الشويخ', price: 2 }, { name: 'المسيلة', price: 2 }, { name: 'الكويت', price: 2 }, { name: 'اشبيليا', price: 2 }, { name: 'السالمية', price: 2 }, { name: 'شرق', price: 2 }, { name: 'الرحاب', price: 2 }, { name: 'المرقاب', price: 2 }, { name: 'صباح السالم', price: 2 }, { name: 'الفردوس', price: 2 }, { name: 'صباح الناصر', price: 2 }, { name: 'المسايل', price: 2 }, { name: 'الاندلس', price: 2 }, { name: 'العارضية', price: 2 }, { name: 'سلوى', price: 2 }, { name: 'العدان', price: 2 }, { name: 'الشعب', price: 2 },
        { name: 'هدية', price: 3 }, { name: 'الصليبيخات', price: 3 }, { name: 'الجهراء', price: 3 }, { name: 'الفنطاس', price: 3 }, { name: 'سعد العبدالله', price: 3 }, { name: 'الفنيطيس', price: 3 }, { name: 'الدوحة', price: 3 }, { name: 'العقيلة', price: 3 }, { name: 'جابر العلي', price: 3 }, { name: 'جابر الاحمد', price: 3 }, { name: 'عبدالله مبارك', price: 3 }, { name: 'المهبولة', price: 3 }, { name: 'المنقف', price: 3 }, { name: 'الاحمدي', price: 3 }, { name: 'الصليبية', price: 3 }, { name: 'الصباحية', price: 3 }, { name: 'فهد الاحمد', price: 3 }, { name: 'صبحان', price: 3 }, { name: 'ابو فطيرة', price: 3 }, { name: 'ابو الحصانية', price: 3 }, { name: 'الظهر', price: 3 }, { name: 'ابو حليفة', price: 3 }, { name: 'الفحيحيل', price: 3 }, { name: 'جليب الشيوخ', price: 3 },
        { name: 'ام الهيمان', price: 4 }, { name: 'المطلاع', price: 5 }, { name: 'صباح الاحمد', price: 6 }, { name: 'الوفرة', price: 8 }
    ];

    React.useEffect(() => {
        db.collection("products").get().then(snap => {
            setProducts(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
    }, []);

    const addToCart = (p) => {
        const exist = cart.find(x => x.id === p.id);
        if (exist) {
            setCart(cart.map(x => x.id === p.id ? { ...exist, qty: parseInt(exist.qty) + 1 } : x));
        } else {
            setCart([...cart, { id: p.id, name: p.nameAr, price: parseFloat(p.price), qty: 1 }]);
        }
    };

    const handleConfirmPrint = async () => {
        await db.collection("orders").add({
            items: cart,
            total: cart.reduce((a, b) => a + (b.qty * b.price), 0) + deliveryFee,
            type: orderType,
            region: selectedRegion,
            date: new Date()
        });
        window.print();
        setView('main');
        setCart([]);
        setDeliveryFee(0);
    };

    if (view === 'print') {
        return (
            <div className="bg-white min-h-screen p-8 text-black" dir="rtl">
                <div className="max-w-[210mm] mx-auto border p-10 bg-white font-sans">
                    <div className="flex justify-between items-start mb-8 border-b-2 pb-6">
                        <div className="w-1/3 text-right">
                            <h2 className="text-xl font-bold">مخبز التين والزيتون</h2>
                            <p className="text-xs">اليرموك ق2 شارع 2</p>
                            <p className="text-xs">☎️ 22085889</p>
                            <p className="text-xs text-blue-700">@figsolives.kw</p>
                        </div>
                        <div className="w-1/3 flex flex-col items-center">
                            <img src="logo.png" className="w-24 mb-2" alt="Logo" />
                            <h1 className="text-lg font-black border p-1 uppercase">فاتورة مبيعات</h1>
                        </div>
                        <div className="w-1/3 text-left" dir="ltr">
                            <h2 className="text-xl font-bold">Natural Figs Rest.</h2>
                            <p className="text-xs">Abu Hasaniya, Mall 30</p>
                            <p className="text-xs">☎️ 22085886</p>
                            <p className="text-xs text-blue-700">@natural_figs</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded text-sm">
                        <div>
                            <p><strong>التاريخ:</strong> {new Date().toLocaleString('ar-KW')}</p>
                            <p><strong>نوع الطلب:</strong> {orderType === 'delivery' ? `توصيل (${selectedRegion})` : 'استلام من الفرع'}</p>
                        </div>
                        <div className="text-left">
                            <p><strong>رقم الفاتورة:</strong> #{Math.floor(10000 + Math.random() * 90000)}</p>
                        </div>
                    </div>

                    <table className="w-full text-right border-collapse mb-8">
                        <thead>
                            <tr className="bg-gray-200 border-b-2 border-black">
                                <th className="p-2 border">المنتج</th>
                                <th className="p-2 border text-center">الكمية</th>
                                <th className="p-2 border">السعر</th>
                                <th className="p-2 border">الاجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, i) => (
                                <tr key={i} className="border-b">
                                    <td className="p-2 border">{item.name}</td>
                                    <td className="p-2 border text-center">{item.qty}</td>
                                    <td className="p-2 border">{item.price.toFixed(3)}</td>
                                    <td className="p-2 border">{(item.qty * item.price).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-72">
                            <div className="flex justify-between p-1"><span>المجموع الفرعي:</span> <span>{cart.reduce((a, b) => a + (b.qty * b.price), 0).toFixed(3)} د.ك</span></div>
                            {orderType === 'delivery' && <div className="flex justify-between p-1 border-b"><span>رسوم التوصيل:</span> <span>{deliveryFee.toFixed(3)} د.ك</span></div>}
                            <div className="flex justify-between p-2 font-black text-2xl bg-gray-100 mt-2"><span>الإجمالي:</span> <span>{(cart.reduce((a, b) => a + (b.qty * b.price), 0) + deliveryFee).toFixed(3)} د.ك</span></div>
                        </div>
                    </div>
                    
                    <div className="mt-20 flex gap-4 no-print">
                        <button onClick={handleConfirmPrint} className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-xl shadow-lg">تأكيد وطباعة الفاتورة</button>
                        <button onClick={() => setView('main')} className="bg-gray-200 px-8 py-4 rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100" dir="rtl">
            <div className="bg-white p-4 shadow-md flex justify-between items-center px-10">
                <div className="flex gap-4">
                    <button onClick={() => setPage('home')} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">القائمة الرئيسية</button>
                    <button onClick={() => setView('new_invoice')} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95">فاتورة جديدة +</button>
                </div>
                <img src="logo.png" alt="Logo" className="h-14" />
            </div>

            {view === 'new_invoice' && (
                <div className="fixed inset-0 bg-white z-50 flex">
                    <div className="w-[400px] border-l bg-gray-50 flex flex-col p-6 shadow-inner">
                        <h2 className="text-2xl font-black mb-6 border-b pb-4">قائمة الطلبات</h2>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg">{item.name}</span>
                                        <span className="text-blue-600 font-bold">{item.price.toFixed(3)} د.ك</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => {
                                            const newCart = [...cart];
                                            if (newCart[idx].qty > 1) newCart[idx].qty--;
                                            setCart(newCart);
                                        }} className="w-8 h-8 bg-gray-200 rounded-full font-bold">-</button>
                                        <span className="text-xl font-black w-6 text-center">{item.qty}</span>
                                        <button onClick={() => {
                                            const newCart = [...cart];
                                            newCart[idx].qty++;
                                            setCart(newCart);
                                        }} className="w-8 h-8 bg-gray-200 rounded-full font-bold">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between text-2xl font-black mb-6">
                                <span>الإجمالي:</span>
                                <span>{cart.reduce((a, b) => a + (b.qty * b.price), 0).toFixed(3)} د.ك</span>
                            </div>
                            <button onClick={() => setView('delivery_selection')} disabled={cart.length === 0}
                                className="w-full py-5 rounded-2xl bg-green-600 text-white text-2xl font-bold shadow-lg active:scale-95 transition-all disabled:bg-gray-300">
                                الـتـالـي
                            </button>
                            <button onClick={() => setView('main')} className="w-full mt-4 text-red-500 font-bold">إلغاء الطلب</button>
                        </div>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto">
                        <input type="text" placeholder="🔍 ابحث عن منتج..." className="w-full p-5 rounded-2xl border-2 mb-8 text-xl focus:border-blue-500 outline-none shadow-sm" onChange={(e) => setSearch(e.target.value)} />
                        <div className="grid grid-cols-3 gap-6">
                            {products.filter(p => p.nameAr.includes(search)).map(product => (
                                <button key={product.id} onClick={() => addToCart(product)} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl border-b-8 border-blue-500 active:scale-95 transition-all text-center group">
                                    <div className="text-2xl font-bold mb-2 group-hover:text-blue-600">{product.nameAr}</div>
                                    <div className="text-blue-600 font-black text-xl">{parseFloat(product.price).toFixed(3)} د.ك</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'delivery_selection' && (
                <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl border-t-8 border-blue-600 text-center">
                        <h2 className="text-4xl font-black mb-12">طريقة الاستلام</h2>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <button onClick={() => {setOrderType('pickup'); setDeliveryFee(0); setView('print');}} className="border-4 border-orange-500 p-12 rounded-[30px] hover:bg-orange-50 transition-all flex flex-col items-center">
                                <span className="text-7xl mb-4">🥡</span>
                                <span className="text-2xl font-bold">استلام فرع</span>
                            </button>
                            <button onClick={() => setOrderType('delivery')} className={`border-4 p-12 rounded-[30px] transition-all flex flex-col items-center ${orderType === 'delivery' ? 'border-blue-600 bg-blue-50' : 'border-blue-600 hover:bg-blue-50'}`}>
                                <span className="text-7xl mb-4">🚗</span>
                                <span className="text-2xl font-bold">توصيل منزل</span>
                            </button>
                        </div>

                        {orderType === 'delivery' && (
                            <div className="animate-fade-in bg-gray-50 p-6 rounded-3xl border">
                                <h3 className="text-xl font-bold mb-4">اختر المنطقة:</h3>
                                <select onChange={(e) => {
                                    const region = regions.find(r => r.name === e.target.value);
                                    setDeliveryFee(region ? region.price : 0);
                                    setSelectedRegion(e.target.value);
                                }} className="w-full p-5 border-2 rounded-2xl text-xl mb-6 shadow-sm">
                                    <option value="">-- اختر المنطقة --</option>
                                    {regions.map((r, i) => <option key={i} value={r.name}>{r.name} (+{r.price.toFixed(3)} د.ك)</option>)}
                                </select>
                                <button onClick={() => setView('print')} disabled={!selectedRegion} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-bold shadow-lg disabled:bg-gray-400">متابعة للطباعة</button>
                            </div>
                        )}
                        <button onClick={() => {setView('new_invoice'); setOrderType('');}} className="mt-8 text-gray-400 font-bold text-lg underline">رجوع لتعديل الطلب</button>
                    </div>
                </div>
            )}
        </div>
    );
};
