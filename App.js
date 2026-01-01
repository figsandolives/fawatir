const App = () => {
    const [lang, setLang] = React.useState('ar'); // 'ar' or 'en'
    const [page, setPage] = React.useState('home');

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    return (
        <div className={lang === 'ar' ? 'rtl font-ar' : 'ltr font-en'}>
            <button 
                onClick={toggleLang}
                className="fixed bottom-10 left-10 z-[100] bg-white border-2 border-black p-4 rounded-full font-black shadow-2xl hover:bg-black hover:text-white transition-all"
            >
                {lang === 'ar' ? 'English' : 'عربي'}
            </button>
            {/* التنقل بين الصفحات */}
        </div>
    );
};
