const speedElement = document.querySelector("#speed");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
let wachId = null;
let currentRide = null;
startBtn.addEventListener("click", () => {
    if(wachId) return;
    function handleSuccess(position) {
        addPosition(currentRide, position);
        console.log(position)
        speedElement.innerText = position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) : 0;
    }
    function handleError(error) {
        console.warn(`ERROR(${error.code}): ${error.message}`);
    }
    const options = {enableHighAccuracy: true};
    currentRide = createNewRide();
    wachId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    startBtn.classList.add("d-none");
    stopBtn.classList.remove("d-none");
})

stopBtn.addEventListener("click", () => {
    if(!wachId) return;
    navigator.geolocation.clearWatch(wachId);
    wachId = null;
    updateStopTime(currentRide)
    currentRide = null;
    stopBtn.classList.add("d-none");
    startBtn.classList.remove("d-none");
    window.location.href = "./"
})
