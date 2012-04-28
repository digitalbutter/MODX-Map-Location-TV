<?php
$mtime = microtime();
$mtime = explode(' ', $mtime);
$mtime = $mtime[1] + $mtime[0];
$tstart = $mtime;
set_time_limit(0);

define('PKG_NAME', 'Map Location TV');
define('PKG_NAME_LOWER', 'maplocationtv');
define('PKG_VERSION', '0.1');
define('PKG_RELEASE', 'beta');

$root = dirname(dirname(__FILE__)) . '/';
$sources = array(
	'root' => $root,
	'build' => $root . '_build/',
	'resolvers' => $root . '_build/resolvers/',
	'data' => $root . '_build/data/',
	'events' => $root . '_build/data/events/',
	'permissions' => $root . '_build/data/permissions/',
	'properties' => $root . '_build/data/properties/',
	'source_core' => $root . 'core/components/' . PKG_NAME_LOWER,
	'source_assets' => $root . 'assets/components/' . PKG_NAME_LOWER,
	'plugins' => $root . 'core/components/' . PKG_NAME_LOWER . '/elements/plugins/',
	'snippets' => $root . 'core/components/' . PKG_NAME_LOWER . '/elements/snippets/',
	'lexicon' => $root . 'core/components/' . PKG_NAME_LOWER . '/lexicon/',
	'docs' => $root . 'core/components/' . PKG_NAME_LOWER . '/docs/',
	'model' => $root . 'core/components/' . PKG_NAME_LOWER . '/model/',
);
unset($root);

require_once $sources['build'] . 'includes/functions.php';
require_once $sources['build'] . 'build.config.php';
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';

$modx = new modX();
$modx->initialize('mgr');
$modx->setLogLevel(modX::LOG_LEVEL_INFO);
$modx->setLogTarget('ECHO');
echo '<pre>';
flush();

$modx->loadClass('transport.modPackageBuilder', '', false, true);
$builder = new modPackageBuilder($modx);
$builder->createPackage(PKG_NAME_LOWER, PKG_VERSION, PKG_RELEASE);
$builder->registerNamespace(PKG_NAME_LOWER, false, true, '{core_path}components/' . PKG_NAME_LOWER . '/');

$plugins = include $sources['data'] . 'transport.plugins.php';
if (!is_array($plugins)) {
	$modx->log(modX::LOG_LEVEL_FATAL, 'Adding plugins failed.');
}
$attributes = array(
	xPDOTransport::UNIQUE_KEY => 'name',
	xPDOTransport::PRESERVE_KEYS => false,
	xPDOTransport::UPDATE_OBJECT => true,
	xPDOTransport::RELATED_OBJECTS => true,
	xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array(
		'PluginEvents' => array(
			xPDOTransport::PRESERVE_KEYS => true,
			xPDOTransport::UPDATE_OBJECT => false,
			xPDOTransport::UNIQUE_KEY => array(
				'pluginid',
				'event',
			),
		),
	),
);
foreach ($plugins as $i => $plugin) {
	$vehicle = $builder->createVehicle($plugin, $attributes);
	if ($i > 0) {
		$builder->putVehicle($vehicle);
	}
}
$modx->log(modX::LOG_LEVEL_INFO, 'Packaged in ' . count($plugins) . ' Plugins.');
flush();
unset($plugins, $plugin, $attributes);

$vehicle->resolve('file', array(
	'source' => $sources['source_core'],
	'target' => "return MODX_CORE_PATH . 'components/';",
));
$vehicle->resolve('file', array(
	'source' => $sources['source_assets'],
	'target' => "return MODX_ASSETS_PATH . 'components/';",
));
$modx->log(modX::LOG_LEVEL_INFO, 'Packaged in resolvers.');
flush();
$builder->putVehicle($vehicle);

$builder->setPackageAttributes(array(
	'license' => file_get_contents($sources['docs'] . 'license.txt'),
	'readme' => file_get_contents($sources['docs'] . 'readme.txt'),
	'changelog' => file_get_contents($sources['docs'] . 'changelog.txt'),
));
$modx->log(modX::LOG_LEVEL_INFO, 'Packaged in package attributes.');
flush();

$modx->log(modX::LOG_LEVEL_INFO, 'Packing...');
flush();
$builder->pack();

$mtime = microtime();
$mtime = explode(' ', $mtime);
$mtime = $mtime[1] + $mtime[0];
$tend = $mtime;
$totalTime = ($tend - $tstart);
$totalTime = sprintf('%2.4f s', $totalTime);

$modx->log(modX::LOG_LEVEL_INFO, "\n<br />Package Built.<br />\nExecution time: {$totalTime}\n");

exit;
