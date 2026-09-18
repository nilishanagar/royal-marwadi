import { Link } from 'react-router-dom';
import { LuMapPin, LuPhone, LuMail, LuInstagram, LuFacebook, LuTwitter, LuYoutube } from 'react-icons/lu';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col footer-brand">
              <div className="footer-logo">
                <span className="logo-text">Royal</span>
                <span className="logo-accent">Marwadi</span>
              </div>
              <p className="footer-about">
                Bringing the legacy of Rajasthani craftsmanship to your home. Each piece tells a story of heritage, 
                artistry, and timeless elegance.
              </p>
              <div className="footer-socials">
                <a href="#" aria-label="Instagram"><LuInstagram size={18} /></a>
                <a href="#" aria-label="Facebook"><LuFacebook size={18} /></a>
                <a href="#" aria-label="Twitter"><LuTwitter size={18} /></a>
                <a href="#" aria-label="YouTube"><LuYoutube size={18} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/shop">Shop All</Link></li>
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/shop?featured=true">Featured</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/shop?category=living-room">Living Room</Link></li>
                <li><Link to="/shop?category=bedroom">Bedroom</Link></li>
                <li><Link to="/shop?category=dining">Dining</Link></li>
                <li><Link to="/shop?category=office">Office</Link></li>
                <li><Link to="/shop?category=outdoor">Outdoor</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Get in Touch</h4>
              <ul className="footer-contact">
                <li><LuMapPin size={16} /> <span>42 Heritage Lane, Jodhpur, Rajasthan 342001</span></li>
                <li><LuPhone size={16} /> <span>+91 98765 43210</span></li>
                <li><LuMail size={16} /> <span>hello@royalmarwadi.com</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Royal Marwadi. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
