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
 * Expected payload: { name: string, fields: [ { type: 'text'|'email'|'textarea', label: string, name: string, required?: bool } ] }
 */
function mt_forms_create(WP_REST_Request $request) {
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
    $id = uniqid('f_', true);
    $newForm = array(
        'id' => $id,
        'name' => $name,
        'fields' => $sanitized_fields,
    );
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
