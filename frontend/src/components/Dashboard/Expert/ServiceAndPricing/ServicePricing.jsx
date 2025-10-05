import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import ServiceCard from './ServiceCard';
import AddServiceModal from './modals/AddServiceModal';
import EditDefaultServiceModal from './modals/EditDefaultServiceModal';
import EditNonDefaultServiceModal from './modals/EditNonDefaultServiceModal';
import { deleteService, updateServicebyId } from '@/Redux/Slices/expert.Slice';
import MentoringCard from '../ProfileDetails/components/preview/src/components/ServicesOffered/MentoringCard';

function ServicePricing() {
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDefaultModalOpen, setIsEditDefaultModalOpen] = useState(false);
  const [isEditNonDefaultModalOpen, setIsEditNonDefaultModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [steps, setSteps] = useState([]);
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render when services update

  const expertData = useSelector((state) => state.expert.expertData);
  const services = expertData?.credentials?.services || [];
  const mentoringService = services.find(service => service.title === "One-on-One Mentoring");
  const filteredServices = services.filter(service => service.title !== "One-on-One Mentoring");

  // Debug logging for services
  console.log('=== SERVICES DEBUG ===');
  console.log('All services:', services);
  console.log('Number of services:', services.length);
  if (services.length > 0) {
    console.log('First service structure:', services[0]);
    console.log('First service keys:', Object.keys(services[0] || {}));
  }
  console.log('Mentoring service:', mentoringService);
  console.log('Filtered services:', filteredServices);
  console.log('=== END SERVICES DEBUG ===');

  useEffect(() => {
    window.scrollTo(0, 0);
    const hasSeenTour = localStorage.getItem('hasSeenServiceTour');
    
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    console.log('Expert Data changed:', expertData);
    console.log('Services:', services);
    console.log('Mentoring Service:', mentoringService);
    console.log('Filtered Services:', filteredServices);
  }, [expertData, services, mentoringService, filteredServices]);

  const handleEditService = (service) => {
    console.log('=== DEBUGGING handleEditService ===');
    console.log('Received service object:', service);
    console.log('Service type:', typeof service);
    console.log('Service keys:', Object.keys(service || {}));
    console.log('Service values:', Object.values(service || {}));
    console.log('service.title:', service?.title);
    console.log('service.serviceName:', service?.serviceName);
    console.log('service.name:', service?.name);
    console.log('=== END DEBUG ===');
    
    setEditingService(service);
    if (service.title === 'One-on-One Mentoring') {
      console.log('Opening default service modal for:', service);
      setIsEditDefaultModalOpen(true);
    } else {
      console.log('Opening non-default service modal for:', service);
      setIsEditNonDefaultModalOpen(true);
    }
  };

  const handleUpdateService = async (updatedService) => {
    console.log('=== handleUpdateService called ===');
    console.log('Updated service data being sent:', updatedService);
    
    try {
      const result = await dispatch(updateServicebyId(updatedService));
      console.log('Update result:', result);
      console.log('Result payload (new expert data):', result.payload);
      
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Service updated successfully, new expert data:', result.payload);
        console.log('New services from updated expert data:', result.payload.expert?.credentials?.services);
        
        // Show success toast
        toast.success('Service updated successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Force re-render of components
        setForceUpdate(prev => prev + 1);
        
        // Don't close modal immediately - let the success toast show first
        setTimeout(() => {
          setEditingService(null);
          setIsEditDefaultModalOpen(false);
          setIsEditNonDefaultModalOpen(false);
        }, 1000); // Give time for the user to see the success message
      } else {
        console.error('Failed to update service:', result.error);
        toast.error('Failed to update service. Please try again.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    if ([ACTIONS.SKIP, ACTIONS.CLOSE].includes(action)) {
      if (status === STATUS.SKIPPED) {
        setStepIndex(prevIndex => prevIndex + 1);
      }
    }

    // Mark tour as completed when finished or skipped
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('hasSeenServiceTour', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 md:p-8">
      {runTour && (
        <Joyride
          steps={steps}
          continuous={true}
          showSkipButton={true}
          showProgress={true}
          scrollToFirstStep={false}
          disableScrolling={true}
          disableScrollParentFix={true}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          disableCloseOnEsc={true}
          disableOverlayClose={true}
          spotlightClicks={false}
          locale={{
            last: 'Done',
            skip: 'Skip'
          }}
          styles={{
            options: {
              primaryColor: '#16A348',
              zIndex: 1000,
              arrowColor: '#fff',
              backgroundColor: '#fff',
              textColor: '#333',
              overlayColor: 'rgba(0, 0, 0, 0.5)'
            },
            tooltip: {
              padding: '20px'
            },
            tooltipContainer: {
              textAlign: 'center'
            },
            buttonNext: {
              backgroundColor: '#16A348'
            },
            buttonBack: {
              marginRight: 10
            }
          }}
        />
      )}
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Pricing & Services
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="add-service-button mt-3 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <span>+</span> Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentoringService && (
            <MentoringCard 
              key={`mentoring-${mentoringService.serviceId || mentoringService._id}-${forceUpdate}-${JSON.stringify(mentoringService.one_on_one || [])}`}
              service={mentoringService} 
              onEdit={(service) => {
                console.log('MentoringCard onEdit called with:', service);
                handleEditService(service || mentoringService);
              }}
              setSteps={setSteps}
            />
          )}
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <ServiceCard
                key={`service-${service.serviceId || service._id || index}-${forceUpdate}-${service.title || 'untitled'}-${JSON.stringify(service.timeSlots || [])}`}
                service={service}
                isDefault={service.id === "default"}
                onEdit={(serviceToEdit) => {
                  console.log('ServiceCard onEdit called with:', serviceToEdit);
                  handleEditService(serviceToEdit || service);
                }}
              />
            ))
          ) : (
            <p className="text-gray-600"></p>
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
        key={`non-default-${editingService?.serviceId || editingService?._id || 'new'}`}
        isOpen={isEditNonDefaultModalOpen}
        onClose={() => {
          console.log('Closing non-default service modal');
          setIsEditNonDefaultModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleUpdateService}
        service={editingService}
      />

      <EditDefaultServiceModal
        key={`default-${editingService?.serviceId || editingService?._id || 'new'}`}
        isOpen={isEditDefaultModalOpen}
        onClose={() => {
          console.log('Closing default service modal');
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