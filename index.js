const rideListElement = document.getElementById('ridelist');
const allRides= getAllRides() 

allRides.forEach(async ([id, value]) => {
    const ride = JSON.parse(value);
    ride.id = id

    const itemElement = document.createElement('li');
    itemElement.id = ride.id;
    itemElement.className = 'd-flex align-items-center p-1 shadow-sm gap-3';
    rideListElement.appendChild(itemElement);

    const firstPosition = ride.data[0];
    const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)

    const mapElement = document.createElement('div');
    mapElement.style = 'width: 100px; height: 100px';
    mapElement.classList.add('bg-secondary');
    mapElement.classList.add('rounded-4');

    const dataElement = document.createElement('div');
    dataElement.className = 'flex-fill d-flex flex-column gap-2';

    const cityDiv= document.createElement('div');
    cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`;
    cityDiv.className = 'text-primary fw-bold mb-2';

    const maxSpeedDiv= document.createElement('div');
    maxSpeedDiv.innerText = `Max speed: ${getMaxSpeed(ride.data)}`;
    maxSpeedDiv.className = 'h5';

    const distanceDiv= document.createElement('div');
    distanceDiv.innerText = `Distance: ${getDistance(ride.data)}`;

    const durationDiv= document.createElement('div');
    durationDiv.innerText = `Duration: ${getDuration(ride)}`;
    
    const dateDiv= document.createElement('div');
    dateDiv.innerText = getStartDate(ride);
    dateDiv.className = 'text-secondary mt-2';

    dataElement.appendChild(cityDiv);
    dataElement.appendChild(maxSpeedDiv);
    dataElement.appendChild(distanceDiv);
    dataElement.appendChild(durationDiv);
    dataElement.appendChild(dateDiv);
    itemElement.appendChild(mapElement)
    itemElement.appendChild(dataElement);
   
    
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

function getDuration(ride){
    function format(number,digits){
        return String(number.toFixed(0)).padStart(2, '0');
    }
    const interval = (ride.stopTime - ride.startTime) / 1000;
    const hours = Math.floor(interval / 3600);
    const minutes = Math.trunc(interval / 60)
    const seconds = interval % 60;
    return `${format(hours,2)}h ${format(minutes,2)}m ${format(seconds,2)}s`;
}

function getStartDate(ride){
    const date = new Date(ride.startTime);
    const day = date.toLocaleDateString('pt-BR', {day: 'numeric'});
    const month = date.toLocaleDateString('pt-BR', {month: 'numeric'});
    const year = date.toLocaleDateString('pt-BR', {year: 'numeric'});

    const hour = date.toLocaleTimeString('pt-BR', {hour: '2-digit'});
    const minute = date.toLocaleTimeString('pt-BR', {minute: '2-digit'});
    return `${day}/${month}/${year} - ${hour}:${minute}`;
}

