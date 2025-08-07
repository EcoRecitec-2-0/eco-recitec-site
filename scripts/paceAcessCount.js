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

window.addEventListener("load", async () => {
   if (localStorage.lastPage != `${window.location.pathname}`.replace(".html", "") || localStorage.lastPageDate != actualDate) {
      const pagePath = `${window.location.pathname}`.replace(".html", "").replace("/", "");
      const docRef = doc(db, "webViews", pagePath);
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
         localStorage.setItem("lastPage", `${window.location.pathname}`.replace(".html", ""));
         localStorage.setItem("lastPageDate", `${actualDate}`);

      } catch (error) {
         console.error("Erro ao registrar a visualização:", error);
      }
   }
});