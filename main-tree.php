<?php
/**
 * Plugin Name: Main Tree
 * Description: Main Wordpress Plugin to collect needed functionalities over the projects
 * Version: 1.0.0
 * Author: Attila Reterics
 * License: GPL3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 */

if ( !function_exists( 'add_action' ) ) {
	echo 'Avoid to call this method directly.';
	exit;
}

const MAIN_TREE = 'main-tree';
const MAIN_TREE_TITLE = 'Main Tree';
const MAIN_TREE_API = 'main-tree/v1';
const MAIN_TREE_OPTION_STORE = 'mt_opt_store';
const MAIN_TREE_OPTION_PUBLIC = 'mt_opt_public';
define( "MAIN_TREE_PLUGIN_DIR", plugin_dir_path( __FILE__ ) );

/**
 * Helper: Read a WordPress option that stores a list as JSON or array and normalize to array.
 */
function mt_read_option_array($option_name) {
    $stored = get_option($option_name);
    if (is_string($stored)) {
        $decoded = json_decode($stored, true);
        return is_array($decoded) ? $decoded : array();
    }
    return is_array($stored) ? $stored : array();
}

/**
 * Helper: Write an array list option as JSON with numeric keys reindexed.
 */
function mt_write_option_array($option_name, array $arr) {
    return update_option($option_name, json_encode(array_values($arr)));
}

/**
 * Helper: Build an associative array of option values for the given keys.
 */
function mt_build_values_for_keys(array $keys) {
    $result = array();
    foreach ($keys as $k) {
        if (is_string($k)) {
            $result[$k] = get_option($k);
        }
    }
    return $result;
}

add_action('wp_enqueue_scripts', function(): void {
    $script_args = include( plugin_dir_path( __FILE__ ) . 'assets/public/scripts.asset.php');
    wp_enqueue_script('wp-typescript', plugins_url('assets/public/scripts.js', __FILE__),
	    $script_args['dependencies'], $script_args['version']);

	$inline_script = sprintf(
            'window.wpUser = %s;',
            json_encode([
                'restUrl' => esc_url_raw(rest_url(MAIN_TREE_API)),
                'nonce'   => wp_create_nonce('wp_rest'),
                'public' => true
            ])
        );

    wp_add_inline_script('wp-typescript', $inline_script, 'before');
});


/**
 * Setup Admin Dashboard
 */

function my_admin_menu() {
	// Create a new admin page for our app.
	add_menu_page(
		__( MAIN_TREE_TITLE, MAIN_TREE ),
		__( MAIN_TREE_TITLE, MAIN_TREE ),
		'manage_options',
		MAIN_TREE,
		function () {
			echo '
            <div id="'.MAIN_TREE.'"></div>
        ';
		},
		'dashicons-admin-network',
		3
	);
}

add_action( 'admin_menu', 'my_admin_menu' );

add_action('admin_enqueue_scripts', function($hook): void {
	// Load only on ?page=main-tree
	if ( 'toplevel_page_' . MAIN_TREE !== $hook ) {
		return;
	}
    $script_args = include( plugin_dir_path( __FILE__ ) . 'assets/public/admin.asset.php');
    wp_enqueue_script('admin-typescript', plugins_url('assets/public/admin.js', __FILE__),
	    $script_args['dependencies'], $script_args['version']);

	$deps = ['common', 'forms', 'buttons', 'wp-admin', 'dashicons'];

	wp_enqueue_style(
		'admin-stylesheet',
		plugins_url('assets/public/admin.css', __FILE__),
		$deps,
		filemtime(plugin_dir_path(__FILE__) . 'assets/public/admin.css')
	);

    $inline_script = sprintf(
                'window.wpUser = %s;',
                json_encode([
                    'restUrl' => esc_url_raw(rest_url(MAIN_TREE_API)),
                    'nonce'   => wp_create_nonce('wp_rest'),
                    'public' => false
                ])
            );

    wp_add_inline_script('admin-typescript', $inline_script, 'before');
}, 10);


// Register REST API endpoint
add_action('rest_api_init', function () {
    // Create/Update multiple settings
    register_rest_route(MAIN_TREE_API, '/settings', array(
        'methods' => 'POST',
        'callback' => 'mt_save_settings',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // Read all settings (admin only)
    register_rest_route(MAIN_TREE_API, '/settings', array(
        'methods' => 'GET',
        'callback' => 'mt_load_settings',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // Delete a single setting by key
    register_rest_route(MAIN_TREE_API, '/settings/(?P<key>[a-zA-Z0-9_\-]+)', array(
        'methods' => 'DELETE',
        'callback' => 'mt_delete_setting',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // Read public settings (whitelisted)
    register_rest_route(MAIN_TREE_API, '/settings-public', array(
        'methods' => 'GET',
        'callback' => 'mt_load_settings_public',
        'permission_callback' => '__return_true',
    ));
});

function mt_save_settings(WP_REST_Request $request) {
    // Expect JSON body
    $postContent = $request->get_json_params();
    if (!is_array($postContent)) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid JSON'), 400);
    }

    // Load existing keys list (stored as array)
    $options = mt_read_option_array(MAIN_TREE_OPTION_STORE);

    foreach ($postContent as $key => $value) {
        if (!is_string($key)) { continue; }
        if (is_scalar($value) || is_null($value)) {
            $setting = is_null($value) ? null : sanitize_text_field((string)$value);
            if ($setting === null) {
                delete_option($key);
                $options = array_values(array_diff($options, array($key)));
            } else {
                update_option($key, $setting);
                if (!in_array($key, (array)$options, true)) {
                    $options[] = $key;
                }
            }
        }
    }
    mt_write_option_array(MAIN_TREE_OPTION_STORE, $options);

    return new WP_REST_Response(array('success' => true), 200);
}

function mt_load_settings(WP_REST_Request $request) {
    $keys = mt_read_option_array(MAIN_TREE_OPTION_STORE);
    $result = mt_build_values_for_keys((array)$keys);
    return new WP_REST_Response($result, 200);
}

function mt_load_settings_public() {
    $publicKeys = mt_read_option_array(MAIN_TREE_OPTION_PUBLIC);
    $result = mt_build_values_for_keys((array)$publicKeys);
    return new WP_REST_Response($result, 200);
}

function mt_delete_setting(WP_REST_Request $request) {
    $key = $request->get_param('key');
    if (!is_string($key) || $key === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid key'), 400);
    }

    // Remove option value
    delete_option($key);

    // Remove from options list (store)
    $keys = mt_read_option_array(MAIN_TREE_OPTION_STORE);
    $keys = array_values(array_diff((array)$keys, array($key)));
    mt_write_option_array(MAIN_TREE_OPTION_STORE, $keys);

    // Also ensure it is removed from public allowlist
    $pubKeys = mt_read_option_array(MAIN_TREE_OPTION_PUBLIC);
    $pubKeys = array_values(array_diff((array)$pubKeys, array($key)));
    mt_write_option_array(MAIN_TREE_OPTION_PUBLIC, $pubKeys);

    return new WP_REST_Response(array('success' => true), 200);
}
