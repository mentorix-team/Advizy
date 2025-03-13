import Modal from './Modal';
import { ServiceForm } from './ServiceForm';

function AddServiceModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Service Detail">
      <ServiceForm onClose={onClose} submitLabel="Save Changes" />
    </Modal>
  );
}

export default AddServiceModal;
