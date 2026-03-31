import React from 'react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me" 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25d366',
        color: 'white',
        borderRadius: '50px',
        padding: '10px 20px',
        fontWeight: 'bold',
        textDecoration: 'none',
        zIndex: 1000,
        display: 'flex',
        align-items: 'center'
      }}
      target="_blank"
    >
      WhatsApp
    </a>
  );
};

export default WhatsAppButton;
