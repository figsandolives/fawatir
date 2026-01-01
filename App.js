const App = () => {
  const [page, setPage] = React.useState('home');

  return (
    <div>
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'admin' && <Admin setPage={setPage} />}
      {page === 'cashier' && <Cashier setPage={setPage} />}
    </div>
  );
};
