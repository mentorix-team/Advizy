import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-4">Last updated: February 05, 2025</p>
            
            <p className="mb-6">
              At Advizy, all payments made for services on our platform are final and non-refundable, except under limited circumstances solely determined by us.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. General Policy</h2>
              <p>
                All payments for services on Advizy are final. Refunds will only be considered in rare, exceptional cases at our sole discretion. Each request will be reviewed individually, and our decision will be final and binding. In cases where a refund is granted, it will be subject to the terms outlined below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Non-Refundable Situations</h2>
              <p>Except in cases where we explicitly agree to issue a refund, all payments made through our platform are non-refundable. Users are not entitled to refunds for:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Missed sessions.</li>
                <li>Dissatisfaction with services.</li>
                <li>Any other circumstances not expressly approved by us.</li>
                <li>Issues arising from the user's failure to comply with platform policies or guidelines.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Refund Considerations</h2>
              <p>Refunds may be considered under the following conditions:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>If a user was mistakenly charged more than once for the same service.</li>
                <li>If a service was not delivered due to a verified technical issue or system error on our part.</li>
                <li>Any other case that we, at our sole discretion, deem eligible for a refund.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Refund Processing</h2>
              <p>
                If we grant a refund, it will be processed through the original payment method within 7-14 business days. Processing times may vary depending on financial institutions and payment providers. We are not responsible for delays caused by third-party payment processors. If a delay occurs, users should follow up with their financial institutions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Dispute Resolution</h2>
              <p>
                If a user disagrees with a refund decision, they may submit an appeal by contacting our support team within 7 days of receiving the decision. Appeals will be reviewed on a case-by-case basis. If further resolution is required, disputes may be escalated through arbitration as per our Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p>
                Our total liability for any refund shall be strictly limited to the amount paid for the disputed service. We shall not be liable for any indirect, incidental, punitive, or consequential damages, including but not limited to loss of revenue, reputation, or business opportunities arising from the use of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Policy Amendments</h2>
              <p>
                We reserve the right to modify or terminate this Refund Policy at any time. Material changes will be communicated via email or platform announcements at least 14 days in advance. Continued use of our service after policy updates signifies acceptance of the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p>For refund-related inquiries, contact us at:</p>
              <ul className="list-none pl-0 mt-2">
                <li><strong>Email:</strong> contact@advizy.in</li>
                <li><strong>Website:</strong> <a href="http://www.advizy.in/contact" className="text-blue-600 hover:underline">www.advizy.in/contact</a></li>
                <li><strong>Business Hours:</strong> Monday-Friday, 9 AM - 5 PM IST</li>
              </ul>
            </section>

            <p className="mt-8 text-sm text-gray-600">
              This policy is designed to ensure clarity and fairness for all users while protecting the integrity of our services. By using our platform, you agree to abide by the terms of this policy.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;