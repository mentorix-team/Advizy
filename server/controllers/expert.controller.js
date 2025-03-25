import { ExpertBasics, ExpertCredentials } from "../config/model/expert/expertfinal.model.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary"
import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import {algoliasearch} from 'algoliasearch'
import { sendOtpMessage } from "../utils/sendnotification.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";

const expertBasicDetails = async (req, res, next) => {
  console.log("Response coming");
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      nationality,
      city,
      email,
      mobile,
      countryCode,
      languages: languagesString, // Expecting a stringified JSON array
      bio,
      socialLinks
    } = req.body;

    const user_id = req.user.id;
    console.log("aasdfs", req.user.id);
    console.log("this is user id befor", user_id);

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !nationality ||
      !city ||
      !email ||
      !mobile ||
      !countryCode ||
      !languagesString // Check if languagesString exists
    ) {
      return next(new AppError("All fields are required", 400));
    }

    // Parse the languages field from stringified JSON to an array of objects
    let languages;
    try {
      languages = JSON.parse(languagesString);
    } catch (error) {
      return next(new AppError("Invalid format for languages field", 400));
    }

    // Check if languages is an array
    if (!Array.isArray(languages)) {
      return next(new AppError("Languages must be an array", 400));
    }

    // Check if an expert already exists for the given user_id
    let expertbasic = await ExpertBasics.findOne({ user_id });
    let isNewExpert = false; // Flag to check if it's a new expert

    if (expertbasic) {
      console.log("Expert found, updating details...");
      expertbasic.firstName = firstName;
      expertbasic.lastName = lastName;
      expertbasic.gender = gender;
      expertbasic.dateOfBirth = dateOfBirth;
      expertbasic.nationality = nationality;
      expertbasic.city = city;
      expertbasic.email = email;
      expertbasic.mobile = mobile;
      expertbasic.countryCode = countryCode;
      expertbasic.languages = languages; // Use the parsed languages array
      expertbasic.bio = bio;
      expertbasic.socialLinks = socialLinks;
    } else {
      console.log("No existing expert found, creating new...");
      isNewExpert = true; // Mark as a new expert
      expertbasic = new ExpertBasics({
        user_id,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        nationality,
        city,
        email,
        mobile,
        countryCode,
        languages, // Use the parsed languages array
        bio,
        socialLinks,
        redirect_url: '',
        profileImage: { public_id: "Dummy", secure_url: "Dummy" },
        coverImage: { public_id: "Dummy", secure_url: "Dummy" },
        credentials: { services: [] }
      });
    }
    console.log("this is user id after", expertbasic.user_id);

    // Log if files exist
    if (req.files) {
      console.log("Image incoming...", req.files);

      if (req.files.profileImage) {
        console.log("Uploading profile image...");
        const profileResult = await cloudinary.v2.uploader.upload(
          req.files.profileImage[0].path,
          { folder: "Advizy/profile" }
        );

        if (profileResult) {
          console.log("Profile Image Uploaded: ", profileResult);
          expertbasic.profileImage = {
            public_id: profileResult.public_id,
            secure_url: profileResult.secure_url
          };
        }
      }

      if (req.files.coverImage) {
        console.log("Uploading cover image...");
        const coverResult = await cloudinary.v2.uploader.upload(
          req.files.coverImage[0].path,
          { folder: "Advizy/cover" }
        );

        if (coverResult) {
          console.log("Cover Image Uploaded: ", coverResult);
          expertbasic.coverImage = {
            public_id: coverResult.public_id,
            secure_url: coverResult.secure_url
          };
        }
      }
    } else {
      console.log("No images found in request.");
    }

    console.log("Final expert data before saving:", expertbasic);
    const generateRandomString = (length = 8) => {
      return crypto.randomBytes(length).toString("hex").slice(0, length);
    };

    // Save the updated or newly created expert record
    await expertbasic.save();

    // Add service only if it's a new expert
    if (isNewExpert) {
      console.log("New expert detected, adding One-on-One service...");

      const randomString = generateRandomString(); // Generate unique identifier
      expertbasic.redirect_url = `${firstName}_${randomString}`; // Set redirect URL
      console.log("This is the redirect url before", expertbasic.redirect_url);

      const serviceData = {
        title: "One-on-One Mentoring",
        shortDescription: "Personalized guidance for your career growth and technical challenges",
        one_on_one: [
          { duration: 15, price: 0 },
          { duration: 30, price: 0 },
          { duration: 45, price: 0 },
          { duration: 60, price: 0 }
        ],
        serviceId: crypto.randomBytes(16).toString("hex"),
        showMore: false
      };

      if (!expertbasic.credentials) {
        expertbasic.credentials = {}; // Ensure credentials exists
      }
      if (!Array.isArray(expertbasic.credentials.services)) {
        expertbasic.credentials.services = [];
      }

      expertbasic.credentials.services.push(serviceData);
      await expertbasic.save(); // Save the service addition
    }

    // Check if the image data is actually saved
    const savedExpert = await ExpertBasics.findOne({ user_id });
    console.log("Saved expert details in DB:", savedExpert);

    // Generate token
    const expertToken = expertbasic.generateExpertToken();

    res.cookie("expertToken", expertToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Expert created/updated successfully",
      expertbasic: savedExpert
    });
  } catch (error) {
    console.error("Error in expertBasicDetails:", error);
    if (error.name === "ValidationError") {
      return next(new AppError("Invalid data format", 400));
    } else {
      return next(new AppError("Something went wrong. Please try again.", 500));
    }
  }
};

