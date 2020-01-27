/* eslint-disable no-undef,no-new */
export default {
  inserted (mapEl, bindings) {
    const property = bindings.value
    const propertyPos = property.geometry.location
    const map = new google.maps.Map(mapEl, {
      zoom: 15,
      center: propertyPos
    })
    new google.maps.Marker({
      position: propertyPos,
      map,
      icon: { url: property.icon, scaledSize: new google.maps.Size(35, 35) }
    })
    let bounds = new google.maps.LatLngBounds()
    bounds.extend(propertyPos)
    property.services.forEach((service) => {
      const marker = new google.maps.Marker({
        position: { lat: service.latitude, lng: service.longitude },
        map,
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png',
          origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(35, 35),
          title: service.name
        }
      })
      var infowindow = new google.maps.InfoWindow()
      setTimeout(() => {
        let catchType = ''
        if (service.catch_type.includes('_')) {
          let strArr = service.catch_type.split('_')
          catchType = strArr[0] + ' - ' + strArr[1]
        } else {
          catchType = service.catch_type
        }
        const content = '<div>' +
          '<div class="map-info-title">' +
            '<p class="text-left">PUBLIC ' + catchType + '</p>' +
          '</div>' +
          '<div class="map-info-content">' +
            '<p class="text-left">' + service.school_name + '</p>' +
          '</div>' +
        '</div>'
        infowindow.setContent(content)
        infowindow.open(map, marker)
      }, 50)
      bounds.extend({ lat: service.latitude, lng: service.longitude })
    })
    map.fitBounds(bounds)
  }
}
