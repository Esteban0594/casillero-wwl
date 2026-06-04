import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiBell } from 'react-icons/fi';

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const { data } = await axios.get('/api/notifications/unread-count');
      setCount(data.count);
    } catch (error) {
      console.error('Error fetching notification count');
    }
  };

  return (
    <Link to="/portal/notificaciones" className="relative p-2 text-gray-600 hover:text-wwl-blue transition">
      <FiBell className="text-xl" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
