import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, increment, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const firebaseConfig = {
   apiKey: "AIzaSyBi-ZjFHow2yDm-TEOTQlp_8DG6yKr6-9k",
   authDomain: "ecorecitecweb.firebaseapp.com",
   projectId: "ecorecitecweb",
   storageBucket: "ecorecitecweb.firebasestorage.app",
   messagingSenderId: "308957538407",
   appId: "1:308957538407:web:b2f42d3da7c252907a0cc2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const routesChartDiv = document.getElementById("routesChart")
const allAcessChartDiv = document.getElementById("allAcessChart")
const allViewsId = []
const allViewsData = []

const querySnapshot = await getDocs(collection(db, "webViews"));
querySnapshot.forEach((doc) => {
   allViewsId.push(doc.id)
   allViewsData.push(doc.data())
   console.log(doc.id, " => ", doc.data());
});

let routesChartcanvas = document.createElement("canvas")
routesChartDiv.insertAdjacentElement("beforeend", routesChartcanvas)
let allAcesscanvas = document.createElement("canvas")
allAcessChartDiv.insertAdjacentElement("beforeend", allAcesscanvas)

new Chart(routesChartcanvas, {
   type: 'bar',
   data: {
      labels: allViewsId,
      datasets: [{
         label: 'Visitas por rota',
         data: allViewsData.map(el => el.views),
         borderWidth: 1
      }]
   },
   options: {
      scales: {
         y: {
            beginAtZero: true
         }
      }
   }
});


new Chart(allAcesscanvas, {
   type: 'line',
   data: {
      labels: allViewsId,
      datasets: [{
         label: 'Visitas Por dia',
         data: allViewsData.map(el => el.views),
         borderWidth: 1
      }]
   },
   options: {
      responsive: true,
      plugins: {
         title: {
            display: true,
            text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
         }
      }
   }
});