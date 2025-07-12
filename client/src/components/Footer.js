import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-warning mb-3">
              <i className="bi bi-arrow-left-right me-2"></i>
              Skill Swap
            </h5>
            <p className="text-light opacity-75">
              Connecting people through skill sharing. Learn new abilities, teach your expertise, 
              and build meaningful connections in our vibrant community.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none fs-5">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-warning text-uppercase mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-house me-1"></i>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/search" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-search me-1"></i>
                  Browse Skills
                </a>
              </li>
              <li className="mb-2">
                <a href="/dashboard" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-info-circle me-1"></i>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-warning text-uppercase mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="mailto:help@skillswap.com" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-question-circle me-1"></i>
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="/safety" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-shield-check me-1"></i>
                  Safety Guidelines
                </a>
              </li>
              <li className="mb-2">
                <a href="/terms" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-file-text me-1"></i>
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-lock me-1"></i>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Team Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="text-warning text-uppercase mb-3">Our Team</h6>
            <div className="mb-3">
              <h6 className="text-warning mb-2">The Silicon Savants</h6>
              <p className="text-light opacity-75 small mb-3">
                A passionate team dedicated to building innovative solutions for skill sharing and community building.
              </p>
            </div>
            <div className="row">
              <div className="col-12 mb-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle text-warning me-2"></i>
                    <span className="text-light">Gyan Chandra</span>
                  </div>
                  <a href="https://www.linkedin.com/in/gyanchandra29102003" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
              <div className="col-12 mb-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle text-warning me-2"></i>
                    <span className="text-light">Kumari Tannu</span>
                  </div>
                  <a href="https://www.linkedin.com/in/kumari-tannu-938281295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
              <div className="col-12 mb-2">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle text-warning me-2"></i>
                    <span className="text-light">Dristi Singh</span>
                  </div>
                  <a href="https://www.linkedin.com/in/dristi-singh-394b57351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light opacity-75 mb-0">
              &copy; 2025 The Silicon Savants. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-light opacity-75 mb-0">
              Made with <i className="bi bi-heart-fill text-danger"></i> for the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
