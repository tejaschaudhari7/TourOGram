//const campground = require("../../models/campground");

//const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', 
    //streets-v11'
    center: destination.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
    // Create a new marker.
    const popup =  new mapboxgl.Popup({offset : 25})
            .setHTML(
                `<h3>${destination.title}</h3><p>${destination.location}</p>`
            )
    const marker = new mapboxgl.Marker()
        .setLngLat(destination.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);