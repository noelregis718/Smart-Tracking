import { Github, Linkedin } from 'lucide-react';
import { Footer } from '@/components/ui/footer';

export const SiteFooter = () => {
    return (
        <Footer
            logo={<img src="/2-removebg-preview.png" alt="Expensify Logo" className="footer-logo-image" />}
            brandName="Expensify"
            socialLinks={[
                {
                    icon: <Github className="h-5 w-5" />,
                    href: "https://github.com/noelregis718",
                    label: "GitHub",
                },
                {
                    icon: <Linkedin className="h-5 w-5" />,
                    href: "https://www.linkedin.com/feed/",
                    label: "LinkedIn",
                },
            ]}
            mainLinks={[
                { href: "/features", label: "Features" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
            ]}
            legalLinks={[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
            ]}
            copyright={{
                text: "© 2026 Expensify.",
                license: "All rights reserved.",
            }}
        />
    );
};
