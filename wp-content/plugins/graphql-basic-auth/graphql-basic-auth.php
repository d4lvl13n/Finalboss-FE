<?php
/**
 * Plugin Name: GraphQL Basic Auth
 * Description: Adds Basic Auth support to WPGraphQL
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

// Debug logging function
function graphql_auth_log($message, $data = null) {
    if (defined('WP_DEBUG') && WP_DEBUG === true) {
        error_log('WPGraphQL Auth: ' . $message);
        if ($data) {
            error_log(print_r($data, true));
        }
    }
}

add_action('graphql_init', function() {
    // Get Authorization header
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    graphql_auth_log('Auth Header received:', $auth_header);

    // Check for Basic Auth header
    if (strpos($auth_header, 'Basic ') === 0) {
        // Extract credentials
        $credentials = base64_decode(substr($auth_header, 6));
        list($username, $password) = explode(':', $credentials);

        graphql_auth_log('Attempting authentication for user:', $username);

        // Try to authenticate
        $user = wp_authenticate($username, $password);

        if (is_wp_error($user)) {
            graphql_auth_log('Authentication failed:', $user->get_error_message());
            return;
        }

        // Set current user if authentication successful
        wp_set_current_user($user->ID);
        graphql_auth_log('Authentication successful. User ID:', $user->ID);
        
        // Verify user has necessary capabilities
        $current_user = wp_get_current_user();
        if ($current_user->has_cap('edit_posts')) {
            graphql_auth_log('User has required capabilities');
        } else {
            graphql_auth_log('User lacks required capabilities');
        }
    } else {
        graphql_auth_log('No Basic Auth header found');
    }
});

// Additional helper to ensure WPGraphQL recognizes the auth
add_filter('graphql_request_data', function($request_data) {
    if (is_user_logged_in()) {
        graphql_auth_log('User is logged in during GraphQL request:', wp_get_current_user()->ID);
    } else {
        graphql_auth_log('No user logged in during GraphQL request');
    }
    return $request_data;
});

// Debugging filter to log mutations
add_filter('graphql_mutation_input', function($input, $mutation_name) {
    graphql_auth_log("Mutation attempted: ${mutation_name}", $input);
    return $input;
}, 10, 2); 