Game Database Integration Summary


Objective
We're building a game database feature that:
1. Allows users to search for games (via IGDB data)
Stores game data in WordPress for persistence
Displays game details in a consistent format
Core Flow

graph LR
    A[User Search] --> B[IGDB API]
    B --> C[Store in WordPress]
    C --> D[Display Game Page]
    D --> E[Fallback to IGDB]


    Key Files & Their Roles
Frontend Components
1. app/components/GameSearch.tsx
Search interface
Handles IGDB API calls
Triggers game storage
app/components/GameDetails.tsx
Displays game information
Handles screenshots, videos
Responsive layout
app/game/[slug]/page.tsx
Dynamic route for game pages
Handles WordPress/IGDB fallback
Generates metadata
API & Data Layer
app/lib/igdb-client.ts
IGDB API client
Data transformation
Image URL handling
app/lib/queries/gameQueries.ts
GraphQL queries for WordPress
CREATE_GAME mutation
GET_GAME query
app/api/games/create/route.ts
API route for game storage
WordPress post creation
Slug generation
Types & Interfaces
app/types/igdb.ts
Game data structure
Platform types
API response types
Current Issues
CORS configuration needs fixing
WordPress storage structure could be improved (custom post type vs regular posts)
Need proper error handling and fallback strategies




Let me break down what we're trying to achieve and what's currently happening:
Goal:
User searches for a game using the GameSearch component
2. When they click on a game, we want to:
Create a WordPress post with the game details
Store it in our WordPress backend
Redirect user to the new game page
Current Flow:
User searches game ✅ (Working)
IGDB API returns results ✅ (Working)
User clicks on a game ✅ (Working)
4. Frontend makes POST request to /api/games/create ✅ (Working)
Our API route tries to create WordPress post ❌ (Failing)
Error: "Sorry, you are not allowed to create posts"
Why It's Failing:
The WordPress GraphQL mutation requires authentication
Even though we have WP_USERNAME and WP_APP_PASSWORD in our environment
The authentication isn't being properly passed through to WordPress
Expected Behavior:
graph LR
    A[User Clicks Game] --> B[API Route]
    B --> C[WordPress Authentication]
    C --> D[Create Post]
    D --> E[Return Slug]
    E --> F[Redirect to Game Page]