const expertCredentialsDetails = async (req, res, next) => {
  const { domain, niche, professionalTitle, skills, experienceYears } = req.body;

  console.log("This is the req.body response:", req.body);

  try {
    const expertId = req.expert.id;

    // Ensure the expert exists
    const expertBasics = await ExpertBasics.findById(expertId);
    if (!expertBasics) {
      return next(new AppError("Expert not found", 404));
    }

    // Update or set the credentials
    expertBasics.credentials = {
      ...expertBasics.credentials, // Preserve existing fields in credentials
      domain,
      niche: Array.isArray(niche) ? niche : [niche], // Ensure niche is stored as an array
      professionalTitle: Array.isArray(professionalTitle) ? professionalTitle : [professionalTitle], // Store as array
      skills: Array.isArray(skills) ? skills : [skills], // Store as array
      experienceYears
    };

    await expertBasics.save();

    res.status(200).json({
      success: true,
      message: "Expert credentials updated successfully",
      expert: expertBasics,
    });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
};


  
const expertcertifiicate = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body);  // Debugging log

    const { name, issuingOrganization, issueDate } = req.body; // Extracting fields from the body
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (!name || !issuingOrganization || !issueDate) {
      return next(new AppError("All fields (name, issuingOrganization, issueDate) are required", 400));
    }

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has a credentials field
    if (!expert.credentials) {
      expert.credentials = { certifications_courses: [] };
    }

    // Prepare certificate entry
    const certificateEntry = {
      title: name,
      issue_organization: issuingOrganization,
      year: issueDate,
      certificate: {
        public_id: null,
        secure_url: null,
      },
    };

    // Handle file upload (certificate)
    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary...");
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Advizy",
          resource_type: "raw", // Assuming it's a raw file like a PDF
        });

        if (result) {
          certificateEntry.certificate.public_id = result.public_id;
          certificateEntry.certificate.secure_url = result.secure_url;
        }
      } catch (error) {
        return next(new AppError("Error uploading certificate: " + error.message, 501));
      }
    }

    // Add the certificate to the expert's credentials
    expert.credentials.certifications_courses.push(certificateEntry);

    // Save the updated expert document
    await expert.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Certificate added successfully",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 501));
  }
};
const editExpertCertificate = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { name, issuingOrganization, issueDate, certificateIndex } = req.body; // Extract fields from the body
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (
      !name ||
      !issuingOrganization ||
      !issueDate ||
      certificateIndex === undefined
    ) {
      return next(
        new AppError(
          "All fields (name, issuingOrganization, issueDate, certificateIndex) are required",
          400
        )
      );
    }

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the credentials and certifications_courses exist
    if (
      !expert.credentials ||
      !Array.isArray(expert.credentials.certifications_courses)
    ) {
      return next(
        new AppError("No certifications or courses found for this expert", 404)
      );
    }

    // Validate certificateIndex
    if (
      certificateIndex < 0 ||
      certificateIndex >= expert.credentials.certifications_courses.length
    ) {
      return next(new AppError("Invalid certificate index", 400));
    }

    // Get the specific certificate entry
    const certificateEntry =
      expert.credentials.certifications_courses[certificateIndex];

    // Update the fields
    certificateEntry.title = name;
    certificateEntry.issue_organization = issuingOrganization;
    certificateEntry.year = issueDate;

    // Handle file upload (update certificate file if provided)
    if (req.file) {
      try {
        console.log("Uploading new file to Cloudinary...");
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Advizy",
          resource_type: "raw", // Assuming it's a raw file like a PDF
        });

        if (result) {
          certificateEntry.certificate = {
            public_id: result.public_id,
            secure_url: result.secure_url,
          };
        }
      } catch (error) {
        return next(
          new AppError("Error uploading certificate: " + error.message, 500)
        );
      }
    }

    // Save the updated expert document
    await expert.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
};
const deleteExpertCertificate = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { certificateIndex } = req.body; // Index of the certificate to delete
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (certificateIndex === undefined) {
      return next(new AppError("certificateIndex is required", 400));
    }

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has credentials and certifications_courses
    if (!expert.credentials || !Array.isArray(expert.credentials.certifications_courses)) {
      return next(new AppError("No certifications found for this expert", 404));
    }

    // Validate certificateIndex
    if (certificateIndex < 0 || certificateIndex >= expert.credentials.certifications_courses.length) {
      return next(new AppError("Invalid certificate index", 400));
    }

    // Get the specific certificate entry
    const certificateToDelete = expert.credentials.certifications_courses[certificateIndex];

    // If the certificate has a file uploaded to Cloudinary, delete it
    if (certificateToDelete.certificate?.public_id) {
      try {
        console.log("Deleting file from Cloudinary...");
        await cloudinary.v2.uploader.destroy(certificateToDelete.certificate.public_id);
      } catch (error) {
        return next(new AppError("Error deleting certificate file: " + error.message, 501));
      }
    }

    // Remove the certificate from the array
    expert.credentials.certifications_courses.splice(certificateIndex, 1);

    // Save the updated expert document
    await expert.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      expert,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 501));
  }
};


