import { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMessageSquare, FiBook } from 'react-icons/fi';

const faqs = [
  {
    question: '¿Cómo funciona el servicio de casillero?',
    answer: 'Te asignamos una dirección de casillero en Miami, FL. Cuando compras en tiendas online de USA, usas esa dirección como dirección de envío. Una vez que recibimos tu paquete en nuestro almacén de Miami, lo procesamos y lo enviamos a Costa Rica para que lo recibas en tu casa.'
  },
  {
    question: '¿Cuánto tiempo tarda en llegar mi paquete?',
    answer: 'El tiempo de entrega varía según el método de envío seleccionado. Envío estándar: 7-10 días hábiles. Envío express: 3-5 días hábiles. Estos tiempos son desde que el paquete sale de nuestro almacén en Miami.'
  },
  {
    question: '¿Cómo calculo el costo de envío?',
    answer: 'El costo de envío se calcula basado en el peso real o peso volumétrico del paquete (el que sea mayor). Puedes usar nuestra calculadora de tarifas en la sección de "Calculadora" para obtener un estimado. También hay un cargo fijo por trámite de aduana.'
  },
  {
    question: '¿Qué productos no puedo enviar?',
    answer: 'No se pueden enviar: armas, explosivos, sustancias ilegales, productos perecederos, animales vivos, medicamentos sin receta, productos que requieran permisos especiales (como ciertos químicos). Si tienes dudas sobre un producto específico, contáctanos antes de comprarlo.'
  },
  {
    question: '¿Cómo declaro mi paquete?',
    answer: 'Al registrar tu paquete en nuestro sistema, deberás proporcionar: descripción del contenido, valor declarado y factura de compra. Nosotros nos encargamos del trámite de aduana. Para paquetes con valor superior a $500, se requiere un agente aduanal.'
  },
  {
    question: '¿Qué pasa si mi paquete se pierde o daña?',
    answer: 'Todos los paquetes cuentan con un seguro básico incluido. Si deseas cobertura adicional, puedes contratar un seguro extra al momento de registrar tu paquete. En caso de pérdida o daño, contacta a nuestro equipo de soporte dentro de las 48 horas de recibido.'
  },
  {
    question: '¿Puedo devolver productos?',
    answer: 'Sí, ofrecemos servicio de devoluciones. Debes notificarnos dentro de los 7 días de recibido el paquete. El costo de envío de devolución corre por cuenta del cliente. Nosotros nos encargamos de enviar el paquete de vuelta a la tienda en USA.'
  },
  {
    question: '¿Cómo cambio mi dirección de casillero?',
    answer: 'Tu dirección de casillero es única y no se puede cambiar. Sin embargo, puedes actualizar tu dirección de entrega en Costa Rica desde la sección "Mi Cuenta" en cualquier momento.'
  }
];

const ClientHelp = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Centro de Ayuda</h1>
        <p className="text-gray-600">Encuentra respuestas a tus preguntas frecuentes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiMail className="text-wwl-blue text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-sm text-gray-500">soporte@casillerowl.com</p>
            </div>
          </div>
        </div>
        <div className="card hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiPhone className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Teléfono</h3>
              <p className="text-sm text-gray-500">+506 2222-3333</p>
            </div>
          </div>
        </div>
        <div className="card hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiMessageSquare className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">WhatsApp</h3>
              <p className="text-sm text-gray-500">+506 8888-9999</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FiBook />
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-gray-600 mb-4">
          Envíanos un mensaje y te responderemos lo antes posible.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
            <input
              type="text"
              className="input-field"
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Describe tu consulta..."
            />
          </div>
          <button type="submit" className="btn-primary">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientHelp;
