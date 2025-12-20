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

// Forms storage option
const MAIN_TREE_FORMS_OPTION = 'mt_forms_store';

// Quick Links storage option
const MAIN_TREE_QUICK_LINKS_OPTION = 'mt_quick_links_store';

// Email Templates CPT constants
const MT_EMAIL_TEMPLATE_CPT = 'mt_email_template';
const MT_EMAIL_TEMPLATE_META = [
    'subject', 'preheader', 'from_name', 'from_email', 'reply_to',
    'source_type', // 'elementor' | 'html'
    'elementor_template_id',
    'html',
    'updated_at'
];

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
                    'public' => false,
                    'adminUrl' => esc_url_raw(admin_url('/'))
                ])
            );

    wp_add_inline_script('admin-typescript', $inline_script, 'before');
}, 10);


// Register REST API endpoint
// Register Email Template CPT
add_action('init', function() {
    $labels = array(
        'name' => __( 'Email Templates', MAIN_TREE ),
        'singular_name' => __( 'Email Template', MAIN_TREE ),
    );
    register_post_type(MT_EMAIL_TEMPLATE_CPT, array(
        'labels' => $labels,
        'public' => false,
        'show_ui' => false,
        'show_in_menu' => false,
        'supports' => array('title','editor'), // editor stores raw html when source_type=html
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ));
});