const expertEducation = async (req, res, next) => {
  console.log(req.body)
  const { educations } = req.body; // Expecting an array of experiences from the frontend
  const expert_id = req.expert.id;
  // Validate the incoming data
  if (!Array.isArray(educations) || educations.length === 0) {
    return next(new AppError("Education array is required", 500));
  }

  // Validate each experience object
  for (const edu of educations) {
    const { degree, institution, passing_year } = edu;
    if (!degree||! institution||! passing_year ) {
      return next(new AppError("All fields are required for each Education", 500));
    }
  }


  try {
    // Find expert credentials
    const expertCredentials = await ExpertCredentials.findOne({ expert_id });

    if (!expertCredentials) {
      return next(new AppError("Expert credentials not found", 404));
    }

    // Process each experience
    const processedEducation = [];
    for (const edu of educations) {
      const { degree, institution, passing_year,certificate } = edu;

      const educationData = {
        degree,
        institution,
        passing_year,
        certificate: {
          public_id: certificate?.public_id || degree, // Default to company name if no public_id
          secure_url: certificate?.secure_url || "cloudinary://916367985651227:kWEPTClb0C0UOAsICG1sGTrg7qE@deafm48ba", // Replace with a default URL if missing
        },
      };

      console.log("this is file",req.file)
      // Handle file uploads, if any
      if (req.file) {
        // Handle file upload to Cloudinary (for PDF or other files)
        if (req.file.mimetype === "application/pdf") {
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "Advizy", 
            resource_type: "raw", // Specify non-image type for PDFs
          });
          educationData.certificate.public_id = result.public_id;
          educationData.certificate.secure_url = result.secure_url;
        } else {
          throw new Error("Invalid file type. Please upload a PDF.");
        }
      } else if (!certificate || Object.keys(certificate).length === 0) {
        // If no file was uploaded and no certificate object is provided, set default
        educationData.certificate = {
          public_id: degree, // Set a default public_id (you can customize this)
          secure_url: "default_certificate_url", // Replace with actual URL if necessary
        };
      }
      

      processedEducation.push(educationData);
    }

    // Add processed experiences to the expert's credentials
    expertCredentials.education.push(...processedEducation);
    await expertCredentials.save();

    res.status(200).json({
      success: true,
      message: "Education added successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const singleexperteducation = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body);  // Debugging log

    // Extract fields from request body (assuming it's sent as form-data)
    const { degree, institution, passingYear } = req.body;
    const expert_id = req.expert.id;

    if (!degree || !institution || !passingYear) {
      return next(new AppError("All fields (degree, institution, passingYear) are required", 400));
    }

    // Fetch expert
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials) {
      expert.credentials = { education: [] };
    }

    // Prepare education data
    const educationEntry = {
      degree,
      institution,
      passingYear,
      certificate: {
        public_id: null,
        secure_url: null,
      },
    };

    // Handle certificate file if uploaded
    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary...");
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Advizy",
          resource_type: "raw",
        });

        if (result) {
          educationEntry.certificate.public_id = result.public_id;
          educationEntry.certificate.secure_url = result.secure_url;
        }
      } catch (error) {
        return next(new AppError("Error uploading certificate: " + error.message, 501));
      }
    }

    // Save education entry
    expert.credentials.education.push(educationEntry);
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Education added successfully",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 501));
  }
};

const editSingleExpertEducation = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { degree, institution, passingYear, educationIndex } = req.body; // Extract fields from the request body
    const expert_id = req.expert.id;

    // Validate required fields
    if (!degree || !institution || !passingYear || educationIndex === undefined) {
      return next(new AppError("All fields (degree, institution, passingYear, educationIndex) are required", 400));
    }

    // Fetch the expert
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Check if credentials and education exist
    if (!expert.credentials || !expert.credentials.education) {
      return next(new AppError("No education records found for this expert", 404));
    }

    // Check if the education index is valid
    if (educationIndex < 0 || educationIndex >= expert.credentials.education.length) {
      return next(new AppError("Invalid education index", 400));
    }

    // Update the specific education entry
    const educationEntry = expert.credentials.education[educationIndex];
    educationEntry.degree = degree;
    educationEntry.institution = institution;
    educationEntry.passingYear = passingYear;

    // Handle certificate file if uploaded
    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary...");
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Advizy",
          resource_type: "raw",
        });

        if (result) {
          educationEntry.certificate = {
            public_id: result.public_id,
            secure_url: result.secure_url,
          };
        }
      } catch (error) {
        return next(new AppError("Error uploading certificate: " + error.message, 501));
      }
    }

    // Save the updated expert document
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 501));
  }
};
const deleteExpertEducation = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { educationIndex } = req.body; // Index of the education to delete
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (educationIndex === undefined) {
      return next(new AppError("educationIndex is required", 400));
    }

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has credentials and education
    if (!expert.credentials || !Array.isArray(expert.credentials.education)) {
      return next(new AppError("No education records found for this expert", 404));
    }

    // Validate educationIndex
    if (educationIndex < 0 || educationIndex >= expert.credentials.education.length) {
      return next(new AppError("Invalid education index", 400));
    }

    // Get the specific education entry
    const educationToDelete = expert.credentials.education[educationIndex];

    // If the education has a certificate file uploaded to Cloudinary, delete it
    if (educationToDelete.certificate?.public_id) {
      try {
        console.log("Deleting file from Cloudinary...");
        await cloudinary.v2.uploader.destroy(educationToDelete.certificate.public_id);
      } catch (error) {
        return next(new AppError("Error deleting certificate file: " + error.message, 501));
      }
    }

    // Remove the education from the array
    expert.credentials.education.splice(educationIndex, 1);

    // Save the updated expert document
    await expert.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
      expert,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 501));
  }
};



