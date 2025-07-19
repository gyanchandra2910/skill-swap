# Rating System Fix - Manual Instructions

## Problem
The rating/feedback system only shows up for "completed" swaps, but users expect to be able to rate after accepting a swap or marking sessions as completed.

## Solution
Update the Dashboard.js file to show feedback buttons for both "accepted" AND "completed" swap statuses.

## Files to Modify
- `client/src/components/Dashboard.js`

## Changes Required

### Change 1: Incoming Requests Section (around line 654)

**Find this line:**
```javascript
{request.status === 'completed' && !feedbackData[request._id] && (
```

**Replace with:**
```javascript
{(request.status === 'accepted' || request.status === 'completed') && !feedbackData[request._id] && (
```

**Find this line:**
```javascript
{request.status === 'completed' && feedbackData[request._id] && (
```

**Replace with:**
```javascript
{(request.status === 'accepted' || request.status === 'completed') && feedbackData[request._id] && (
```

### Change 2: Outgoing Requests Section (around line 888)

**Find this line:**
```javascript
{request.status === 'completed' && !feedbackData[request._id] && (
```

**Replace with:**
```javascript
{(request.status === 'accepted' || request.status === 'completed') && !feedbackData[request._id] && (
```

**Find this line:**
```javascript
{request.status === 'completed' && feedbackData[request._id] && (
```

**Replace with:**
```javascript
{(request.status === 'accepted' || request.status === 'completed') && feedbackData[request._id] && (
```

## Backend Changes (Already Applied)
The backend has been updated to accept feedback for both "accepted" and "completed" swaps in:
- `routes/feedback.js` - API now accepts both status types

## Testing the Fix

1. **Create two test users:**
   - User A: john@test.com
   - User B: jane@test.com

2. **Test workflow:**
   - User A sends a swap request to User B
   - User B accepts the request
   - **Both users should now see "Rate Experience" button**
   - Users can mark sessions as completed
   - **Rating button should remain available**

3. **Expected behavior:**
   - Rating button appears immediately after swap acceptance
   - Rating button remains available when session is marked complete
   - Users can leave feedback at any point after acceptance

## Verification
After making these changes:
- Restart the React development server (`npm start`)
- Test the rating system with the workflow above
- The "Rate Experience" button should now appear for accepted swaps

## Additional Notes
- This fix makes the rating system more user-friendly
- Users don't have to wait for both parties to mark sessions as "completed"
- Feedback can be left as soon as a swap is accepted
- The system maintains all existing functionality while improving UX
