import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section bg-gradient-primary text-white py-5 mb-5 rounded-3">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">
                Share Skills,
                <br />
                <span className="text-warning">Build Community</span>
              </h1>
              <p className="lead mb-4 fs-5">
                Connect with passionate learners and skilled teachers in our vibrant community. 
                Exchange knowledge, discover new talents, and grow together.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 fw-semibold">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Start Your Journey
                </Link>
                <Link to="/search" className="btn btn-outline-light btn-lg px-4 py-3">
                  <i className="bi bi-search me-2"></i>
                  Explore Skills
                </Link>
              </div>
              <div className="d-flex align-items-center text-light opacity-75">
                <i className="bi bi-people-fill me-2"></i>
                <small>Join thousands of skill sharers worldwide</small>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image-placeholder bg-white bg-opacity-10 rounded-4 p-5">
                <i className="bi bi-people-fill display-1 text-warning mb-3"></i>
                <h4 className="text-light">Connect & Learn</h4>
                <p className="text-light opacity-75">Building bridges through knowledge sharing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-5">
        <div className="col-md-3 text-center mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <i className="bi bi-people text-primary display-4 mb-3"></i>
              <h3 className="fw-bold text-primary">1000+</h3>
              <p className="text-muted mb-0">Active Members</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 text-center mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <i className="bi bi-lightbulb text-success display-4 mb-3"></i>
              <h3 className="fw-bold text-success">500+</h3>
              <p className="text-muted mb-0">Skills Shared</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 text-center mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <i className="bi bi-arrow-left-right text-warning display-4 mb-3"></i>
              <h3 className="fw-bold text-warning">2000+</h3>
              <p className="text-muted mb-0">Successful Swaps</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 text-center mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-4">
              <i className="bi bi-star-fill text-info display-4 mb-3"></i>
              <h3 className="fw-bold text-info">4.9</h3>
              <p className="text-muted mb-0">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">How It Works</h2>
          <p className="lead text-muted">Simple steps to start your skill-sharing journey</p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-lg h-100 feature-card">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-primary bg-gradient rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                <i className="bi bi-search text-white fs-1"></i>
              </div>
              <h4 className="fw-bold mb-3">Discover Skills</h4>
              <p className="text-muted mb-4">
                Browse through hundreds of skills offered by passionate teachers. 
                Find exactly what you want to learn, from coding to cooking.
              </p>
              <Link to="/search" className="btn btn-outline-primary">
                <i className="bi bi-arrow-right me-1"></i>
                Browse Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-lg h-100 feature-card">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-success bg-gradient rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                <i className="bi bi-person-plus text-white fs-1"></i>
              </div>
              <h4 className="fw-bold mb-3">Share Your Expertise</h4>
              <p className="text-muted mb-4">
                Become a teacher and share your knowledge with eager learners. 
                Help others grow while building your reputation in the community.
              </p>
              <Link to="/register" className="btn btn-outline-success">
                <i className="bi bi-arrow-right me-1"></i>
                Start Teaching
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-lg h-100 feature-card">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-warning bg-gradient rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center">
                <i className="bi bi-people text-white fs-1"></i>
              </div>
              <h4 className="fw-bold mb-3">Build Connections</h4>
              <p className="text-muted mb-4">
                Connect with like-minded individuals, build lasting relationships, 
                and create a network of friends who share your interests.
              </p>
              <Link to="/register" className="btn btn-outline-warning">
                <i className="bi bi-arrow-right me-1"></i>
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-light rounded-3 p-5 mb-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">What Our Community Says</h2>
            <p className="lead text-muted">Real stories from real skill sharers</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className="text-muted mb-3">
                  "I learned web development from an amazing mentor here. The community is so welcoming and supportive!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Sarah Johnson</h6>
                    <small className="text-muted">Web Developer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className="text-muted mb-3">
                  "Teaching photography here has been incredibly rewarding. I've met so many passionate learners!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Mike Chen</h6>
                    <small className="text-muted">Photographer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className="text-muted mb-3">
                  "The skill swap system is genius! I taught guitar and learned digital marketing. Win-win!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Emma Rodriguez</h6>
                    <small className="text-muted">Musician & Marketer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-5">
        <div className="bg-gradient-primary text-white rounded-3 p-5">
          <h2 className="display-6 fw-bold mb-3">Ready to Start Learning?</h2>
          <p className="lead mb-4">Join our community today and unlock a world of knowledge sharing</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 fw-semibold">
              <i className="bi bi-person-plus me-2"></i>
              Sign Up Free
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
        }
        
        .hero-image-placeholder {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
