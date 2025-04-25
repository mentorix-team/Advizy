import { CircleCheckBig } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/contact");
  };

  return (
    <>
      {/* <div>
        Standard Commission Plan
        <div className="bg-white rounded-lg p-8 border border-[#E8F5E9] relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#169544] rounded-t-lg" />
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1D2939] mb-2">
              Standard Commission
            </h3>
            <p className="text-gray-600 text-sm">Perfect for most experts</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />

              <span className="text-gray-600 text-sm">
                10% commission on earnings
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />

              <span className="text-gray-600 text-sm">
                No upfront costs or monthly fees
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />

              <span className="text-gray-600 text-sm">
                Access to all platform features
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />

              <span className="text-gray-600 text-sm">
                Maximize your earnings potential
              </span>
            </li>
          </ul>
          <button
            onClick={() => navigate("/expert-onboarding")}
            className="w-full py-3 rounded-lg font-medium transition-colors cursor-pointer bg-[#169544] text-white hover:bg-[#138339]"
          >
            Start Earning Now
          </button>
        </div>

         Flexible Commission Plan
        <div className="bg-white rounded-lg p-8 border border-[#E8F5E9] relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#169544] rounded-t-lg" />
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1D2939] mb-2">Need More Flexibility?</h3>
            <p className="text-gray-600 text-sm">For experts handling large client bases or high session volumes</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
            <CircleCheckBig className='text-green-800 w-4 h-4' />
              <span className="text-gray-600 text-sm">Flexible commission rates based on your needs</span>
            </li>
            <li className="flex items-center gap-3">
            <CircleCheckBig className='text-green-800 w-4 h-4' />

              <span className="text-gray-600 text-sm">Simple and scalable for growing requirements</span>
            </li>
            <li className="flex items-center gap-3">
            <CircleCheckBig className='text-green-800 w-4 h-4' />

              <span className="text-gray-600 text-sm">Rates tailored to platform usage</span>
            </li>
            <li className="flex items-center gap-3">
            <CircleCheckBig className='text-green-800 w-4 h-4' />

              <span className="text-gray-600 text-sm">Designed to adapt as you grow</span>
            </li>
          </ul>
          <button
            onClick={handleNavigation}
            className="w-full py-3 rounded-lg font-medium transition-colors cursor-pointer border border-[#169544] text-[#169544] hover:bg-[#E8F5E9]"
          >
            Contact for Custom Pricing
          </button>
        </div> 
      </div> */}
      <div className="flex justify-center">
        {/* Standard Commission Plan - Content-fit width instead of full width */}
        <div className="max-w-lg bg-white rounded-lg p-8 border border-[#E8F5E9] relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#169544] rounded-t-lg" />
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1D2939] mb-2">
              Standard Commission
            </h3>
            {/* <p className="text-gray-600 text-sm">Perfect for most experts</p> */}
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />
              <span className="text-gray-600 text-sm">
                20% commission on earnings
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />
              <span className="text-gray-600 text-sm">
                No upfront costs or monthly fees
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />
              <span className="text-gray-600 text-sm">
                Access to all platform features
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig className="text-green-800 w-4 h-4" />
              <span className="text-gray-600 text-sm">
                Maximize your earnings potential
              </span>
            </li>
          </ul>
          <button
            onClick={() => navigate("/expert-onboarding")}
            className="w-full py-3 rounded-lg font-medium transition-colors cursor-pointer bg-[#169544] text-white hover:bg-[#138339]"
          >
            Start Earning Now
          </button>
        </div>
      </div>
      <p className="text-center text-2xl sm:text-3xl font-bold text-[#169544] mt-12 sm:mt-16">
        Simple, affordable, and designed to help you grow.
      </p>
    </>
  );
};

export default PricingSection;
