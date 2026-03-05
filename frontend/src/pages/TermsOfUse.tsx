import { Footer } from '../components/Footer';
import './TermsOfUse.css';

const TermsOfUse = () => {
    return (
        <div className="terms-page">
            <header className="terms-header">
                <h1>Terms of Use</h1>
                <p className="last-updated">Last updated: March 2026</p>
            </header>

            <main className="terms-content">
                <p>
                    By accessing and using Expensify, you agree to be bound by these Terms of Use
                    and all applicable laws and regulations. These terms govern your interaction
                    with our platform and ensure a secure, transparent, and fair environment for
                    all our users. If you do not agree with any of these terms, you are
                    prohibited from using or accessing this site, as your continued use
                    signifies your total acceptance of the conditions outlined herein.
                </p>

                <p>
                    Expensify grants you a personal, non-exclusive, non-transferable license to
                    use our software for personal financial tracking and management. You agree
                    not to reproduce, duplicate, copy, sell, or exploit any portion of the service
                    without express written permission from us. This license shall automatically
                    terminate if you violate any of these restrictions and may be terminated by
                    Expensify at any time for any reason we deem necessary to protect our platform.
                </p>

                <p>
                    The materials on Expensify's website are provided on an 'as is' basis. We
                    make no warranties, expressed or implied, and hereby disclaim all other
                    warranties including, without limitation, implied warranties of
                    merchantability or fitness for a particular purpose. Further, we do not
                    warrant or make any representations concerning the accuracy or reliability
                    of the use of the materials on our platform or otherwise relating to such
                    materials or on any sites linked to this service.
                </p>

                <p>
                    In no event shall Expensify or its suppliers be liable for any damages
                    arising out of the use or inability to use the materials on our platform,
                    even if we have been notified orally or in writing of the possibility of
                    such damage. Because some jurisdictions do not allow limitations on implied
                    warranties or limitations of liability for consequential or incidental
                    damages, these limitations may not apply to you specifically.
                </p>

                <p>
                    We reserve the right to revise these terms of use for our platform at any
                    time without prior notice. By using this platform, you are agreeing to be
                    bound by the then-current version of these Terms of Use. We encourage you
                    to review this page periodically to ensure you are aware of any changes
                    that may affect your rights and responsibilities as a user of our service.
                </p>

                <p className="contact-info">
                    For any questions regarding these terms, please contact us at
                    noel.regis04@gmail.com
                </p>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUse;