add_action('rest_api_init', function () {
    // EMAIL TEMPLATES endpoints
    register_rest_route(MAIN_TREE_API, '/email-templates', array(
        'methods' => 'GET',
        'callback' => 'mt_email_templates_list',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    register_rest_route(MAIN_TREE_API, '/email-templates', array(
        'methods' => 'POST',
        'callback' => 'mt_email_templates_create',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    register_rest_route(MAIN_TREE_API, '/email-templates/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'mt_email_templates_get',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    register_rest_route(MAIN_TREE_API, '/email-templates/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'mt_email_templates_update',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    register_rest_route(MAIN_TREE_API, '/email-templates/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'mt_email_templates_delete',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    register_rest_route(MAIN_TREE_API, '/email-templates/(?P<id>\d+)/duplicate', array(
        'methods' => 'POST',
        'callback' => 'mt_email_templates_duplicate',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    // Render email template (HTML or Elementor) to HTML for preview/sending
    register_rest_route(MAIN_TREE_API, '/email-templates/(?P<id>\d+)/render', array(
        'methods' => 'GET',
        'callback' => 'mt_email_templates_render',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    // Elementor templates list
    register_rest_route(MAIN_TREE_API, '/elementor-templates', array(
        'methods' => 'GET',
        'callback' => 'mt_elementor_templates_list',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
    // Elementor template create
    register_rest_route(MAIN_TREE_API, '/elementor-templates', array(
        'methods' => 'POST',
        'callback' => 'mt_elementor_template_create',
        'permission_callback' => function () { return current_user_can('manage_options'); }
    ));
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

    // FORMS: list
    register_rest_route(MAIN_TREE_API, '/forms', array(
        'methods' => 'GET',
        'callback' => 'mt_forms_list',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // FORMS: create
    register_rest_route(MAIN_TREE_API, '/forms', array(
        'methods' => 'POST',
        'callback' => 'mt_forms_create',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // FORMS: get single
    register_rest_route(MAIN_TREE_API, '/forms/(?P<id>[^/]+)', array(
        'methods' => 'GET',
        'callback' => 'mt_forms_get',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // FORMS: update
    register_rest_route(MAIN_TREE_API, '/forms/(?P<id>[^/]+)', array(
        'methods' => 'PUT',
        'callback' => 'mt_forms_update',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // FORMS: delete
    register_rest_route(MAIN_TREE_API, '/forms/(?P<id>[^/]+)', array(
        'methods' => 'DELETE',
        'callback' => 'mt_forms_delete',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // FORMS: duplicate
    register_rest_route(MAIN_TREE_API, '/forms/(?P<id>[^/]+)/duplicate', array(
        'methods' => 'POST',
        'callback' => 'mt_forms_duplicate',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    // QUICK LINKS: list
    register_rest_route(MAIN_TREE_API, '/quick-links', array(
        'methods' => 'GET',
        'callback' => 'mt_quick_links_list',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // QUICK LINKS: create
    register_rest_route(MAIN_TREE_API, '/quick-links', array(
        'methods' => 'POST',
        'callback' => 'mt_quick_links_create',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // QUICK LINKS: update
    register_rest_route(MAIN_TREE_API, '/quick-links/(?P<id>[^/]+)', array(
        'methods' => 'PUT',
        'callback' => 'mt_quick_links_update',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // QUICK LINKS: delete
    register_rest_route(MAIN_TREE_API, '/quick-links/(?P<id>[^/]+)', array(
        'methods' => 'DELETE',
        'callback' => 'mt_quick_links_delete',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
    // QUICK LINKS: reorder
    register_rest_route(MAIN_TREE_API, '/quick-links/reorder', array(
        'methods' => 'POST',
        'callback' => 'mt_quick_links_reorder',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
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


// -------------------- FORMS BACKEND --------------------
/**
 * Load all stored forms from option. Ensures array structure.
 */
function mt_load_forms_store() {
    $stored = get_option(MAIN_TREE_FORMS_OPTION);
    if (is_string($stored)) {
        $decoded = json_decode($stored, true);
        return is_array($decoded) ? $decoded : array();
    }
    return is_array($stored) ? $stored : array();
}

/**
 * Save forms array into option as JSON.
 */
function mt_save_forms_store(array $forms) {
    return update_option(MAIN_TREE_FORMS_OPTION, json_encode(array_values($forms)));
}

/**
 * REST: GET /forms
 */
function mt_forms_list(WP_REST_Request $request) {
    $forms = mt_load_forms_store();
    return new WP_REST_Response($forms, 200);
}

/**
 * REST: POST /forms — create a form
 * Expected payload: { name: string, fields: [ { type: 'text'|'email'|'textarea', label: string, name: string, required?: bool, showIf?: { field: string, operator: string, value: string } } ], actions?: { email?: { to: string, subject?: string, template?: string } } }
 */
function mt_forms_create(WP_REST_Request $request) {
    $data = $request->get_json_params();
    if (!is_array($data)) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid JSON'), 400);
    }
    $name = isset($data['name']) ? sanitize_text_field($data['name']) : '';
    $fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : array();
    $actions = isset($data['actions']) && is_array($data['actions']) ? $data['actions'] : array();
    if ($name === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Name is required'), 400);
    }
    $sanitized_fields = array();
    foreach ($fields as $f) {
        if (!is_array($f)) { continue; }
        $type = isset($f['type']) ? strtolower(sanitize_text_field($f['type'])) : 'text';
        if (!in_array($type, array('text','email','textarea'), true)) { $type = 'text'; }
        $label = isset($f['label']) ? sanitize_text_field($f['label']) : '';
        $fname = isset($f['name']) ? sanitize_key($f['name']) : '';
        $required = !empty($f['required']);
        // optional condition
        $showIf = null;
        if (isset($f['showIf']) && is_array($f['showIf'])) {
            $sf = $f['showIf'];
            $sfField = isset($sf['field']) ? sanitize_key($sf['field']) : '';
            $sfOp = isset($sf['operator']) ? sanitize_text_field($sf['operator']) : '';
            $sfVal = isset($sf['value']) ? sanitize_text_field($sf['value']) : '';
            if ($sfField !== '' && $sfOp !== '') {
                $showIf = array('field' => $sfField, 'operator' => $sfOp, 'value' => $sfVal);
            }
        }
        if ($label === '' || $fname === '') { continue; }
        $row = array(
            'type' => $type,
            'label' => $label,
            'name' => $fname,
            'required' => (bool)$required,
        );
        if (!is_null($showIf)) { $row['showIf'] = $showIf; }
        $sanitized_fields[] = $row;
    }

    // actions.email
    $emailAction = null;
    if (isset($actions['email']) && is_array($actions['email'])) {
        $em = $actions['email'];
        $to = isset($em['to']) ? sanitize_text_field($em['to']) : '';
        $subject = isset($em['subject']) ? sanitize_text_field($em['subject']) : '';
        $template = isset($em['template']) ? wp_kses_post($em['template']) : '';
        if ($to !== '') {
            $emailAction = array('to' => $to, 'subject' => $subject, 'template' => $template);
        }
    }

    $forms = mt_load_forms_store();
    $id = uniqid('f_', true);
    $newForm = array(
        'id' => $id,
        'name' => $name,
        'fields' => $sanitized_fields,
    );
    if (!is_null($emailAction)) { $newForm['actions'] = array('email' => $emailAction); }
    $forms[] = $newForm;
    mt_save_forms_store($forms);

    return new WP_REST_Response(array('success' => true, 'form' => $newForm), 201);
}

function mt_forms_find_index_by_id($forms, $id) {
    foreach ($forms as $i => $f) {
        if (is_array($f) && isset($f['id']) && $f['id'] === $id) {
            return $i;
        }
    }
    return -1;
}

function mt_forms_get(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $forms = mt_load_forms_store();
    $idx = mt_forms_find_index_by_id($forms, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }
    return new WP_REST_Response(array('success' => true, 'form' => $forms[$idx]), 200);
}

function mt_forms_update(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $data = $request->get_json_params();
    if (!is_array($data)) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid JSON'), 400);
    }

    $name = isset($data['name']) ? sanitize_text_field($data['name']) : '';
    $fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : array();
    if ($name === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Name is required'), 400);
    }

    $sanitized_fields = array();
    foreach ($fields as $f) {
        if (!is_array($f)) { continue; }
        $type = isset($f['type']) ? strtolower(sanitize_text_field($f['type'])) : 'text';
        if (!in_array($type, array('text','email','textarea'), true)) { $type = 'text'; }
        $label = isset($f['label']) ? sanitize_text_field($f['label']) : '';
        $fname = isset($f['name']) ? sanitize_key($f['name']) : '';
        $required = !empty($f['required']);
        if ($label === '' || $fname === '') { continue; }
        $sanitized_fields[] = array(
            'type' => $type,
            'label' => $label,
            'name' => $fname,
            'required' => (bool)$required,
        );
    }

    $forms = mt_load_forms_store();
    $idx = mt_forms_find_index_by_id($forms, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }

    $forms[$idx]['name'] = $name;
    $forms[$idx]['fields'] = $sanitized_fields;
    mt_save_forms_store($forms);

    return new WP_REST_Response(array('success' => true, 'form' => $forms[$idx]), 200);
}

function mt_forms_delete(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $forms = mt_load_forms_store();
    $idx = mt_forms_find_index_by_id($forms, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }
    array_splice($forms, $idx, 1);
    mt_save_forms_store($forms);
    return new WP_REST_Response(array('success' => true), 200);
}

function mt_forms_duplicate(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $forms = mt_load_forms_store();
    $idx = mt_forms_find_index_by_id($forms, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }
    $orig = $forms[$idx];
    $new = $orig;
    $new['id'] = uniqid('f_', true);
    $new['name'] = isset($orig['name']) ? ($orig['name'] . ' (Copy)') : 'Untitled (Copy)';
    $forms[] = $new;
    mt_save_forms_store($forms);
    return new WP_REST_Response(array('success' => true, 'form' => $new), 201);
}

// -------------------- QUICK LINKS BACKEND --------------------
/**
 * Load all stored quick links from option. Ensures array structure.
 */
function mt_load_quick_links_store() {
    $stored = get_option(MAIN_TREE_QUICK_LINKS_OPTION);
    if (is_string($stored)) {
        $decoded = json_decode($stored, true);
        return is_array($decoded) ? $decoded : array();
    }
    return is_array($stored) ? $stored : array();
}

/**
 * Save quick links array into option as JSON.
 */
function mt_save_quick_links_store(array $links) {
    return update_option(MAIN_TREE_QUICK_LINKS_OPTION, json_encode(array_values($links)));
}

function mt_quick_links_find_index_by_id($links, $id) {
    foreach ($links as $i => $link) {
        if (is_array($link) && isset($link['id']) && $link['id'] === $id) {
            return $i;
        }
    }
    return -1;
}

/**
 * REST: GET /quick-links
 */
function mt_quick_links_list(WP_REST_Request $request) {
    $links = mt_load_quick_links_store();
    return new WP_REST_Response($links, 200);
}

/**
 * REST: POST /quick-links — create a quick link
 * Expected payload: { label: string, url: string, description?: string, icon?: string, openInNewTab?: bool }
 */
function mt_quick_links_create(WP_REST_Request $request) {
    $data = $request->get_json_params();
    if (!is_array($data)) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid JSON'), 400);
    }
    $label = isset($data['label']) ? sanitize_text_field($data['label']) : '';
    $url = isset($data['url']) ? esc_url_raw($data['url']) : '';
    $description = isset($data['description']) ? sanitize_text_field($data['description']) : '';
    $icon = isset($data['icon']) ? sanitize_text_field($data['icon']) : '';
    $openInNewTab = !empty($data['openInNewTab']);

    if ($label === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Label is required'), 400);
    }
    if ($url === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'URL is required'), 400);
    }

    $links = mt_load_quick_links_store();
    $id = uniqid('ql_', true);
    $newLink = array(
        'id' => $id,
        'label' => $label,
        'url' => $url,
        'description' => $description,
        'icon' => $icon,
        'openInNewTab' => $openInNewTab,
    );
    $links[] = $newLink;
    mt_save_quick_links_store($links);

    return new WP_REST_Response(array('success' => true, 'link' => $newLink), 201);
}

/**
 * REST: PUT /quick-links/:id — update a quick link
 */
function mt_quick_links_update(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $data = $request->get_json_params();
    if (!is_array($data)) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid JSON'), 400);
    }

    $links = mt_load_quick_links_store();
    $idx = mt_quick_links_find_index_by_id($links, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }

    $label = isset($data['label']) ? sanitize_text_field($data['label']) : '';
    $url = isset($data['url']) ? esc_url_raw($data['url']) : '';
    $description = isset($data['description']) ? sanitize_text_field($data['description']) : '';
    $icon = isset($data['icon']) ? sanitize_text_field($data['icon']) : '';
    $openInNewTab = !empty($data['openInNewTab']);

    if ($label === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Label is required'), 400);
    }
    if ($url === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'URL is required'), 400);
    }

    $links[$idx]['label'] = $label;
    $links[$idx]['url'] = $url;
    $links[$idx]['description'] = $description;
    $links[$idx]['icon'] = $icon;
    $links[$idx]['openInNewTab'] = $openInNewTab;

    mt_save_quick_links_store($links);

    return new WP_REST_Response(array('success' => true, 'link' => $links[$idx]), 200);
}

/**
 * REST: DELETE /quick-links/:id
 */
function mt_quick_links_delete(WP_REST_Request $request) {
    $id = $request->get_param('id');
    if (!is_string($id) || $id === '') {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid id'), 400);
    }
    $links = mt_load_quick_links_store();
    $idx = mt_quick_links_find_index_by_id($links, $id);
    if ($idx === -1) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Not found'), 404);
    }
    array_splice($links, $idx, 1);
    mt_save_quick_links_store($links);
    return new WP_REST_Response(array('success' => true), 200);
}

/**
 * REST: POST /quick-links/reorder — reorder quick links
 * Expected payload: { ids: string[] }
 */
function mt_quick_links_reorder(WP_REST_Request $request) {
    $data = $request->get_json_params();
    if (!is_array($data) || !isset($data['ids']) || !is_array($data['ids'])) {
        return new WP_REST_Response(array('success' => false, 'error' => 'Invalid payload'), 400);
    }

    $ids = $data['ids'];
    $links = mt_load_quick_links_store();

    // Build a map of id => link
    $linksMap = array();
    foreach ($links as $link) {
        if (isset($link['id'])) {
            $linksMap[$link['id']] = $link;
        }
    }

    // Reorder based on provided ids
    $reordered = array();
    foreach ($ids as $id) {
        if (isset($linksMap[$id])) {
            $reordered[] = $linksMap[$id];
            unset($linksMap[$id]);
        }
    }
    // Append any remaining links not in the ids list
    foreach ($linksMap as $link) {
        $reordered[] = $link;
    }

    mt_save_quick_links_store($reordered);

    return new WP_REST_Response(array('success' => true, 'links' => $reordered), 200);
}

/**
 * Shortcode: [mt_form id=\"...\"]
 * Renders a basic HTML form from stored definition. Submission handling is not implemented in MVP.
 */
function mt_shortcode_form($atts = array()) {
    $atts = shortcode_atts(array('id' => ''), $atts, 'mt_form');
    $id = is_string($atts['id']) ? $atts['id'] : '';
    if ($id === '') { return ''; }
    $forms = mt_load_forms_store();
    $target = null;
    foreach ($forms as $f) {
        if (is_array($f) && isset($f['id']) && $f['id'] === $id) { $target = $f; break; }
    }
    if (!$target) { return ''; }
    $fields = isset($target['fields']) && is_array($target['fields']) ? $target['fields'] : array();

    ob_start();
    ?>
    <form class="mt-form" method="post">
        <?php foreach ($fields as $field):
            $type = isset($field['type']) ? $field['type'] : 'text';
            $label = isset($field['label']) ? esc_html($field['label']) : '';
            $name = isset($field['name']) ? esc_attr($field['name']) : '';
            $required = !empty($field['required']);
            $reqAttr = $required ? 'required' : '';
        ?>
            <div class="mt-form__row">
                <label class="mt-form__label">
                    <span><?php echo $label; ?></span>
                    <?php if ($type === 'textarea'): ?>
                        <textarea name="<?php echo $name; ?>" <?php echo $reqAttr; ?>></textarea>
                    <?php elseif ($type === 'email'): ?>
                        <input type="email" name="<?php echo $name; ?>" <?php echo $reqAttr; ?> />
                    <?php else: ?>
                        <input type="text" name="<?php echo $name; ?>" <?php echo $reqAttr; ?> />
                    <?php endif; ?>
                </label>
            </div>
        <?php endforeach; ?>
        <div class="mt-form__actions">
            <button type="submit">Submit</button>
        </div>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('mt_form', 'mt_shortcode_form');


// -------------------- EMAIL TEMPLATES BACKEND (CPT) --------------------

function mt_email_template_sanitize_payload($data) {
    if (!is_array($data)) return new WP_Error('invalid', 'Invalid JSON payload');
    $name = isset($data['name']) ? sanitize_text_field($data['name']) : '';
    $source_type = isset($data['source_type']) ? sanitize_text_field($data['source_type']) : 'html';
    if (!in_array($source_type, array('html','elementor'), true)) $source_type = 'html';
    $subject = isset($data['subject']) ? sanitize_text_field($data['subject']) : '';
    $preheader = isset($data['preheader']) ? sanitize_text_field($data['preheader']) : '';
    $from_name = isset($data['from_name']) ? sanitize_text_field($data['from_name']) : '';
    $from_email = isset($data['from_email']) ? sanitize_email($data['from_email']) : '';
    $reply_to = isset($data['reply_to']) ? sanitize_email($data['reply_to']) : '';
    $elementor_template_id = isset($data['elementor_template_id']) ? intval($data['elementor_template_id']) : 0;
    $html = isset($data['html']) ? wp_kses_post($data['html']) : '';

    return array(
        'name' => $name,
        'source_type' => $source_type,
        'subject' => $subject,
        'preheader' => $preheader,
        'from_name' => $from_name,
        'from_email' => $from_email,
        'reply_to' => $reply_to,
        'elementor_template_id' => $elementor_template_id,
        'html' => $html,
    );
}

function mt_email_template_to_array($post) {
    if (!$post) return null;
    $id = intval($post->ID);
    $meta = array();
    foreach (MT_EMAIL_TEMPLATE_META as $k) {
        $meta[$k] = get_post_meta($id, $k, true);
    }
    // Backward compatibility: also pull editor content as html if set
    $content = $post->post_content;

    return array(
        'id' => $id,
        'name' => get_the_title($post),
        'source_type' => isset($meta['source_type']) && $meta['source_type'] ? $meta['source_type'] : 'html',
        'subject' => isset($meta['subject']) ? $meta['subject'] : '',
        'preheader' => isset($meta['preheader']) ? $meta['preheader'] : '',
        'from_name' => isset($meta['from_name']) ? $meta['from_name'] : '',
        'from_email' => isset($meta['from_email']) ? $meta['from_email'] : '',
        'reply_to' => isset($meta['reply_to']) ? $meta['reply_to'] : '',
        'elementor_template_id' => intval(isset($meta['elementor_template_id']) ? $meta['elementor_template_id'] : 0),
        'html' => isset($meta['html']) && $meta['html'] !== '' ? $meta['html'] : $content,
        'updated_at' => isset($meta['updated_at']) ? $meta['updated_at'] : '',
    );
}

function mt_email_templates_list(WP_REST_Request $request) {
    $q = new WP_Query(array(
        'post_type' => MT_EMAIL_TEMPLATE_CPT,
        'post_status' => array('publish','draft','pending'),
        'posts_per_page' => 200,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
    ));
    $items = array();
    foreach ($q->posts as $p) { $items[] = mt_email_template_to_array($p); }
    return new WP_REST_Response($items, 200);
}

function mt_email_templates_create(WP_REST_Request $request) {
    $data = mt_email_template_sanitize_payload($request->get_json_params());
    if (is_wp_error($data)) return new WP_REST_Response(array('success'=>false,'error'=>'Invalid payload'), 400);
    if ($data['name'] === '') return new WP_REST_Response(array('success'=>false,'error'=>'Name is required'), 400);

    $content = $data['source_type'] === 'html' ? $data['html'] : '';
    $post_id = wp_insert_post(array(
        'post_type' => MT_EMAIL_TEMPLATE_CPT,
        'post_status' => 'publish',
        'post_title' => $data['name'],
        'post_content' => $content,
    ), true);
    if (is_wp_error($post_id)) return new WP_REST_Response(array('success'=>false,'error'=>$post_id->get_error_message()), 500);

    foreach (MT_EMAIL_TEMPLATE_META as $key) {
        if ($key === 'updated_at') continue;
        $val = isset($data[$key]) ? $data[$key] : '';
        update_post_meta($post_id, $key, $val);
    }
    update_post_meta($post_id, 'updated_at', current_time('mysql'));

    $post = get_post($post_id);
    return new WP_REST_Response(array('success'=>true,'template'=>mt_email_template_to_array($post)), 201);
}

function mt_email_templates_get(WP_REST_Request $request) {
    $id = intval($request->get_param('id'));
    $post = get_post($id);
    if (!$post || $post->post_type !== MT_EMAIL_TEMPLATE_CPT) return new WP_REST_Response(array('success'=>false,'error'=>'Not found'), 404);
    return new WP_REST_Response(array('success'=>true,'template'=>mt_email_template_to_array($post)), 200);
}

function mt_email_templates_update(WP_REST_Request $request) {
    $id = intval($request->get_param('id'));
    $post = get_post($id);
    if (!$post || $post->post_type !== MT_EMAIL_TEMPLATE_CPT) return new WP_REST_Response(array('success'=>false,'error'=>'Not found'), 404);

    $data = mt_email_template_sanitize_payload($request->get_json_params());
    if (is_wp_error($data)) return new WP_REST_Response(array('success'=>false,'error'=>'Invalid payload'), 400);
    if ($data['name'] === '') return new WP_REST_Response(array('success'=>false,'error'=>'Name is required'), 400);

    // Prevent switching source type after creation (no interchangeable)
    $existing_source = get_post_meta($id, 'source_type', true);
    if (!$existing_source) { $existing_source = 'html'; }
    if ($existing_source && $data['source_type'] && $existing_source !== $data['source_type']) {
        return new WP_REST_Response(array('success'=>false,'error'=>'Source type cannot be changed for this template'), 400);
    }

    $content = $data['source_type'] === 'html' ? $data['html'] : $post->post_content;
    $res = wp_update_post(array(
        'ID' => $id,
        'post_title' => $data['name'],
        'post_content' => $content,
    ), true);
    if (is_wp_error($res)) return new WP_REST_Response(array('success'=>false,'error'=>$res->get_error_message()), 500);

    foreach (MT_EMAIL_TEMPLATE_META as $key) {
        if ($key === 'updated_at') continue;
        $val = isset($data[$key]) ? $data[$key] : '';
        update_post_meta($id, $key, $val);
    }
    update_post_meta($id, 'updated_at', current_time('mysql'));

    return new WP_REST_Response(array('success'=>true,'template'=>mt_email_template_to_array(get_post($id))), 200);
}

function mt_email_templates_delete(WP_REST_Request $request) {
    $id = intval($request->get_param('id'));
    $post = get_post($id);
    if (!$post || $post->post_type !== MT_EMAIL_TEMPLATE_CPT) return new WP_REST_Response(array('success'=>false,'error'=>'Not found'), 404);
    wp_delete_post($id, true);
    return new WP_REST_Response(array('success'=>true), 200);
}

function mt_email_templates_duplicate(WP_REST_Request $request) {
    $id = intval($request->get_param('id'));
    $post = get_post($id);
    if (!$post || $post->post_type !== MT_EMAIL_TEMPLATE_CPT) return new WP_REST_Response(array('success'=>false,'error'=>'Not found'), 404);
    $tpl = mt_email_template_to_array($post);
    $new_title = $tpl['name'] . ' (Copy)';
    $new_content = $tpl['source_type'] === 'html' ? $tpl['html'] : '';
    $new_id = wp_insert_post(array(
        'post_type' => MT_EMAIL_TEMPLATE_CPT,
        'post_status' => 'draft',
        'post_title' => $new_title,
        'post_content' => $new_content,
    ), true);
    if (is_wp_error($new_id)) return new WP_REST_Response(array('success'=>false,'error'=>$new_id->get_error_message()), 500);
    foreach (MT_EMAIL_TEMPLATE_META as $key) {
        if ($key === 'updated_at') continue;
        update_post_meta($new_id, $key, get_post_meta($id, $key, true));
    }
    update_post_meta($new_id, 'updated_at', current_time('mysql'));
    return new WP_REST_Response(array('success'=>true,'template'=>mt_email_template_to_array(get_post($new_id))), 201);
}

function mt_set_current_email_template_id($id) { $GLOBALS['mt_current_email_template_id'] = intval($id); }
function mt_get_current_email_template_id() {
    if (isset($GLOBALS['mt_current_email_template_id'])) {
        return intval($GLOBALS['mt_current_email_template_id']);
    }
    // Try to resolve automatically in Elementor editor context or via explicit param
    $id = 0;
    if (isset($_GET['mt_email_template_id'])) {
        $id = intval($_GET['mt_email_template_id']);
    }
    if (!$id && isset($_GET['action']) && $_GET['action'] === 'elementor' && isset($_GET['post'])) {
        $el_id = intval($_GET['post']);
        // Find email template that references this Elementor template
        $found = get_posts(array(
            'post_type' => MT_EMAIL_TEMPLATE_CPT,
            'post_status' => array('publish','draft','pending'),
            'posts_per_page' => 1,
            'fields' => 'ids',
            'meta_query' => array(
                array(
                    'key' => 'elementor_template_id',
                    'value' => $el_id,
                    'compare' => '=',
                    'type' => 'NUMERIC',
                ),
            ),
            'no_found_rows' => true,
            'suppress_filters' => true,
        ));
        if (!empty($found)) { $id = intval($found[0]); }
    }
    if ($id) { $GLOBALS['mt_current_email_template_id'] = $id; return $id; }
    return 0;
}

// Shortcodes for dynamic email fields
if (!shortcode_exists('mt_email_subject')) {
    add_shortcode('mt_email_subject', function() { return esc_html((string)get_post_meta(mt_get_current_email_template_id(), 'subject', true)); });
}
if (!shortcode_exists('mt_email_preheader')) {
    add_shortcode('mt_email_preheader', function() { return esc_html((string)get_post_meta(mt_get_current_email_template_id(), 'preheader', true)); });
}
if (!shortcode_exists('mt_email_from_name')) {
    add_shortcode('mt_email_from_name', function() { return esc_html((string)get_post_meta(mt_get_current_email_template_id(), 'from_name', true)); });
}
if (!shortcode_exists('mt_email_from_email')) {
    add_shortcode('mt_email_from_email', function() { return esc_html((string)get_post_meta(mt_get_current_email_template_id(), 'from_email', true)); });
}
if (!shortcode_exists('mt_email_reply_to')) {
    add_shortcode('mt_email_reply_to', function() { return esc_html((string)get_post_meta(mt_get_current_email_template_id(), 'reply_to', true)); });
}
if (!shortcode_exists('mt_email_var')) {
    add_shortcode('mt_email_var', function($atts) {
        $atts = shortcode_atts(array('key' => ''), $atts, 'mt_email_var');
        $key = sanitize_key($atts['key']);
        if (!$key) return '';
        return esc_html((string)get_post_meta(mt_get_current_email_template_id(), $key, true));
    });
}

function mt_email_templates_render(WP_REST_Request $request) {
    $id = intval($request->get_param('id'));
    $post = get_post($id);
    if (!$post || $post->post_type !== MT_EMAIL_TEMPLATE_CPT) {
        return new WP_REST_Response(array('success'=>false,'error'=>'Not found'), 404);
    }

    mt_set_current_email_template_id($id);
    try {
        $source_type = get_post_meta($id, 'source_type', true);

        if ($source_type === 'elementor') {
            $tpl_id = intval(get_post_meta($id, 'elementor_template_id', true));
            if ($tpl_id > 0 && post_type_exists('elementor_library') && class_exists('Elementor\\Plugin')) {
                try {
                    $html = \Elementor\Plugin::instance()->frontend->get_builder_content_for_display($tpl_id, true);
                    // Process our shortcodes but avoid theme/content filters that may inject headers/meta
                    $html = do_shortcode($html);
                    return new WP_REST_Response(array('success'=>true,'html'=>$html), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response(array('success'=>false,'error'=>'Failed to render Elementor template'), 500);
                }
            }
            return new WP_REST_Response(array('success'=>false,'error'=>'Elementor template not available'), 400);
        }

        // Fallback to saved HTML
        $raw = (string) get_post_meta($id, 'html', true);
        if ($raw === '') {
            $raw = (string) $post->post_content;
        }
        $raw = do_shortcode($raw);
        // Do not run 'the_content' filters to avoid theme headers/meta injection
        return new WP_REST_Response(array('success'=>true,'html'=>$raw), 200);
    } finally {
        unset($GLOBALS['mt_current_email_template_id']);
    }
}

function mt_elementor_templates_list(WP_REST_Request $request) {
    // Elementor stores templates in 'elementor_library' post type
    $exists = post_type_exists('elementor_library');
    if (!$exists) return new WP_REST_Response(array(), 200);
    $q = new WP_Query(array(
        'post_type' => 'elementor_library',
        'post_status' => array('publish','draft','pending'),
        'posts_per_page' => 200,
        'orderby' => 'title',
        'order' => 'ASC',
        'no_found_rows' => true,
        'fields' => 'ids',
    ));
    $out = array();
    foreach ($q->posts as $pid) {
        $out[] = array(
            'id' => intval($pid),
            'title' => get_the_title($pid),
        );
    }
    return new WP_REST_Response($out, 200);
}

function mt_elementor_template_create(WP_REST_Request $request) {
    if (!post_type_exists('elementor_library')) {
        return new WP_REST_Response(array('success'=>false,'error'=>'Elementor not active'), 400);
    }
    $params = $request->get_json_params();
    $title = '';
    if (is_array($params) && isset($params['title'])) {
        $title = sanitize_text_field((string)$params['title']);
    }
    if ($title === '') { $title = 'Email Template'; }

    $post_id = wp_insert_post(array(
        'post_type'   => 'elementor_library',
        'post_status' => 'draft',
        'post_title'  => $title,
    ), true);
    if (is_wp_error($post_id)) {
        return new WP_REST_Response(array('success'=>false,'error'=>$post_id->get_error_message()), 500);
    }

    // Seed Elementor starter layout for email
    $make_id = function() { return uniqid('mt_', true); };
    $seed = array(
        array(
            'id' => $make_id(),
            'elType' => 'section',
            'isInner' => false,
            'settings' => array(
                'content_width' => 'boxed',
                'boxed_width' => array('unit' => 'px', 'size' => 600),
                'gap' => 'no',
                'padding' => array('unit' => 'px', 'top' => 20, 'right' => 20, 'bottom' => 20, 'left' => 20, 'isLinked' => false),
                'background_color' => '#ffffff',
            ),
            'elements' => array(
                array(
                    'id' => $make_id(),
                    'elType' => 'column',
                    'isInner' => false,
                    'settings' => array(
                        'padding' => array('unit'=>'px','top'=>0,'right'=>0,'bottom'=>0,'left'=>0,'isLinked'=>false)
                    ),
                    'elements' => array(
                        array(
                            'id' => $make_id(),
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => array(
                                'editor' => '<p style="font-size:12px; color:#6B7280; margin:0;">[mt_email_preheader]</p>'
                            ),
                            'elements' => array(),
                            'isInner' => false,
                        ),
                        array(
                            'id' => $make_id(),
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => array(
                                'title' => '[mt_email_subject]',
                                'header_size' => 'h2',
                                'align' => 'left',
                            ),
                            'elements' => array(),
                            'isInner' => false,
                        ),
                        array(
                            'id' => $make_id(),
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => array(
                                'editor' => '<p>Hi there,</p><p>This is your email body. Replace with your content.</p>'
                            ),
                            'elements' => array(),
                            'isInner' => false,
                        ),
                        array(
                            'id' => $make_id(),
                            'elType' => 'widget',
                            'widgetType' => 'button',
                            'settings' => array(
                                'text' => 'Call to Action',
                                'link' => array('url' => '#'),
                                'align' => 'left',
                            ),
                            'elements' => array(),
                            'isInner' => false,
                        ),
                        array(
                            'id' => $make_id(),
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => array(
                                'editor' => '<p style="font-size:12px; color:#6B7280; margin-top:24px;">From: [mt_email_from_name] &lt;[mt_email_from_email]&gt;<br/>Reply-To: [mt_email_reply_to]</p>'
                            ),
                            'elements' => array(),
                            'isInner' => false,
                        ),
                    ),
                ),
            ),
        ),
    );

    /** Allow sites to override the seeded layout */
    if (function_exists('apply_filters')) {
        $seed = apply_filters('mt/elementor_email_seed', $seed, $post_id);
    }

    // Save Elementor meta so it opens in the builder with the starter
    update_post_meta($post_id, '_elementor_edit_mode', 'builder');
    if (defined('ELEMENTOR_VERSION')) {
        update_post_meta($post_id, '_elementor_version', ELEMENTOR_VERSION);
    }
    update_post_meta($post_id, '_elementor_template_type', 'page');
    update_post_meta($post_id, '_elementor_data', wp_slash( wp_json_encode( $seed ) ));
    // Use Elementor Canvas to avoid theme header/footer in editor preview
    $page_settings = get_post_meta($post_id, '_elementor_page_settings', true);
    if (!is_array($page_settings)) { $page_settings = array(); }
    $page_settings['template'] = 'elementor_canvas';
    update_post_meta($post_id, '_elementor_page_settings', $page_settings);

    $edit_url = add_query_arg(array(
        'post' => intval($post_id),
        'action' => 'elementor',
    ), admin_url('post.php'));

    return new WP_REST_Response(array(
        'success' => true,
        'template' => array(
            'id' => intval($post_id),
            'title' => get_the_title($post_id),
            'edit_url' => esc_url_raw($edit_url),
        )
    ), 201);
}

// Elementor: Register category and Email Field widget
add_action('elementor/elements/categories_registered', function($elements_manager) {
    if (!is_object($elements_manager) || !method_exists($elements_manager, 'add_category')) return;
    $elements_manager->add_category('main-tree-email', array(
        'title' => __('Main Tree Email', 'main-tree'),
        'icon'  => 'fa fa-envelope',
    ));
});

add_action('elementor/widgets/register', function($widgets_manager) {
    if (!class_exists('Elementor\\Widget_Base')) return;

    if (!class_exists('MT_Email_Field_Widget')) {
        class MT_Email_Field_Widget extends \Elementor\Widget_Base {
            public function get_name() { return 'mt_email_field'; }
            public function get_title() { return __('Email Field', 'main-tree'); }
            public function get_icon() { return 'eicon-editor-code'; }
            public function get_categories() { return array('main-tree-email'); }

            protected function register_controls() {
                $this->start_controls_section('section_content', [ 'label' => __('Content', 'main-tree') ]);
                $this->add_control('field', [
                    'label' => __('Field', 'main-tree'),
                    'type' => \Elementor\Controls_Manager::SELECT,
                    'options' => [
                        'subject' => __('Subject', 'main-tree'),
                        'preheader' => __('Preheader', 'main-tree'),
                        'from_name' => __('From name', 'main-tree'),
                        'from_email' => __('From email', 'main-tree'),
                        'reply_to' => __('Reply-To', 'main-tree'),
                        'custom' => __('Custom meta key', 'main-tree'),
                    ],
                    'default' => 'preheader',
                ]);
                $this->add_control('key', [
                    'label' => __('Custom key', 'main-tree'),
                    'type' => \Elementor\Controls_Manager::TEXT,
                    'condition' => [ 'field' => 'custom' ],
                ]);
                $this->end_controls_section();
            }

            protected function render() {
                $settings = $this->get_settings_for_display();
                $field = isset($settings['field']) ? $settings['field'] : 'preheader';
                if ($field === 'custom') {
                    $key = isset($settings['key']) ? sanitize_key($settings['key']) : '';
                    echo do_shortcode('[mt_email_var key="' . esc_attr($key) . '"]');
                    return;
                }
                echo do_shortcode('[mt_email_' . esc_attr($field) . ']');
            }
        }
    }

    if (method_exists($widgets_manager, 'register')) {
        $widgets_manager->register(new MT_Email_Field_Widget());
    } elseif (method_exists($widgets_manager, 'register_widget_type')) {
        $widgets_manager->register_widget_type(new MT_Email_Field_Widget());
    }
});

// Elementor Editor: enqueue Email Fields insertion UI for Text Editor
add_action('elementor/editor/after_enqueue_scripts', function() {
    // Build options list of tokens to insert as plain text
    $options = array(
        array('text' => __('Name', 'main-tree'),        'value' => '[mt_email_var key="name"]'),
        array('text' => __('Subject', 'main-tree'),     'value' => '[mt_email_subject]'),
        array('text' => __('Preheader', 'main-tree'),   'value' => '[mt_email_preheader]'),
        array('text' => __('From name', 'main-tree'),   'value' => '[mt_email_from_name]'),
        array('text' => __('From email', 'main-tree'),  'value' => '[mt_email_from_email]'),
        array('text' => __('Reply-To', 'main-tree'),    'value' => '[mt_email_reply_to]'),
    );
    if (function_exists('apply_filters')) {
        $options = apply_filters('mt/email_editor_tokens', $options);
    }

    // Enqueue the small editor script and pass options
    wp_enqueue_script(
        'mt-email-editor',
        plugins_url('assets/public/mt-tinymce-email.js', __FILE__),
        array('jquery'),
        '1.1.0',
        true
    );
    // Editor-only CSS for better panel fit
    wp_enqueue_style(
        'mt-email-editor',
        plugins_url('assets/public/mt-tinymce-email.css', __FILE__),
        array(),
        '1.1.0'
    );

    $inline = 'window.mtEmailFieldsOptions = ' . wp_json_encode($options) . ';';
    wp_add_inline_script('mt-email-editor', $inline, 'before');
});

// -------------------- QUICK LINKS DASHBOARD WIDGET --------------------
/**
 * Register the Quick Links dashboard widget
 */
add_action('wp_dashboard_setup', function() {
    $links = mt_load_quick_links_store();
    // Only show widget if there are quick links configured
    if (!empty($links)) {
        wp_add_dashboard_widget(
            'mt_quick_links_widget',
            __('Quick Links', MAIN_TREE),
            'mt_render_quick_links_widget'
        );
    }
});

/**
 * Map icon keys to WordPress dashicons
 */
function mt_get_dashicon_class($icon_key) {
    $icon_map = array(
        'link' => 'dashicons-admin-links',
        'home' => 'dashicons-admin-home',
        'globe' => 'dashicons-admin-site-alt3',
        'chart' => 'dashicons-chart-line',
        'users' => 'dashicons-groups',
        'star' => 'dashicons-star-filled',
        'heart' => 'dashicons-heart',
        'book' => 'dashicons-book',
        'calendar' => 'dashicons-calendar-alt',
        'folder' => 'dashicons-portfolio',
        'image' => 'dashicons-format-image',
        'cart' => 'dashicons-cart',
        'card' => 'dashicons-money-alt',
        'bell' => 'dashicons-bell',
        'lock' => 'dashicons-lock',
        'cloud' => 'dashicons-cloud-upload',
        'database' => 'dashicons-database',
        'file' => 'dashicons-media-document',
        'play' => 'dashicons-controls-play',
        'comments' => 'dashicons-admin-comments',
        'megaphone' => 'dashicons-megaphone',
        'settings' => 'dashicons-admin-generic',
        'mail' => 'dashicons-email',
        'code' => 'dashicons-editor-code',
        'info' => 'dashicons-info',
    );
    return isset($icon_map[$icon_key]) ? $icon_map[$icon_key] : 'dashicons-admin-links';
}

/**
 * Render the Quick Links dashboard widget
 */
function mt_render_quick_links_widget() {
    $links = mt_load_quick_links_store();

    if (empty($links)) {
        echo '<p>' . esc_html__('No quick links configured.', MAIN_TREE) . '</p>';
        return;
    }

    echo '<style>
        .mt-ql-widget { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .mt-ql-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px;
            background: #f6f7f7;
            border: 1px solid #dcdcde;
            border-radius: 4px;
            text-decoration: none;
            color: inherit;
            transition: all 0.15s ease;
        }
        .mt-ql-item:hover {
            background: #fff;
            border-color: #2271b1;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .mt-ql-item:focus {
            outline: 2px solid #2271b1;
            outline-offset: 2px;
        }
        .mt-ql-label {
            font-weight: 500;
            font-size: 13px;
            color: #1d2327;
            margin-bottom: 2px;
        }
        .mt-ql-desc {
            font-size: 11px;
            color: #646970;
            line-height: 1.3;
        }
        .mt-ql-icon {
            width: 16px;
            height: 16px;
            margin-bottom: 4px;
            color: #2271b1;
        }
    </style>';

    echo '<div class="mt-ql-widget">';
    foreach ($links as $link) {
        $label = isset($link['label']) ? esc_html($link['label']) : '';
        $url = isset($link['url']) ? esc_url($link['url']) : '#';
        $description = isset($link['description']) ? esc_html($link['description']) : '';
        $icon = isset($link['icon']) ? sanitize_key($link['icon']) : 'link';
        $openInNewTab = !empty($link['openInNewTab']);
        $target = $openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        $dashicon_class = mt_get_dashicon_class($icon);

        echo '<a href="' . $url . '" class="mt-ql-item"' . $target . '>';
        echo '<span class="dashicons ' . esc_attr($dashicon_class) . ' mt-ql-icon"></span>';
        echo '<span class="mt-ql-label">' . $label . '</span>';
        if ($description) {
            echo '<span class="mt-ql-desc">' . $description . '</span>';
        }
        echo '</a>';
    }
    echo '</div>';

    // Add link to manage quick links
    $manage_url = admin_url('admin.php?page=' . MAIN_TREE . '#quick-links');
    echo '<p style="margin-top: 12px; margin-bottom: 0;"><a href="' . esc_url($manage_url) . '">' . esc_html__('Manage Quick Links', MAIN_TREE) . '</a></p>';
}
