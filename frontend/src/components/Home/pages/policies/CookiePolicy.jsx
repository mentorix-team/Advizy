import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CookiePolicy = () => {
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
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-4">Last updated: February 08, 2025</p>
            
            <p className="mb-6">
              This Cookie Policy explains how Advizy ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at https://www.advizy.in ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <p className="mb-6">
              In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What are cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="mt-4">
                Cookies set by the website owner (in this case, Advizy) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Why do we use cookies?</h2>
              <p>
                We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How can I control cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
              </p>
              <p className="mt-4">
                The Cookie Consent Manager can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How can I control cookies on my browser?</h2>
              <p>
                As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:
              </p>
              <ul className="list-none pl-0 mt-4 space-y-2">
                <li><strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" className="text-primary hover:underline">https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies</a></li>
                <li><strong>Internet Explorer:</strong> <a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" className="text-primary hover:underline">Microsoft Support</a></li>
                <li><strong>Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US" className="text-primary hover:underline">Mozilla Support</a></li>
                <li><strong>Safari:</strong> <a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" className="text-primary hover:underline">Apple Support</a></li>
                <li><strong>Edge:</strong> <a href="https://support.microsoft.com/en-us/microsoft-edge/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" className="text-primary hover:underline">Microsoft Edge Support</a></li>
                <li><strong>Opera:</strong> <a href="https://help.opera.com/en/latest/web-preferences/" className="text-primary hover:underline">Opera Help</a></li>
              </ul>
              <p className="mt-4">
                In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:
              </p>
              <p className="mt-2">
                Digital Advertising Alliance: <a href="https://optout.aboutads.info/?c=2&lang=EN" className="text-primary hover:underline">https://optout.aboutads.info/?c=2&lang=EN</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What about other tracking technologies, like web beacons?</h2>
              <p>
                Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Do you use Flash cookies or Local Shared Objects?</h2>
              <p>
                Websites may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.
              </p>
              <p className="mt-4">
                If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the Website Storage Settings Panel. You can also control Flash Cookies by going to the Global Storage Settings Panel and following the instructions (which may include instructions that explain, for example, how to delete existing Flash Cookies (referred to "information" on the Macromedia site), how to prevent Flash LSOs from being placed on your computer without your being asked, and (for Flash Player 8 and later) how to block Flash Cookies that are not being delivered by the operator of the page you are on at the time).
              </p>
              <p className="mt-4">
                Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications, including, potentially, Flash applications used in connection with our services or online content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Do you serve targeted advertising?</h2>
              <p>
                Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How often will you update this Cookie Policy?</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p className="mt-4">
                The date at the top of this Cookie Policy indicates when it was last updated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Where can I get further information?</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at contact@advizy.in
              </p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;