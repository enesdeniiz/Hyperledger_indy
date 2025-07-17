import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Bu bileşen sayfa değiştiğinde otomatik olarak sayfanın en üstüne kaydırır
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
