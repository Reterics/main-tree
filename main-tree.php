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
define( "MAIN_TREE_PLUGIN_DIR", plugin_dir_path( __FILE__ ) );

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
    wp_enqueue_style('admin-stylesheet', plugins_url('assets/public/admin.css', __FILE__));

    $inline_script = sprintf(
                'window.wpUser = %s;',
                json_encode([
                    'restUrl' => esc_url_raw(rest_url(MAIN_TREE_API)),
                    'nonce'   => wp_create_nonce('wp_rest'),
                    'public' => false
                ])
            );

    wp_add_inline_script('admin-typescript', $inline_script, 'before');
});


// Register REST API endpoint
add_action('rest_api_init', function () {
    register_rest_route(MAIN_TREE_API, '/settings', array(
        'methods' => 'POST',
        'callback' => 'mt_save_settings',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    register_rest_route(MAIN_TREE_API, '/settings', array(
        'methods' => 'GET',
        'callback' => 'mt_load_settings',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    register_rest_route(MAIN_TREE_API, '/settings-public', array(
        'methods' => 'GET',
        'callback' => 'mt_load_settings_pubic',
        'permission_callback' => '__return_true',
    ));
});

function mt_save_settings(WP_REST_Request $request) {
    $postContent = $request->get_body_params();

	$options = json_decode(esc_attr(get_option(MAIN_TREE_OPTION_STORE)) || '[]') || [];
	if ($options === true) {
		$options = [];
	}
    foreach ($postContent as $key => $value) {
		if (is_string($value) || is_numeric($value) || is_null($value)) {
			$setting = sanitize_text_field($value);
			update_option($key, $setting);
			if (!in_array($key, (array) $options )) {
				$options[] = $key;
			}
		}
    }
	update_option(MAIN_TREE_OPTION_STORE, json_encode($options));

    return new WP_REST_Response(array('success' => true), 200);
}

function mt_load_settings(WP_REST_Request $request) {
	$options = esc_attr(get_option(MAIN_TREE_OPTION_STORE)) || '[]';
	if ($options === true) {
		$options = [];
	}
	return new WP_REST_Response($options, 200);
}

function mt_load_settings_pubic() {
	$options = esc_attr(get_option(MAIN_TREE_OPTION_STORE)) || '[]';
	if ($options === true) {
		$options = [];
	}
	return new WP_REST_Response($options, 200);
}
