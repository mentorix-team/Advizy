import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const PriceBreakdownModal = ({ isOpen, onClose, amount }) => {
  if (!isOpen) return null;
  const baseRate = Math.round(amount); // total amount
  const platformFee = Math.round(amount * 0.2); // 20% platform fee
  const netEarning = baseRate - platformFee;

  // console.log(amount);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Price Breakdown
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Detailed breakdown of the meeting cost
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Base Rate (₹{Math.round(baseRate / 60)}/hour)
            </span>
            <span className="text-gray-900 font-semibold">₹{baseRate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Platform Fee (20%)</span>
            <span className="text-red-600">- ₹{platformFee}</span>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-semibold text-gray-900">Net Earnings</span>
            <span className="font-semibold text-green-600">₹{netEarning}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

PriceBreakdownModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
};

export default PriceBreakdownModal;
