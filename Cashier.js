import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// قائمة المناطق والأسعار التي زودتني بها
const regions = [
    { name: 'السرة', price: 0.5 },
    { name: 'الزهراء', price: 1 }, { name: 'السلام', price: 1 }, { name: 'حطين', price: 1 }, { name: 'الفيحاء', price: 1 }, { name: 'القادسية', price: 1 }, { name: 'مشرف', price: 1 }, { name: 'كيفان', price: 1 }, { name: 'الروضة', price: 1 }, { name: 'العديلية', price: 1 }, { name: 'الخالدية', price: 1 }, { name: 'النزهة', price: 1 }, { name: 'الدعية', price: 1 }, { name: 'المنصورية', price: 1 }, { name: 'قرطبة', price: 1 }, { name: 'الشامية', price: 1 }, { name: 'الرميثية', price: 1 }, { name: 'عبدالله السالم', price: 1 }, { name: 'الجابرية', price: 1 }, { name: 'بيان', price: 1 }, { name: 'الصديق', price: 1 }, { name: 'الشهداء', price: 1 }, { name: 'اليرموك', price: 1 },
    { name: 'الفروانية', price: 2 }, { name: 'خيطان', price: 2 }, { name: 'بنيد القار', price: 2 }, { name: 'الدسمة', price: 2 }, { name: 'حولي', price: 2 }, { name: 'ميدان حولي', price: 2 }, { name: 'مبارك الكبير', price: 2 }, { name: 'القصور', price: 2 }, { name: 'الرابية', price: 2 }, { name: 'العمرية', price: 2 }, { name: 'الرقعي', price: 2 }, { name: 'غرناطة', price: 2 }, { name: 'القرين', price: 2 }, { name: 'الشويخ', price: 2 }, { name: 'المسيلة', price: 2 }, { name: 'الكويت', price: 2 }, { name: 'اشبيليا', price: 2 }, { name: 'السالمية', price: 2 }, { name: 'شرق', price: 2 }, { name: 'الرحاب', price: 2 }, { name: 'المرقاب', price: 2 }, { name: 'صباح السالم', price: 2 }, { name: 'الفردوس', price: 2 }, { name: 'صباح الناصر', price: 2 }, { name: 'المسايل', price: 2 }, { name: 'الاندلس', price: 2 }, { name: 'العارضية', price: 2 }, { name: 'سلوى', price: 2 }, { name: 'العدان', price: 2 }, { name: 'الشعب', price: 2 },
    { name: 'هدية', price: 3 }, { name: 'الصليبيخات', price: 3 }, { name: 'الجهراء', price: 3 }, { name: 'الفنطاس', price: 3 }, { name: 'سعد العبدالله', price: 3 }, { name: 'الفنيطيس', price: 3 }, { name: 'الدوحة', price: 3 }, { name: 'العقيلة', price: 3 }, { name: 'جابر العلي', price: 3 }, { name: 'جابر الاحمد', price: 3 }, { name: 'عبدالله مبارك', price: 3 }, { name: 'المهبولة', price: 3 }, { name: 'المنقف', price: 3 }, { name: 'الاحمدي', price: 3 }, { name: 'الصليبية', price: 3 }, { name: 'الصباحية', price: 3 }, { name: 'فهد الاحمد', price: 3 }, { name: 'صبحان', price: 3 }, { name: 'ابو فطيرة', price: 3 }, { name: 'ابو الحصانية', price: 3 }, { name: 'الظهر', price: 3 }, { name: 'ابو حليفة', price: 3 }, { name: 'الفحيحيل', price: 3 }, { name: 'جليب الشيوخ', price: 3 },
    { name: 'ام الهيمان', price: 4 }, { name: 'المطلاع', price: 5 }, { name: 'صباح الاحمد', price: 6 }, { name: 'الوفرة', price: 8 }
];

