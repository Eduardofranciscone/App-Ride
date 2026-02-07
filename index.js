const rideListElement = document.getElementById('ridelist');
const allRides= getAllRides() 

allRides.forEach(async ([id, value]) => {
    const ride = JSON.parse(value);
    ride.id = id

    const firstPosition = ride.data[0];
    const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)

    const itemElement = document.createElement('li');
    itemElement.id = ride.id;
    
    const cityDiv= document.createElement('div');
    cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`;

    const maxSpeedDiv= document.createElement('div');
    maxSpeedDiv.innerText = `Max speed: ${getMaxSpeed(ride.data)}`;

    const distanceDiv= document.createElement('div');
    distanceDiv.innerText = `Distance: ${getDistance(ride.data)}`;

    itemElement.appendChild(cityDiv);
    itemElement.appendChild(maxSpeedDiv);
    itemElement.appendChild(distanceDiv);
    rideListElement.appendChild(itemElement);
}) 

async function getLocationData(latitude, longitude){
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url)
    return await response.json()
}

function getMaxSpeed(positions){
    maxSpeed=0
    positions.forEach(position => {
        if(position.speed != null && position.speed>maxSpeed){
            maxSpeed=position.speed
        }
    })
    return (maxSpeed * 3.6).toFixed(1) + " km/h"
}

function getDistance(positions){
    const earthRadiusKm = 6371;
    let totalDistance = 0;
    for (let i=0; i<positions.length -1; i++){
        const p1 = {
            latitude: positions[i].latitude,
            longitude: positions[i].longitude
        }
        const p2 = {
            latitude: positions[i+1].latitude,
            longitude: positions[i+1].longitude
        }
    
    const dLat = toRad((p2.latitude - p1.latitude));
    const dLon = toRad((p2.longitude - p1.longitude));

    const a = Math.sin(dLat/2) * 
              Math.sin(dLat/2) +
              Math.sin(dLon/2) * 
              Math.sin(dLon/2) *
              Math.cos(toRad(p1.latitude))*
              Math.cos(toRad(p2.latitude)) 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = earthRadiusKm * c;
    totalDistance += distance;
    }
    return totalDistance.toFixed(2) + " km";

}

function toRad(degree){
    return degree * Math.PI / 180;
}

