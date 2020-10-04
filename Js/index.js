window.onload = () => {
  // displayStores();
};

let map;
let markers = [];
let infowindow;

// initialize the map
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
  searchStores();
}

// searching for stores with zip code
function searchStores() {
  let foundStores = [];
  let zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    for (let store of stores) {
      let postal = store["address"]["postalCode"].substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocation();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocation() {
  infowindow.close();
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

// linking list and the store info window
// function setOnClickListener(){
//     let storeElements = document.querySelectorAll('.store-container');
//     storeElements.forEach(function(storeElement, index){
//         storeElement.addEventListener('click', function(){
//             google.maps.event.trigger(markers[index], 'click');
//         })
//     })
// }

// alternative of the set onclick listener on the store containers

function setOnClickListener() {
  let storeElements = document.querySelectorAll(".store-container");
  for (let [index, storeElement] of storeElements.entries()) {
    storeElement.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  }
}

// displaying stores
function displayStores(stores) {
  let storesHtml = "";
  for (let [index, store] of stores.entries()) {
    let address = store["addressLines"];
    let phone = store["phoneNumber"];
    storesHtml += `
            <div class="store-container">
            <div class="store-container-background">
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
            </div>
        `;
    document.querySelector(".stores-list").innerHTML = storesHtml;
  }
}

// show the store markers
function showStoresMarkers(stores) {
  let bounds = new google.maps.LatLngBounds();
  for (let [index, store] of stores.entries()) {
    let latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    let name = store["name"];
    let address = store["addressLines"][0];
    let openStatusText = store["openStatusText"];
    let phoneNumber = store["phoneNumber"];
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phoneNumber, ++index);
  }
  map.fitBounds(bounds);
}

// creating the markers
function createMarker(
  latlng,
  name,
  address,
  openStatusText,
  phoneNumber,
  index
) {
  let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `;

  // initialize a new marker
  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
  });

  // market eventlistener
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
  markers.push(marker);
}