export default function Cashier() {
    const [view, setView] = useState('main'); // main, new_invoice, delivery_selection, print
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState(''); // 'delivery' or 'pickup'
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);

    const convertNumbers = (str) => str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

    const addToCart = (product) => {
        const exist = cart.find(x => x.id === product.id);
        if (exist) {
            setCart(cart.map(x => x.id === product.id ? { ...exist, qty: parseInt(exist.qty) + 1 } : x));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const handlePrint = () => {
        window.print();
        setView('main');
        setCart([]);
    };

    if (view === 'print') {
        return (
            <div className="bg-white min-h-screen p-8" dir="rtl" id="print-section">
                <div className="max-w-[210mm] mx-auto border p-10 bg-white shadow-sm font-sans text-black">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8 border-b-2 pb-6">
                        <div className="w-1/3 text-right">
                            <h2 className="text-xl font-bold">مخبز التين والزيتون</h2>
                            <p className="text-xs">الكويت، اليرموك ق2 شارع 2 بالقرب من باب فرع الجمعية</p>
                            <p className="text-xs">☎️ 22085889</p>
                            <p className="text-xs">☎️ للرسائل 65162277</p>
                            <p className="text-xs text-blue-700">@figsolives.kw</p>
                        </div>
                        <div className="w-1/3 flex flex-col items-center">
                            <img src="Logo.png" className="w-24 mb-2" alt="Logo" />
                            <h1 className="text-lg font-black border p-1">فاتورة مبيعات</h1>
                        </div>
                        <div className="w-1/3 text-left" dir="ltr">
                            <h2 className="text-xl font-bold">Natural Figs Rest.</h2>
                            <p className="text-xs">Kuwait, Abu Hasaniya, Mall 30</p>
                            <p className="text-xs">☎️ 22085886</p>
                            <p className="text-xs">☎️ WhatsApp 99176512</p>
                            <p className="text-xs text-blue-700">@natural_figs</p>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                        <div>
                            <p><strong>رقم الفاتورة:</strong> #{Math.floor(1000 + Math.random() * 9000)}</p>
                            <p><strong>التاريخ:</strong> {new Date().toLocaleString('ar-KW')}</p>
                        </div>
                        <div className="text-left">
                            <p><strong>العميل:</strong> {selectedCustomer?.name || 'زبون خارجي'}</p>
                            <p><strong>نوع الطلب:</strong> {orderType === 'delivery' ? 'توصيل' : 'استلام'}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-right border-collapse mb-8">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">المنتج</th>
                                <th className="border p-2 text-center">الكمية</th>
                                <th className="border p-2">السعر</th>
                                <th className="border p-2">الاجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, i) => (
                                <tr key={i}>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2 text-center">{item.qty}</td>
                                    <td className="border p-2">{item.price} د.ك</td>
                                    <td className="border p-2">{(item.qty * item.price).toFixed(3)} د.ك</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-64 text-left">
                            <div className="flex justify-between p-1"><span>المجموع:</span> <span>{cart.reduce((a, b) => a + (b.qty * b.price), 0).toFixed(3)} د.ك</span></div>
                            {orderType === 'delivery' && <div className="flex justify-between p-1 border-b"><span>رسوم التوصيل:</span> <span>{deliveryFee.toFixed(3)} د.ك</span></div>}
                            <div className="flex justify-between p-2 font-bold text-xl bg-gray-100 mt-2"><span>الإجمالي:</span> <span>{(cart.reduce((a, b) => a + (b.qty * b.price), 0) + (orderType === 'delivery' ? deliveryFee : 0)).toFixed(3)} د.ك</span></div>
                        </div>
                    </div>
                    
                    <button onClick={handlePrint} className="mt-10 bg-black text-white px-10 py-3 rounded no-print">تأكيد وطباعة</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans" dir="rtl">
            {/* Header */}
            <div className="bg-white p-4 shadow-md flex justify-between items-center px-10">
                <div className="flex gap-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm">الفواتير المفتوحة</button>
                    <button onClick={() => setView('new_invoice')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm">فاتورة جديدة +</button>
                </div>
                <img src="Logo.png" alt="Logo" className="h-14" />
            </div>

            {/* New Invoice Fullscreen Modal */}
            {view === 'new_invoice' && (
                <div className="fixed inset-0 bg-white z-50 flex flex-row">
                    {/* Close Button */}
                    <button onClick={() => setView('main')} className="absolute top-4 left-4 bg-red-500 text-white w-12 h-12 rounded-full shadow-xl text-3xl z-[60]">×</button>

                    {/* Right Side: Cart */}
                    <div className="w-[400px] border-l bg-gray-50 flex flex-col p-6 shadow-inner">
                        <h2 className="text-2xl font-black mb-6 border-b pb-4 text-gray-700">قائمة الطلبات</h2>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center border">
                                    <span className="font-bold flex-1">{item.name}</span>
                                    <input 
                                        type="text" 
                                        value={item.qty} 
                                        onChange={(e) => {
                                            const newCart = [...cart];
                                            newCart[idx].qty = convertNumbers(e.target.value);
                                            setCart(newCart);
                                        }}
                                        className="w-14 border rounded text-center font-bold p-1 mx-2"
                                    />
                                    <span className="text-blue-600 font-bold">{item.price} د.ك</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between text-2xl font-black mb-4">
                                <span>الإجمالي:</span>
                                <span>{cart.reduce((a, b) => a + (b.qty * b.price), 0).toFixed(3)} د.ك</span>
                            </div>
                            <button 
                                onClick={() => setView('delivery_selection')}
                                disabled={cart.length === 0}
                                className={`w-full py-5 rounded-2xl text-2xl font-bold shadow-lg transition-all ${cart.length > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                الـتـالـي
                            </button>
                        </div>
                    </div>

                    {/* Left Side: Products Grid */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="mb-8">
                            <input type="text" placeholder="🔍 ابحث عن منتج أو قسم..." className="w-full p-5 rounded-2xl border-2 border-gray-200 text-xl focus:border-blue-500 outline-none transition-all shadow-sm" />
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {/* مثال لمنتج - سيتم جلبه من الداتابيس */}
                            <button onClick={() => addToCart({id: 1, name: 'خبز تنور كبير', price: 0.150})} className="bg-white p-6 rounded-2xl shadow hover:shadow-xl border-b-4 border-blue-500 active:scale-95 transition-all text-center">
                                <div className="text-xl font-bold mb-2">خبز تنور كبير</div>
                                <div className="text-blue-600 font-black">0.150 د.ك</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery/Pickup Selection Modal */}
            {view === 'delivery_selection' && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
                        <h2 className="text-3xl font-black text-center mb-10">اختر طريقة الاستلام</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <button onClick={() => {setOrderType('pickup'); setView('print');}} className="border-4 border-orange-500 p-10 rounded-3xl hover:bg-orange-50 transition-all group">
                                <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🥡</span>
                                <span className="text-2xl font-bold">استلام من الفرع</span>
                            </button>
                            <button onClick={() => setOrderType('delivery')} className="border-4 border-blue-600 p-10 rounded-3xl hover:bg-blue-50 transition-all group">
                                <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🚗</span>
                                <span className="text-2xl font-bold">توصيل للمنزل</span>
                            </button>
                        </div>

                        {orderType === 'delivery' && (
                            <div className="mt-10 border-t pt-8 animate-fade-in">
                                <h3 className="text-xl font-bold mb-4">اختر المنطقة لحساب التوصيل:</h3>
                                <select onChange={(e) => {
                                    const region = regions.find(r => r.name === e.target.value);
                                    setDeliveryFee(region ? region.price : 0);
                                }} className="w-full p-4 border-2 rounded-xl text-lg mb-6">
                                    <option value="">-- اختر المنطقة --</option>
                                    {regions.map((r, i) => <option key={i} value={r.name}>{r.name} ({r.price} د.ك)</option>)}
                                </select>
                                <button onClick={() => setView('print')} className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold">متابعة للطباعة</button>
                            </div>
                        )}
                        <button onClick={() => setView('new_invoice')} className="mt-6 w-full text-gray-500 font-bold">رجوع</button>
                    </div>
                </div>
            )}
        </div>
    );
}
