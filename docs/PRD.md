# Product Requirement Document (PRD)
# Jiwo.AI - Mental Wellness Companion

## 1. Executive Summary

**Product Name:** Jiwo.AI  
**Version:** 1.0  
**Last Updated:** January 2025  
**Product Owner:** Jiwo.AI Team

### Vision
Jiwo.AI is a compassionate digital companion app designed to support mental wellness through AI-powered conversations, mood tracking, journaling, and professional care connections. The platform aims to make mental health support accessible, affordable, and stigma-free for Indonesian users.

### Mission
To provide a comprehensive, user-friendly mental wellness platform that combines AI technology with professional care, empowering users to take control of their mental health journey.

---

## 2. Product Overview

### 2.1 Product Description
Jiwo.AI is a Next.js-based web application that serves as a mental wellness companion. It combines AI-powered chat support, mood tracking, journaling capabilities, self-screening tools, and direct access to mental health professionals.

### 2.2 Target Audience
- **Primary:** Indonesian adults (18-45 years) seeking mental health support
- **Secondary:** Individuals experiencing stress, anxiety, or seeking personal development
- **Tertiary:** People looking for professional mental health services

### 2.3 Key Differentiators
- AI-powered companion with wellness-focused conversations
- Integrated professional care marketplace
- Affordable subscription model (starting from Rp 49,000/month)
- QRIS payment integration for Indonesian market
- Holistic approach: therapy, yoga, art therapy, nutrition
- Real-time chat with professionals
- Progressive Web App (PWA) capabilities

---

## 3. Core Features

### 3.1 Authentication & User Management
**Status:** ✅ Implemented

**Features:**
- Email/password authentication via Supabase Auth
- User profile management
- Role-based access (user/professional)
- Secure session management

**User Stories:**
- As a user, I can sign up with email and password
- As a user, I can log in securely
- As a user, I can sign out from any page
- As a professional, I have access to professional dashboard

---

### 3.2 Dashboard
**Status:** ✅ Implemented

**Features:**
- Personalized greeting with user name
- Real-time statistics:
  - Total mood entries
  - Total journal entries
  - Average mood score
  - Weekly progress
- Quick access cards to all features
- Responsive design (mobile-first)
- Dark mode support

**User Stories:**
- As a user, I can see my mental health statistics at a glance
- As a user, I can quickly navigate to any feature
- As a user, I can view my weekly progress

---

### 3.3 Mood Tracking
**Status:** ✅ Implemented

**Features:**
- 5-level emoji mood selector
- Fine-tuning slider (1-5 scale)
- Optional notes for context
- Mood history tracking
- Visual mood trends
- Timestamp for each entry

**Database Schema:**
```sql
moods (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  mood_value INTEGER (1-5),
  mood_label TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)
```

**User Stories:**
- As a user, I can log my current mood quickly
- As a user, I can add notes to explain my mood
- As a user, I can view my mood history
- As a user, I can see patterns in my emotional well-being

---

### 3.4 AI Chat Companion
**Status:** ✅ Implemented

**Features:**
- Conversational UI with message bubbles
- Typing indicators
- Persistent chat history
- Supportive AI responses
- Wellness-focused conversations
- Real-time message updates

**Database Schema:**
```sql
ai_chats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  message TEXT,
  sender TEXT ('user' | 'ai'),
  created_at TIMESTAMPTZ
)
```

**User Stories:**
- As a user, I can chat with AI for instant support
- As a user, I can view my chat history
- As a user, I receive empathetic and helpful responses
- As a user, I can access chat from floating action button

---

### 3.5 Journal
**Status:** ✅ Implemented

**Features:**
- Create, read, update, delete journal entries
- Title and content fields
- Mood tagging for entries
- Date tracking
- Search by tags
- Rich text editing support

