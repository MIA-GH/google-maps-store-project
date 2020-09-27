window.onload = () => {
    displayStores();
}

let map;
let markers = [];
let infowindow;

function initMap() {
  let losangeles = {
    lat: 34.052235,
    lng: -118.243683,
  };

  map = new google.maps.Map(document.getElementById("map"), {
    center: losangeles,
    zoom: 11,
    mapTypeId: "roadmap",
  });
  infowindow = new google.maps.InfoWindow();
  showStoresMarkers();
}

function displayStores(){
    let storesHtml = '';
    for (let [index, store] of stores.entries()){
        let address = store['addressLines'];
        let phone = store['phoneNumber'];
        storesHtml += `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">
                        ${phone}
                    </div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${++index}
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(){
    let bounds = new google.maps.LatLngBounds();
    for (let [index, store] of stores.entries()){
        let latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"],
        );
        let name = store['name'];
        let address = store['addressLines'][0];
        bounds.extend(latlng);
        createMarker(latlng, name, address, ++index);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index){
    let html = "<br>" + name + "</br> <br/>" + address;
    let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString(),
    });
    google.maps.event.addListener(marker, 'click', function(){
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
    markers.push(marker);
}
