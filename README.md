# 🔄 Skill Swap Platform

> A modern skill-sharing platform that connects learners and teachers in a collaborative environment.

[![Demo Video](https://img.shields.io/badge/📹_Watch-Demo_Video-red?style=for-the-badge)](https://drive.google.com/file/d/1ZrbwHnbE2PCQbaM5K3bSm3okegG80Lad/view?usp=sharing)
[![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-green?style=for-the-badge)](https://skill-swap-production.up.railway.app/)
[![MongoDB Atlas](https://img.shields.io/badge/🍃_Database-MongoDB_Atlas-green?style=for-the-badge)](#)

---

## 🎥 Demo Video & Live Platform

**🚀 Try the Live Platform:** [https://skill-swap-production.up.railway.app/](https://skill-swap-production.up.railway.app/)

**Watch our platform in action!** 
👉 [**View Demo Video**](https://drive.google.com/file/d/1ZrbwHnbE2PCQbaM5K3bSm3okegG80Lad/view?usp=sharing)

The demo showcases:
- ✅ User registration and authentication
- ✅ Profile management and skill listing
- ✅ Real-time swap request system
- ✅ Admin dashboard functionality
- ✅ Feedback and rating system

## ✨ Features

- 🔐 **User Authentication**: Secure registration and login with JWT
- 🎯 **Skill Management**: List skills you can teach and skills you want to learn
- 🤝 **Swap Requests**: Send and receive skill exchange requests
- 🔔 **Real-time Notifications**: Get notified of new requests and messages via Socket.io
- ⭐ **Feedback System**: Rate and review completed skill exchanges
- 👤 **User Profiles**: Manage your skills, availability, and preferences
- 🛡️ **Admin Dashboard**: Complete administrative control and monitoring
- 📱 **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React.js** - User interface library
- 🎨 **Bootstrap** - CSS framework for responsive design
- 🔌 **Socket.io Client** - Real-time communication
- 📡 **Axios** - HTTP client for API calls

### Backend
- 🟢 **Node.js** - Runtime environment
- 🚀 **Express.js** - Web application framework
- 🍃 **MongoDB Atlas** - Cloud NoSQL database
- 🔌 **Socket.io** - Real-time bidirectional communication
- 🔐 **JWT** - JSON Web Tokens for authentication
- 🔒 **Bcrypt** - Password hashing

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gyanchandra2910/skill-swap.git
   cd skill-swap
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the application**
   ```bash
   # Start both server and client concurrently
   npm run dev-full
   
   # Or start them separately:
   npm run dev        # Server only (http://localhost:5000)
   npm run client     # Client only (http://localhost:3000)
   ```

7. **Access the application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:5000
   - 👑 **Admin Dashboard**: http://localhost:3000/admin
   - 🚀 **Live Production**: https://skill-swap-production.up.railway.app/

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | 🚀 Start production server |
| `npm run dev` | 🔧 Start development server with nodemon |
| `npm run client` | ⚛️ Start React client only |
| `npm run dev-full` | 🔄 Start both server and client concurrently |
| `npm test` | 🧪 Run test suite |
| `npm run build` | 📦 Build for production |

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/public` - Get all public users

### Swap Requests
- `GET /api/swaps` - Get all swap requests
- `POST /api/swaps` - Create new swap request
- `PUT /api/swaps/:id` - Update swap request status
- `DELETE /api/swaps/:id` - Delete swap request

### Feedback System
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:userId` - Get user feedback

### Admin Routes
- `GET /api/admin/stats` - Get platform statistics
- `POST /api/admin/ban/:userId` - Ban/unban user

---

## 📖 Detailed Features

### 👤 User Profile Management
- 📝 **Basic Information**: Name, location (optional), profile photo (optional)
- 🎯 **Skills Offered**: Comprehensive list of skills users can teach
- 📚 **Skills Wanted**: List of skills users want to learn  
- ⏰ **Availability**: Flexible scheduling (weekends, evenings, custom times)
- 🔒 **Privacy Controls**: Users can make their profile public or private
- ✨ **Profile Customization**: Rich profiles with experience levels and descriptions

### 🔍 Discovery & Search
- 👥 **Browse Users**: Explore community members and their skills
- 🔎 **Advanced Search**: Find users by specific skills (e.g., "Photoshop", "Excel", "Guitar")
- 🎚️ **Filter Options**: Search by location, availability, skill level, and ratings
- 📂 **Skill Categories**: Organized skill browsing for better discovery

### 🤝 Swap Request Management
- 📨 **Send Requests**: Initiate skill swap requests with other users
- ✅ **Accept/Reject**: Respond to incoming swap offers
- 📊 **Request Tracking**: Monitor current and pending swap requests
- 🗑️ **Request Deletion**: Users can delete swap requests if not accepted
- 🔔 **Status Updates**: Real-time notifications for request status changes

### ⭐ Feedback & Rating System
- 📝 **Post-Swap Reviews**: Rate and review experiences after skill swaps
- 📈 **Rating Display**: View user ratings and feedback history
- 🛡️ **Quality Assurance**: Helps maintain platform quality and trust
- 💭 **Detailed Feedback**: Written reviews with star ratings

### 🔧 Administrative Features
- 🛡️ **Content Moderation**: Reject inappropriate or spammy skill descriptions
- 👥 **User Management**: Ban users who violate platform policies
- 📊 **Swap Monitoring**: Monitor pending, accepted, or cancelled swaps
- 📢 **Platform Communication**: Send platform-wide messages (feature updates, alerts)
- 📈 **Analytics & Reporting**: Download reports of user activity, feedback logs, and swap statistics
- 📧 **Email Configuration**: Test and manage email notification systems

### 🖥️ Technical Features
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Real-time Notifications**: Instant updates for messages, bookings, and feedback
- 🔐 **Secure Authentication**: JWT-based authentication with password encryption
- 👑 **Admin Dashboard**: Complete administrative control and user management
- 📧 **Email Notifications**: Automated email system for important updates
- 📱 **Progressive Web App**: Installable web app with offline capabilities

---

##  Usage Guide

### 👨‍🎓 For Learners
1. 📝 **Sign up** and complete your profile
2. 🔍 **Browse skills** or search for specific topics
3. 💬 **Connect with teachers** through the swap request system
4. 📅 **Schedule sessions** and start learning
5. ⭐ **Leave feedback** to help the community

### 👨‍🏫 For Teachers
1. 📋 **Create your profile** highlighting your skills and experience
2. ⏰ **Set your availability** and teaching preferences
3. 📨 **Respond to learner requests** and schedule sessions
4. 🎓 **Share knowledge** and build your reputation
5. 🏆 **Earn recognition** through positive feedback

### 👑 For Admins
1. 🔧 Access the admin dashboard at `/admin`
2. 👥 Manage users, skills, and reported content
3. 📊 Monitor platform analytics and usage
4. ⚙️ Configure system settings and notifications

##  Documentation

📚 **For comprehensive setup and usage information, see the sections above.**

The README contains all essential information for:
- Installation and setup
- API reference
- Usage guidelines
- Technical details

### 🔗 Key API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/users/profile` - User profile management
- `POST /api/skills` - Skill creation and management
- `GET /api/messages` - Messaging system
- `POST /api/feedback` - Feedback and ratings

## 🔧 Configuration

### Email Setup
Configure email notifications by setting up your Gmail App Password and updating the environment variables as shown in the setup section above.

### Production Deployment
For production deployment:
1. Set up your MongoDB Atlas database
2. Configure environment variables for production
3. Deploy to your preferred platform (Railway, Heroku, Vercel, etc.)
4. Update CORS settings and CLIENT_URL for your domain

### Real-time Features
Real-time notifications are powered by Socket.io and work automatically once the server is running.

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

Please read our contributing guidelines in the main sections above for more details.

## 📋 Project Status

✅ **Production Ready** - The platform is stable and ready for deployment.

## 👥 Team

- **Team Lead**: Dristi Singh
- **Developer**: Gyan Chandra  
- **Developer**: Kumari Tannu

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Help

### 🔗 Getting Help
-  **Issues**: [GitHub Issues](https://github.com/gyanchandra2910/skill-swap/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/gyanchandra2910/skill-swap/discussions)
- 📹 **Demo Video**: [Watch Here](https://drive.google.com/file/d/1ZrbwHnbE2PCQbaM5K3bSm3okegG80Lad/view?usp=sharing)
- 🚀 **Live Demo**: [Try it Now](https://skill-swap-production.up.railway.app/)

### ❓ Frequently Asked Questions

**Q: How do I reset my password?**
A: Use the "Forgot Password" link on the login page to receive a reset email.

**Q: Can I teach multiple skills?**
A: Yes! Add as many skills as you'd like to your profile.

**Q: Is the platform free to use?**
A: Yes, Skill Swap is completely free for all users.

**Q: How do I report inappropriate content?**
A: Use the report button on user profiles or contact our admin team directly.

**Q: Can I use this with MongoDB Atlas?**
A: Yes! The platform is fully configured to work with MongoDB Atlas cloud database.

---

<div align="center">

**🚀 Built with ❤️ by the Skill Swap Team**

*Empowering communities through knowledge sharing*

[![GitHub stars](https://img.shields.io/github/stars/gyanchandra2910/skill-swap?style=social)](https://github.com/gyanchandra2910/skill-swap)
[![GitHub forks](https://img.shields.io/github/forks/gyanchandra2910/skill-swap?style=social)](https://github.com/gyanchandra2910/skill-swap)

[⬆️ Back to Top](#-skill-swap-platform)

</div>