import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg max-w-none"
        >
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: February 05, 2024</p>

          <div className="space-y-8">
            {/* Agreement Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Agreement to Our Legal Terms</h2>
              <p>
                We operate under the brand name Advizy ('we,' 'us,' 'our') as an independent service provider. Advizy is currently in the process of incorporation. Until formal incorporation, all services are provided in an individual capacity, and no corporate liability is assumed.
              </p>
              <p>
                We operate, as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
              </p>
              <p>
                These Legal Terms establish the conditions for using our platform. Advizy currently operates as an independent entity and is in the process of incorporation.
              </p>
              <p>
                You can contact us by email at contact@advizy.in
              </p>
              <p>
                These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Advizy, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
              <p>
                We recommend that you print a copy of these Legal Terms for your records.
              </p>
            </section>

            {/* Table of Contents */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Our Services</li>
                <li>Intellectual Property Rights</li>
                <li>User Representations</li>
                <li>Prohibited Activities</li>
                <li>User Generated Contributions</li>
                <li>Contribution License</li>
                <li>Purchases and Payment</li>
                <li>Services Management</li>
                <li>Term and Termination</li>
                <li>Governing Law</li>
                <li>Dispute Resolution</li>
                <li>Corrections</li>
                <li>Disclaimer</li>
                <li>Limitations of Liability</li>
                <li>Indemnification</li>
                <li>User Data</li>
                <li>Electronic Communications, Transactions, and Signatures</li>
                <li>Miscellaneous</li>
                <li>Contact Us</li>
              </ol>
            </section>

            {/* Individual Sections */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Our Services</h2>
              <p>
                The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
              </p>
              <p>
                The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
              </p>
              <p>
                We do not guarantee uninterrupted availability of our Services. We are not liable for any downtime, disruptions, or loss of data due to system maintenance, updates, or unforeseen technical issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Intellectual Property Rights</h2>
              <h3 className="text-xl font-semibold mb-3">Our intellectual property</h3>
              <p>
                We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-3">Your use of our Services</h3>
              <p>
                Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use or internal business purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Representations</h2>
              <p>
                By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Prohibited Activities</h2>
              <p>You may not access or use the Services for any purpose other than those expressly permitted by us. As a user of the Services, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Systematically retrieve data or other content from the Services</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Circumvent, disable, or interfere with security-related features</li>
                <li>Engage in any conduct that could damage or discredit our reputation</li>
                <li>Make improper use of our support services</li>
                <li>Use the Services in violation of applicable laws</li>
                <li>Engage in unauthorized framing or linking</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Engage in automated use of the system</li>
                <li>Delete copyright or proprietary rights notices</li>
                <li>Attempt to impersonate another user or entity</li>
                <li>Interfere with or disrupt the Services</li>
                <li>Harass, annoy, intimidate, or threaten others</li>
                <li>Attempt to bypass security measures</li>
              </ul>
            </section>

            {/* Continue with remaining sections... */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. User Generated Contributions</h2>
              <p>
                The Services does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contribution License</h2>
              <p>
                By using the Services, you acknowledge and agree that we may access, store, process, and use any information and personal data you provide, in accordance with our Privacy Policy and applicable data protection laws.
              </p>
              <p>
                By submitting suggestions, ideas, or other feedback regarding the Services, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use, modify, reproduce, distribute, and publicly display such feedback for any purpose, without any obligation to compensate you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Purchases and Payment</h2>
              <p>We accept the following forms of payment:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Visa</li>
                <li>Mastercard</li>
                <li>American Express</li>
                <li>Razorpay Services</li>
              </ul>
              <p>
                You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. All payments and transactions on this platform are processed via Razorpay under the business name: Akate Vivek Pundalik. All payments shall be in USD, EUR, CAD, AUD, SGD, INR. Users acknowledge that they may be responsible for currency conversion fees or other bank-imposed charges.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Services Management</h2>
              <p>
                We reserve the right to monitor the Services for violations of these Legal Terms and to take appropriate legal action against anyone who violates them. We may also suspend or terminate your access to the Services for violations of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Term and Termination</h2>
              <p>
                These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access to or restrict the use of the Services to any person or entity, for any reason, at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
              <p>
                These Legal Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. You and we agree that any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
              <p>
                All disputes will first be attempted to be resolved through mutual discussion. If unresolved, disputes will be subject to arbitration under the Arbitration and Conciliation Act, 1996 (India), with Mumbai as the seat of arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Corrections</h2>
              <p>
                There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information at any time, without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Disclaimer</h2>
              <p className="uppercase">
                THE SERVICES ARE PROVIDED ON AN 'AS-IS' AND 'AS-AVAILABLE' BASIS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Limitations of Liability</h2>
              <p>
                IN NO EVENT SHALL ADVIZY OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, PUNITIVE, OR SPECIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold us harmless from any claims, damages, or expenses arising from your use of the Services or violation of these Legal Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. User Data</h2>
              <p>
                We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. You are solely responsible for maintaining backups of any critical data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">17. Electronic Communications</h2>
              <p>
                You consent to receive electronic communications from us and agree that all agreements, notices, disclosures, and other communications we provide electronically satisfy any legal requirement for written communication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">18. Miscellaneous</h2>
              <p>
                These Legal Terms constitute the entire agreement between you and us regarding your use of the Services. Our failure to exercise any right or provision shall not constitute a waiver of such right or provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">19. Contact Us</h2>
              <p>For any inquiries regarding the Services, you may contact us at:</p>
              <p><a href="http://www.advizy.in/contact" className="text-primary hover:underline">www.advizy.in/contact</a></p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default TermsOfService;