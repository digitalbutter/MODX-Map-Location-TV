<input id="tv{$tv->id}" type="hidden" value="{$tv->value}" name="tv{$tv->id}"/>
<script type="text/javascript">
    // <![CDATA[
        {literal}
            Ext.onReady(function () {
                var field = MODx.load({
                    {/literal}
                        xtype: 'map-location-picker',
                        applyTo: 'tv{$tv->id}',
                        tv: '{$tv->id}',
                        id: 'tv{$tv->id}',
                        name: 'tv{$tv->id}',
                        tvtype: '{$tv->type}',
                        wctx: '{$myctx}',
                        value: '{$tv->get('value')|escape:'javascript'}',
                        msgTarget: 'under',
                        allowBlank: {if $properties.allowBlank == 1 || $properties.allowBlank == 'true'}true{else}false{/if},
                    {literal}
                    listeners: {
                        change: {
                            fn: MODx.fireResourceFormChange,
                            scope: this
                        }
                    },
                    mapConfig: {
                        zoomLevel: {/literal}{$properties.zoomLevel}{literal},
                        center: {
                            type: '{/literal}{$properties.centerType}{literal}',
                            address: '{/literal}{$properties.address|default:'Украина, Одесская обл., г. Ильичевск'|escape:'javascript'}{literal}',
                            latitude: {/literal}{$properties.latitude|default:'46.3055'}{literal},
                            longitude: {/literal}{$properties.longitude|default:'30.662245'}{literal}
                        }
                    }
                });
                Ext.getCmp('modx-panel-resource').getForm().add(field);
            });
        {/literal}
    // ]]>
</script>