import React, { useEffect, useState } from 'react';

export default function FloatingCharm({ src }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const offset = Math.random() * 20 + 2; // 5% ~ 25% from the side
    const size = Math.random() * 40 + 30; // 30px ~ 70px
    const duration = Math.random() * 5 + 5; // 5s ~ 10s
    const delay = Math.random() * 5; // 0s ~ 5s
    const amplitude = Math.random() * 10 + 5; // 5deg ~ 15deg

    setStyle({
      position: 'absolute',
      top: '-10%',
      [side]: `${offset}%`,
      width: `${size}px`,
      height: 'auto',
      animation: `swing ${duration}s ease-in-out ${delay}s infinite alternate`,
      transformOrigin: 'top center',
      '--amplitude': `${amplitude}deg`
    });
  }, []);

  return (
    <img src={src} alt="Charm" style={style} />
  );
}
