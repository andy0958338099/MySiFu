# API Endpoints Documentation

## Overview

This document outlines the API endpoints for TechFix. All endpoints are implemented using Supabase's API functionality and follow RESTful principles.

## Authentication Endpoints

### User Management
```
POST /auth/signup
- Register new user
- Body: { email, password, full_name }

POST /auth/login
- User login
- Body: { email, password }

POST /auth/logout
- User logout
- Headers: Authorization

POST /auth/reset-password
- Password reset request
- Body: { email }

PUT /auth/profile
- Update user profile
- Headers: Authorization
- Body: { full_name, avatar_url, language_preference }
```

## Expert Marketplace

### Expert Profiles
```
POST /experts/profiles
- Create expert profile
- Headers: Authorization
- Body: { expertise_areas, hourly_rate, availability_schedule }

GET /experts/profiles
- List expert profiles
- Query: { category, expertise, rating_min, availability }

GET /experts/profiles/:id
- Get expert profile details
- Params: expert_id

PUT /experts/profiles/:id
- Update expert profile
- Headers: Authorization
- Body: { expertise_areas, hourly_rate, availability_schedule }
```

### Consultations
```
POST /consultations
- Book consultation
- Headers: Authorization
- Body: { expert_id, issue_id, scheduled_time }

GET /consultations
- List user consultations
- Headers: Authorization
- Query: { status, date_range }

GET /consultations/:id
- Get consultation details
- Headers: Authorization
- Params: consultation_id

PUT /consultations/:id
- Update consultation status
- Headers: Authorization
- Body: { status }
```

## Video Content

### Tutorial Videos
```
POST /videos/tutorials
- Upload tutorial video
- Headers: Authorization
- Body: { title, description, video_file, category, tags }

GET /videos/tutorials
- List tutorial videos
- Query: { category, tags, sort_by }

GET /videos/tutorials/:id
- Get tutorial video details
- Params: video_id

POST /videos/tutorials/:id/interactions
- Record video interaction
- Headers: Authorization
- Body: { interaction_type }
```

### Support Issues
```
POST /issues
- Create support issue
- Headers: Authorization
- Body: { title, description, video_url, category, tags }

GET /issues
- List support issues
- Query: { status, category, tags }

GET /issues/:id
- Get issue details
- Headers: Authorization
- Params: issue_id

PUT /issues/:id
- Update issue status
- Headers: Authorization
- Body: { status }
```

## Communication

### Chat
```
POST /chat/messages
- Send chat message
- Headers: Authorization
- Body: { consultation_id, content, type }

GET /chat/messages/:consultation_id
- Get chat history
- Headers: Authorization
- Query: { limit, offset }

POST /chat/attachments
- Upload chat attachment
- Headers: Authorization
- Body: { consultation_id, file }
```

### Video Calls
```
POST /calls/initiate
- Start video call
- Headers: Authorization
- Body: { consultation_id }

POST /calls/end
- End video call
- Headers: Authorization
- Body: { call_id }

POST /calls/recording
- Toggle call recording
- Headers: Authorization
- Body: { call_id, action }
```

## Payments

### Transaction Management
```
POST /payments/intent
- Create payment intent
- Headers: Authorization
- Body: { amount, currency, consultation_id }

POST /payments/confirm
- Confirm payment
- Headers: Authorization
- Body: { payment_intent_id }

GET /payments/history
- Get payment history
- Headers: Authorization
- Query: { date_range, status }
```

### Expert Payouts
```
POST /payments/payouts
- Request payout
- Headers: Authorization
- Body: { amount }

GET /payments/earnings
- Get earnings summary
- Headers: Authorization
- Query: { date_range }
```

## Reviews and Ratings

### User Reviews
```
POST /reviews
- Create review
- Headers: Authorization
- Body: { consultation_id, rating, comment }

GET /reviews/expert/:expert_id
- Get expert reviews
- Query: { sort_by, limit }

GET /reviews/user
- Get user's reviews
- Headers: Authorization
- Query: { type }
```

## Notifications

### Push Notifications
```
POST /notifications/register
- Register device for push notifications
- Headers: Authorization
- Body: { device_token, platform }

GET /notifications
- Get user notifications
- Headers: Authorization
- Query: { read_status, limit }

PUT /notifications/:id
- Mark notification as read
- Headers: Authorization
```

## Response Formats

### Success Response
```json
{
    "status": "success",
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "status": "error",
    "error": {
        "code": "ERROR_CODE",
        "message": "Error description"
    }
}
```

## Rate Limiting

- Standard rate limit: 100 requests per minute
- File upload rate limit: 10 requests per minute
- Video streaming rate limit: 1000 requests per hour

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Versioning

API version is specified in the URL:
```
https://api.techfix.app/v1/endpoint
```

This API documentation serves as a reference for frontend development and third-party integrations. Regular updates will be made to reflect new features and improvements.
