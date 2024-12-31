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
