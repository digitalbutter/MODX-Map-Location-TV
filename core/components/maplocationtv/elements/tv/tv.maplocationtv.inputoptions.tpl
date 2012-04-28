<div id="tv-input-properties-form{$tv}"></div>
{literal}
    <script type="text/javascript">
    // <![CDATA[
        var params = {
            {/literal}{foreach from=$params key=k item=v name='p'}
                '{$k}': '{$v|escape:'javascript'}'{if not $smarty.foreach.p.last},{/if}
            {/foreach}{literal}
        };
        var oc = {
            change: {
                fn: function (el) {
                    if (el.name == 'inopt_centerType') {
                        if (el.getValue() == 'address') {
                            Ext.getCmp('inopt_latitude{/literal}{$tv}{literal}').hide();
                            Ext.getCmp('inopt_longitude{/literal}{$tv}{literal}').hide();
                            Ext.getCmp('inopt_address{/literal}{$tv}{literal}').show();
                        } else {
                            Ext.getCmp('inopt_latitude{/literal}{$tv}{literal}').show();
                            Ext.getCmp('inopt_longitude{/literal}{$tv}{literal}').show();
                            Ext.getCmp('inopt_address{/literal}{$tv}{literal}').hide();
                        }
                    }
                    Ext.getCmp('modx-panel-tv').markDirty();
                },
                scope: this
            }
        };
        var zoomLevels = [];
        for (var i = 0; i < 18; i++) {
            zoomLevels.push([i, i]);
        }
        MODx.load({
            xtype: 'panel',
            layout: 'form',
            cls: 'form-with-labels',
            autoHeight: true,
            border: false,
            labelAlign: 'top',
            labelSeparator: '',
            items: [{
                xtype: 'combo-boolean',
                fieldLabel: _('required'),
                description: MODx.expandHelp ? '' : _('required_desc'),
                name: 'inopt_allowBlank',
                hiddenName: 'inopt_allowBlank',
                id: 'inopt_allowBlank{/literal}{$tv}{literal}',
                value: params['allowBlank'] == 0 || params['allowBlank'] == 'false' ? false : true,
                width: 300,
                listeners: oc
            }, {
                xtype: MODx.expandHelp ? 'label' : 'hidden',
                forId: 'inopt_allowBlank{/literal}{$tv}{literal}',
                html: _('required_desc'),
                cls: 'desc-under'
            }, {
                xtype: 'combo',
                store: zoomLevels,
                fieldLabel: '{/literal}{$gmLang.zoomLevel}{literal}',
                name: 'inopt_zoomLevel',
                hiddenName: 'inopt_zoomLevel',
                forceSelection: true,
                typeAhead: false,
                editable: false,
                triggerAction: 'all',
                id: 'inopt_zoomLevel{/literal}{$tv}{literal}',
                value: params['zoomLevel'] || 14,
                width: 300,
                listeners: oc
            }, {
                xtype: 'combo',
                store: [[
                    'coordinates',
                    '{/literal}{$gmLang.centerType_coordinates}{literal}'
                ], [
                    'address',
                    '{/literal}{$gmLang.centerType_address}{literal}'
                ]],
                fieldLabel: '{/literal}{$gmLang.centerType}{literal}',
                name: 'inopt_centerType',
                hiddenName: 'inopt_centerType',
                forceSelection: true,
                typeAhead: false,
                editable: false,
                triggerAction: 'all',
                id: 'inopt_centerType{/literal}{$tv}{literal}',
                value: params['centerType'] || 'coordinates',
                width: 300,
                listeners: oc
            }, {
                xtype: 'textfield',
                fieldLabel: '{/literal}{$gmLang.latitude}{literal}',
                name: 'inopt_latitude',
                hiddenName: 'inopt_latitude',
                id: 'inopt_latitude{/literal}{$tv}{literal}',
                value: params['latitude'] || '',
                hidden: params['centerType'] == 'address',
                width: 300,
                listeners: oc
            }, {
                xtype: 'textfield',
                fieldLabel: '{/literal}{$gmLang.longitude}{literal}',
                name: 'inopt_longitude',
                hiddenName: 'inopt_longitude',
                id: 'inopt_longitude{/literal}{$tv}{literal}',
                value: params['longitude'] || '',
                hidden: params['centerType'] == 'address',
                width: 300,
                listeners: oc
            }, {
                xtype: 'textfield',
                fieldLabel: '{/literal}{$gmLang.address}{literal}',
                name: 'inopt_address',
                hiddenName: 'inopt_address',
                id: 'inopt_address{/literal}{$tv}{literal}',
                value: params['address'] || '',
                hidden: (params['centerType'] || 'coordinates') == 'coordinates',
                width: 300,
                listeners: oc
            }],
            renderTo: 'tv-input-properties-form{/literal}{$tv}{literal}'
        });
    // ]]>
    </script>
{/literal}