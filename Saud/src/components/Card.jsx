import React, { useEffect, useRef, useState } from 'react';
import Display from './Display';
import Description from './Description';

const Card = ({ product }) => {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        w-full
        bg-white
        overflow-hidden
        transition-all
        duration-700
        ease-out
        hover:shadow-xl
        border border-black/[0.04]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
    >
      <div className="relative group aspect-[4/5]">
        <Display product={product} />
      </div>

      <Description product={product} />
    </div>
  );
};

export default Card;