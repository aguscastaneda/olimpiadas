import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 403) {
        setError('No tienes permisos para ver las órdenes. Debes ser un administrador.');
      } else if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error al cargar las órdenes. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setError('');
      await axios.put(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Refresh orders after status update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.response?.status === 403) {
        setError('No tienes permisos para actualizar el estado de las órdenes.');
      } else {
        setError('Error al actualizar el estado de la orden. Por favor, intenta nuevamente.');
      }
    }
  };

  if (!user || user.role !== 'SALES_MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso no autorizado
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Órdenes
        </h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Órdenes
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {orders.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No hay órdenes para mostrar
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Orden #{order.id} - {order.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ${order.total} - Estado: {order.orderStatus.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, parseInt(e.target.value))}
                        className="rounded border-gray-300"
                      >
                        <option value={0}>Pendiente</option>
                        <option value={1}>Procesando</option>
                        <option value={2}>Completada</option>
                        <option value={3}>Cancelada</option>
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement; 