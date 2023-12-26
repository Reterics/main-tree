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

define('MAIN_TREE', 'main-tree');

add_action('wp_enqueue_scripts', function(): void {
    $script_args = include( plugin_dir_path( __FILE__ ) . 'assets/public/scripts.asset.php');
    wp_enqueue_script('wp-typescript', plugins_url('assets/public/scripts.js', __FILE__),
	    $script_args['dependencies'], $script_args['version']);
});


/**
 * Setup Admin Dashboard
 */

function my_admin_menu() {
	// Create a new admin page for our app.
	add_menu_page(
		__( 'My first Gutenberg app', MAIN_TREE ),
		__( 'My first Gutenberg app', MAIN_TREE ),
		'manage_options',
		MAIN_TREE,
		function () {
			echo '
            <h2>Pages</h2>
            <div id="'.MAIN_TREE.'"></div>
        ';
		},
		'dashicons-schedule',
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
});