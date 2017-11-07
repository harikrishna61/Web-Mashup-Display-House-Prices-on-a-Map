// Put your zillow.com API key here
var zwsid = "X1-ZWz18ysx2bvytn_17jma";
var adresses=" ";
var lab;
var markers=[];

function sendRequest (map,geocoder) {
    var request = new XMLHttpRequest();
    var find_add=document.getElementById('find_Zestimate').value;
    var addr=find_add.split(',');
    var address = encodeURI(addr[0]);
    var c=addr[1].trim();
    var city = encodeURI(c);
    var state =encodeURI( addr[2].slice(1,3));
    var zipcode = encodeURI(addr[2].slice(4));
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.onreadystatechange =function (){
        if (request.readyState == 4) {
            var xml = request.responseXML.documentElement;
            // document.write(xml.getElementsByTagName("zestimate")[0].innerHTML);
            var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;

            var address= addr[0]+", "+addr[1].trim()+" "+addr[2].slice(1,3)+" "+addr[2].slice(4);
            lab=address+", Estimate: "+value;
            adresses+=lab+"<br>";
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
                    mark(results[0].geometry.location,map,lab);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
            document.getElementById("output").innerHTML=adresses;
        }
    }
    request.send(null);
}
function initialize() {
    var uluru = {lat: 32.75, lng: -97.13};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: uluru
    });
    var geocoder = new google.maps.Geocoder();
    var add = "UT Arlington, Not For Sale";
    mark(uluru, map, add);
    document.getElementById('submit').addEventListener('click', function () {
        sendRequest(map,geocoder);
    });
    google.maps.event.addListener(map, 'click', function (e) {
        var latitude = e.latLng.lat();
        var longitude = e.latLng.lng();
        var location = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
        sendRequest_from_map(map,geocoder,location);
    });
}
function sendRequest_from_map(map,geocoder,location){
    var request = new XMLHttpRequest();

    geocoder.geocode({'location': location}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                var addre=results[0].formatted_address;
                var addr=addre.split(',');
                var address = encodeURI(addr[0]);
                var c=addr[1].trim();
                var city = encodeURI(c);
                var state =encodeURI( addr[2].slice(1,3));
                var zipcode = encodeURI(addr[2].slice(4));
                request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
                request.withCredentials = "true";
                request.onreadystatechange =function (){
                    if (request.readyState == 4) {
                        try {
                            var xml = request.responseXML.documentElement;
                            var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
                            if (value) {
                                var address = addr[0] + ", " + addr[1].trim() + ", " + addr[2].slice(1, 3) + " " + addr[2].slice(4);
                                lab = address + ", Estimate: " + value;
                                adresses += lab + "<br>";
                                geocoder.geocode({'address': address}, function (results, status) {
                                    if (status === 'OK') {
                                        map.setCenter(results[0].geometry.location);
                                        map.setZoom(17);
                                        mark(results[0].geometry.location, map, lab);
                                    } else {
                                        alert('Geocode was not successful for the following reason: ' + status);
                                    }
                                });
                                document.getElementById("output").innerHTML = adresses;
                            }
                            else{
                                map.setZoom(17);
                            }
                        }
                        catch(er){
                            map.setZoom(17);
                            address+="No House found at this location";
                            document.getElementById("output").innerHTML = adresses;
                        }
                    }
                }
                request.send(null);

            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
function mark(pos,map,labels){

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
 markers=[];

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        zoom: 17,
        label: labels
    });
    markers.push(marker);
}

function clear_input(){
    document.getElementById("find_Zestimate").value="";
}

