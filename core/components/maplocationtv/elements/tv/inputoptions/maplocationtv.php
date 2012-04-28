<?php
$modx->lexicon->load('tv_widget', 'maplocationtv:tv_widget');
$modx->smarty->assign('base_url', $modx->getOption('base_url'));
$modx->smarty->assign('gmLang', $modx->lexicon->fetch('maplocationtv.props.', true));
return $modx->smarty->fetch($modx->getOption('maplocationtv.core_path', null, $modx->getOption('core_path') . 'components/maplocationtv/') . 'elements/tv/tv.maplocationtv.inputoptions.tpl');