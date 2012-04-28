<?php
$corePath = $modx->getOption('maplocationtv.core_path', null, $modx->getOption('core_path') . 'components/maplocationtv/');
switch ($modx->event->name) {
	case 'OnTVInputRenderList':
		$modx->lexicon->load('maplocationtv:tv_widget');
		$modx->event->output($corePath . 'elements/tv/input/');
		break;
	case 'OnTVInputPropertiesList':
		$modx->event->output($corePath . 'elements/tv/inputoptions/');
		break;
	case 'OnDocFormPrerender':
		$modx->response->addLangTopic('maplocationtv:tv_widget');
		$modx->regClientStartupScript('http://maps.googleapis.com/maps/api/js?v=3&sensor=false');
		$modx->regClientStartupScript($modx->getOption('assets_url') . 'components/maplocationtv/js/Ext.ux.GMapPanel3.js');
		$modx->regClientStartupScript($modx->getOption('assets_url') . 'components/maplocationtv/js/maplocation.picker.js');
		break;
}
return '';