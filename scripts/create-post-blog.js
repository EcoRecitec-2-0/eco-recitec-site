import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Sua configuração do Firebase
const firebaseConfig = {
   apiKey: "AIzaSyBi-ZjFHow2yDm-TEOTQlp_8DG6yKr6-9k",
   authDomain: "ecorecitecweb.firebaseapp.com",
   projectId: "ecorecitecweb",
   storageBucket: "ecorecitecweb.firebasestorage.app",
   messagingSenderId: "308957538407",
   appId: "1:308957538407:web:b2f42d3da7c252907a0cc2"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const postForm = document.getElementById("postForm");
const messageEl = document.getElementById("message");

postForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   const title = postForm.postTitle.value;
   const content = postForm.postContent.value;
   const imageUrl = postForm.postImage.value;
   const tagsInput = postForm.postTags.value;

   messageEl.textContent = "Publicando postagem...";
   messageEl.style.color = "blue";

   try {
      // Formata a data para dd/mm/aa
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const formattedDate = `${day}/${month}/${year}`;

      // Converte a string de tags em um array, removendo espaços e itens vazios
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

      // Salvar os dados da postagem no Firestore
      await addDoc(collection(db, "blogPosts"), {
         title: title,
         content: content,
         imageUrl: imageUrl,
         tags: tags, // Salva o array de tags
         createdAt: formattedDate // Salva a data formatada
      });

      // Limpar o formulário e mostrar mensagem de sucesso
      postForm.reset();
      messageEl.textContent = "Postagem publicada com sucesso!";
      messageEl.style.color = "green";

   } catch (error) {
      console.error("Erro ao publicar postagem:", error);
      messageEl.textContent = `Erro ao publicar: ${error.message}`;
      messageEl.style.color = "red";
   }
});