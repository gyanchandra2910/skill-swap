import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="jumbotron bg-light p-5 rounded">
          <h1 className="display-4">Welcome to Skill Swap</h1>
          <p className="lead">
            Connect with others to share and learn new skills. Exchange your expertise 
            and discover new talents in our community-driven platform.
          </p>
          <hr className="my-4" />
          <p>
            Start your skill-sharing journey today. Find mentors, become a teacher, 
            or simply connect with like-minded individuals.
          </p>
          <div className="d-flex gap-2">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-primary btn-lg">
              Login
            </Link>
            <Link to="/search" className="btn btn-outline-secondary btn-lg">
              Browse Skills
            </Link>
          </div>
        </div>
      </div>
      
      <div className="col-md-12 mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Learn Skills</h5>
                <p className="card-text">
                  Discover new skills from experienced professionals and passionate enthusiasts.
                </p>
                <Link to="/search" className="btn btn-outline-primary">
                  Browse Skills
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Teach Skills</h5>
                <p className="card-text">
                  Share your expertise with others and help them grow their skill set.
                </p>
                <Link to="/register" className="btn btn-outline-primary">
                  Offer Skills
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Connect</h5>
                <p className="card-text">
                  Build meaningful connections with people who share your interests.
                </p>
                <Link to="/register" className="btn btn-outline-primary">
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
