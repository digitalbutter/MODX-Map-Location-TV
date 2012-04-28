<?php
class modTemplateVarInputRenderMapLocationTV extends modTemplateVarInputRender
{
	public function process($value, array $params = array())
	{
		$zoomLevel = intval($this->modx->getOption('zoomLevel', $params, 14));
		if ($zoomLevel < 0) {
			$zoomLevel = 14;
		}
		$params['zoomLevel'] = $zoomLevel;
		if (!isset($params['centerType'])) {
			$params['centerType'] = 'coordinates';
		}
		$params['address'] = trim($params['address']);
		if ($params['centerType'] == 'address' && empty($params['address'])) {
			$params['centerType'] = 'coordinates';
		}
		$this->setPlaceholder('properties', $params);
	}

	public function getTemplate()
	{
		$corePath = $this->modx->getOption('maplocationtv.core_path', null, $this->modx->getOption('core_path') . 'components/maplocationtv/');
		return $corePath . 'elements/tv/tv.maplocationtv.input.tpl';
	}

	public function getLexiconTopics()
	{
		return array_merge(parent::getLexiconTopics(), array(
			'maplocationtv:tv_widget',
		));
	}
}

return 'modTemplateVarInputRenderMapLocationTV';
