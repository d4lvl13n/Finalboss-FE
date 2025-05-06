# Environment Variables Setup Guide

To connect your local development environment to WordPress, you need to set the following environment variables in your `.env.local` file:

## For Local WordPress Development

If you have WordPress running locally:

```
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8000
```

Replace `8000` with the port your local WordPress is running on.

## For Remote WordPress Development

If you're connecting to a remote WordPress instance:

```
NEXT_PUBLIC_WORDPRESS_URL=https://backend.finalboss.io
```

## CORS Settings for WordPress

Make sure your WordPress instance has CORS enabled for your local development URL. You may need to add the following to your WordPress `functions.php` or use a CORS plugin:

```php
add_action('init', function() {
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
});
```

## Testing Your Configuration

1. Visit http://localhost:3000/debug to see your current environment variables
2. Visit http://localhost:3000/api/debug to check server-side environment variables 