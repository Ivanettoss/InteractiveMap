// Funzione per mostrare il div con le informazioni della boa
function showBuoyInfo(buoyNumber, latlng) {
    var buoyInfoDiv = document.getElementById('buoyInfo');
    
    if (!buoyInfoDiv) {
        console.error('Elemento con id "buoyInfo" non trovato.');
        return;
    }

    if (latlng && typeof latlng.lat === 'number' && typeof latlng.lng === 'number') {
        document.getElementById('buoyId').textContent = buoyNumber;
        document.getElementById('lat').textContent = latlng.lat.toFixed(6); // Mostra la latitudine con 6 decimali
        document.getElementById('long').textContent = latlng.lng.toFixed(6); // Mostra la longitudine con 6 decimali

        buoyInfoDiv.style.display = 'block'; // Mostra il div
    } else {
        console.error('Latitudine e longitudine non valide');
    }
}


// Funzione per nascondere il div
function hideBuoyInfo() {
    var buoyInfoDiv = document.getElementById('buoyInfo');
    buoyInfoDiv.style.display = 'none'; // Nascondi il div
}
