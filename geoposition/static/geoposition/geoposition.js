if (jQuery != undefined) {
    var django = {
        'jQuery':jQuery,
    }
}
(function($) {
    
    window.geopositionMapInit = function() {
        var mapDefaults = {
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        };
        
        $('p.geoposition-widget').each(function() {
            var $container = $(this),
                $mapContainer = $('<div class="geoposition-map" />'),
                $addressRow = $('<div class="geoposition-address" />'),
                $searchRow = $('<div class="geoposition-search" />'),
                $searchInput = $('<input>', {'type': 'search', 'placeholder': 'Search …'}),
                $latitudeField = $container.find('input.geoposition:eq(0)'),
                $longitudeField = $container.find('input.geoposition:eq(1)'),
				$pathField = $container.find('input.geoposition:eq(2)'),
                latitude = parseFloat($latitudeField.val()) || 0,
                longitude = parseFloat($longitudeField.val()) || 0,
				path = parseFloat($pathField.val()) || '-',
                map,
                mapLatLng,
                mapOptions,
                marker;
            
            
            $searchInput.bind('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    var $input = $(this),
                       // gc = new google.maps.Geocoder(),
						service = new google.maps.places.PlacesService(map);
						
                    $input.parent().find('ul.geoposition-results').remove();
                    //gc.geocode({
					service.textSearch({
                        'query': $(this).val()
                    }, function(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var updatePosition = function(result) {
                                if (result.geometry.bounds) {
                                    map.fitBounds(result.geometry.bounds);
                                } else {
                                    map.panTo(result.geometry.location);
                                    map.setZoom(18);
                                }
                                marker.setPosition(result.geometry.location);
                                google.maps.event.trigger(marker, 'dragend');
                            };
                            
                            var $ul = $('<ul />', {'class': 'geoposition-results'});
                            $.each(results, function(i, result) {
                                var $li = $('<li />');
                                $li.text(result.formatted_address);
                                $li.bind('click', function() {
                                    updatePosition(result);
                                    $li.closest('ul').remove();
                                });
                                $li.appendTo($ul);
                            });
                            $input.after($ul);
							
                            // if (results.length == 1) {
                            //     updatePosition(results[0]);
                            // } else {
                            //     
                            // }
                        }
                    });
                }
            }).bind('abort', function() {
                $(this).parent().find('ul.geoposition-results').remove();
            });
            $searchInput.appendTo($searchRow);
            $container.append($mapContainer, $addressRow, $searchRow);
            
            mapLatLng = new google.maps.LatLng(latitude, longitude);
            mapOptions = $.extend({}, mapDefaults, {
                'center': mapLatLng,
                'zoom': latitude && longitude ? 15 : 1
            });
            map = new google.maps.Map($mapContainer.get(0), mapOptions);
            marker = new google.maps.Marker({
                'position': mapLatLng,
                'map': map,
                'draggable': true,
                'animation': google.maps.Animation.DROP
            });
            google.maps.event.addListener(marker, 'dragend', function() {
                $latitudeField.val(this.position.lat());
                $longitudeField.val(this.position.lng());
                
                var gc = new google.maps.Geocoder();
                gc.geocode({
                    'latLng': marker.position
                }, function(results, status) {
                    $addressRow.text('');
                    if (results[0]) {
                        $addressRow.text(results[0].formatted_address);
						
						var path = "/";
						
						var length = results[0].address_components.length
						for (var i = 0; i < length; i++) {
							result = results[0].address_components[i];
							path.concat('/');
							path.concat(result.long_name);
						}
						$pathField.val(path)
                    }
                });
            });
            google.maps.event.trigger(marker, 'dragend');
        });
        
    };
    
    $(document).ready(function() {
        var $script = $('<script/>');
        $script.attr('src', 'https://maps.google.com/maps/api/js?libraries=places&sensor=false&callback=geopositionMapInit');
        $script.appendTo('body');
    });
})(django.jQuery);
