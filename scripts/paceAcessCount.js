import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, increment, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
      try {
         const washingtonRef = doc(db, "webViews", `${window.location.pathname}`.replace(".html", "").replace("/", ""));
         await updateDoc(washingtonRef, {
            views: increment(1),
            dateView: arrayUnion(`${actualDate}`)
         });
         localStorage.setItem("lastPage", `${window.location.pathname}`.replace(".html", ""))
         localStorage.setItem("lastPageDate", `${actualDate}`)
      } catch (error) {
         if (`${error}`.includes("No document to update:")) {
            await setDoc(doc(db, "webViews", `${window.location.pathname}`.replace(".html", "").replace("/", "")), {
               views: 1,
               dateView: [`${actualDate}`]
            });
            localStorage.setItem("lastPage", `${window.location.pathname}`.replace(".html", ""))
            localStorage.setItem("lastPageDate", `${actualDate}`)
         } else {
            console.log(error);
         }
      }
   }
})