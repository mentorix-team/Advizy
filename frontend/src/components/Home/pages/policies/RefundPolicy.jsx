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
                All payments for services on Advizy are final. Refunds are only considered in rare, exceptional cases solely at our discretion. Each request will be reviewed individually, and our decision shall be final and binding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Non-Refundable Situations</h2>
              <p>
                Except in cases where we explicitly agrees to issue a refund, all payments made through our platform are non-refundable. Users are not entitled to refunds for missed sessions, dissatisfaction with services or any other circumstances not expressly approved by us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Refund Processing</h2>
              <p>
                If we grants a refund, it will be processed through the original payment method within 7-14 business days. Processing times may vary depending on financial institutions and payment providers. we are not responsible for delays caused by third-party payment processors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
              <p>
                our total liability for any refund shall be strictly limited to the amount paid for the disputed service. we shall not be liable for any indirect, incidental, punitive, or consequential damages, including but not limited to loss of revenue, reputation, or business opportunities arising from the use of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Policy Amendments</h2>
              <p>
                We reserves the right to modify or terminate this Refund Policy at any time. Material changes will be notified via email or platform announcements. Continued use of our service after policy updates signifies acceptance of the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
              <p>For refund-related inquiries, contact us at:</p>
              <ul className="list-none pl-0">
                <li><strong>Email:</strong> support@advizy.in</li>
                <li><strong>Website:</strong> <a href="http://www.advizy.in/contact" className="text-primary hover:underline">www.advizy.in/contact</a></li>
                <li><strong>Business Hours:</strong> Monday-Friday, 9 AM - 5 PM IST</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;