import React, { useEffect, useState } from 'react';

export default function FloatingCharm({ src }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const isMobile = window.innerWidth < 768; // Determine if it's a mobile phone

    let positionStyle = {};
    if (isMobile) {
      const position = Math.random() * 80 + 2; // 10% ~ 90%
      positionStyle = { left: `${position}%` };
    } else {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const position = Math.random() * 20 + 2 ; 
      positionStyle = { [side]: `${position}%` };
    }

    const size = Math.random() * 40 + 30; // 30px ~ 70px
    const duration = Math.random() * 5 + 5; // 5s ~ 10s
    const delay = Math.random() * 5; // 0s ~ 5s
    const amplitude = Math.random() * 10 + 5; // 5deg ~ 15deg

    setStyle({
      position: 'absolute',
      top: '-10%',
      width: `${size}px`,
      height: 'auto',
      animation: `swing ${duration}s ease-in-out ${delay}s infinite alternate`,
      transformOrigin: 'top center',
      '--amplitude': `${amplitude}deg`,
      ...positionStyle
    });
  }, []);

  return (
    <img src={src} alt="Charm" style={style} />
  );
}
