
import ProductTable from '../../components/ProductTable.jsx';
import Layout from '../../components/Layout.jsx';

function StockPage() {

  return (
    <Layout>
    <div>
      <h2>Consulta de inventario</h2>
      <ProductTable />
    </div>
    </Layout>
  );
}

export default StockPage;
