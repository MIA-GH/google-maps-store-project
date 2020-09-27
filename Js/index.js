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
}