const expertexperience = async (req, res, next) => {
  try {
    let experiences = req.body; // Expecting an array but receiving an object

    console.log("Received Experience Data:", req.body);

    // Ensure experiences is always an array
    if (!Array.isArray(experiences)) {
      experiences = [experiences]; // Convert single object to array
    }

    if (experiences.length === 0) {
      return next(new AppError("Experience data must be an array", 400));
    }

    const expert_id = req.expert.id;

    // Fetch the expert
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure credentials and work_experiences exist
    if (!expert.credentials) {
      expert.credentials = { work_experiences: [] };
    } else if (!Array.isArray(expert.credentials.work_experiences)) {
      expert.credentials.work_experiences = [];
    }

    // Process each experience entry
    for (const exp of experiences) {
      let { companyName, jobTitle, startDate, endDate, currentlyWork } = exp;

      // Convert `currentlyWork` from string to boolean if needed
      currentlyWork = currentlyWork === true || currentlyWork === "true";

      if (!companyName || !jobTitle || !startDate || (!currentlyWork && !endDate)) {
        return next(new AppError("All required fields must be provided for each experience", 400));
      }

      const experienceData = {
        companyName,
        jobTitle,
        startDate,
        endDate: currentlyWork ? null : endDate,
        currentlyWork,
        document: {
          public_id: companyName,
          secure_url: "default-cloudinary-url",
        },
      };

      // Handle document upload, if file is provided
      if (req.files && req.files[companyName]) {
        try {
          console.log(`Uploading file for ${companyName}...`);
          const result = await cloudinary.v2.uploader.upload(req.files[companyName].path, {
            folder: "Advizy",
            resource_type: "raw",
          });

          if (result) {
            experienceData.document.public_id = result.public_id;
            experienceData.document.secure_url = result.secure_url;
          }
        } catch (error) {
          return next(new AppError("Error uploading document", 500));
        }
      }

      // Add to work_experiences array
      expert.credentials.work_experiences.push(experienceData);
    }

    // Save the updated expert document
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Experiences added successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const editExpertExperience = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body);

    const { companyName, jobTitle, startDate, endDate, currentlyWork, experienceIndex } = req.body; // Extract fields
    const expert_id = req.expert.id;

    // Validate required fields
    if (
      !companyName ||
      !jobTitle ||
      !startDate ||
      (currentlyWork !== true && !endDate) ||
      experienceIndex === undefined
    ) {
      return next(new AppError("All fields (companyName, jobTitle, startDate, endDate, currentlyWork, experienceIndex) are required", 400));
    }

    // Fetch the expert
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure credentials and work_experiences exist
    if (!expert.credentials || !Array.isArray(expert.credentials.work_experiences)) {
      return next(new AppError("No work experience records found for this expert", 404));
    }

    // Validate experienceIndex
    if (experienceIndex < 0 || experienceIndex >= expert.credentials.work_experiences.length) {
      return next(new AppError("Invalid experience index", 400));
    }

    // Get the specific experience entry
    const experienceEntry = expert.credentials.work_experiences[experienceIndex];

    // Update the fields
    experienceEntry.companyName = companyName;
    experienceEntry.jobTitle = jobTitle;
    experienceEntry.startDate = startDate;
    experienceEntry.endDate = currentlyWork ? null : endDate;
    experienceEntry.currentlyWork = currentlyWork === true || currentlyWork === "true";

    // Handle document upload if a new file is provided
    if (req.file) {
      try {
        console.log(`Uploading new file for ${companyName}...`);
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Advizy",
          resource_type: "raw",
        });

        if (result) {
          experienceEntry.document = {
            public_id: result.public_id,
            secure_url: result.secure_url,
          };
        }
      } catch (error) {
        return next(new AppError("Error uploading document: " + error.message, 500));
      }
    }

    // Save the updated expert document
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
};
const deleteExpertExperience = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { experienceIndex } = req.body; // Index of the experience to delete
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (experienceIndex === undefined) {
      return next(new AppError("experienceIndex is required", 400));
    }

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has credentials and work_experiences
    if (!expert.credentials || !Array.isArray(expert.credentials.work_experiences)) {
      return next(new AppError("No work experience records found for this expert", 404));
    }

    // Validate experienceIndex
    if (experienceIndex < 0 || experienceIndex >= expert.credentials.work_experiences.length) {
      return next(new AppError("Invalid experience index", 400));
    }

    // Get the specific experience entry to delete
    const experienceToDelete = expert.credentials.work_experiences[experienceIndex];

    // If the experience has a document uploaded, delete it from Cloudinary
    if (experienceToDelete.document?.public_id) {
      try {
        console.log("Deleting file from Cloudinary...");
        await cloudinary.v2.uploader.destroy(experienceToDelete.document.public_id);
      } catch (error) {
        return next(new AppError("Error deleting document file: " + error.message, 501));
      }
    }

    // Remove the experience from the work_experiences array
    expert.credentials.work_experiences.splice(experienceIndex, 1);

    // Save the updated expert document
    await expert.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
      expert,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 501));
  }
};



