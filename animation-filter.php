<?php
/**
 * Animation Filter
 *
 * @since       0.1.0
 * @version     0.1.0
 * @author      VeryTwisty
 * @license     GPL-3.0-or-later
 *
 * @noinspection    ALL
 *
 * @wordpress-plugin
 * Plugin Name:             Animation Filter
 * Description:             Example block scaffolded with Create Block tool.
 * Version:                 0.1.0
 * Requires at least:       6.1
 * Requires PHP:            8.1
 * Author:                  WordPress.com Special Projects
 * Author URI:              https://wpspecialprojects.wordpress.com/
 * License:                 GPL-3.0-or-later
 * License URI:             https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:             animation-filter
 * Domain Path:             /languages
 */

defined( 'ABSPATH' ) || exit;

// Define plugin constants.
function_exists( 'get_plugin_data' ) || require_once ABSPATH . 'wp-admin/includes/plugin.php';
define( 'ANIMATION_FILTERS_METADATA', get_plugin_data( __FILE__, false, false ) );

define( 'ANIMATION_FILTERS_DIR', plugin_dir_path( __FILE__ ) );
define( 'ANIMATION_FILTERS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueue Gutenberg filters for the backend.
 *
 * @return void
 */
function animation_filters_enqueue_editor_assets() {

	$asset_meta = include ANIMATION_FILTERS_DIR . '/build/index.asset.php';

	wp_enqueue_script(
		'animation-filters',
		ANIMATION_FILTERS_URL . '/build/index.js',
		$asset_meta['dependencies'],
		$asset_meta['version'],
		false
	);
}

add_action( 'enqueue_block_editor_assets', 'animation_filters_enqueue_editor_assets' );

/**
 * Enqueue Gutenberg css from the front and backend.
 *
 * @return void
 */
function animation_filters_enqueue_block_assets() {
	$asset_meta = include ANIMATION_FILTERS_DIR . '/build/index.asset.php';

	wp_enqueue_style(
		'animation-filters',
		ANIMATION_FILTERS_URL . '/build/index.css',
		array(),
		$asset_meta['version']
	);
}

add_action( 'enqueue_block_assets', 'animation_filters_enqueue_block_assets' );

/**
 * Add the frontend JavaScript.
 *
 * @return void
 */
function animation_filters_enqueue_js() {
	$asset_meta = include ANIMATION_FILTERS_DIR . '/build/view.asset.php';

	wp_enqueue_script(
		'animation-filters-fe-js',
		ANIMATION_FILTERS_URL . '/build/view.js',
		$asset_meta['dependencies'],
		$asset_meta['version'],
		true
	);
}

add_action( 'wp_enqueue_scripts', 'animation_filters_enqueue_js' );
