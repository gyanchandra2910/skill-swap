# Admin Email System Setup Guide

## Overview

The Skill Swap platform now includes a comprehensive email system for admin communications. This system automatically sends emails for various admin actions and provides manual email capabilities.

## Email Configuration

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - App passwords → Generate password for "Mail"
   - Copy the generated 16-character password

3. **Update .env file**:
   ```env
   EMAIL_USER=your-admin-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_SERVICE=gmail
   ```

### 2. Other Email Providers

#### Outlook/Hotmail:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=outlook
```

#### Yahoo:
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=yahoo
```

#### Custom SMTP:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Email Features

### 1. Automatic Emails

#### User Account Banned
- **Trigger**: When admin bans a user
- **Recipient**: Banned user
- **Content**: Professional notification with ban reason and contact info

#### User Account Unbanned
- **Trigger**: When admin unbans a user  
- **Recipient**: Unbanned user
- **Content**: Welcome back message with login link

#### Admin Promotion
- **Trigger**: When user is promoted to admin
- **Recipient**: New admin
- **Content**: Welcome message with admin responsibilities and dashboard link

### 2. Manual Email Features

#### Platform Reports
- **Purpose**: Send platform statistics to all admins
- **Content**: User stats, swap stats, ratings, etc.
- **Frequency**: Can be sent weekly, monthly, or on-demand

#### Test Email
- **Purpose**: Verify email configuration is working
- **Recipient**: Requesting admin
- **Content**: Test notification

## API Endpoints

### Ban/Unban User (with email)
```
PUT /api/admin/users/:id/ban
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "ban": true,
  "reason": "Violation of community guidelines"
}
```

### Promote User to Admin (with email)
```
PUT /api/admin/users/:id/promote
Authorization: Bearer {admin_token}
```

### Send Platform Report
```
POST /api/admin/send-report
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "period": "Weekly"
}
```

### Test Email Configuration
```
POST /api/admin/test-email
Authorization: Bearer {admin_token}
```

## Admin Dashboard Integration

The admin dashboard should include:

1. **Email Status Indicator**
   - Shows if email is configured and working
   - Test email button

2. **User Management Actions**
   - Ban/Unban with email notification
   - Promote to admin with email notification

3. **Reporting Features**
   - Send platform reports to all admins
   - Schedule automatic reports

4. **Email History**
   - Log of sent emails (optional feature)

## Setting Up First Admin

### Method 1: Direct Database
```javascript
// Connect to MongoDB and update user role
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Script
Create `setup-admin.js`:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/skill-swap');

async function setupAdmin() {
  const adminEmail = 'your-email@gmail.com';
  
  await User.updateOne(
    { email: adminEmail },
    { $set: { role: 'admin' } }
  );
  
  console.log(`Admin role granted to ${adminEmail}`);
  process.exit(0);
}

setupAdmin();
```

## Email Templates

All emails use responsive HTML templates with:
- Professional styling
- Platform branding
- Clear call-to-action buttons
- Contact information
- Mobile-friendly design

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check email/password in .env
   - Ensure app password is used (not regular password)
   - Verify 2FA is enabled

2. **"Connection refused"**
   - Check internet connection
   - Verify email service settings
   - Try different SMTP port (587, 465, 25)

3. **Emails go to spam**
   - Use professional email address
   - Set up SPF/DKIM records (for custom domains)
   - Ask recipients to whitelist your email

### Testing:
1. Use `/api/admin/test-email` endpoint
2. Check server logs for email errors
3. Verify .env configuration
4. Test with different email providers

## Security Considerations

1. **Never commit .env file** to version control
2. **Use app passwords** instead of regular passwords
3. **Rotate email passwords** regularly
4. **Monitor email usage** for suspicious activity
5. **Limit admin email access** to trusted team members

## Production Deployment

For production environments:
1. Use environment variables instead of .env file
2. Consider professional email services (SendGrid, AWS SES, etc.)
3. Set up email monitoring and alerts
4. Implement email rate limiting
5. Add email logging and analytics
