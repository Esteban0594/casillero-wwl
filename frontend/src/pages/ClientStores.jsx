import { FiExternalLink, FiShoppingCart, FiStar, FiTruck } from 'react-icons/fi';

const stores = [
  {
    name: 'Amazon',
    url: 'https://www.amazon.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png',
    color: 'bg-orange-500',
    description: 'El mayor marketplace del mundo',
    category: 'General'
  },
  {
    name: 'Shein',
    url: 'https://www.shein.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Shein_logo.svg/200px-Shein_logo.svg.png',
    color: 'bg-black',
    description: 'Moda y accesorios a precios bajos',
    category: 'Moda'
  },
  {
    name: 'eBay',
    url: 'https://www.ebay.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/200px-EBay_logo.svg.png',
    color: 'bg-blue-600',
    description: 'Subastas y compras directas',
    category: 'General'
  },
  {
    name: 'Temu',
    url: 'https://www.temu.com',
    logo: 'https://logos-world.net/wp-content/uploads/2023/12/Temu-Logo.png',
    color: 'bg-orange-600',
    description: 'Productos a precios de fábrica',
    category: 'General'
  },
  {
    name: 'AliExpress',
    url: 'https://www.aliexpress.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/AliExpress_logo.svg/200px-AliExpress_logo.svg.png',
    color: 'bg-red-600',
    description: 'Directo de fábrica al consumidor',
    category: 'General'
  },
  {
    name: 'Walmart USA',
    url: 'https://www.walmart.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/200px-Walmart_logo.svg.png',
    color: 'bg-blue-700',
    description: 'Todo para el hogar y más',
    category: 'General'
  },
  {
    name: 'Target',
    url: 'https://www.target.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/200px-Target_logo.svg.png',
    color: 'bg-red-500',
    description: 'Estilo y calidad a buen precio',
    category: 'General'
  },
  {
    name: 'Best Buy',
    url: 'https://www.bestbuy.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/200px-Best_Buy_Logo.svg.png',
    color: 'bg-blue-900',
    description: 'Electrónica y tecnología',
    category: 'Tecnología'
  },
  {
    name: 'Nike',
    url: 'https://www.nike.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png',
    color: 'bg-black',
    description: 'Ropa y calzado deportivo',
    category: 'Deportes'
  },
  {
    name: 'Apple Store',
    url: 'https://www.apple.com/shop',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png',
    color: 'bg-gray-900',
    description: 'Productos Apple oficiales',
    category: 'Tecnología'
  },
  {
    name: 'Costco USA',
    url: 'https://www.costco.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/200px-Costco_Wholesale_logo_2010-10-26.svg.png',
    color: 'bg-red-700',
    description: 'Compras al por mayor',
    category: 'General'
  },
  {
    name: 'Home Depot',
    url: 'https://www.homedepot.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TheHomeDepot.svg/200px-TheHomeDepot.svg.png',
    color: 'bg-orange-700',
    description: 'Hogar, construcción y jardín',
    category: 'Hogar'
  }
];

const ClientStores = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tiendas Favoritas</h1>
        <p className="text-gray-600">Accede directamente a las mejores tiendas de USA</p>
      </div>

      <div className="card mb-6 bg-gradient-to-r from-wwl-blue to-blue-700 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <FiTruck className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">¿Cómo funciona?</h2>
            <p className="text-blue-100 text-sm">
              Compra en cualquier tienda usando tu dirección de casillero en Miami. 
              Nosotros lo traemos a Costa Rica por ti.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stores.map((store) => (
          <a
            key={store.name}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-start gap-4">
              <div className={`${store.color} w-14 h-14 rounded-xl flex items-center justify-center p-2`}>
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-white font-bold text-lg">${store.name.charAt(0)}</span>`;
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 group-hover:text-wwl-blue transition">
                    {store.name}
                  </h3>
                  <FiExternalLink className="text-gray-400 group-hover:text-wwl-blue transition" />
                </div>
                <p className="text-sm text-gray-500 mt-1">{store.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {store.category}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Consejos para comprar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <FiShoppingCart className="text-wwl-blue text-xl mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Usa tu dirección</h3>
              <p className="text-sm text-gray-600">Al comprar, usa tu dirección de casillero en Miami como dirección de envío.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <FiTruck className="text-green-600 text-xl mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Nosotros lo traemos</h3>
              <p className="text-sm text-gray-600">Cuando recibamos tu paquete, te notificaremos y lo enviaremos a Costa Rica.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <FiStar className="text-yellow-600 text-xl mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Recíbelo en casa</h3>
              <p className="text-sm text-gray-600">Recibe tu paquete en la puerta de tu casa en Costa Rica.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientStores;
