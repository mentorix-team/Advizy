import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { EditIcon, PlusIcon } from "@/icons/Icons";
import { useDispatch } from "react-redux";
import { PaymentFormSubmit } from "@/Redux/Slices/expert.Slice";

const BankAccountPopup = () => {

  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false); // Popup open/close state
  const [formData, setFormData] = useState({
    accountType: "Savings",
    beneficiaryName: "",
    ifscCode: "",
    accountNumber: "",
  });


  const [errors, setErrors] = useState({});
  const [branchName, setBranchName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Success state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.beneficiaryName || formData.beneficiaryName.length < 3) {
      newErrors.beneficiaryName =
        "Account holder name must be at least 3 characters.";
    }
    if (
      !formData.ifscCode ||
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
    ) {
      newErrors.ifscCode = "Invalid IFSC code.";
    }
    if (!formData.accountNumber || !/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-18 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBankBranch = async () => {
    try {
      const response = await axios.get(
        `https://ifsc.razorpay.com/${formData.ifscCode}`
      );
      setBranchName(response.data.BRANCH || "Unknown branch");
    } catch (error) {
      setBranchName("Invalid IFSC code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await dispatch(PaymentFormSubmit(formData)).unwrap();
        if (response.success) {
          console.log("Form Submitted:", formData);
          toast.success("Bank details saved successfully!");
          setIsSubmitted(true); // Mark submission as successful
          setIsOpen(false); // Close the popup
        } else {
          throw new Error(response.message || "Failed to save bank details.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "Something went wrong.");
      }
    }
  };
  

  return (
    <div>
      <Toaster position="top-right" />

      {/* Success State: Payout Connected Successfully */}
      {isSubmitted ? (
        <div className="p-4 bg-green-100 flex gap-2 items-center rounded-lg border border-green-400 text-green-800">
          <h3 className="text-lg font-semibold">Payout Connected</h3>
          <button
            onClick={() => setIsOpen(true)} // Open popup to edit details
            className="bg-[#1d1d1d] flex items-center text-white px-2 py-2 rounded-full"
          >
            <EditIcon className="w-4 h-4 mr-1" />
          </button>
        </div>
      ) : (
        /* Default Button: Add Bank Account */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1d1d1d] flex items-center text-white px-4 py-2 rounded-md"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
        Bank Account
        </button>
      )}

      {/* Popup Component */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bank Account Details</h3>
              <button
                onClick={() => setIsOpen(false)} // Close the popup
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Account Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Account Type
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, accountType: "Savings" })
                    }
                    className={`px-4 py-2 border rounded-md ${
                      formData.accountType === "Savings"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Savings
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, accountType: "Current" })
                    }
                    className={`px-4 py-2 border rounded-md ${
                      formData.accountType === "Current"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Current
                  </button>
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter account holder name"
                />
                {errors.beneficiaryName && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.beneficiaryName}
                  </div>
                )}
              </div>

              {/* IFSC Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  onBlur={fetchBankBranch}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter IFSC code"
                />
                {errors.ifscCode && (
                  <div className="text-red-500 text-sm mt-1">{errors.ifscCode}</div>
                )}
                {branchName && (
                  <div className="text-gray-700 text-sm mt-1">
                    Branch: {branchName}
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter account number"
                />
                {errors.accountNumber && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.accountNumber}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountPopup;
