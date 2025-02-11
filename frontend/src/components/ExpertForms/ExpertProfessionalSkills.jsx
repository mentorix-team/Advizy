import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import PreviewCard from "./PreviewCard";
import ProgressBar from "./ProgressBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { professionalFormSubmit } from "@/Redux/Slices/expert.Slice";
import {domainOptions, nicheOptions} from '../../utils/Options'


const validationSchema = Yup.object({
  domain: Yup.object().required("Domain is required"),
  niche: Yup.object().required("Niche is required"),
  expertise: Yup.string().required("Expertise/Skills are required"),
});

function ExpertProfessionalSkills({ onNext, onPrevious }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      domain: "",
      niche: "",
      expertise: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          domain: values.domain.value,
          niche: values.niche.value,
          expertise: values.expertise,
        };

        const response = await dispatch(professionalFormSubmit(payload)).unwrap();
        toast.success("Form submitted successfully!");
        navigate("/expert-registration/experience"); // Navigate to the next page
      } catch (error) {
        toast.error("Failed to submit the form. Please try again.");
      }
    },
  });

  const handleDomainChange = (option) => {
    formik.setFieldValue("domain", option);
    formik.setFieldValue("niche", null); // Reset the niche when domain changes
  };

  return (
    <div className="max-w-[1100px] h-[900px] mx-auto bg-white shadow-md rounded-md p-8">
      <h1 className="text-2xl font-semibold mb-2">Expert Registration</h1>
      <p className="text-lg text-gray-500 mb-4">Showcase your expertise</p>
      <ProgressBar currentStep={2} totalSteps={6} />
      <div className="text-gray-600 text-sm mb-6">Step 2 of 7</div>

      <p className="text-base text-gray-700 font-medium mb-4">
        What are you great at? Highlight your professional skills and areas of expertise.
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Domain Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain of Expertise
          </label>
          <Select
            name="domain"
            placeholder="Select domain"
            options={domainOptions}
            value={formik.values.domain}
            onChange={handleDomainChange}
            className={`w-full border-gray-300 rounded-md shadow-sm ${
              formik.touched.domain && formik.errors.domain ? "border-red-500" : ""
            }`}
          />
          {formik.touched.domain && formik.errors.domain && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.domain}</p>
          )}
        </div>

        {/* Niche Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niche
          </label>
          <Select
            name="niche"
            placeholder="Enter your specific niche"
            options={
              formik.values.domain ? nicheOptions[formik.values.domain.value] : []
            }
            value={formik.values.niche}
            onChange={(option) => formik.setFieldValue("niche", option)}
            className={`w-full border-gray-300 rounded-md shadow-sm ${
              formik.touched.niche && formik.errors.niche ? "border-red-500" : ""
            }`}
          />
          {formik.touched.niche && formik.errors.niche && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.niche}</p>
          )}
        </div>

        {/* Expertise Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expertise/Skills
          </label>
          <textarea
            name="expertise"
            placeholder="Enter your areas of Expertise or Skills, separated by commas"
            value={formik.values.expertise}
            onChange={formik.handleChange}
            className={`w-full border-gray-300 rounded-md shadow-sm h-24 p-2 ${
              formik.touched.expertise && formik.errors.expertise
                ? "border-red-500"
                : ""
            }`}
          />
          {formik.touched.expertise && formik.errors.expertise && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.expertise}</p>
          )}
        </div>

        {/* Preview Card */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <PreviewCard
            title={formik.values.domain?.label || "N/A"}
            subtitle={formik.values.niche?.label || "N/A"}
            skills={formik.values.expertise}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div className="space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm"
              onClick={onPrevious}
            >
              Previous
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md shadow-sm"
              onClick={() => formik.resetForm()}
            >
              Clear Section
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            disabled={formik.isSubmitting} // Disable while submitting
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
}


export default ExpertProfessionalSkills;
