import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const actualDate = new Date().toLocaleDateString('pt-BR');
const pagePath = `${window.location.pathname}`.replace(".html", "").replace("/", "");
const docRef = doc(db, "webViews", pagePath);

// Armazena o momento em que a página foi carregada
const startTime = new Date().getTime();

window.addEventListener("load", async () => {
   if (localStorage.lastPage != pagePath || localStorage.lastPageDate != actualDate) {
      try {
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            const data = docSnap.data();
            let dateView = data.dateView || [];
            let todayData = dateView.find(item => item.date === actualDate);
            if (todayData) {
               todayData.dayViews = (todayData.dayViews || 0) + 1;
            } else {
               dateView.push({ date: actualDate, dayViews: 1 });
            }
            await updateDoc(docRef, {
               views: increment(1),
               dateView: dateView
            });
         } else {
            await setDoc(docRef, {
               views: 1,
               dateView: [{ date: actualDate, dayViews: 1 }]
            });
         }
         localStorage.setItem("lastPage", pagePath);
         localStorage.setItem("lastPageDate", actualDate);
      } catch (error) {
         console.error("Erro ao registrar a visualização:", error);
      }
   }
});

window.addEventListener("beforeunload", async () => {
   const endTime = new Date().getTime();
   const timeOnPage = (endTime - startTime) / 1000; // Tempo em segundos

   if (timeOnPage > 1) { // Ignora se o tempo for muito curto
      try {
         // Use runTransaction para garantir a atomicidade da operação
         await updateDoc(docRef, {
            totalTime: increment(timeOnPage),
            visitCount: increment(1)
         });
      } catch (error) {
         console.error("Erro ao registrar o tempo de permanência:", error);
      }
   }
});