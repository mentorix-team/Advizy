import Contact from "../config/model/contact.model.js";

export const submitContactForm = async (req, res) => {
  try {
    console.log("📥 Received contact form submission:", req.body);
    
    const { name, email, message } = req.body;
    if(!name || !email || !message) {
      console.log("❌ Validation failed: Missing required fields");
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();
    
    console.log("✅ Contact form saved successfully:", {
      id: newContact._id,
      name: newContact.name,
      email: newContact.email,
      message: newContact.message,
      createdAt: newContact.createdAt
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Your message has been sent successfully! We will get back to you soon.", 
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        message: newContact.message,
        createdAt: newContact.createdAt
      }
    });
  } catch (error) {
    console.error("❌ Error submitting contact form:", error);
    res.status(500).json({ success: false, message: "Server error while submitting contact form" });
  }
};
