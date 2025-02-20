
function enableSelection() {

    const id1 = prompt("Insert the first buoy id ");
    const id2 = prompt("insert the second buoy id");

    const c1= getCoordById(id1)
    const c2=getCoordById(id2)
 
    distance= distanceCalculation(c1,c2).toFixed(5)
    drawDistanceLine(c1,c2,distance)
    alert(distance)
}

function drawDistanceLine(c1,c2,d)
{   
    console.log("im drawing bae")
    let latlngs= [c1,c2]
    var distline = L.polyline(latlngs, {
        color: 'red', // puoi scegliere il colore della linea
        weight: 3,     // spessore della linea
        dashArray: '5, 5'
    }).addTo(map);

  
    L.marker(latlngs[Math.floor(latlngs.length / 2)], { // Posiziona il marker al centro della linea
        icon: L.divIcon({
            className: 'text-label', // Classe CSS personalizzata
            html: d + ' km', // Testo della distanza
            iconSize: [100, 30] // Dimensioni dell'icona
        })
    }).addTo(map);
}

function getCoordById(idBuoy)
{
    console.log("im here")
    wantedBuoy= window.actualBuoys[idBuoy]
    if (wantedBuoy){
        return wantedBuoy.getLatLng();
    }else 
    console.log("buoy not found")
}


function distanceCalculation(c1,c2){
console.log("estamos calcolando")
 lat1 = +c1.lat
 long1 = +c1.lng
 lat2 = +c2.lat
 long2 = +c2.lng
console.log(lat1)
console.log(long1)
 distance= vincenty(lat1,long1,lat2,long2)
 return distance
}


function vincenty(lat1, lon1, lat2, lon2) {
    // Parametri ellissoidali WGS-84
    const a = 6378137;  // semiasse maggiore in metri
    const f = 1 / 298.257223563;  // fattore di appiattimento
    const b = (1 - f) * a;  // semiasse minore

    // Converti le latitudini e longitudini in radianti
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const λ1 = lon1 * Math.PI / 180;
    const λ2 = lon2 * Math.PI / 180;

    // Differenza di longitudine
    const Δλ = λ2 - λ1;

    // U1 e U2 sono le latitudini ridotte
    const U1 = Math.atan((1 - f) * Math.tan(φ1));
    const U2 = Math.atan((1 - f) * Math.tan(φ2));

    // Inizializzazione per le iterazioni
    let sinσ, cosσ, σ, sinα, cos2α, cos2σm, C;
    let iterLimit = 100;
    let λ = Δλ;

    // Iterazione per ottenere la convergenza
    do {
        sinσ = Math.sqrt(Math.pow(Math.cos(U2) * Math.sin(λ), 2) +
                         Math.pow(Math.cos(U1) * Math.sin(U2) - Math.sin(U1) * Math.cos(U2) * Math.cos(λ), 2));
        cosσ = Math.sin(U1) * Math.sin(U2) + Math.cos(U1) * Math.cos(U2) * Math.cos(λ);
        σ = Math.atan2(sinσ, cosσ);
        sinα = Math.cos(U1) * Math.cos(U2) * Math.sin(λ) / sinσ;
        cos2α = 1 - sinα * sinα;  // Coseno del quadrato di alpha (cos^2(α)) → cos2α = 1 - sinα * sinα
        cos2σm = cosσ - 2 * Math.sin(U1) * Math.sin(U2) / cos2α;
        C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));

        // Nuova longitudine
        λ = Δλ + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));
    } while (Math.abs(λ) > 1e-12 && --iterLimit > 0);

    // Distanza finale
    const u2 = cos2α * (a * a - b * b) / (b * b);  // Correzione della distanza
    const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
    const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    const Δσ = u2 / 1024 * (64 + u2 * (-32 + u2 * (20 - 14 * u2)));

    const ΔσFinal = Δσ * Math.sin(σ) * (cos2σm + Δσ * cosσ * (-1 + 2 * cos2σm * cos2σm));
    const distance = b * A * (σ - ΔσFinal);

    
    return distance/1000;
}