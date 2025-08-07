import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const routesChartDiv = document.getElementById("routesChart");
const allAcessChartDiv = document.getElementById("allAcessChart");
const averageTimeChartDiv = document.getElementById("averageTimeChart"); // Novo div

function addChartStyles(canvas, full = false) {
   canvas.style.minWidth = "500px";
   canvas.style.height = "auto";
   canvas.style.aspectRatio = "2/1";
   if (full == true) {
      canvas.style.width = "calc(100vw - 240px)";
   } else {
      canvas.style.width = "calc(50vw - 240px)";
   }
}

// Cria os canvas para os gráficos
const routesChartCanvas = document.createElement("canvas");
routesChartDiv.insertAdjacentElement("beforeend", routesChartCanvas);
const averageTimeChartCanvas = document.createElement("canvas");
averageTimeChartDiv.insertAdjacentElement("beforeend", averageTimeChartCanvas);
const allAcessChartCanvas = document.createElement("canvas");
allAcessChartDiv.insertAdjacentElement("beforeend", allAcessChartCanvas);

// Aplica os estilos
addChartStyles(routesChartCanvas, true);
addChartStyles(averageTimeChartCanvas, true);
addChartStyles(allAcessChartCanvas, true);

// --- Processamento dos dados ---
const querySnapshot = await getDocs(collection(db, "webViews"));

const allViewsId = [];
const viewsByRoute = [];
const dailyViewsTotal = {};
const averageTimeByRoute = []; 

querySnapshot.forEach((doc) => {
   const data = doc.data();
   allViewsId.push(doc.id);
   viewsByRoute.push(data.views);

   // Calcula o tempo médio por rota
   const totalTime = data.totalTime || 0;
   const visitCount = data.visitCount || 0;
   const averageTime = visitCount > 0 ? (totalTime / visitCount) : 0;
   averageTimeByRoute.push(averageTime.toFixed(2)); // Arredonda para duas casas decimais

   data.dateView.forEach(dailyData => {
      const date = dailyData.date;
      const dayViews = dailyData.dayViews;
      dailyViewsTotal[date] = (dailyViewsTotal[date] || 0) + dayViews;
   });
});

const dailyLabels = Object.keys(dailyViewsTotal).sort((a, b) => {
   const [dayA, monthA, yearA] = a.split('/').map(Number);
   const [dayB, monthB, yearB] = b.split('/').map(Number);
   const dateA = new Date(yearA, monthA - 1, dayA);
   const dateB = new Date(yearB, monthB - 1, dayB);
   return dateA - dateB;
});
const dailyData = dailyLabels.map(date => dailyViewsTotal[date]);


// --- Gráfico de Barras: Visualizações por Rota ---
new Chart(routesChartCanvas, {
   type: 'bar',
   data: {
      labels: allViewsId,
      datasets: [{
         label: 'Visitas por Rota',
         data: viewsByRoute,
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

// --- Gráfico de Linha: Total de Visitas por Dia ---

console.log(dailyData);

new Chart(allAcessChartCanvas, {
   type: 'line',
   data: {
      labels: dailyLabels,
      datasets: [{
         label: 'Total de Visitas Por Dia',
         data: dailyData,
         borderWidth: 1,
         backgroundColor: 'rgba(54, 162, 235, 0.2)',
         borderColor: 'rgba(54, 162, 235, 1)',
         tension: 0.1
      }]
   },
   options: {
      responsive: true,
      plugins: {
         title: {
            display: true,
            text: 'Total de Acessos Diários'
         }
      }
   }
});

// --- Gráfico: Tempo Médio de Permanência por Rota ---
new Chart(averageTimeChartCanvas, {
   type: 'bar',
   data: {
      labels: allViewsId,
      datasets: [{
         label: 'Tempo Médio na Página (segundos)',
         data: averageTimeByRoute,
         borderWidth: 1,
         backgroundColor: 'rgba(75, 192, 192, 0.2)',
         borderColor: 'rgba(75, 192, 192, 1)',
      }]
   },
   options: {
      scales: {
         y: {
            beginAtZero: true
         }
      },
      plugins: {
         title: {
            display: true,
            text: 'Tempo Médio de Permanência por Rota'
         }
      }
   }
});