# Website Architecture Overview

This document provides an overview of the FinalBoss.io website architecture, focusing on its main components, directory structure, and user/data flows.

## 1. Core Technologies

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, with some global CSS (`app/globals.css`) and component-specific styles (e.g., `app/styles/article.css`).
*   **Data Fetching (GraphQL)**: Apollo Client
*   **Animations**: Framer Motion
*   **Deployment**: Vercel

## 2. Project Structure (Key Directories & Files)

The project uses the Next.js App Router, meaning the `app` directory is central to routing and UI.

*   **`app/`**: Root directory for application routes, components, and logic.
    *   **`layout.tsx`**: The root layout component. It wraps all pages, defines the main HTML structure, includes global styles, fonts (Inter), analytics (Google Analytics, Vercel Analytics & Speed Insights), and context providers (e.g., `SearchProvider`).
    *   **`page.tsx`**: The homepage of the website. It fetches data using `getHomePageData` and displays various sections like `FeaturedSlider`, `LatestArticles`, `ReviewsSlider`, `ContentSections`, and `GameDatabaseSection`, mostly using `next/dynamic` for lazy loading and `Suspense` for loading states.
    *   **`globals.css`**: Global styles applied throughout the application.
    *   **`[slug]/page.tsx`**: Dynamic route handler for individual content pages (e.g., articles, guides, reviews if they follow this slug pattern). It fetches data for a specific post by its slug using `GET_POST_BY_SLUG` and uses the `ArticleContent` component to display it. It also handles metadata generation (`generateMetadata`) and includes structured data (JSON-LD) for SEO.
    *   **`articles/page.tsx`**: Page for listing all articles. It fetches an initial set of articles using `GET_ALL_POSTS` and passes them to the `AllArticlesPageContent` component, which handles pagination/infinite scroll.
    *   **`search/page.tsx`**: The search results page. It uses `useSearchParams` to get the query, fetches results via `SEARCH_POSTS` GraphQL query, and displays them. It includes debouncing for the search input and a "load more" functionality. It's wrapped in a `<Suspense>` boundary.
    *   **`api/`**: Contains API route handlers.
        *   `api/wordpress-proxy/route.ts`: A proxy for the WordPress GraphQL backend, used to mitigate CORS issues in local development.
        *   `api/debug/route.ts`: A simple route for debugging environment variables.
    *   **`components/`**: Contains reusable React components.
        *   `Header.tsx`: The main site navigation header. Includes the logo, a mega menu, and a search button that triggers a search overlay.
        *   `Footer.tsx`: The site footer. Includes quick links, category links, social media icons, and copyright information.
        *   `Article/ArticleContent.tsx`: Component responsible for displaying the main content of an article, including the title, author, date, and the processed HTML content.
        *   `AllArticles/AllArticlesPageContent.tsx`: Renders the grid of articles on the `/articles` page, including "Load More" functionality.
        *   `Search/SearchOverlay.tsx`: A full-screen overlay for search input and quick results.
        *   `Search/SearchContext.tsx`: Manages the state for the search overlay.
        *   Many other presentational and functional components (e.g., `FeaturedSlider.tsx`, `LatestArticles.tsx`, `Loader.tsx`, etc.).
    *   **`lib/`**: Contains library code, utilities, and configurations.
        *   `apolloClient.ts`: Configuration for the Apollo Client, setting up the link to the GraphQL endpoint (WordPress backend, using the proxy in development).
        *   `queries/`: Directory containing GraphQL query definitions (e.g., `getHomePageData.ts`, `getLatestPosts.ts`, `searchPosts.ts`, `getAllPosts.ts`, `getPostBySlug.ts`).
    *   **`public/`**: Static assets like images (e.g., `finalboss.png`, favicons) and `robots.txt` (via `robots.ts`).
    *   **`styles/`**: Contains additional global or component-specific CSS files (e.g., `article.css`).
    *   **`types/`**: Contains TypeScript type definitions (e.g., `search.ts` for search results, `index.ts` for common post types).
    *   **`utils/`**: Utility functions (e.g., `placeholder.ts` for placeholder image data).
    *   Other route directories: `gaming/`, `guides/`, `reviews/`, `technology/`, `game/`, `games/`, `videos/` which likely serve as landing/listing pages for those specific content categories. Their structure usually involves a `page.tsx` for the listing and potentially a `[slug]/page.tsx` for individual items if not handled by the main `app/[slug]/page.tsx`.
    *   Static content pages: `terms-of-service/`, `privacy-policy/`, `contact/`, `write-for-us/`, `about/`, `features/`.

*   **`next.config.js`**: Configuration file for Next.js. Includes image optimization settings (`remotePatterns`), experimental features, ESLint configuration, header modifications (e.g., CSP), webpack customizations, redirects, and rewrites.
*   **`codegen.ts`**: Configuration for GraphQL Code Generator, used to generate TypeScript types from GraphQL schema and operations.
*   **`package.json`**: Lists project dependencies, scripts (e.g., `dev`, `build`, `codegen`).
*   **`tsconfig.json`**: TypeScript compiler options.

## 3. Main User Flows & Data Flows

### 3.1. Homepage Visit

1.  **User Action**: Visits `/` (the homepage).
2.  **Routing**: `app/page.tsx` handles the request.
3.  **Data Fetching**:
    *   `getHomePageData` (server-side) is called, which likely fetches data for featured posts, latest posts, etc., from the WordPress GraphQL backend via Apollo Client.
