import { AnimatePresence, motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={onClose}
        />
        {/* Modal Content */}
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.97, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default Modal;