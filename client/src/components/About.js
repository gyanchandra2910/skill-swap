import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-5 mb-5 rounded-3">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">About Skill Swap</h1>
              <p className="lead fs-5 mb-4">
                Empowering communities through knowledge sharing and skill exchange. 
                Building bridges between learners and teachers worldwide.
              </p>
              <div className="d-flex justify-content-center">
                <i className="bi bi-people-fill display-1 text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6 mb-4">
          <div className="h-100">
            <h2 className="display-6 fw-bold mb-4 text-primary">Our Mission</h2>
            <p className="lead text-muted mb-4">
              We believe that everyone has something valuable to teach and something new to learn. 
              Our mission is to create a vibrant community where individuals can connect, share 
              their expertise, and grow together.
            </p>
            <div className="bg-light p-4 rounded-3">
              <h5 className="text-primary mb-3">Why Skill Swap?</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Learn from passionate experts in any field
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Share your knowledge and build your reputation
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Connect with like-minded individuals
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Build lasting professional relationships
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="h-100">
            <h2 className="display-6 fw-bold mb-4 text-success">Our Vision</h2>
            <p className="lead text-muted mb-4">
              To create a world where knowledge flows freely, barriers to learning are eliminated, 
              and every person has the opportunity to teach and learn from others, regardless of 
              their background or location.
            </p>
            <div className="bg-success bg-opacity-10 p-4 rounded-3">
              <h5 className="text-success mb-3">Core Values</h5>
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    <span className="fw-semibold">Community</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                    <span className="fw-semibold">Innovation</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check-fill text-primary me-2"></i>
                    <span className="fw-semibold">Trust</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-graph-up-arrow text-success me-2"></i>
                    <span className="fw-semibold">Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-light py-5 mb-5 rounded-3">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">Simple steps to start your skill-sharing journey</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="text-center h-100">
                <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-person-plus fs-1"></i>
                </div>
                <h5 className="fw-bold mb-3">1. Sign Up</h5>
                <p className="text-muted">Create your profile and showcase the skills you can teach and want to learn</p>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="text-center h-100">
                <div className="bg-success bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-search fs-1"></i>
                </div>
                <h5 className="fw-bold mb-3">2. Discover</h5>
                <p className="text-muted">Browse through hundreds of skills and find the perfect match for your learning goals</p>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="text-center h-100">
                <div className="bg-warning bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-handshake fs-1"></i>
                </div>
                <h5 className="fw-bold mb-3">3. Connect</h5>
                <p className="text-muted">Send swap requests and connect with people who share your interests and passions</p>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="text-center h-100">
                <div className="bg-info bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-arrow-left-right fs-1"></i>
                </div>
                <h5 className="fw-bold mb-3">4. Exchange</h5>
                <p className="text-muted">Start learning and teaching! Schedule sessions and grow together in our community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Meet Our Team</h2>
          <p className="lead text-muted">The passionate minds behind Skill Swap</p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <div className="bg-gradient-primary text-white p-4 rounded-3 d-inline-block">
            <h3 className="mb-2 text-warning fw-bold">The Silicon Savants</h3>
            <p className="mb-0 opacity-75">Building the future of skill sharing</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <i className="bi bi-person-fill text-white fs-1"></i>
              </div>
              <h5 className="fw-bold mb-2">Gyan Chandra</h5>
              <p className="text-muted mb-3">Lead Developer & Architect</p>
              <p className="small text-muted mb-3">Passionate about creating innovative solutions that connect communities and facilitate learning.</p>
              <a href="https://www.linkedin.com/in/gyanchandra29102003" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-linkedin me-1"></i>
                Connect
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <i className="bi bi-person-fill text-white fs-1"></i>
              </div>
              <h5 className="fw-bold mb-2">Kumari Tannu</h5>
              <p className="text-muted mb-3">UI/UX Designer & Developer</p>
              <p className="small text-muted mb-3">Focused on creating beautiful, intuitive experiences that make skill sharing accessible to everyone.</p>
              <a href="https://www.linkedin.com/in/kumari-tannu-938281295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm">
                <i className="bi bi-linkedin me-1"></i>
                Connect
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <i className="bi bi-person-fill text-white fs-1"></i>
              </div>
              <h5 className="fw-bold mb-2">Dristi Singh</h5>
              <p className="text-muted mb-3">Backend Developer & QA</p>
              <p className="small text-muted mb-3">Ensuring robust, scalable solutions and seamless user experiences across the platform.</p>
              <a href="https://www.linkedin.com/in/dristi-singh-394b57351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="btn btn-outline-warning btn-sm">
                <i className="bi bi-linkedin me-1"></i>
                Connect
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-dark text-white py-5 mb-5 rounded-3">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="h-100">
                <i className="bi bi-people-fill text-warning display-4 mb-3"></i>
                <h3 className="fw-bold text-warning">1000+</h3>
                <p className="text-light opacity-75 mb-0">Active Members</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="h-100">
                <i className="bi bi-lightbulb-fill text-warning display-4 mb-3"></i>
                <h3 className="fw-bold text-warning">500+</h3>
                <p className="text-light opacity-75 mb-0">Skills Available</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="h-100">
                <i className="bi bi-arrow-left-right text-warning display-4 mb-3"></i>
                <h3 className="fw-bold text-warning">2000+</h3>
                <p className="text-light opacity-75 mb-0">Successful Swaps</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="h-100">
                <i className="bi bi-star-fill text-warning display-4 mb-3"></i>
                <h3 className="fw-bold text-warning">4.9</h3>
                <p className="text-light opacity-75 mb-0">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-primary text-white rounded-3 p-5">
          <h2 className="display-6 fw-bold mb-3">Ready to Join Our Community?</h2>
          <p className="lead mb-4">Start your skill-sharing journey today and connect with passionate learners and teachers</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 fw-semibold">
              <i className="bi bi-person-plus me-2"></i>
              Get Started
            </Link>
            <Link to="/search" className="btn btn-outline-light btn-lg px-4 py-3">
              <i className="bi bi-search me-2"></i>
              Browse Skills
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