4.  **Rendering**:
    *   `app/layout.tsx` provides the basic HTML structure, header, and footer.
    *   `app/page.tsx` renders:
        *   `<Header />`
        *   `<FeaturedSlider />` (likely with `featuredPosts` data)
        *   `<LatestArticles />` (fetches its own data using `GET_LATEST_POSTS`)
        *   Other sections like `<ReviewsSlider />`, `<ContentSections />`, `<GameDatabaseSection />`, `<NewsletterForm />` (many are dynamically loaded with Suspense).
        *   `<Footer />`
5.  **Display**: The homepage is displayed with various content sections.

### 3.2. Viewing an Article

1.  **User Action**: Clicks on an article link (e.g., from the homepage or an articles list). The URL will be `/article-slug`.
2.  **Routing**: `app/[slug]/page.tsx` handles the request, where `slug` is the article's unique identifier.
3.  **Data Fetching**:
    *   Server-side, `generateMetadata` fetches post data using `GET_POST_BY_SLUG` to generate SEO metadata.
    *   Server-side, the main page component also fetches post data using `GET_POST_BY_SLUG` (variables: `{ id: params.slug }`).
4.  **Rendering**:
    *   `app/layout.tsx` wraps the page.
    *   `app/[slug]/page.tsx` renders:
        *   `<Header />`
        *   Structured data (JSON-LD) for the article.
        *   `<ArticleContent article={article} />` which displays the title, image, author, date, and body of the article.
        *   `<Footer />`
5.  **Display**: The individual article page is displayed.

### 3.3. Viewing All Articles

1.  **User Action**: Navigates to the "/articles" page (e.g., via a "News" link in the header).
2.  **Routing**: `app/articles/page.tsx` handles the request.
3.  **Data Fetching**:
    *   Server-side, an initial batch of posts is fetched using the `GET_ALL_POSTS` query.
4.  **Rendering**:
    *   `app/layout.tsx` wraps the page.
    *   `app/articles/page.tsx` renders:
        *   `<Header />` (implicitly via layout, or explicitly if added)
        *   `<AllArticlesPageContent initialArticles={...} initialHasNextPage={...} initialEndCursor={...} />`
        *   `<Footer />` (implicitly via layout, or explicitly if added)
    *   `AllArticlesPageContent` then handles displaying the initial articles and fetching more articles via `fetchMore` when the user clicks "Load More".
5.  **Display**: A list/grid of articles is shown, with the option to load more.

### 3.4. Performing a Search

1.  **User Action (Method 1 - Overlay)**:
    *   Clicks the search icon in the `<Header />`.
    *   `SearchContext` triggers the `<SearchOverlay />` to become visible.
    *   User types in the overlay's input. Results might be displayed live within the overlay (depending on `SearchOverlay.tsx` implementation, which fetches search results using `SEARCH_POSTS_QUERY`).
    *   User might click a result or press enter to navigate to the main search page.
2.  **User Action (Method 2 - Direct Navigation/Submission)**:
    *   Navigates to `/search?q=searchTerm` or submits the form on the search page.
3.  **Routing**: `app/search/page.tsx` handles the request.
4.  **Data Fetching**:
    *   The `SearchContent` component (client-side) uses `useSearchParams` to get the search term.
    *   It then uses the `useQuery` hook with the `SEARCH_POSTS` query to fetch results from the GraphQL backend.
5.  **Rendering**:
    *   `app/layout.tsx` wraps the page.
    *   `app/search/page.tsx` renders:
        *   `<Header />`
        *   A `<Suspense>` boundary with `<SearchLoading />` as fallback.
        *   `<SearchContent />` which includes:
            *   A search input bar (with debouncing).
            *   The list of search results (articles, etc.).
            *   A "Load more results" button if pagination is available.
        *   `<Footer />`
6.  **Display**: The search results page is displayed with matching content.

## 4. Key Reusable Components

*   **`Header.tsx`**: Provides global navigation and access to search.
*   **`Footer.tsx`**: Provides global links and copyright information.
*   **`ArticleContent.tsx`**: Standardized way to display an article's body.
*   **`Loader.tsx`**: A generic loading spinner/indicator.
*   **`SearchOverlay.tsx` / `SearchContext.tsx`**: Powers the site-wide search functionality initiated from the header.
*   Various sliders and section components used on the homepage (`FeaturedSlider`, `LatestArticles`, `ReviewsSlider`, etc.)

## 5. Data Source

*   The primary data source is a **WordPress backend**, accessed via GraphQL.
*   The GraphQL endpoint is configured in `app/lib/apolloClient.ts`.
*   In local development, a proxy (`app/api/wordpress-proxy/route.ts`) is used to avoid CORS issues. For production, it likely connects directly to the WordPress GraphQL URL.

## 6. Areas for Future Documentation/Exploration

*   Detailed flow for specific content types beyond articles (e.g., guides, reviews, game pages).
*   Authentication flow (if login functionality is fully implemented beyond the button in the mega menu).
*   State management details within more complex components.
*   Specifics of the `codegen.ts` setup and how generated types are utilized.
*   Deployment specifics and Vercel configurations.

This document should provide a solid foundation for understanding the website's architecture. It can be expanded as the project evolves. 