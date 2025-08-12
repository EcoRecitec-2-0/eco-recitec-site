import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const blogCardsDiv = document.getElementById("blogCardsDiv");
const blogPostsDiv = document.getElementById("blogPostsDiv");

// Função para gerar uma cor clara aleatória para as tags
function generateRandomLightColor() {
    const r = Math.floor(Math.random() * (255 - 192 + 1) + 192);
    const g = Math.floor(Math.random() * (255 - 192 + 1) + 192);
    const b = Math.floor(Math.random() * (255 - 192 + 1) + 192);
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    return `#${hexR}${hexG}${hexB}`;
}

// Função principal para buscar e exibir os posts
async function fetchAndDisplayPosts() {
    try {
        // Consulta o Firestore, ordenando os posts por data de criação
        const postsRef = collection(db, "blogPosts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const allPosts = [];
        const cardPosts = [];

        // Filtra os posts para as duas seções
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            allPosts.push(post);
            // Pega os 4 primeiros posts com imagem para os cards
            if (cardPosts.length < 4 && post.imageUrl) {
                cardPosts.push(post);
            }
        });

        // Limpa as divs de posts
        blogCardsDiv.innerHTML = '';
        blogPostsDiv.innerHTML = '';

        // Preenche a seção de cards
        cardPosts.forEach((post, index) => {
            const cardElement = document.createElement("article");
            cardElement.className = "blogCard";

            // Trunca o texto para caber no card
            const truncatedContent = post.content.length > 90 ? post.content.substring(0, 90) + '...' : post.content;

            cardElement.innerHTML = `
                <div class="blogCard__div-1">
                    <img class="blogCard__image" src="${post.imageUrl}" alt="${post.title}" />
                </div>
                <p class="blogCard__text">
                    <strong>${post.tags.join(', ')}:</strong> ${truncatedContent}
                </p>
                <div class="blogCard__div-2">
                    <button type="button" class="blogCard__like">
                        <ion-icon name="heart-outline"></ion-icon>Like
                    </button>
                    <button type="button" class="blogCard__share" id="shareButton${index}">
                        <ion-icon name="share-social-outline"></ion-icon>Share
                    </button>
                </div>
            `;
            // Adiciona o evento de compartilhamento
            const shareButton = cardElement.querySelector(`#shareButton${index}`);
            shareButton.addEventListener("click", () => {
                const shareData = {
                    title: post.title,
                    text: truncatedContent,
                    url: window.location.href // URL da página atual
                };
                if (navigator.share) {
                    navigator.share(shareData)
                        .then(() => console.log('Compartilhamento bem-sucedido'))
                        .catch((error) => console.error('Erro ao compartilhar:', error));
                } else {
                    alert('Compartilhamento não suportado neste navegador.');
                }
            });
            blogCardsDiv.appendChild(cardElement);
        });

        // Preenche a seção de lista de posts (a partir do código anterior)
        allPosts.forEach((post, index) => {
            const postElement = document.createElement("article");
            postElement.className = "postcard";

            const hasImage = post.imageUrl && post.imageUrl.trim() !== '';

            const tagsHtml = post.tags.map(tag => {
                const randomColor = generateRandomLightColor();
                return `<p class="postcard__tag" style="background-color: ${randomColor}">${tag}</p>`;
            }).join('');

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
                    <button type="button" class="postcard__shareButton" id="shareCardButton${index}>
                        <ion-icon name="share-social-outline"></ion-icon>Share
                    </button>
                </div>
            `;
            // Adiciona o evento de compartilhamento
            const shareCardButton = postElement.children[hasImage ? 5 : 4].children[1];
            shareCardButton.addEventListener("click", () => {
                const shareData = {
                    title: post.title,
                    text: post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content,
                    url: window.location.href // URL da página atual
                };
                if (navigator.share) {
                    navigator.share(shareData)
                        .then(() => console.log('Compartilhamento bem-sucedido'))
                        .catch((error) => console.error('Erro ao compartilhar:', error));
                } else {
                    alert('Compartilhamento não suportado neste navegador.');
                }
            });
            blogPostsDiv.appendChild(postElement);
        });
    } catch (error) {
        console.error("Erro ao buscar as postagens:", error);
        blogCardsDiv.innerHTML = "<p>Não foi possível carregar os posts em destaque.</p>";
        blogPostsDiv.innerHTML = "<p>Não foi possível carregar a lista de posts.</p>";
    }
}

// Chama a função para exibir os posts quando a página carregar
fetchAndDisplayPosts();