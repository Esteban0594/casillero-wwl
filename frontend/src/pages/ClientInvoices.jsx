import { FiFileText, FiDownload, FiEye, FiCalendar, FiDollarSign } from 'react-icons/fi';

const invoices = [
  {
    id: 'FAC-2024-001',
    date: '2024-01-18',
    description: 'Envío iPhone 15 Pro Max - Miami a San José',
    amount: '$35.00',
    status: 'Pagada',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'FAC-2024-002',
    date: '2024-01-15',
    description: 'Envío MacBook Air M2 - New York a San José',
    amount: '$45.00',
    status: 'Pendiente',
    statusColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'FAC-2024-003',
    date: '2024-01-10',
    description: 'Envío AirPods Pro - Los Angeles a San José',
    amount: '$25.00',
    status: 'Pagada',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'FAC-2024-004',
    date: '2024-01-05',
    description: 'Envío Nike Air Max 90 - Portland a San José',
    amount: '$30.00',
    status: 'Pagada',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'FAC-2024-005',
    date: '2023-12-28',
    description: 'Envío Samsung Galaxy S24 - Houston a San José',
    amount: '$40.00',
    status: 'Pagada',
    statusColor: 'bg-green-100 text-green-800'
  }
];

const ClientInvoices = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Facturas</h1>
          <p className="text-gray-600">Historial de pagos y facturas</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FiDownload />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-800">$175.00</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-wwl-blue text-xl" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">$130.00</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiFileText className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">$45.00</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FiCalendar className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiFileText className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-wwl-blue hover:text-blue-800 mr-3">
                      <FiEye />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <FiDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoices;
