import {
  ExpertBasics,
  ExpertCredentials,
} from "../config/model/expert/expertfinal.model.js";
import HelpCenterModel from "../config/model/HelpCenter/helpcenter.model.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { algoliasearch } from "algoliasearch";
// import { sendOtpMessage } from "../utils/sendnotification.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const normalizeSocialLinksInput = (rawLinks) => {
  if (!rawLinks) return [];

  const collected = new Set();

  const processValue = (value) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(processValue);
      return;
    }

    if (typeof value !== "string") return;

    const trimmed = value.trim();
    if (!trimmed) return;

    const looksLikeJsonArray =
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"));

    if (looksLikeJsonArray) {
      try {
        const parsed = JSON.parse(trimmed);
        processValue(parsed);
        return;
      } catch (error) {
        // Fall through and treat as literal string if JSON.parse fails
      }
    }

    if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
      try {
        const unwrapped = JSON.parse(trimmed);
        processValue(unwrapped);
        return;
      } catch (error) {
        // Ignore and use trimmed string as-is
      }
    }

    collected.add(trimmed);
  };

  processValue(rawLinks);

  return Array.from(collected);
};

const sanitizeExpertForResponse = (expertDoc) => {
  if (!expertDoc) return expertDoc;

  const expertObj =
    typeof expertDoc.toObject === "function"
      ? expertDoc.toObject()
      : { ...expertDoc };

  expertObj.socialLinks = normalizeSocialLinksInput(expertObj.socialLinks);

  return expertObj;
};

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
      socialLinks,
    } = req.body;

    const normalizedSocialLinks = normalizeSocialLinksInput(socialLinks);
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
      // if(languagesString){
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
      expertbasic.socialLinks = normalizedSocialLinks;
      expertbasic.markModified("socialLinks");
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
        socialLinks: normalizedSocialLinks,
        redirect_url: "",
        profileImage: { public_id: "Dummy", secure_url: "Dummy" },
        coverImage: { public_id: "Dummy", secure_url: "Dummy" },
        credentials: { services: [] },
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
            secure_url: profileResult.secure_url,
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
            secure_url: coverResult.secure_url,
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
        // shortDescription: "Personalized guidance for your career growth and technical challenges",
        one_on_one: [
          { duration: 15, price: 0 },
          { duration: 30, price: 0 },
          { duration: 45, price: 0 },
          { duration: 60, price: 0 },
        ],
        serviceId: crypto.randomBytes(16).toString("hex"),
        showMore: false,
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
    const sanitizedExpert = sanitizeExpertForResponse(savedExpert);
    console.log("Saved expert details in DB:", savedExpert);

    // Generate token
    const expertToken = expertbasic.generateExpertToken();

    res.cookie("expertToken", expertToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Expert created/updated successfully",
      expertbasic: sanitizedExpert,
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

const expertImages = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    let expertbasic = await ExpertBasics.findOne({ user_id });

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
            secure_url: profileResult.secure_url,
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
            secure_url: coverResult.secure_url,
          };
        }
      }
    } else {
      console.log("No images found in request.");
    }

    await expertbasic.save();
    const sanitizedExpert = sanitizeExpertForResponse(expertbasic);
    res.status(200).json({
      success: true,
      message: "Images updated",
      expertbasic: sanitizedExpert,
    });
  } catch (error) {
    return next(new AppError(error, 503));
  }
};

const expertCredentialsDetails = async (req, res, next) => {
  const { domain, niche, professionalTitle, skills, experienceYears } =
    req.body;

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
      professionalTitle: Array.isArray(professionalTitle)
        ? professionalTitle
        : [professionalTitle], // Store as array
      skills: Array.isArray(skills) ? skills : [skills],
      experienceYears,
    };

    await expertBasics.save();
    console.log("THis is expert saved", expertBasics);
    const sanitizedExpert = sanitizeExpertForResponse(expertBasics);
    res.status(200).json({
      success: true,
      message: "Expert credentials updated successfully",
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
};

const expertcertifiicate = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { title, issue_organization, year } = req.body; // Extracting fields from the body
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (!title || !issue_organization || !year) {
      return next(
        new AppError(
          "All fields (name, issuingOrganization, issueDate) are required",
          400
        )
      );
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
      title: title,
      issue_organization: issue_organization,
      year: year,
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
        return next(
          new AppError("Error uploading certificate: " + error.message, 501)
        );
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
const adminapproved = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("this is id", id);
    const expert = await ExpertBasics.findById(id); // Don't forget the 'await'

    if (!expert) {
      return next(new AppError("Expert not found", 403));
    }

    // Toggle admin approval
    expert.admin_approved_expert = !expert.admin_approved_expert;
    await expert.save();

    // Now fetch all experts who are admin approved
    const approvedExperts = await ExpertBasics.find({
      admin_approved_expert: true,
    });

    // Format records for Algolia
    const records = approvedExperts.map((expert) => ({
      objectID: expert._id.toString(),
      name: `${expert.firstName} ${expert.lastName}`,
      redirect_url: expert.redirect_url,
      username: expert.redirect_url,
      bio: expert.bio || "",
      profileImage: expert.profileImage?.secure_url || "",
      domain: expert.credentials?.domain || "",
      niche: expert.credentials?.niche || [],
      services:
        expert.credentials?.services?.map((service) => ({
          title: service.title || "",
          shortDescription: service.shortDescription || "",
        })) || [],
      country_living: expert.country_living || "",
    }));

    // Push to Algolia
    await client.saveObjects({
      indexName: "experts_index",
      objects: records,
    });

    return res.status(200).json({
      success: true,
      message: "Expert admin approved toggled & Algolia updated",
      expert,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 501));
  }
};

