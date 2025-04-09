import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
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

  const expertData = useSelector((state) => state.expert.expertData);
  const services = expertData?.credentials?.services || [];
  const mentoringService = services.find(service => service.title === "One-on-One Mentoring");
  const filteredServices = services.filter(service => service.title !== "One-on-One Mentoring");

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
    console.log('Expert Data:', expertData);
    console.log('Services:', services);
  }, [expertData, services]);

  const handleEditService = (service) => {
    console.log('this is the service', service);
    setEditingService(service);
    if (service.title === 'One-on-One Mentoring') {
      setIsEditDefaultModalOpen(true);
    } else {
      setIsEditNonDefaultModalOpen(true);
    }
  };

  const handleUpdateService = (updatedService) => {
    console.log('this is updated service ', updatedService);
    dispatch(updateServicebyId(updatedService));
    setEditingService(null);
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
              service={mentoringService} 
              onEdit={handleEditService}
              setSteps={setSteps}
            />
          )}
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                isDefault={service.id === "default"}
                onEdit={handleEditService}
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