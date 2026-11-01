import { Logo } from "@/app/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-frame footer-frame">
        <div className="footer-grid">
          <div className="footer-brand"><Logo /><p>The simplest way to bring Notion pages to your website.</p></div>
          <div><h3>Product</h3><Link href="/#features">Features</Link><Link href="/#pricing">Pricing</Link><Link href="/#how-it-works">How it works</Link></div>
          <div><h3>Resources</h3><Link href="/blog">Blog</Link><Link href="/#demo">Documentation</Link><Link href="/#faq">FAQ</Link><a href="mailto:hello@embedmynotion.example">Contact</a></div>
          <div><h3>Legal</h3><a href="#footer-note">Privacy Policy</a><a href="#footer-note">Terms of Service</a></div>
        </div>
        <div className="footer-bottom" id="footer-note">
          <span>© 2026 embedmynotion. All rights reserved.</span>
          <span>embedmynotion is an independent product and is not affiliated with Notion.</span>
        </div>
      </div>
    </footer>
  );
}