const handleSuspendExpert = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("Suspending expert with ID:", id);

    // Check if expert exists in the database
    const expert = await ExpertBasics.findById(id);

    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    console.log("Expert found, proceeding with deletion...");

    // Delete the expert from MongoDB
    await ExpertBasics.findByIdAndDelete(id);

    // If you're using Algolia, you might want to remove from there too
    // await client.deleteObject({
    //   indexName: "experts_index",
    //   objectID: id
    // });

    console.log("Expert suspended/deleted successfully");

    return res.status(200).json({
      success: true,
      message: "Expert suspended and deleted successfully",
      deletedExpertId: id
    });

  } catch (error) {
    console.log("Error:", error);
    return next(new AppError(error.message, 500));
  }
};

const editExpertCertificate = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { title, issue_organization, year, _id } = req.body; // Extract fields from the body
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Validate required fields
    if (!title || !issue_organization || !year) {
      return next(
        new AppError(
          "All fields (name, issuingOrganization, issueDate, _id) are required",
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

    const certificateIndex =
      expert.credentials.certifications_courses.findIndex(
        (certi) => certi._id.toString() === _id
      );

    // Get the specific certificate entry
    const certificateEntry =
      expert.credentials.certifications_courses[certificateIndex];

    // Update the fields
    certificateEntry.title = title;
    certificateEntry.issue_organization = issue_organization;
    certificateEntry.year = year;

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

    const { _id } = req.body; // Index of the certificate to delete
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has credentials and certifications_courses
    if (
      !expert.credentials ||
      !Array.isArray(expert.credentials.certifications_courses)
    ) {
      return next(new AppError("No certifications found for this expert", 404));
    }

    const certificateIndex =
      expert.credentials.certifications_courses.findIndex(
        (certi) => certi._id.toString() === _id
      );

    // Get the specific certificate entry
    const certificateToDelete =
      expert.credentials.certifications_courses[certificateIndex];

    // If the certificate has a file uploaded to Cloudinary, delete it
    if (certificateToDelete.certificate?.public_id) {
      try {
        console.log("Deleting file from Cloudinary...");
        await cloudinary.v2.uploader.destroy(
          certificateToDelete.certificate.public_id
        );
      } catch (error) {
        return next(
          new AppError("Error deleting certificate file: " + error.message, 501)
        );
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
  const { educations } = req.body;
  const expert_id = req.expert.id;

  if (!Array.isArray(educations) || educations.length === 0) {
    return next(new AppError("Education array is required", 500));
  }

  for (const edu of educations) {
    const { degree, institution, passing_year } = edu;
    if (!degree || !institution || !passing_year) {
      return next(
        new AppError("All fields are required for each Education", 500)
      );
    }
  }

  const parseCertificateArray = (value) => {
    if (!value) return [];
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return parsed ? [parsed] : [];
      } catch (parseError) {
        return [];
      }
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "object") {
      return [value];
    }
    return [];
  };

  try {
    const expertCredentials = await ExpertCredentials.findOne({ expert_id });

    if (!expertCredentials) {
      return next(new AppError("Expert credentials not found", 404));
    }

    const processedEducation = [];
    for (const edu of educations) {
      const { degree, institution, passing_year, certificate } = edu;
      const certificates = parseCertificateArray(certificate);

      const educationData = {
        degree,
        institution,
        passing_year,
      };

      if (certificates.length > 0) {
        educationData.certificate = certificates;
      }

      processedEducation.push(educationData);
    }

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
    const parseCertificateArray = (value) => {
      if (!value) return [];
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return parsed ? [parsed] : [];
        } catch (parseError) {
          return [];
        }
      }
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "object") {
        return [value];
      }
      return [];
    };

    const { degree, institution, passingYear } = req.body;
    const expert_id = req.expert.id;

    if (!degree || !institution || !passingYear) {
      return next(
        new AppError(
          "All fields (degree, institution, passingYear) are required",
          400
        )
      );
    }

    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials) {
      expert.credentials = { education: [] };
    }

    const educationEntry = {
      degree,
      institution,
      passingYear,
    };

    const providedCertificates = parseCertificateArray(req.body.certificate);

    const uploadedCertificates = [];
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Advizy",
            resource_type: "raw",
          });

          if (result) {
            uploadedCertificates.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        } catch (error) {
          return next(
            new AppError("Error uploading certificate: " + error.message, 500)
          );
        }
      }
    }

    const combinedCertificates = [...providedCertificates, ...uploadedCertificates];
    if (combinedCertificates.length > 0) {
      educationEntry.certificate = combinedCertificates;
    }

    expert.credentials.education.push(educationEntry);
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Education added successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const editSingleExpertEducation = async (req, res, next) => {
  try {
    const parseCertificateArray = (value) => {
      if (!value) return [];
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return parsed ? [parsed] : [];
        } catch (parseError) {
          return [];
        }
      }
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "object") {
        return [value];
      }
      return [];
    };

    const {
      _id,
      degree,
      institution,
      passingYear,
      removeCertificate,
    } = req.body;
    const expert_id = req.expert.id;

    if (!_id) {
      return next(new AppError("Education entry ID is required", 400));
    }

    if (!degree || !institution || !passingYear) {
      return next(
        new AppError(
          "All fields (degree, institution, passingYear) are required",
          400
        )
      );
    }

    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials || !Array.isArray(expert.credentials.education)) {
      return next(
        new AppError("No education records found for this expert", 404)
      );
    }

    const educationIndex = expert.credentials.education.findIndex(
      (edu) => edu._id.toString() === _id
    );

    if (educationIndex === -1) {
      return next(new AppError("Education entry not found", 404));
    }

    const educationEntry = expert.credentials.education[educationIndex];

    educationEntry.degree = degree;
    educationEntry.institution = institution;
    educationEntry.passingYear = passingYear;

    const shouldRemoveCertificate =
      removeCertificate === "true" || removeCertificate === true;

    const incomingCertificates = parseCertificateArray(
      req.body.existingCertificate ?? req.body.certificate
    );

    const currentCertificates = Array.isArray(educationEntry.certificate)
      ? educationEntry.certificate
      : educationEntry.certificate
        ? [educationEntry.certificate]
        : [];

    const certificatesToKeep = [];
    const providedIds = new Set(
      incomingCertificates
        .map((doc) => doc?.public_id)
        .filter((id) => typeof id === "string")
    );

    if (shouldRemoveCertificate) {
      for (const doc of currentCertificates) {
        if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    } else if (providedIds.size > 0) {
      for (const doc of currentCertificates) {
        if (doc?.public_id && providedIds.has(doc.public_id)) {
          certificatesToKeep.push(doc);
          providedIds.delete(doc.public_id);
        } else if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    } else if (incomingCertificates.length === 0) {
      for (const doc of currentCertificates) {
        if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    }

    const orphanPayloadDocs = incomingCertificates.filter(
      (doc) => !doc?.public_id && doc?.secure_url
    );
    if (orphanPayloadDocs.length > 0) {
      certificatesToKeep.push(...orphanPayloadDocs);
    }

    const uploadedCertificates = [];
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Advizy",
            resource_type: "raw",
          });

          if (result) {
            uploadedCertificates.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        } catch (error) {
          return next(
            new AppError("Error uploading certificate: " + error.message, 500)
          );
        }
      }
    }

    const resultingCertificates = shouldRemoveCertificate
      ? uploadedCertificates
      : [...certificatesToKeep, ...uploadedCertificates];

    if (resultingCertificates.length > 0) {
      educationEntry.certificate = resultingCertificates;
    } else {
      delete educationEntry.certificate;
    }

    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const deleteExpertEducation = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const expert_id = req.expert.id;

    if (!_id) {
      return next(new AppError("Education ID (_id) is required", 400));
    }

    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials || !Array.isArray(expert.credentials.education)) {
      return next(
        new AppError("No education records found for this expert", 404)
      );
    }

    const educationIndex = expert.credentials.education.findIndex(
      (edu) => edu._id.toString() === _id
    );

    if (educationIndex === -1) {
      return next(new AppError("Education entry not found", 404));
    }

    const educationToDelete = expert.credentials.education[educationIndex];

    const certificates = Array.isArray(educationToDelete.certificate)
      ? educationToDelete.certificate
      : educationToDelete.certificate
        ? [educationToDelete.certificate]
        : [];

    for (const doc of certificates) {
      if (doc?.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        } catch (error) {
          return next(
            new AppError(
              "Error deleting certificate file: " + error.message,
              501
            )
          );
        }
      }
    }

    expert.credentials.education.splice(educationIndex, 1);
    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error.message, 501));
  }
};

