import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { Toaster } from 'react-hot-toast';
import ServiceCard from './ServiceCard';
import AddServiceModal from './modals/AddServiceModal';
import EditDefaultServiceModal from './modals/EditDefaultServiceModal';
import EditNonDefaultServiceModal from './modals/EditNonDefaultServiceModal';
import { deleteService, updateServicebyId } from '@/Redux/Slices/expert.Slice';

function ServicePricing() {
  const dispatch = useDispatch(); // Initialize dispatch
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDefaultModalOpen, setIsEditDefaultModalOpen] = useState(false);
  const [isEditNonDefaultModalOpen, setIsEditNonDefaultModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Get expert data from Redux store
  const expertData = useSelector((state) => state.expert.expertData);
  const services = expertData?.credentials?.services || []; // Fallback to empty array if not available

  useEffect(() => {
    console.log('Expert Data:', expertData);
    console.log('Services:', services);
  }, [expertData, services]);

  const handleEditService = (service) => {
    console.log('this is the service',service)
    setEditingService(service);
    if (service.serviceId === 'default') {
      setIsEditDefaultModalOpen(true);
    } else {
      setIsEditNonDefaultModalOpen(true);
    }
  };

  const handleUpdateService = (updatedService) => {
    console.log('this is updated service ',updatedService);
    dispatch(updateServicebyId(updatedService))
    setEditingService(null);
  };

  // const handleDeleteService = (serviceId) => {
  //   // Dispatch deleteService action
  //   dispatch(deleteService(serviceId))
  //     .then(() => {
  //       console.log(`Service with ID ${serviceId} deleted successfully.`);
  //     })
  //     .catch((error) => {
  //       console.error(`Failed to delete service with ID ${serviceId}:`, error);
  //     });
  // };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Pricing & Services</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>+</span> Add Service
          </button>
        </div>

        {/* Display services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                isDefault={service.id === 'default'}
                onEdit={handleEditService}
                // onDelete={() => handleDeleteService(service.serviceId)} 
              />
            ))
          ) : (
            <p>No services available. Add a new service to get started!</p>
          )}
        </div>
      </div>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          /* Dispatch logic for adding service */
        }}
      />

      <EditNonDefaultServiceModal
        isOpen={isEditNonDefaultModalOpen}
        onClose={() => {
          setIsEditNonDefaultModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleUpdateService}
        service={editingService}
      />

      <EditDefaultServiceModal
        isOpen={isEditDefaultModalOpen}
        onClose={() => {
          setIsEditDefaultModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleUpdateService}
        service={editingService}
      />
    </div>
  );
}

export default ServicePricing;