const createService = async (req, res, next) => {
  const { title, shortDescription, detailedDescription, duration, price, features, serviceId, timeSlots } = req.body;
  
  try {
    const expertToken = req.cookies.expertToken;
    if (!expertToken) {
      return next(new AppError("No token found. Please log in again.", 401));
    }

    // Verify the token and extract the payload
    const decoded = jwt.verify(expertToken, '0C/VCsuGON6yZ0x2jKjh18Azt6W29JMOVSOBwbHik3k=');
    const expertId = decoded.user_id;

    // Find the expert in the database using the decoded expertId
    const expert = await ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure credentials and services exist
    if (!expert.credentials) {
      expert.credentials = { services: [] }; // Initialize credentials if missing
    } else if (!Array.isArray(expert.credentials.services)) {
      expert.credentials.services = []; // Ensure services is an array
    }

    // If title exists, it's a new service creation
    if (title) {
      if (!title || !shortDescription || !detailedDescription || !duration || !price) {
        return next(new AppError("All fields are required for creating a service", 400));
      }

      const newService = {
        title,
        shortDescription,
        detailedDescription,
        duration,
        price,
        features: [], // Default empty array for features
        serviceId: crypto.randomBytes(16).toString('hex'), // Generate a unique serviceId using crypto
        timeSlots: timeSlots || [], // Store the timeSlots if passed in the request
      };

      expert.credentials.services.push(newService); // Add new service to the services array
    }

    // If features exist, add them to the specified service
    if (features && serviceId) {
      const serviceIndex = expert.credentials.services.findIndex(service => service.serviceId === serviceId);
      if (serviceIndex === -1) {
        return next(new AppError("Service not found", 400));
      }

      expert.credentials.services[serviceIndex].features.push(features); // Add feature to the service
    }

    // Update the credentials object with the new service or feature data
    const updatedCredentials = {
      ...decoded.credentials,
      services: expert.credentials.services, // Update the services array in credentials
    };

    // Create the updated payload with the new services data
    const updatedPayload = {
      ...decoded,
      credentials: updatedCredentials, // Update with the new services data
    };

    // Regenerate the expert token with the updated credentials
    const updatedExpertToken = jwt.sign(updatedPayload, '0C/VCsuGON6yZ0x2jKjh18Azt6W29JMOVSOBwbHik3k=', {
      expiresIn: "7d", // 7 days expiration
    });

    // Set the updated token in the cookie
    res.cookie("expertToken", updatedExpertToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"None" ,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with success
    return res.status(200).json({
      success: true,
      message: title ? "Service created successfully" : "Feature added successfully",
      services: expert.credentials.services, // Return updated services
    });
  } catch (error) {
    console.error("Error managing service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const manageService = async (req, res, next) => {
  const { title, shortDescription, detailedDescription, duration, price, features, serviceId, timeSlots } = req.body;
  const expertId = req.expert.id;

  try {
    const expert = await ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials) {
      expert.credentials = { services: [] }; // Initialize if missing
    } else if (!Array.isArray(expert.credentials.services)) {
      expert.credentials.services = []; // Ensure services is an array
    }

    // Creating a new service
    if (title) {
      if (!title || !shortDescription || !detailedDescription || !duration || !price) {
        return next(new AppError("All fields are required for creating a service", 400));
      }

      const newService = {
        title,
        shortDescription,
        detailedDescription,
        duration,
        price,
        features: Array.isArray(features) ? features : [], // Ensure features is an array
        serviceId: crypto.randomBytes(16).toString('hex'),
        timeSlots: timeSlots || [],
      };

      expert.credentials.services.push(newService);
    }

    // Adding features to an existing service
    if (serviceId && features) {
      const serviceIndex = expert.credentials.services.findIndex(service => service.serviceId === serviceId);
      if (serviceIndex === -1) {
        return next(new AppError("Service not found", 400));
      }

      const service = expert.credentials.services[serviceIndex];

      if (!Array.isArray(service.features)) {
        service.features = []; // Ensure features array exists
      }

      if (Array.isArray(features)) {
        service.features.push(...features); // Append each feature to the existing array
      } else {
        service.features.push(features); // Push single feature string if not an array
      }
    }

    await expert.save();

    return res.status(200).json({
      success: true,
      message: title ? "Service created successfully" : "Feature(s) added successfully",
      expert,
    });
  } catch (error) {
    console.error("Error managing service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};
const deleteService = async (req, res, next) => {
  const serviceId = Object.keys(req.body)[0]; // Extract serviceId
  const expertId = req.expert.id;

  console.log("Received delete request for serviceId:", serviceId);
  console.log("Authenticated Expert ID:", expertId);

  try {
    const expert = await ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("Expert not found", 403));
    }

    if (!expert.credentials || !Array.isArray(expert.credentials.services)) {
      return next(new AppError("No services found to delete", 404));
    }

    const serviceIndex = expert.credentials.services.findIndex(
      (service) => service._id.toString() === serviceId // Ensure proper matching
    );

    if (serviceIndex === -1) {
      return next(new AppError("Service not found", 405));
    }

    expert.credentials.services.splice(serviceIndex, 1);
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      expert
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const updateService = async (req, res, next) => {
  const { id, serviceName, shortDescription, detailedDescription, hourlyRate, timeSlots, features } = req.body;
  const serviceId = id; // Ensure correct ID mapping
  const expertId = req.expert.id;

  console.log("This is req.body", req.body);

  try {
    const expert = await ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("Expert not found", 402));
    }

    if (!expert.credentials || !Array.isArray(expert.credentials.services)) {
      return next(new AppError("No services found", 406));
    }

    const serviceIndex = expert.credentials.services.findIndex(service => service.serviceId === serviceId);
    if (serviceIndex === -1) {
      return next(new AppError("Service not found", 401));
    }

    const service = expert.credentials.services[serviceIndex];

    // Check if the service is "One-on-One Mentoring"
    if (serviceName === "One-on-One Mentoring") {
      // Update only relevant fields for One-on-One Mentoring
      if(hourlyRate) service.hourlyRate = hourlyRate
      if (shortDescription) service.shortDescription = shortDescription;
      if (detailedDescription) service.detailedDescription = detailedDescription;
      if (Array.isArray(features)) service.features = features;

      // Update one_on_one field with timeSlots data
      if (Array.isArray(timeSlots)) {
        service.one_on_one = timeSlots.map(slot => ({
          duration: slot.duration,
          price: slot.price,
          enabled: slot.enabled ?? false, // Ensure default value for enabled
        }));
      }
    } else {
      // Default behavior for other services
      if (serviceName) service.title = serviceName;
      if (shortDescription) service.shortDescription = shortDescription;
      if (detailedDescription) service.detailedDescription = detailedDescription;
      if (Array.isArray(features)) service.features = features;
      if (Array.isArray(timeSlots)) service.timeSlots = timeSlots;
    }

    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      expert,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};



const getService = async (req, res, next) => {
  const { serviceId } = req.params;
  const { expertId } = req.body;
  try {
    const expert = await ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials || !Array.isArray(expert.credentials.services)) {
      return next(new AppError("No services available", 404));
    }

    const service = expert.credentials.services.find(
      (service) => service.serviceId === serviceId
    );

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: `Service with ${serviceId} fetched successfully`,
      expert,
      service,
    });
  } catch (error) {
    console.error("Error getting service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};


const getExpertServices = async (req,res,next) =>{
  const expertId = req.expert.id;
  try {
    const expert = ExpertBasics.findById(expertId)
    if(!expert) {
      return next(new AppError('expert not found',500));
    }
    return res.status(200).json({
      success:true,
      message:'Experts servicesss',
      services:expert.credentials.services
    })
  } catch (error) {
    return next(new AppError(error,505));
  }

}

export default manageService;


const extpertPortfolioDetails = async (req, res, next) => {
  const { bio } = req.body;
  const expertId = req.expert.id;
  if (!bio) {
    return next(new AppError("Bio is required", 400));
  }

  const portfolioData = {
    bio,
    photo: {
      public_id: "placeholder",
      secure_url: "placeholder-url", // Replace with meaningful default values
    },
  };

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Advizy",
      });
      portfolioData.photo.public_id = result.public_id;
      portfolioData.photo.secure_url = result.secure_url;
    } catch (error) {
      return next(new AppError(`File upload failed: ${error.message}`, 500));
    }
  }

  try {
    // Find the expert in the `ExpertBasics` schema
    const expertBasics = await ExpertBasics.findById(expertId );

    if (!expertBasics) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure portfolio array exists in `credentials`
    if (!Array.isArray(expertBasics.credentials.portfolio)) {
      expertBasics.credentials.portfolio = [];
    }

    // Add portfolio data
    expertBasics.credentials.portfolio.push(portfolioData);

    // Save updated data
    await expertBasics.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio added successfully",
      expert: expertBasics,
    });
  } catch (error) {
    return next(new AppError(`Database operation failed: ${error.message}`, 500));
  }
};

  
  
  const updateProfileStatus = async (req, res) => {
    try {
      const { userId } = req.params;  // Get the user ID from URL params or JWT token
      const { profileStatus } = req.body;  // Get the profile status from the request body (e.g., 'confirmed', 'active')
  
      // Find the expert by their userId
      const expert = await ExpertModel.findById(userId);  // Use the model you're using to fetch the expert
  
      if (!expert) {
        return res.status(404).json({ message: "Expert not found" });
      }
  
      // Update the expert's profile status (or any other field you'd want to modify)
      expert.profileStatus = profileStatus || expert.profileStatus;  // You may add other fields as necessary
      await expert.save();  // Save the updated data
  
      // Optionally, send a notification to admin or update admin_approved_expert to true
      if (profileStatus === "active" && !expert.admin_approved_expert) {
        expert.admin_approved_expert = true;  // Set admin approval status
        await expert.save();
      }
  
      res.status(200).json({
        message: "Profile successfully updated",
        data: expert,  // Send the updated expert data as a response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  };
  
  const getAllExperts = async (req, res, next) => {
    try {
        const filters = {};

        if (req.query.admin_approved_expert) {
            filters.admin_approved_expert = req.query.admin_approved_expert === "true";
        }
        if (req.query.gender) {
            filters.gender = req.query.gender;
        }
        if (req.query.nationality) {
            filters.nationality = req.query.nationality;
        }
        if (req.query.country_living) {
            filters.country_living = req.query.country_living;
        }
        if (req.query.city) {
            filters.city = req.query.city;
        }
        if (req.query.languages) {
          const languagesArray = req.query.languages.split(",");
          filters.languages = { $elemMatch: { value: { $in: languagesArray } } };
        }
        if (req.query.skills) {
            filters["credentials.skills"] = { $in: req.query.skills.split(",") };
        }
        if (req.query.domain) {
          filters["credentials.domain"] = req.query.domain;
        }
        if (req.query.niches) {
            const nichesArray = req.query.niches.split(",");
            filters["$or"] = [
                { "credentials.niche": { $in: nichesArray } },
                { "credentials.niche": { $in: nichesArray.map(n => new RegExp(`^${n}$`, "i")) } }
            ];
        }
        if (req.query.professionalTitle) {
            filters["credentials.professionalTitle"] = { $in: req.query.professionalTitle.split(",") };
        }

        // Validate and apply price range filters
        if (req.query.priceMin || req.query.priceMax) {
            const minPrice = Number(req.query.priceMin) || 0;
            const maxPrice = Number(req.query.priceMax) || Number.MAX_SAFE_INTEGER;
        
            filters["credentials.services"] = {
                $elemMatch: {
                    $or: [
                        { price: { $gte: minPrice, $lte: maxPrice } },
                        { "one_on_one.price": { $gte: minPrice, $lte: maxPrice } }
                    ]
                }
            };
        }

        // Add Rating Filter
        if (req.query.ratings) {
            const minRating = parseInt(req.query.ratings, 10); // Convert to integer
            filters.$expr = {
                $gte: [
                    {
                        $toInt: {
                            $ifNull: [
                                {
                                    $divide: [
                                        { $sum: "$reviews.rating" },
                                        { $cond: { if: { $gt: [{ $size: "$reviews" }, 0] }, then: { $size: "$reviews" }, else: 1 } }
                                    ]
                                },
                                0
                            ]
                        }
                    },
                    minRating
                ]
            };
        }

        // Sorting
        const sortBy = req.query.sorting || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;
        const sortCriteria = { [sortBy]: order, createdAt: -1 };

        // Fetch experts with sorting and filtering
        const experts = await ExpertBasics.find(filters).sort(sortCriteria).lean();
        const totalExperts = await ExpertBasics.countDocuments(filters);

        return res.status(200).json({
            success: true,
            message: "Filtered Experts",
            totalExperts,
            experts,
        });
    } catch (error) {
        next(error);
    }
};

  
  

  
const getExpertById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError('Invalid ID format', 400)); // 400 Bad Request
  }

  try {
    const expert = await ExpertBasics.findById(id);

    if (!expert) {
      return next(new AppError('Expert Not Found', 404)); // 404 Not Found
    }

    return res.status(200).json({
      success: true,
      message: `User with id ${id}`,
      expert: expert.toObject(),
    }); 
  } catch (error) {
    return next(new AppError('An error occurred while fetching the expert', 500, error));
  }
};

const getExpertByRedirectURL = async (req, res, next) => {
  const { redirect_url } = req.params;

  try {
    const expert = await ExpertBasics.findOne({ redirect_url });

    if (!expert) {
      return next(new AppError('Expert Not Found', 404)); // 404 Not Found
    }

    return res.status(200).json({
      success: true,
      message: `User with redirect_url ${redirect_url}`,
      expert: expert.toObject(),
    });
  } catch (error) {
    return next(new AppError('An error occurred while fetching the expert', 500, error));
  }
};

const expertPaymentDetails = async (req, res, next) => {
  const expert_id = req.expert.id;
  const { accountType, beneficiaryName, ifscCode, accountNumber } = req.body; // Updated field name

  console.log(req.body);

  if (!accountType || !beneficiaryName || !ifscCode || !accountNumber) {
    return next(new AppError('All fields are required', 500));
  }

  const expert = await ExpertBasics.findById(expert_id); // Ensure this is awaited
  if (!expert) {
    return next(new AppError('Expert not found', 510));
  }

  const paymentData = {
    accountType,
    accountHolderName: beneficiaryName, // Map beneficiaryName to accountHolderName
    ifscCode,
    accountNumber,
  };

  expert.credentials.PaymentDetails.push(paymentData);

  await expert.save();

  res.status(200).json({
    success: true,
    message: 'Payment details added successfully',
    expert,
  });
};


const client = algoliasearch('XWATQTV8D5', 'a6543e2ed20ddb9f6cecf1d99d5c0905');

const pushExpertsToAlgolia = async (req, res) => {
  try {
    const experts = await ExpertBasics.find({});

    // Format experts for Algolia
    const records = experts.map(expert => ({
      objectID: expert._id.toString(), // Required field in Algolia
      name: `${expert.firstName} ${expert.lastName}`,
      bio: expert.bio || "", // Ensure empty string if missing
      profileImage: expert.profileImage?.secure_url || "", // Ensure valid URL or empty string
      domain: expert.credentials?.domain || "", // Handle missing credentials object
      niche: expert.credentials?.niche || [], // Default empty array if missing
      services: expert.credentials?.services?.map(service => ({
        title: service.title || "", // Ensure string or empty
        shortDescription: service.shortDescription || "",
      })) || [], // Default to an empty array if no services exist
      country_living: expert.country_living || "",
    }));

    // Push records to Algolia using saveObjects method
    // const index = client.initIndex('experts_index');
    // await index.saveObjects(records);
    await client.saveObjects({
      indexName: 'experts_index',
      objects: records,
    });

    return res.status(200).json({ message: 'Experts indexed successfully' });
  } catch (error) {
    console.error('Error pushing experts to Algolia:', error);
    return res.status(500).json({ message: 'Error indexing experts' });
  }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateOtpForVerifying = async (req, res, next) => {
  try {
    // Extract the key from req.body
    const inputKey = Object.keys(req.body)[0]; // Get the first key
    console.log("Received input:", inputKey);

    if (!inputKey) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Check if the input is a mobile number (only digits, length 10-15)
    const isMobile = /^\d{10,15}$/.test(inputKey);

    // Check if the input is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputKey);

    if (isMobile) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpToken = bcrypt.hashSync(otp, 10);

      res.cookie("otpToken", otpToken, { httpOnly: true, maxAge: 10 * 60 * 1000,secure: process.env.NODE_ENV === "production",sameSite:"None"  }); 

      const formattedNumber = inputKey.startsWith('+') ? inputKey : `+91${inputKey}`;
      console.log("Formatted Mobile:", formattedNumber);
      
      await sendOtpMessage(formattedNumber, otp);
      return res.status(200).json({
        success: true,
        message: `OTP sent to ${formattedNumber}`,
      });
    } 
    
    if (isEmail) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpToken = bcrypt.hashSync(otp, 10);

      res.cookie("otpToken", otpToken, { httpOnly: true, secure: process.env.NODE_ENV === "production",sameSite:"None" ,maxAge: 10 * 60 * 1000 });

      const templatePath = path.join(__dirname, "./EmailTemplates/verifyaccount.html");
      let emailTemplate = fs.readFileSync(templatePath, "utf8");

      emailTemplate = emailTemplate.replace("{OTP_CODE}", otp);
      await sendEmail(inputKey, "Your OTP Code", emailTemplate, true);
      return res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    }

    // If input is neither email nor mobile
    return res.status(400).json({ success: false, message: "Invalid email or mobile number format" });

  } catch (error) {
    return next(new AppError(error, 505));
  }
};


const validatethnumberormobile = async(req,res,next) =>{
  const {otp} =req.body;
  const otpToken = req.cookies.otpToken;
  try {
    const isOtpValid = bcrypt.compareSync(otp, otpToken);
    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", 400));
    }
    res.clearCookie("otpToken");
    res.status(200).json({
      success:true,
      message:'Verified',
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
    console.log(error)
  }
}
 
export {
    expertBasicDetails,

    expertCredentialsDetails,
    
    extpertPortfolioDetails,
    
    expertcertifiicate,
    editExpertCertificate,
    deleteExpertCertificate,
    
    expertexperience,
    editExpertExperience,
    deleteExpertExperience,

    expertEducation,
    singleexperteducation,
    editSingleExpertEducation,
    deleteExpertEducation,
    
    updateProfileStatus,
    
    getAllExperts,
    
    getExpertById,
    
    getExpertByRedirectURL,
    
    manageService,
    getExpertServices,
    deleteService,
    getService,
    
    expertPaymentDetails,
    createService,
    updateService,
    
    pushExpertsToAlgolia,
    
    generateOtpForVerifying,
    validatethnumberormobile
}