const expertexperience = async (req, res, next) => {
  try {
    const parseDocumentArray = (value) => {
      if (!value) return [];
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return parsed ? [parsed] : [];
        } catch (parseError) {
          return [];
        }
      }
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "object") {
        return [value];
      }
      return [];
    };

    let experiencesPayload = req.body?.experiences ?? req.body;

    if (typeof experiencesPayload === "string") {
      try {
        experiencesPayload = JSON.parse(experiencesPayload);
      } catch (parseError) {
        experiencesPayload = {};
      }
    }

    const experiences = Array.isArray(experiencesPayload)
      ? experiencesPayload
      : [experiencesPayload];

    if (experiences.length === 0) {
      return next(new AppError("Experience data must be an array", 400));
    }

    const expert_id = req.expert.id;

    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (!expert.credentials) {
      expert.credentials = { work_experiences: [] };
    } else if (!Array.isArray(expert.credentials.work_experiences)) {
      expert.credentials.work_experiences = [];
    }

    const uploadedDocuments = [];
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Advizy",
            resource_type: "raw",
          });

          if (result) {
            uploadedDocuments.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        } catch (uploadError) {
          return next(new AppError("Error uploading document", 500));
        }
      }
    }

    for (const exp of experiences) {
      if (!exp) {
        continue;
      }

      let { companyName, jobTitle, startDate, endDate, currentlyWork } = exp;

      currentlyWork = currentlyWork === true || currentlyWork === "true";

      if (
        !companyName ||
        !jobTitle ||
        !startDate ||
        (!currentlyWork && !endDate)
      ) {
        return next(
          new AppError(
            "All required fields must be provided for each experience",
            400
          )
        );
      }

      const existingDocuments = parseDocumentArray(
        exp.existingDocuments ?? exp.documents
      );

      const experienceData = {
        companyName,
        jobTitle,
        startDate,
        endDate: currentlyWork ? null : endDate,
        currentlyWork,
        documents: [...existingDocuments, ...uploadedDocuments],
      };

      expert.credentials.work_experiences.push(experienceData);
    }

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
    const parseDocumentArray = (value) => {
      if (!value) return [];
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return parsed ? [parsed] : [];
        } catch (parseError) {
          return [];
        }
      }
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "object") {
        return [value];
      }
      return [];
    };

    const {
      companyName,
      jobTitle,
      startDate,
      endDate,
      currentlyWork,
      _id,
      removeDocument,
    } = req.body;
    const expert_id = req.expert.id;

    if (
      !companyName ||
      !jobTitle ||
      !startDate ||
      (currentlyWork !== true && currentlyWork !== "true" && !endDate)
    ) {
      return next(
        new AppError(
          "All fields (companyName, jobTitle, startDate, endDate, currentlyWork) are required",
          400
        )
      );
    }

    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    if (
      !expert.credentials ||
      !Array.isArray(expert.credentials.work_experiences)
    ) {
      return next(
        new AppError("No work experience records found for this expert", 404)
      );
    }

    const experienceIndex = expert.credentials.work_experiences.findIndex(
      (experience) => experience._id.toString() === _id
    );

    if (experienceIndex === -1) {
      return next(new AppError("Experience not found", 404));
    }

    const experienceEntry =
      expert.credentials.work_experiences[experienceIndex];

    const normalizedCurrentlyWork =
      currentlyWork === true || currentlyWork === "true";

    experienceEntry.companyName = companyName;
    experienceEntry.jobTitle = jobTitle;
    experienceEntry.startDate = startDate;
    experienceEntry.endDate = normalizedCurrentlyWork ? null : endDate;
    experienceEntry.currentlyWork = normalizedCurrentlyWork;

    const existingDocumentsPayload = parseDocumentArray(
      req.body.existingDocuments ?? req.body.documents
    );

    const currentDocuments = Array.isArray(experienceEntry.documents)
      ? experienceEntry.documents
      : experienceEntry.documents
        ? [experienceEntry.documents]
        : [];

    const documentsToKeep = [];
    const providedIds = new Set(
      existingDocumentsPayload
        .map((doc) => doc?.public_id)
        .filter((id) => typeof id === "string")
    );

    if (removeDocument === "true" || removeDocument === true) {
      for (const doc of currentDocuments) {
        if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    } else if (providedIds.size > 0) {
      for (const doc of currentDocuments) {
        if (doc?.public_id && providedIds.has(doc.public_id)) {
          documentsToKeep.push(doc);
          providedIds.delete(doc.public_id);
        } else if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    } else if (existingDocumentsPayload.length === 0) {
      for (const doc of currentDocuments) {
        if (doc?.public_id) {
          await cloudinary.v2.uploader.destroy(doc.public_id);
        }
      }
    }

    const orphanPayloadDocs = existingDocumentsPayload.filter(
      (doc) => !doc?.public_id && doc?.secure_url
    );
    if (orphanPayloadDocs.length > 0) {
      documentsToKeep.push(...orphanPayloadDocs);
    }

    const newlyUploadedDocs = [];
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Advizy",
            resource_type: "raw",
          });

          if (result) {
            newlyUploadedDocs.push({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        } catch (uploadError) {
          return next(
            new AppError(
              "Error uploading document: " + uploadError.message,
              500
            )
          );
        }
      }
    }

    const resultingDocuments =
      removeDocument === "true" || removeDocument === true
        ? newlyUploadedDocs
        : [...documentsToKeep, ...newlyUploadedDocs];

    experienceEntry.documents = resultingDocuments;

    await expert.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteExpertExperience = async (req, res, next) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging log

    const { _id } = req.body; // Index of the experience to delete
    const expert_id = req.expert.id; // Assuming expert ID is in the request

    // Fetch expert document from the database
    const expert = await ExpertBasics.findById(expert_id);
    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Ensure the expert has credentials and work_experiences
    if (
      !expert.credentials ||
      !Array.isArray(expert.credentials.work_experiences)
    ) {
      return next(
        new AppError("No work experience records found for this expert", 404)
      );
    }

    // Get the specific experience entry to delete
    const experienceIndex = expert.credentials.work_experiences.findIndex(
      (experience) => experience._id.toString() === _id
    );
    const experienceToDelete =
      expert.credentials.work_experiences[experienceIndex];
    // If the experience has a document uploaded, delete it from Cloudinary
    const documentsToRemove = Array.isArray(experienceToDelete.documents)
      ? experienceToDelete.documents
      : experienceToDelete.documents
        ? [experienceToDelete.documents]
        : [];

    for (const doc of documentsToRemove) {
      if (doc?.public_id) {
        try {
          console.log("Deleting file from Cloudinary...");
          await cloudinary.v2.uploader.destroy(doc.public_id);
        } catch (error) {
          return next(
            new AppError(
              "Error deleting document file: " + error.message,
              501
            )
          );
        }
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
  const {
    title,
    shortDescription,
    detailedDescription,
    duration,
    price,
    features,
    serviceId,
    timeSlots,
  } = req.body;

  try {
    const expertToken = req.cookies.expertToken;
    if (!expertToken) {
      return next(new AppError("No token found. Please log in again.", 401));
    }

    // Verify the token and extract the payload
    const decoded = jwt.verify(
      expertToken,
      "0C/VCsuGON6yZ0x2jKjh18Azt6W29JMOVSOBwbHik3k="
    );
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
      if (
        !title ||
        !shortDescription ||
        !duration ||
        !price
      ) {
        return next(
          new AppError("All fields are required for creating a service", 400)
        );
      }

      const newService = {
        title,
        shortDescription,
        detailedDescription: detailedDescription || "",
        duration,
        price,
        features: [], // Default empty array for features
        serviceId: crypto.randomBytes(16).toString("hex"), // Generate a unique serviceId using crypto
        timeSlots: timeSlots || [], // Store the timeSlots if passed in the request
      };

      expert.credentials.services.push(newService); // Add new service to the services array
    }

    // If features exist, add them to the specified service
    if (features && serviceId) {
      const serviceIndex = expert.credentials.services.findIndex(
        (service) => service.serviceId === serviceId
      );
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
    const updatedExpertToken = jwt.sign(
      updatedPayload,
      "0C/VCsuGON6yZ0x2jKjh18Azt6W29JMOVSOBwbHik3k=",
      {
        expiresIn: "7d", // 7 days expiration
      }
    );

    // Set the updated token in the cookie
    res.cookie("expertToken", updatedExpertToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with success
    return res.status(200).json({
      success: true,
      message: title
        ? "Service created successfully"
        : "Feature added successfully",
      services: expert.credentials.services, // Return updated services
    });
  } catch (error) {
    console.error("Error managing service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const manageService = async (req, res, next) => {
  const {
    title,
    shortDescription,
    detailedDescription,
    duration,
    price,
    features,
    serviceId,
    timeSlots,
  } = req.body;
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
      if (
        !title ||
        !shortDescription ||
        !duration ||
        !price
      ) {
        return next(
          new AppError("All fields are required for creating a service", 400)
        );
      }

      const newService = {
        title,
        shortDescription,
        detailedDescription: detailedDescription || "",
        duration,
        price,
        features: Array.isArray(features) ? features : [], // Ensure features is an array
        serviceId: crypto.randomBytes(16).toString("hex"),
        timeSlots: timeSlots || [],
      };

      expert.credentials.services.push(newService);
    }

    // Adding features to an existing service
    if (serviceId && features) {
      const serviceIndex = expert.credentials.services.findIndex(
        (service) => service.serviceId === serviceId
      );
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
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: title
        ? "Service created successfully"
        : "Feature(s) added successfully",
      expert: sanitizedExpert,
    });
  } catch (error) {
    console.error("Error managing service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};
const deleteService = async (req, res, next) => {
  let serviceId =
    req.body?.serviceId ||
    req.body?.id ||
    req.body?.service_id ||
    null;

  if (!serviceId && req.body && typeof req.body === "object") {
    const dynamicKeys = Object.keys(req.body).filter(
      (key) => !["serviceId", "id", "service_id"].includes(key)
    );
    if (dynamicKeys.length > 0) {
      serviceId = dynamicKeys[0];
    }
  }

  if (!serviceId) {
    return next(new AppError("Service ID is required", 400));
  }

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

    const serviceIndex = expert.credentials.services.findIndex((service) => {
      const mongoId = service?._id ? String(service._id) : undefined;
      return mongoId === String(serviceId) || service.serviceId === String(serviceId);
    });

    if (serviceIndex === -1) {
      return next(new AppError("Service not found", 405));
    }

    expert.credentials.services.splice(serviceIndex, 1);
    await expert.save();
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      expert: sanitizedExpert,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const updateService = async (req, res, next) => {
  const {
    id,
    serviceName,
    shortDescription,
    detailedDescription,
    hourlyRate,
    timeSlots,
    features,
  } = req.body;
  const serviceId = id; // Ensure correct ID mapping
  const serviceIdStr = serviceId ? String(serviceId) : undefined;
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

    const serviceIndex = expert.credentials.services.findIndex((service) => {
      const mongoId = service?._id ? String(service._id) : undefined;
      return service.serviceId === serviceId || mongoId === serviceIdStr;
    });
    if (serviceIndex === -1) {
      return next(new AppError("Service not found", 401));
    }

    const service = expert.credentials.services[serviceIndex];

    // Check if the service is "One-on-One Mentoring"
    if (serviceName === "One-on-One Mentoring") {
      // Update only relevant fields for One-on-One Mentoring
      if (typeof hourlyRate !== "undefined") service.hourlyRate = hourlyRate;
      if (typeof shortDescription !== "undefined")
        service.shortDescription = shortDescription;
      if (typeof detailedDescription !== "undefined")
        service.detailedDescription = detailedDescription;
      if (Array.isArray(features)) service.features = features;

      // Update one_on_one field with timeSlots data
      if (Array.isArray(timeSlots)) {
        const normalizedSlots = timeSlots.map((slot) => ({
          duration: Number(slot.duration),
          price: Number(slot.price),
          enabled: Boolean(slot.enabled),
        }));

        service.one_on_one = normalizedSlots;
        service.timeSlots = normalizedSlots;

        const primarySlot =
          normalizedSlots.find((slot) => slot.enabled) || normalizedSlots[0];
        if (primarySlot) {
          service.duration = primarySlot.duration;
          service.price = primarySlot.price;
        }
      }
    } else {
      // Default behavior for other services
      if (typeof serviceName !== "undefined") {
        service.title = serviceName;
        service.serviceName = serviceName;
      }
      if (typeof shortDescription !== "undefined")
        service.shortDescription = shortDescription;
      if (typeof detailedDescription !== "undefined")
        service.detailedDescription = detailedDescription;
      if (Array.isArray(features)) service.features = features;
      if (Array.isArray(timeSlots)) {
        const normalizedSlots = timeSlots.map((slot) => ({
          duration: Number(slot.duration),
          price: Number(slot.price),
          enabled: Boolean(slot.enabled),
        }));

        service.timeSlots = normalizedSlots;

        const primarySlot =
          normalizedSlots.find((slot) => slot.enabled) || normalizedSlots[0];
        if (primarySlot) {
          service.duration = primarySlot.duration;
          service.price = primarySlot.price;
        }
      }
    }

    await expert.save();
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      expert: sanitizedExpert,
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
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: `Service with ${serviceId} fetched successfully`,
      expert: sanitizedExpert,
      service,
    });
  } catch (error) {
    console.error("Error getting service:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const getExpertServices = async (req, res, next) => {
  const expertId = req.expert.id;
  try {
    const expert = ExpertBasics.findById(expertId);
    if (!expert) {
      return next(new AppError("expert not found", 500));
    }
    return res.status(200).json({
      success: true,
      message: "Experts servicesss",
      services: expert.credentials.services,
    });
  } catch (error) {
    return next(new AppError(error, 505));
  }
};

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
    const expertBasics = await ExpertBasics.findById(expertId);

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
    const sanitizedExpert = sanitizeExpertForResponse(expertBasics);
    return res.status(200).json({
      success: true,
      message: "Portfolio added successfully",
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(
      new AppError(`Database operation failed: ${error.message}`, 500)
    );
  }
};

const updateProfileStatus = async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from URL params or JWT token
    const { profileStatus } = req.body; // Get the profile status from the request body (e.g., 'confirmed', 'active')

    // Find the expert by their userId
    const expert = await ExpertModel.findById(userId); // Use the model you're using to fetch the expert

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Update the expert's profile status (or any other field you'd want to modify)
    expert.profileStatus = profileStatus || expert.profileStatus; // You may add other fields as necessary
    await expert.save(); // Save the updated data

    // Optionally, send a notification to admin or update admin_approved_expert to true
    if (profileStatus === "active" && !expert.admin_approved_expert) {
      expert.admin_approved_expert = true; // Set admin approval status
      await expert.save();
    }

    res.status(200).json({
      message: "Profile successfully updated",
      data: expert, // Send the updated expert data as a response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getAllExperts = async (req, res, next) => {
  try {
    const filters = {};

    // Apply filters
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
        {
          "credentials.niche": {
            $in: nichesArray.map((n) => new RegExp(`^${n}$`, "i")),
          },
        },
      ];
    }
    if (req.query.professionalTitle) {
      filters["credentials.professionalTitle"] = {
        $in: req.query.professionalTitle.split(","),
      };
    }
    if (req.query.durations) {
      const durationValue = parseInt(req.query.durations);
      if (!isNaN(durationValue)) {
        filters["credentials.services"] = {
          $elemMatch: {
            $or: [
              { duration: durationValue },
              { "one_on_one.duration": durationValue }
            ]
          }
        };
      }
    }

    // Price range filtering
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
      const minRating = parseInt(req.query.ratings, 10);
      filters.$expr = {
        $gte: [
          {
            $toDouble: {
              $divide: [
                { $sum: "$reviews.rating" },
                {
                  $cond: {
                    if: { $gt: [{ $size: "$reviews" }, 0] },
                    then: { $size: "$reviews" },
                    else: 1
                  }
                }
              ]
            }
          },
          minRating
        ]
      };
    }

    // Sorting logic - fixed to use MongoDB aggregation for complex sorting
    const sortBy = req.query.sorting || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    // For complex sorting, we need to use aggregation
    if (["price-low-high", "price-high-low", "highest-rated"].includes(sortBy)) {
      const pipeline = [{ $match: filters }];

      // Add computed fields for sorting
      switch (sortBy) {
        case "price-low-high":
          pipeline.push({
            $addFields: {
              minPrice: {
                $min: {
                  $map: {
                    input: "$credentials.services",
                    as: "service",
                    in: {
                      $min: [
                        { $ifNull: ["$$service.price", Number.MAX_SAFE_INTEGER] },
                        { $ifNull: ["$$service.one_on_one.price", Number.MAX_SAFE_INTEGER] }
                      ]
                    }
                  }
                }
              }
            }
          });
          pipeline.push({ $sort: { minPrice: 1, createdAt: -1 } });
          break;

        case "price-high-low":
          pipeline.push({
            $addFields: {
              maxPrice: {
                $max: {
                  $map: {
                    input: "$credentials.services",
                    as: "service",
                    in: {
                      $max: [
                        { $ifNull: ["$$service.price", 0] },
                        { $ifNull: ["$$service.one_on_one.price", 0] }
                      ]
                    }
                  }
                }
              }
            }
          });
          pipeline.push({ $sort: { maxPrice: -1, createdAt: -1 } });
          break;

        case "highest-rated":
          pipeline.push({
            $addFields: {
              avgRating: {
                $divide: [
                  { $sum: "$reviews.rating" },
                  {
                    $cond: {
                      if: { $gt: [{ $size: "$reviews" }, 0] },
                      then: { $size: "$reviews" },
                      else: 1
                    }
                  }
                ]
              }
            }
          });
          pipeline.push({ $sort: { avgRating: -1, createdAt: -1 } });
          break;
      }

      const experts = await ExpertBasics.aggregate(pipeline);
      const totalExperts = await ExpertBasics.countDocuments(filters);

      return res.status(200).json({
        success: true,
        message: "Filtered Experts",
        totalExperts,
        experts,
      });
    }

    // For simple sorting, use the regular find method
    let sortCriteria = {};
    switch (sortBy) {
      default:
        sortCriteria = { [sortBy]: order, createdAt: -1 };
    }

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

const getExpertAndServiceByServiceId = async (req, res, next) => {
  const { serviceID } = req.params;

  try {
    // Find expert by matching serviceId
    const expert = await ExpertBasics.findOne({
      "credentials.services.serviceId": serviceID,
    });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Extract the actual service
    const service = expert.credentials.services.find(
      (s) => s.serviceId === serviceID
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      expert,
      service,
    });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
};

const getAllExpertswithoutfilter = async (req, res, next) => {
  try {
    const expert = await ExpertBasics.find();
    if (!expert) {
      return next(new AppError("No experts found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Experts fetched successfully",
      expert,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

const getExpertById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid ID format", 400)); // 400 Bad Request
  }

  try {
    const expert = await ExpertBasics.findById(id);

    if (!expert) {
      return next(new AppError("Expert Not Found", 404)); // 404 Not Found
    }

    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: `User with id ${id}`,
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(
      new AppError("An error occurred while fetching the expert", 500, error)
    );
  }
};

const getExpertByRedirectURL = async (req, res, next) => {
  const { redirect_url } = req.params;

  try {
    const expert = await ExpertBasics.findOne({ redirect_url });

    if (!expert) {
      return next(new AppError("Expert Not Found", 404)); // 404 Not Found
    }
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    return res.status(200).json({
      success: true,
      message: `User with redirect_url ${redirect_url}`,
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(
      new AppError("An error occurred while fetching the expert", 500, error)
    );
  }
};

const expertPaymentDetails = async (req, res, next) => {
  const expert_id = req.expert.id;
  const { accountType, beneficiaryName, ifscCode, accountNumber } = req.body; // Updated field name

  console.log(req.body);

  if (!accountType || !beneficiaryName || !ifscCode || !accountNumber) {
    return next(new AppError("All fields are required", 500));
  }

  const expert = await ExpertBasics.findById(expert_id); // Ensure this is awaited
  if (!expert) {
    return next(new AppError("Expert not found", 510));
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
    message: "Payment details added successfully",
    expert,
  });
};

const client = algoliasearch("XWATQTV8D5", "a6543e2ed20ddb9f6cecf1d99d5c0905");

const pushExpertsToAlgolia = async (req, res) => {
  try {
    const experts = await ExpertBasics.find({});

    // Format experts for Algolia
    const records = experts.map((expert) => ({
      objectID: expert._id.toString(), // Required field in Algolia
      name: `${expert.firstName} ${expert.lastName}`,
      redirect_url: expert.redirect_url,
      username: expert.redirect_url,
      bio: expert.bio || "", // Ensure empty string if missing
      profileImage: expert.profileImage?.secure_url || "", // Ensure valid URL or empty string
      domain: expert.credentials?.domain || "", // Handle missing credentials object
      niche: expert.credentials?.niche || [], // Default empty array if missing
      services:
        expert.credentials?.services?.map((service) => ({
          title: service.title || "", // Ensure string or empty
          shortDescription: service.shortDescription || "",
        })) || [], // Default to an empty array if no services exist
      country_living: expert.country_living || "",
    }));

    // Push records to Algolia using saveObjects method
    const index = client.initIndex('experts_index');
    await index.replaceAllObjects(records); // atomic replace
    // await index.saveObjects(records);
    await client.saveObjects({
      indexName: index,
      objects: records,
    });

    return res.status(200).json({ message: "Experts indexed successfully" });
  } catch (error) {
    console.error("Error pushing experts to Algolia:", error);
    return res.status(500).json({ message: "Error indexing experts" });
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

      res.cookie("otpToken", otpToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      });

      const formattedNumber = inputKey.startsWith("+")
        ? inputKey
        : `+91${inputKey}`;
      console.log("Formatted Mobile:", formattedNumber);

      // await sendOtpMessage(formattedNumber, otp);
      return res.status(200).json({
        success: true,
        message: `OTP sent to ${formattedNumber}`,
      });
    }

    if (isEmail) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpToken = bcrypt.hashSync(otp, 10);

      res.cookie("otpToken", otpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 10 * 60 * 1000,
      });

      const templatePath = path.join(
        __dirname,
        "./EmailTemplates/verifyaccount.html"
      );
      let emailTemplate = fs.readFileSync(templatePath, "utf8");

      emailTemplate = emailTemplate.replace("{OTP_CODE}", otp);
      await sendEmail(inputKey, "Your OTP Code", emailTemplate);
      return res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    }

    // If input is neither email nor mobile
    return res.status(400).json({
      success: false,
      message: "Invalid email or mobile number format",
    });
  } catch (error) {
    return next(new AppError(error, 505));
  }
};

const validatethnumberormobile = async (req, res, next) => {
  const { otp } = req.body;
  const otpToken = req.cookies.otpToken;
  try {
    const isOtpValid = bcrypt.compareSync(otp, otpToken);
    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", 400));
    }
    res.clearCookie("otpToken");
    res.status(200).json({
      success: true,
      message: "Verified",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
    console.log(error);
  }
};

const handleToggleService = async (req, res, next) => {
  try {
    console.log("Raw request body:", req.body); // Debugging line

    let serviceId =
      req.body?.serviceId ||
      req.body?.id ||
      req.body?.service_id ||
      null;

    if (!serviceId && req.body && typeof req.body === "object") {
      const dynamicKeys = Object.keys(req.body).filter(
        (key) => !["serviceId", "id", "service_id"].includes(key)
      );
      if (dynamicKeys.length > 0) {
        serviceId = dynamicKeys[0];
      }
    }

    if (!serviceId) {
      return next(new AppError("Service ID is required", 400));
    }

    const expert_id = req.expert.id;
    console.log("Expert ID:", expert_id); // Debugging line

    // Find the expert by ID
    const expert = await ExpertBasics.findById(expert_id);

    if (!expert) {
      return next(new AppError("Expert not found", 404));
    }

    // Find the index of the service in the services array
    const serviceIndex = expert.credentials.services.findIndex((service) => {
      const mongoId = service?._id ? String(service._id) : undefined;
      return service.serviceId === serviceId || mongoId === String(serviceId);
    });

    if (serviceIndex === -1) {
      return next(new AppError("Service not found", 404));
    }

    // Log the current value of showMore before toggling
    console.log(
      `Before Toggle - Service ID: ${serviceId}, showMore: ${expert.credentials.services[serviceIndex].showMore}`
    );

    // Toggle the showMore field
    expert.credentials.services[serviceIndex].showMore =
      !expert.credentials.services[serviceIndex].showMore;

    // Log the updated value of showMore after toggling
    console.log(
      `After Toggle - Service ID: ${serviceId}, showMore: ${expert.credentials.services[serviceIndex].showMore}`
    );

    // Save the updated expert document
    await expert.save();

    // Log the updated expert document
    console.log("Updated Expert Document:", expert);
    const sanitizedExpert = sanitizeExpertForResponse(expert);
    res.status(200).json({
      success: true,
      message: "Service toggle updated successfully",
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(new AppError(error, 503));
  }
};

const getExpert = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    if (!user_id) {
      return next(new AppError("User id not found", 500));
    }

    let expertbasic = await ExpertBasics.findOne({ user_id });
    if (!expertbasic) {
      return next(new AppError("Expert details not found", 502));
    }
    const sanitizedExpert = sanitizeExpertForResponse(expertbasic);
    res.status(200).json({
      success: true,
      message: "expert details",
      expert: sanitizedExpert,
    });
  } catch (error) {
    return next(new AppError(error, 400));
  }
};


const HelpCenter = async (req, res) => {
  try {
    const { name, mobile, problem } = req.body;

    if (!name || !mobile || !problem) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const expertId = req.expert.id;
    if (!expertId) {
      return res.status(400).json({ error: "Expert ID not found." });
    }

    const newRequest = new HelpCenterModel({
      expertId,
      name,
      mobile,
      problem,
    });

    await newRequest.save();

    res.status(200).json({
      message: "Support request submitted successfully.",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error in HelpCenter:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

const getSupportRequestsForExpert = async (req, res) => {
  try {
    const expertId = req.expert.id;

    if (!expertId) {
      return res.status(400).json({ error: "Expert ID not found. from get" });
    }
    const supportRequests = await HelpCenterModel.find({ expertId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ data: supportRequests });
  } catch (error) {
    console.error("Error fetching support requests:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  getExpert,
  expertBasicDetails,
  expertImages,
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
  getExpertAndServiceByServiceId,
  deleteService,
  getService,
  expertPaymentDetails,
  createService,
  updateService,
  pushExpertsToAlgolia,
  generateOtpForVerifying,
  validatethnumberormobile,

  adminapproved,
  handleSuspendExpert,

  getAllExpertswithoutfilter,
  handleToggleService,

  // help center
  HelpCenter,
  getSupportRequestsForExpert,
};
