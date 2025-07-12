# Skill Swap - Learn & Teach Skills Through Community Exchange

![Skill Swap Logo](client/public/favicon.jpg)

**Skill Swap** is a modern, community-driven platform that connects learners and teachers in a collaborative skill-sharing environment. Whether you're looking to master a new skill or share your expertise with others, Skill Swap makes it easy to connect with like-minded individuals in your community.

## 📋 Project Overview

**Skill Swap Platform** is a mini application that enables users to list their skills and request others in return. This platform facilitates skill exchange within communities, allowing users to teach what they know and learn what they need.

### 🎯 Problem Statement
Develop a comprehensive skill-sharing platform where users can:
- List skills they can offer to others
- Request skills they want to learn
- Connect with community members for mutual skill exchange
- Manage swap requests and provide feedback
- Maintain profiles with availability and preferences

### 📐 Design Mockup
View the original design mockup: [Excalidraw Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/8bM86GXnnUN)

## 🎬 Demo Video

*Demo video coming soon...*

<!-- ![Demo Video Thumbnail](demo-thumbnail.jpg) -->
<!-- [Watch the Demo Video](https://youtu.be/your-video-id) -->

## ✨ Features

### 👤 User Profile Management
- **Basic Information**: Name, location (optional), profile photo (optional)
- **Skills Offered**: Comprehensive list of skills users can teach
- **Skills Wanted**: List of skills users want to learn
- **Availability**: Flexible scheduling (weekends, evenings, custom times)
- **Privacy Controls**: Users can make their profile public or private
- **Profile Customization**: Rich profiles with experience levels and descriptions

### 🔍 Discovery & Search
- **Browse Users**: Explore community members and their skills
- **Advanced Search**: Find users by specific skills (e.g., "Photoshop", "Excel", "Guitar")
- **Filter Options**: Search by location, availability, skill level, and ratings
- **Skill Categories**: Organized skill browsing for better discovery

### 🤝 Swap Request Management
- **Send Requests**: Initiate skill swap requests with other users
- **Accept/Reject**: Respond to incoming swap offers
- **Request Tracking**: Monitor current and pending swap requests
- **Request Deletion**: Users can delete swap requests if not accepted
- **Status Updates**: Real-time notifications for request status changes

### ⭐ Feedback & Rating System
- **Post-Swap Reviews**: Rate and review experiences after skill swaps
- **Rating Display**: View user ratings and feedback history
- **Quality Assurance**: Helps maintain platform quality and trust
- **Detailed Feedback**: Written reviews with star ratings

### 🔧 Administrative Features
- **Content Moderation**: Reject inappropriate or spammy skill descriptions
- **User Management**: Ban users who violate platform policies
- **Swap Monitoring**: Monitor pending, accepted, or cancelled swaps
- **Platform Communication**: Send platform-wide messages (feature updates, alerts)
- **Analytics & Reporting**: Download reports of user activity, feedback logs, and swap statistics
- **Email Configuration**: Test and manage email notification systems

### 🖥️ Technical Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Instant updates for messages, bookings, and feedback
- **Secure Authentication**: JWT-based authentication with password encryption
- **Admin Dashboard**: Complete administrative control and user management
- **Email Notifications**: Automated email system for important updates
- **Progressive Web App**: Installable web app with offline capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skill-swap.git
   cd skill-swap
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=http://localhost:3000
   ```

4. **Set up admin user**
   ```bash
   node setup-admin.js
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📱 Usage

### For Learners
1. **Sign up** and complete your profile
2. **Browse skills** or search for specific topics
3. **Connect with teachers** through the messaging system
4. **Book sessions** and start learning
5. **Leave feedback** to help the community

### For Teachers
1. **Create your profile** highlighting your skills and experience
2. **Set your availability** and teaching preferences
3. **Respond to learner requests** and schedule sessions
4. **Share knowledge** and build your reputation
5. **Earn recognition** through positive feedback

### For Admins
1. Access the admin dashboard at `/admin`
2. Manage users, skills, and reported content
3. Monitor platform analytics and usage
4. Configure system settings and notifications

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface library
- **Material-UI** - Modern component library
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Navigation and routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending

### DevOps & Tools
- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📖 API Documentation

For detailed API documentation, see [API_DOCS.md](API_DOCS.md).

Key endpoints include:
- `POST /api/auth/login` - User authentication
- `GET /api/users/profile` - User profile management
- `POST /api/skills` - Skill creation and management
- `GET /api/messages` - Messaging system
- `POST /api/feedback` - Feedback and ratings

## 🔧 Configuration

### Email Setup
Configure email notifications by following the [Email Setup Guide](EMAIL_SETUP_GUIDE.md).

### Production Deployment
For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Real-time Features
Learn about setting up real-time notifications in [REALTIME_NOTIFICATIONS_GUIDE.md](REALTIME_NOTIFICATIONS_GUIDE.md).

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📋 Project Status

✅ **Production Ready** - The platform is stable and ready for deployment.

See [PRODUCTION-READY.md](PRODUCTION-READY.md) for deployment checklist and production considerations.

## 👥 Team

- **Team Lead**: Dristi Singh
- **Developer**: Gyan Chandra  
- **Developer**: Kumari Tannu

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📧 Email: support@skillswap.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/skill-swap/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/skill-swap/discussions)

### Frequently Asked Questions

**Q: How do I reset my password?**
A: Use the "Forgot Password" link on the login page to receive a reset email.

**Q: Can I teach multiple skills?**
A: Yes! Add as many skills as you'd like to your profile.

**Q: Is the platform free to use?**
A: Yes, Skill Swap is completely free for all users.

**Q: How do I report inappropriate content?**
A: Use the report button on user profiles or contact our admin team directly.

---

**Built with ❤️ by the Skill Swap Team**

*Empowering communities through knowledge sharing*