**Database Schema:**
```sql
journals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  content TEXT,
  mood_tag TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**User Stories:**
- As a user, I can write daily journal entries
- As a user, I can tag entries with my mood
- As a user, I can edit or delete my entries
- As a user, I can search entries by tags
- As a user, I can reflect on past entries

---

### 3.6 Self-Screening
**Status:** ✅ Implemented

**Features:**
- Mental health assessment questionnaire
- Scoring system
- Results interpretation
- Recommendations based on results
- Privacy-focused (results stored securely)

**User Stories:**
- As a user, I can take a mental health assessment
- As a user, I receive personalized recommendations
- As a user, I can retake assessments to track progress

---

### 3.7 Weekly Insights
**Status:** ✅ Implemented

**Features:**
- Personalized mental health analytics
- Mood trends visualization
- Activity summary
- Progress tracking
- Actionable insights

**User Stories:**
- As a user, I can view my weekly mental health summary
- As a user, I can see trends in my mood and activities
- As a user, I receive insights to improve my well-being

---

### 3.8 Professional Care Marketplace
**Status:** ✅ Implemented

**Features:**
- Browse professionals by category:
  - Psychologists
  - Psychiatrists
  - Life Coaches
  - Nutritionists
  - Yoga Instructors
  - Art Therapists
- Professional profiles with:
  - Name, specialization, experience
  - Price per session
  - Availability status
  - Rating and reviews
- Session booking system
- Real-time chat with professionals
- Payment integration (QRIS)

**Database Schema:**
```sql
professionals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  full_name TEXT,
  specialization TEXT,
  category TEXT,
  experience_years INTEGER,
  price_per_session NUMERIC,
  bio TEXT,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ
)

bookings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  professional_id UUID REFERENCES professionals,
  session_time TIMESTAMPTZ,
  status TEXT ('pending' | 'paid' | 'completed' | 'cancelled'),
  price NUMERIC,
  payment_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)

chat_channels (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  professional_id UUID REFERENCES professionals,
  booking_id UUID REFERENCES bookings,
  status TEXT ('active' | 'closed'),
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, professional_id)
)

care_chat_messages (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES chat_channels,
  sender_id UUID REFERENCES auth.users,
  message TEXT,
  created_at TIMESTAMPTZ
)
```

**User Stories:**
- As a user, I can browse professionals by category
- As a user, I can view professional profiles
- As a user, I can book a session with a professional
- As a user, I can chat with my booked professional
- As a user, I can pay for sessions via QRIS
- As a professional, I can manage my bookings
- As a professional, I can chat with my clients

---

### 3.9 Yoga Studio
**Status:** ✅ Implemented

**Features:**
- Guided yoga video library
- Categories: Postnatal, Singing Bowl, Yoga Nidra
- Video player with controls
- Practice tracking

**User Stories:**
- As a user, I can access guided yoga videos
- As a user, I can practice yoga at my own pace
- As a user, I can track my yoga sessions

---

### 3.10 Art Therapy
**Status:** ✅ Implemented

**Features:**
- Creative expression tools
- Art therapy exercises
- Emotional healing through creativity

**User Stories:**
- As a user, I can engage in art therapy activities
- As a user, I can express emotions creatively

---

### 3.11 Payment System
**Status:** ✅ Implemented

**Features:**
- QRIS payment integration
- Subscription plans:
  - Basic: Rp 49,000/month
  - Premium: Rp 99,000/month
  - Pro: Rp 149,000/month
- Session booking payments
- Payment webhook for status updates
- Payment history

**Database Schema:**
```sql
plans (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  price NUMERIC,
  duration_days INTEGER,
  features JSONB,
  created_at TIMESTAMPTZ
)

subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  plan_id UUID REFERENCES plans,
  status TEXT ('pending' | 'active' | 'expired' | 'cancelled'),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  payment_ref TEXT,
  created_at TIMESTAMPTZ
)

payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  amount NUMERIC,
  qris_link TEXT,
  payment_type TEXT ('subscription' | 'booking'),
  ref_code TEXT UNIQUE,
  status TEXT ('pending' | 'paid' | 'failed' | 'expired'),
  metadata JSONB,
  created_at TIMESTAMPTZ
)
```

**User Stories:**
- As a user, I can subscribe to a plan
- As a user, I can pay via QRIS
- As a user, I can view my subscription status
- As a user, I can pay for professional sessions

---

## 4. Technical Requirements

### 4.1 Technology Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Payment:** QRIS integration via n8n webhook
- **Icons:** Lucide React
- **PWA:** next-pwa
- **Deployment:** Vercel (recommended)

### 4.2 Performance Requirements
- Page load time: < 3 seconds
- Time to Interactive: < 5 seconds
- Mobile-first responsive design
- Offline support via PWA
- Real-time updates (< 1 second latency)

### 4.3 Security Requirements
- Supabase Row Level Security (RLS) enabled
- Secure authentication with JWT tokens
- HTTPS only
- Environment variables for sensitive data
- Payment webhook signature verification

### 4.4 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 5. User Experience

### 5.1 Navigation
- **Mobile:** Bottom navigation bar with 4 main tabs
- **Desktop:** Collapsible sidebar menu
- **Floating Action Button:** Quick access to AI chat
- **Header:** Logo, notifications, user profile, sign out

### 5.2 Design System
- **Primary Color:** #8B6CFD (Purple)
- **Secondary Color:** #756657 (Brown)
- **Typography:** System fonts with proper hierarchy
- **Components:** shadcn/ui with custom styling
- **Dark Mode:** Full support with theme switcher

### 5.3 Accessibility
- Proper contrast ratios (WCAG AA)
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Alt text for images

---

## 6. Success Metrics

### 6.1 User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Feature usage rates
- Retention rate (Day 1, Day 7, Day 30)

### 6.2 Business Metrics
- Subscription conversion rate
- Professional booking rate
- Average revenue per user (ARPU)
- Churn rate
- Customer lifetime value (CLV)

### 6.3 Health Metrics
- Mood improvement trends
- Journal entry frequency
- Self-screening completion rate
- Professional session completion rate

---

## 7. Future Roadmap

### Phase 2 (Q2 2025)
- [ ] Group therapy sessions
- [ ] Community forums
- [ ] Meditation library
- [ ] Sleep tracking
- [ ] Habit tracking
- [ ] Push notifications
- [ ] Email reminders

### Phase 3 (Q3 2025)
- [ ] Mobile native apps (iOS/Android)
- [ ] Video call integration for sessions
- [ ] AI-powered insights and recommendations
- [ ] Gamification (badges, streaks)
- [ ] Social sharing (optional)
- [ ] Multi-language support

### Phase 4 (Q4 2025)
- [ ] Corporate wellness programs
- [ ] Insurance integration
- [ ] Prescription management
- [ ] Emergency support hotline
- [ ] Family accounts

---

## 8. Risks & Mitigation

### 8.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase downtime | High | Implement retry logic, status page |
| Payment gateway issues | High | Multiple payment options, error handling |
| Data loss | Critical | Regular backups, point-in-time recovery |
| Security breach | Critical | Regular security audits, encryption |

### 8.2 Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user adoption | High | Marketing campaigns, referral program |
| Professional shortage | Medium | Recruitment program, incentives |
| Regulatory compliance | High | Legal consultation, privacy policy |
| Competition | Medium | Unique features, better UX |

---

## 9. Compliance & Legal

### 9.1 Data Privacy
- GDPR compliance (for international users)
- Indonesian data protection laws
- User consent for data collection
- Right to data deletion
- Transparent privacy policy

### 9.2 Medical Disclaimer
- Clear disclaimer that app is not a substitute for professional medical advice
- Emergency resources provided
- Professional credentials verification

### 9.3 Terms of Service
- User responsibilities
- Professional conduct guidelines
- Payment terms
- Refund policy
- Liability limitations

---

## 10. Support & Documentation

### 10.1 User Support
- In-app help center
- FAQ section
- Email support
- AI chat for basic queries
- Professional support for premium users

### 10.2 Professional Support
- Onboarding guide
- Dashboard tutorial
- Payment processing guide
- Best practices documentation

---

## Appendix

### A. Glossary
- **PWA:** Progressive Web App
- **RLS:** Row Level Security
- **QRIS:** Quick Response Code Indonesian Standard
- **DAU:** Daily Active Users
- **MAU:** Monthly Active Users

### B. References
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com

### C. Change Log
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial PRD creation |
