# Search API Test Documentation

## Search Endpoint
`GET /api/users/search?skill=keyword`

### Test the search endpoint with curl:

```bash
# Basic skill search
curl "http://localhost:5000/api/users/search?skill=JavaScript"

# Search with location filter
curl "http://localhost:5000/api/users/search?skill=Python&location=New York"

# Search with availability filter
curl "http://localhost:5000/api/users/search?skill=React&availability=available"

# Combined filters
curl "http://localhost:5000/api/users/search?skill=Photography&location=California&availability=available"
```

### Expected Response Format:
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "location": "New York, NY",
      "profilePhoto": null,
      "skillsOffered": ["JavaScript", "React", "Node.js"],
      "skillsWanted": ["Python", "Machine Learning"],
      "availability": "available",
      "isPublic": true,
      "role": "user",
      "createdAt": "2021-06-21T17:16:47.000Z",
      "updatedAt": "2021-06-21T17:16:47.000Z"
    }
  ],
  "searchTerm": "JavaScript"
}
```

### Search Features:
- **Case-insensitive** search
- **Partial matches** (uses regex)
- Searches both **skillsOffered** and **skillsWanted** arrays
- Only returns **public profiles** (isPublic: true)
- Optional **location** and **availability** filters
- Results limited to **50 users**
- Sorted by **creation date** (newest first)
