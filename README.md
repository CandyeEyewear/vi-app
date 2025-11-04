# VIbe - Volunteer Social App

A social networking application for volunteers, similar to Yammer, built with React Native and Expo.

## Features

- **Authentication**: Login and registration with persistent sessions
- **Social Feed**: Share posts, images, like and comment on updates
- **Messaging**: Direct messaging with other volunteers
- **Events**: Browse and sign up for volunteer opportunities
- **Profile Management**: Customize your volunteer profile
- **Settings**: Configure notifications and app preferences

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **AsyncStorage** for local data persistence
- **React Query** for data management
- **Lucide React Native** for icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vi-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
vi-app/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Feed screen
│   │   ├── messages.tsx   # Messages screen
│   │   ├── events.tsx     # Events screen
│   │   └── profile.tsx    # Profile screen
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   ├── edit-profile.tsx   # Profile editing
│   └── settings.tsx       # Settings screen
├── contexts/              # React contexts for state management
│   ├── AuthContext.tsx    # Authentication state
│   ├── FeedContext.tsx    # Social feed state
│   └── MessagingContext.tsx # Messaging state
├── types/                 # TypeScript type definitions
│   └── index.ts
├── constants/             # App constants
│   └── colors.ts          # Color scheme definitions
├── mocks/                 # Mock data for development
│   ├── userProfile.ts
│   ├── posts.ts
│   ├── events.ts
│   └── conversations.ts
└── package.json
```

## Key Features Details

### Authentication
- Email/password login
- User registration with profile details
- Persistent authentication using AsyncStorage
- Profile editing capabilities

### Social Feed
- Create posts with text and images
- Like and comment on posts
- Real-time timestamp formatting
- Image picker integration

### Messaging
- One-on-one conversations
- Unread message indicators
- Real-time message updates
- Search conversations

### Events
- Browse volunteer opportunities
- Filter by category (Education, Environment, Health, Poor Relief)
- Sign up/cancel registrations
- View available spots

### Profile
- View volunteer statistics
- Edit profile information
- Upload profile picture
- Track achievements

## Development

The app uses Expo's file-based routing system. Each file in the `app` directory becomes a route automatically.

### Adding New Features

1. Create new screen files in the `app` directory
2. Add types to `types/index.ts` if needed
3. Create context providers in `contexts` for state management
4. Add mock data in `mocks` for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
