import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const blogPostsDiv = document.getElementById("blogPostsDiv");

function generateRandomLightColor() {
   // Escolhe um valor aleatório entre 192 (C0 em hex) e 255 (FF em hex)
   // Isso garante que a cor será sempre em tons pastel/claros
   const r = Math.floor(Math.random() * (255 - 192 + 1) + 192);
   const g = Math.floor(Math.random() * (255 - 192 + 1) + 192);
   const b = Math.floor(Math.random() * (255 - 192 + 1) + 192);

   // Converte os valores para hexadecimal e garante 2 dígitos
   const hexR = r.toString(16).padStart(2, '0');
   const hexG = g.toString(16).padStart(2, '0');
   const hexB = b.toString(16).padStart(2, '0');

   return `#${hexR}${hexG}${hexB}`;
}

// Função para buscar e exibir os posts
async function fetchBlogPosts() {
   try {
      const querySnapshot = await getDocs(collection(db, "blogPosts"));

      blogPostsDiv.innerHTML = '';

      querySnapshot.forEach((doc) => {
         const post = doc.data();
         const postId = doc.id;

         const hasImage = post.imageUrl && post.imageUrl.trim() !== '';

         // Cria o HTML para o post
         const postElement = document.createElement("article");
         postElement.className = "postcard";

         // Gera as tags dinamicamente, aplicando uma cor aleatória a cada uma
         const tagsHtml = post.tags.map(tag => {
            const randomColor = generateRandomLightColor();
            return `<p class="postcard__tag" style="background-color: ${randomColor}">${tag}</p>`;
         }).join('');

         // Estrutura do HTML do post
         postElement.innerHTML = `
                ${hasImage ? `
                    <div class="postcard__imgWrapper">
                        <img class="postcard__img" src="${post.imageUrl}" alt="${post.title}" />
                    </div>
                ` : ''}
                <div class="postcard__div-1">
                    <div class="tags-container">
                        ${tagsHtml}
                    </div>
                    <p class="postcard__date">${post.createdAt}</p>
                </div>
                <h1 class="postcard__title">${post.title}</h1>
                <div class="postcard__lineDiv"></div>
                <p class="postcard__text">${post.content}</p>
                <div class="postcard__div-2">
                    <button type="button" class="postcard__likeButton">
                        <ion-icon name="heart-outline"></ion-icon>Like
                    </button>
                    <button type="button" class="postcard__shareButton">
                        <ion-icon name="share-social-outline"></ion-icon>Share
                    </button>
                </div>
            `;

         blogPostsDiv.appendChild(postElement);
      });

   } catch (error) {
      console.error("Erro ao buscar as postagens:", error);
      blogPostsDiv.innerHTML = "<p>Não foi possível carregar as postagens. Tente novamente mais tarde.</p>";
   }
}

// Chama a função para exibir os posts quando a página carregar
fetchBlogPosts();