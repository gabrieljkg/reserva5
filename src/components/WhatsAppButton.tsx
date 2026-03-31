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
        alignItems: 'center',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.2)'
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img 
        src="https://wikimedia.org" 
        alt="WhatsApp" 
        style={{ width: '20px', marginRight: '8px' }} 
      />
      WhatsApp
    </a>
  );
};

export default WhatsAppButton;
