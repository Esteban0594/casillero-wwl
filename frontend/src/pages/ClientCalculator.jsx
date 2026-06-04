import { useState } from 'react';
import { FiPackage, FiTruck, FiInfo, FiDollarSign, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const shippingMethods = [
  { id: 'standard', name: 'Envío Estándar', days: '7-10 días', pricePerLb: 4.50 },
  { id: 'express', name: 'Envío Express', days: '3-5 días', pricePerLb: 8.00 },
  { id: 'premium', name: 'Envío Premium', days: '2-3 días', pricePerLb: 12.00 }
];

const ClientCalculator = () => {
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [method, setMethod] = useState('standard');
  const [result, setResult] = useState(null);
  const [showDimensions, setShowDimensions] = useState(false);

  const calculateShipping = (e) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight) || 0;
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;
    const heightNum = parseFloat(height) || 0;

    const volumetricWeight = (lengthNum * widthNum * heightNum) / 139;
    const chargeableWeight = Math.max(weightNum, volumetricWeight);
    
    const selectedMethod = shippingMethods.find(m => m.id === method);
    const shippingCost = chargeableWeight * selectedMethod.pricePerLb;
    const customsFee = shippingCost * 0.10;
    const insurance = shippingCost * 0.05;
    const total = shippingCost + customsFee + insurance;

    setResult({
      weight: weightNum,
      volumetricWeight: volumetricWeight.toFixed(2),
      chargeableWeight: chargeableWeight.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      customsFee: customsFee.toFixed(2),
      insurance: insurance.toFixed(2),
      total: total.toFixed(2),
      method: selectedMethod.name,
      days: selectedMethod.days,
      hasDimensions: lengthNum > 0 && widthNum > 0 && heightNum > 0
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Calculadora de Envío</h1>
        <p className="text-gray-600">Calcula el costo de envío de tu paquete</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiDollarSign />
            Datos del Paquete
          </h2>
          <form onSubmit={calculateShipping} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (lbs) *
              </label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Ej: 2.5"
                  required
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDimensions(!showDimensions)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Dimensiones del paquete
                  </span>
                  <span className="text-xs text-gray-500">(Opcional)</span>
                </div>
                {showDimensions ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
              </button>
              
              {showDimensions && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">
                    Solo necesario si la agancia lo solicita por tipo de paquete o si deseas un cálculo más preciso con peso volumétrico.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Largo (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="input-field text-sm"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ancho (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="input-field text-sm"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alto (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="input-field text-sm"
                        placeholder="6"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Envío
              </label>
              <div className="space-y-2">
                {shippingMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                      method === m.id
                        ? 'border-wwl-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="method"
                        value={m.id}
                        checked={method === m.id}
                        onChange={(e) => setMethod(e.target.value)}
                        className="text-wwl-blue focus:ring-wwl-blue"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{m.name}</p>
                        <p className="text-sm text-gray-500">{m.days}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      ${m.pricePerLb}/lb
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiDollarSign />
              Calcular Envío
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {result && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Resumen de Costos</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Peso real</span>
                  <span className="font-medium">{result.weight} lbs</span>
                </div>
                {result.hasDimensions && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Peso volumétrico</span>
                      <span className="font-medium">{result.volumetricWeight} lbs</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600">Peso a cobrar</span>
                      <span className="font-medium text-wwl-blue">{result.chargeableWeight} lbs</span>
                    </div>
                  </>
                )}
                {!result.hasDimensions && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Peso a cobrar</span>
                    <span className="font-medium text-wwl-blue">{result.weight} lbs</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Envío ({result.method})</span>
                    <span className="font-medium">${result.shippingCost}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Trámite de aduana (10%)</span>
                    <span className="font-medium">${result.customsFee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Seguro (5%)</span>
                    <span className="font-medium">${result.insurance}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Estimado</span>
                    <span className="text-2xl font-bold text-wwl-blue">${result.total}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Tiempo estimado: {result.days}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FiInfo className="text-wwl-blue text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Información Importante</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• El peso es obligatorio para calcular el envío</li>
                  <li>• Las dimensiones son opcionales pero recomendadas para paquetes grandes</li>
                  <li>• Si proporcionas dimensiones, se calculará el peso volumétrico</li>
                  <li>• Se cobra el mayor entre el peso real y el volumétrico</li>
                  <li>• Los costos de aduana están incluidos en el cálculo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCalculator;
