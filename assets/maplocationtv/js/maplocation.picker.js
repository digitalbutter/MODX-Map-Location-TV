MODx.form.locationPicker = Ext.extend(Ext.form.Field, {
	defaultAutoCreate: {
		tag: 'input',
		type: 'hidden'
	},
	initComponent: function () {
		MODx.form.locationPicker.superclass.initComponent.call(this);
		var textFieldConfig = {
			width: 150,
			listeners: {
				blur: {
					fn: this.onBlur,
					scope: this
				},
				focus: {
					fn: this.onFocus,
					scope: this
				}
			}
		};
		this.lat = new Ext.form.TextField(textFieldConfig);
		this.lat.ownerCt = this;
		this.lng = new Ext.form.TextField(textFieldConfig);
		this.lng.ownerCt = this;
		this.picker = new Ext.Button({
			style: 'background: url("' + MODx.config.assets_url + 'components/maplocationtv/images/marker.png") center center no-repeat',
			width: 34
		});
		this.picker.ownerCt = this;
		var events = ['focus'];
		this.relayEvents(this.lat, events);
		this.relayEvents(this.lng, events);
	},
	onRender: function (ct, position) {
		if (this.isRendered) {
			return;
		}
		MODx.form.locationPicker.superclass.onRender.call(this, ct, position);
		var table = Ext.DomHelper.append(ct, {
			tag: 'table',
			style: 'border-collapse: collapse',
			children: [{
				tag: 'tr',
				children: [{
					tag: 'td',
					style: 'padding-right: 4px',
					cls: 'map-location-lat'
				}, {
					tag: 'td',
					style: 'padding-right: 4px',
					cls: 'map-location-lng'
				}, {
					tag: 'td',
					cls: 'map-location-picker'
				}]
			}]
		}, true);
		this.lat.render(table.child('td.map-location-lat'));
		this.lng.render(table.child('td.map-location-lng'));
		this.picker.render(table.child('td.map-location-picker'));
		this.tableContainer = table;
		this.lat.el.dom.removeAttribute('name');
		this.lng.el.dom.removeAttribute('name');
		this.picker.el.dom.removeAttribute('name');
		var mapCenter = {};
		var parts = this.value.split(';', 2);
		var success = false;
		if (parts.length == 2) {
			parts[0] = parseFloat(parts[0]);
			parts[1] = parseFloat(parts[1]);
			if (!isNaN(parts[0]) && !isNaN(parts[1])) {
				mapCenter.lat = parts[0];
				mapCenter.lng = parts[1];
				success = true;
			}
		}
		if (!success) {
			if (this.mapConfig.center.type == 'address') {
				mapCenter.geoCodeAddr = this.mapConfig.center.address;
			} else {
				mapCenter.lat = this.mapConfig.center.latitude;
				mapCenter.lng = this.mapConfig.center.longitude;
			}
		}
		this.mapWindow = new Ext.Window({
			layout: 'border',
			title: _('maplocationtv.window_title'),
			closeAction: 'hide',
			width: 600,
			height: 400,
			minWidth: 600,
			minHeight: 400,
			x: (Ext.getBody().getViewSize().width - 600) / 2,
			y: (Ext.getBody().getViewSize().height - 400) / 2,
			defaults: {
				collapsible: false,
				split: false
			},
			id: this.id + '-popup',
			items: [{
				region: 'west',
				width: 200,
				layout: 'form',
				labelAlign: 'top',
				autoHeight: true,
				labelSeparator: '',
				bodyStyle: 'padding: 10px',
				border: false,
				defaults: {
					border: false
				},
				items: [{
					xtype: 'textfield',
					fieldLabel: _('maplocationtv.latitude'),
					id: this.id + '-popup-lat',
					anchor: '100%',
					listeners: {
						change: {
							fn: function (field, value) {
								this.displayMarker();
							},
							scope: this
						}
					}
				}, {
					xtype: 'textfield',
					fieldLabel: _('maplocationtv.longitude'),
					id: this.id + '-popup-lng',
					anchor: '100%',
					listeners: {
						change: {
							fn: function (field, value) {
								this.displayMarker();
							},
							scope: this
						}
					}
				}, {
					xtype: 'textarea',
					fieldLabel: _('maplocationtv.address'),
					id: this.id + '-popup-address',
					height: 120,
					anchor: '100%'
				}],
				buttons: [{
					text: _('maplocationtv.find'),
					hidden: true,
					id: this.id + '-popup-find',
					listeners: {
						click: {
							fn: function () {
								var map = Ext.getCmp(this.id + '-map');
								if (map.cache.marker.length == 0) {
									return;
								}
								var field = Ext.getCmp(this.id + '-popup-address');
								var address = field ? field.getValue().trim() : '';
								if (address != '') {
									if (!map.geocoder) {
										map.geocoder = new google.maps.Geocoder();
									}
									map.geocoder.geocode({
										address: address
									}, function (response, status) {
										if (!response || status !== 'OK') {
											map.respErrorMsg(status);
										} else {
											var place = response[0].geometry.location;
											var accuracy = map.getLocationTypeInfo(response[0].geometry.location_type, 'level');
											var reqAccuracy = map.getLocationTypeInfo(map.minGeoAccuracy, 'level');
											if (accuracy === 0) {
												map.geoErrorMsg(this.geoErrorTitle, map.geoErrorMsgUnable);
											} else {
												if (accuracy < reqAccuracy) {
													map.geoErrorMsg(map.geoErrorTitle, String.format(map.geoErrorMsgAccuracy, response[0].geometry.location_type, map.getLocationTypeInfo(response[0].geometry.location_type, 'msg')));
												} else {
													field.setValue('');
													var point = new google.maps.LatLng(place.lat(), place.lng());
													map.getMap().setCenter(point, map.zoomLevel);
													var marker = map.cache.marker[0];
													marker.setPosition(point);
													google.maps.event.trigger(marker, 'dragend');
												}
											}
										}
									});
								}
							},
							scope: this
						}
					}
				}, {
					text: _('maplocationtv.save'),
					hidden: true,
					id: this.id + '-popup-save',
					listeners: {
						click: {
							fn: function () {
								var field = Ext.getCmp(this.id + '-popup-lat');
								var lat = parseFloat(field ? field.getValue().trim() : '');
								field = Ext.getCmp(this.id + '-popup-lng');
								var lng = parseFloat(field ? field.getValue().trim() : '');
								this.setValue((isNaN(lat) ? 0 : lat) + ';' + (isNaN(lng) ? 0 : lng));
								this.mapWindow.hide();
								this.onBlur(this);
							},
							scope: this
						}
					}
				}]
			}, {
				region: 'center',
				layout: 'fit',
				xtype: 'gmappanel',
				zoomLevel: this.mapConfig.zoomLevel || 14,
				gmapType: 'map',
				id: this.id + '-map',
				mapConfOpts: [
					'enableScrollWheelZoom',
					'enableDoubleClickZoom',
					'enableDragging'
				],
				displayGeoErrors: true,
				minGeoAccuracy: 1,
				setCenter: mapCenter
			}]
		});
		this.picker.on('click', this.showMapWindow, this);
		this.isRendered = true;
		this.updateHidden();
	},
	focus: function () {
		this.lat.focus();
	},
	onBlur: function (f) {
		this.updateHidden();
		this.validate();
		(function () {
			if (!this.lat.hasFocus && !this.lng.hasFocus) {
				var value = this.getValue();
				if (String(value) !== String(this.startValue)) {
					this.fireEvent('change', this, value, this.startValue);
				}
				this.hasFocus = false;
				this.fireEvent('blur', this);
			}
		}).defer(100, this);
	},
	onFocus: function () {
		if(!this.hasFocus) {
      this.hasFocus = true;
			this.startValue = this.getValue();
			this.fireEvent('focus', this);
		}
	},
	clearInvalid: function () {
		this.lat.clearInvalid();
		this.lng.clearInvalid();
	},
	markInvalid: function (msg) {
		this.lat.markInvalid(msg);
		this.lng.markInvalid(msg);
	},
	setValue: function (val) {
		var parts = val.split(';', 2);
		if (parts.length > 0) {
			this.setLat(parts[0]);
			this.setLng(parts.length == 2 ? parts[1] : '');
		} else {
			this.setLat('');
			this.setLng('');
		}
		this.updateHidden();
	},
	reset: function (val) {
		this.setValue(this.originalValue);
	},
	setLat: function (val) {
		this.lat.setValue(val);
	},
	setLng: function (val) {
		this.lng.setValue(val);
	},
	setVisible: function (visible) {
		if (visible) {
			this.lat.show();
			this.lng.show();
			this.picker.show();
		} else {
			this.lat.hide();
			this.lng.hide();
			this.picker.hide();
		}
		return this;
	},
	show: function () {
		return this.setVisible(true);
	},
	hide: function () {
		return this.setVisible(false);
	},
	disable: function () {
		this.disabled = true;
		if (this.isRendered) {
			this.lat.disabled = this.disabled;
			this.lng.disabled = this.disabled;
			this.picker.disabled = this.disabled;
			this.mapWindow.hide();
			this.lat.onDisable();
			this.lng.onDisable();
			this.picker.onDisable();
		}
		this.fireEvent('disable', this);
		return this;
	},
	enable: function () {
		this.disabled = false;
		if (this.isRendered) {
			this.lat.disabled = this.disabled;
			this.lng.disabled = this.disabled;
			this.picker.disabled = this.disabled;
			this.lat.onEnable();
			this.lng.onEnable();
			this.picker.onEnable();
		}
		this.fireEvent('enable', this);
		return this;
	},
	displayMarker: function () {
		var map = Ext.getCmp(this.id + '-map');
		var gMap = map.getMap();
		if (typeof gMap !== 'undefined') {
			if (map.cache.marker.length > 0) {
				var field = Ext.getCmp(this.id + '-popup-lat');
				var lat = parseFloat(field ? field.getValue().trim() : '');
				field = Ext.getCmp(this.id + '-popup-lng');
				var lng = parseFloat(field ? field.getValue().trim() : '');
				if (!isNaN(lat) && !isNaN(lng)) {
					var marker = map.cache.marker[0];
					var point;
					point = new google.maps.LatLng(lat, lng);
					gMap.setCenter(point, map.zoomLevel);
					marker.setPosition(point);
				}
			}
		}
	},
	showMapWindow: function () {
		this.onFocus();
		var map = Ext.getCmp(this.id + '-map');
		var id = this.id;
		var listeners = {
			dragend: function (event) {
				var position = this.getPosition();
				var field = Ext.getCmp(id + '-popup-lat');
				if (field) {
					field.setValue(position.lat());
				}
				field = Ext.getCmp(id + '-popup-lng');
				if (field) {
					field.setValue(position.lng());
				}
			}
		};
		var lat = this.lat.getValue().trim();
		var lng = this.lng.getValue().trim();
		var mapConfig = this.mapConfig;
		Ext.getCmp(id + '-popup-find').hide();
		Ext.getCmp(id + '-popup-save').hide();
		var showButtons = function () {
			Ext.getCmp(id + '-popup-find').show();
			Ext.getCmp(id + '-popup-save').show();
		};
		var markerOptions = {
			title: _('maplocationtv.current_position'),
			draggable: true
		};
		var callback = function () {
			Ext.each(map.cache.marker, function (mrk) {
				mrk.setMap(null);
			});
			map.cache.marker = [];
			var marker = null;
			if (lat != '' && lng != '') {
				marker = map.addMarker(new google.maps.LatLng(lat, lng), markerOptions, true, true, listeners);
				showButtons();
			} else {
				if (mapConfig.center.type == 'address') {
					map.geoCodeLookup(mapConfig.center.address, Ext.apply({}, {
						callback: function (marker) {
							google.maps.event.trigger(marker, 'dragend');
							showButtons();
						}
					}, markerOptions), true, true, listeners);
				} else {
					marker = map.addMarker(new google.maps.LatLng(mapConfig.center.latitude, mapConfig.center.longitude), markerOptions, true, true, listeners);
					showButtons();
				}
			}
			if (marker) {
				google.maps.event.trigger(marker, 'dragend');
			}
		};
		if (typeof map.getMap() === 'undefined') {
			map.on('mapready', callback);
		} else {
			callback();
		}
		this.mapWindow.show();
	},
	updateHidden: function () {
		if (this.isRendered) {
			this.el.dom.value = this.lat.getValue() + ';' + this.lng.getValue();
		}
	},
	validate: function () {
		return this.lat.validate() && this.lng.validate();
	},
	beforeDestroy: function () {
		if (this.isRendered) {
			this.tableContainer.remove();
			this.lat.destroy();
			this.lng.destroy();
			this.picker.destroy();
		}
	}
});
Ext.reg('map-location-picker', MODx.form.locationPicker);
