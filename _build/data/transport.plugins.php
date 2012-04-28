<?php
$plugins = array();

$plugins[0] = $modx->newObject('modPlugin');
$plugins[0]->fromArray(array(
	'name' => 'MapLocationTV',
	'description' => '',
	'plugincode' => getSnippetContent($sources['source_core'] . '/elements/plugins/plugin.maplocationtv.php'),
	'category' => 0,
));
$plugins[0]->set('id', 1);

$events = include $sources['data'] . 'events/events.maplocationtv.php';
if (is_array($events) && !empty($events)) {
	$plugins[0]->addMany($events);
	$modx->log(xPDO::LOG_LEVEL_INFO, 'Packaged in ' . count($events) . ' Plugin Events');
	flush();
} else {
	$modx->log(xPDO::LOG_LEVEL_ERROR, 'Could not find plugin events!');
}
unset($events);

return $plugins;
