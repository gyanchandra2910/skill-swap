import React from 'react';

const About = () => {
  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <h2 className="mb-4">About Skill Swap</h2>
        <p className="lead">
          Skill Swap is a platform designed to bring people together through the 
          power of knowledge sharing and skill exchange.
        </p>
        
        <h4 className="mt-4">Our Mission</h4>
        <p>
          We believe that everyone has something valuable to teach and something 
          new to learn. Our mission is to create a community where individuals 
          can connect, share their expertise, and grow together.
        </p>
        
        <h4 className="mt-4">How It Works</h4>
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">1</span>
              </div>
              <h6 className="mt-2">Sign Up</h6>
              <p className="small">Create your profile and list your skills</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">2</span>
              </div>
              <h6 className="mt-2">Connect</h6>
              <p className="small">Find people with skills you want to learn</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                <span className="h4 mb-0">3</span>
              </div>
              <h6 className="mt-2">Exchange</h6>
              <p className="small">Start learning and teaching in our community</p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 p-4 bg-light rounded">
          <h5>Join Our Community</h5>
          <p className="mb-3">
            Ready to start your skill-sharing journey? Join thousands of learners 
            and teachers who are already part of our community.
          </p>
          <button className="btn btn-primary me-2">Get Started</button>
          <button className="btn btn-outline-primary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default About;
