<?php
$events = array();

$events['OnTVInputRenderList'] = $modx->newObject('modPluginEvent');
$events['OnTVInputRenderList']->fromArray(array(
	'event' => 'OnTVInputRenderList',
	'priority' => 0,
	'propertyset' => 0,
), '', true, true);

$events['OnTVInputPropertiesList'] = $modx->newObject('modPluginEvent');
$events['OnTVInputPropertiesList']->fromArray(array(
	'event' => 'OnTVInputPropertiesList',
	'priority' => 0,
	'propertyset' => 0,
), '', true, true);

$events['OnDocFormPrerender'] = $modx->newObject('modPluginEvent');
$events['OnDocFormPrerender']->fromArray(array(
	'event' => 'OnDocFormPrerender',
	'priority' => 0,
	'propertyset' => 0,
), '', true, true);

return $events;
