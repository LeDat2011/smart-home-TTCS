import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqXNR6veD1QTi-MF_53hE3ZsizLf-KzMU",
  authDomain: "testesp32-7e391.firebaseapp.com",
  databaseURL: "https://testesp32-7e391-default-rtdb.firebaseio.com",
  projectId: "testesp32-7e391",
  storageBucket: "testesp32-7e391.firebasestorage.app",
  messagingSenderId: "623654034396",
  appId: "1:623654034396:web:7ff64f7aa93d2df9688d19",
  measurementId: "G-D3Z1BYTGQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, '/');
onValue(dbRef, (snapshot) => {
    console.log('Connected to Firebase:', snapshot.val());
}, (error) => {
    console.error('Failed to connect to Firebase:', error);
});

const gasWarningRef = ref(database, '/kitchen/gasWarning');

onValue(gasWarningRef, (snapshot) => {
    const gasWarning = snapshot.val() || 'OFF';
    console.log('Gas Warning:', gasWarning);

    if (gasWarning === 'ON') {
        showGasAlert(); // Hiển thị modal khi cảnh báo gas được bật
    } else {
        closeGasAlert(); // Tắt modal nếu cảnh báo gas tắt
    }
});

function showGasAlert() {
    const modal = document.getElementById('gasAlert');
    modal.classList.add('show');
    console.log("Gas alert displayed!");
}

function closeGasAlert() {
    const modal = document.getElementById('gasAlert');
    modal.classList.remove('show');
    console.log("Gas alert closed!");
}


window.closeGasAlert = function () {
    document.getElementById('gasAlert').style.display = 'none';
};

window.toggleLED = function (room, led) {
    console.log(`Toggle button clicked for ${led} in ${room}`);
    const statusElement = document.getElementById(`${led}-status`);
    const currentStatus = statusElement.innerText.split(': ')[1];
    const newStatus = currentStatus === 'OFF' ? 'ON' : 'OFF';

    const ledRef = ref(database, `${room}/${led}`);
    set(ledRef, newStatus)
        .then(() => {
            statusElement.innerText = `Status: ${newStatus}`;
            console.log(`Updated ${led} in ${room} to ${newStatus}`);
        })
        .catch(error => console.error('Error updating data:', error));
};

window.toggleMode = function (room) {
    const statusElement = document.getElementById('dht11-status');
    const currentStatus = statusElement.innerText.split(': ')[1];
    const newStatus = currentStatus === 'OFF' ? 'ON' : 'OFF';

    const modeRef = ref(database, `${room}/dht11/mode`);
    set(modeRef, newStatus === 'ON') // Update with boolean value
        .then(() => {
            statusElement.innerText = `DHT11 Mode: ${newStatus}`;
            console.log(`Updated dht11/mode in ${room} to ${newStatus}`);
        })
        .catch(error => console.error('Error updating data:', error));
};

// Fetch initial data
document.addEventListener('DOMContentLoaded', () => {
    const roomsRef = ref(database, '/');
    onValue(roomsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Bathroom
            document.getElementById('bathroomLed-status').innerText = `Status: ${data?.bathroom?.bathroomLed || 'OFF'}`;

            // Bedroom
            document.getElementById('bedroomLed-status').innerText = `Status: ${data?.bedroom?.bedroomLed || 'OFF'}`;
            document.getElementById('temp-status').innerText = data?.bedroom?.dht11?.temp || 'N/A';
            document.getElementById('humd-status').innerText = data?.bedroom?.dht11?.humd || 'N/A';

            // Kitchen
            document.getElementById('kitchenLed-status').innerText = `Status: ${data?.kitchen?.kitchenLed || 'OFF'}`;
            document.getElementById('gasValue-status').innerText = data?.kitchen?.gasValue || 'N/A';
            document.getElementById('gasWarning-status').innerText = data?.kitchen?.gasWarning || 'N/A';

            // Field
            document.getElementById('antiThief-status').innerText = `Anti-Thief: ${data?.field?.antiThief || 'OFF'}`;
            document.getElementById('doorStatus-status').innerText = data?.field?.doorStatus || 'N/A';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loading = document.getElementById('loading');
    loading.style.display = 'block'; // Hiển thị loading khi bắt đầu

    const roomsRef = ref(database, '/');
    onValue(roomsRef, (snapshot) => {
        loading.style.display = 'none'; // Tắt loading khi dữ liệu được tải
        const data = snapshot.val();
        if (data) {
            // Cập nhật dữ liệu lên giao diện...
        }
    });
});

