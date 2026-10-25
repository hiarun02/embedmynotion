import { Logo } from "./Logo";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand"><Logo /><p>The simplest way to bring Notion pages to your website.</p></div>
          <div><h3>Product</h3><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#how-it-works">How it works</a></div>
          <div><h3>Resources</h3><a href="#demo">Documentation</a><a href="#faq">FAQ</a><a href="mailto:hello@embedmynotion.example">Contact</a></div>
          <div><h3>Legal</h3><a href="#footer-note">Privacy Policy</a><a href="#footer-note">Terms of Service</a></div>
        </div>
        <div className="footer-bottom" id="footer-note">
          <span>© {CURRENT_YEAR} embedmynotion. All rights reserved.</span>
          <span>embedmynotion is an independent product and is not affiliated with Notion.</span>
        </div>
      </div>
    </footer>
  );
}
