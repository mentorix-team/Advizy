import ConfettiExplosion from 'react-confetti-explosion';
import React from 'react';

export function Random() {
  const [isExploding, setIsExploding] = React.useState(false);
  return <>{isExploding && <ConfettiExplosion />}</>;
}