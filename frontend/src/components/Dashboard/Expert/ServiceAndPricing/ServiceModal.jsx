import { useState } from 'react';
import ServiceHeader from './ServiceModal/ServiceHeader';
import ServiceForm from './ServiceModal/ServiceForm';

export default function ServiceModal({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <ServiceHeader onClose={onClose} />
        <ServiceForm onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}