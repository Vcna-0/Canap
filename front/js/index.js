const addProduct = document.querySelector("#items");

// Requête API
fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((value) => {
    displayProducts(value);
  })
  .catch(console.error);


// Affiche tous les produits sur la page d'accueil 

function displayProducts (value){
  for (const object of value) {
      const a = document.createElement("a");
      a.href = "./product.html?id=" + object._id;
      addProduct.appendChild(a);

      const article = document.createElement("article");
      a.appendChild(article);

      const img = document.createElement("img");
      img.src = object.imageUrl;
      img.alt = object.altTxt;
      article.appendChild(img);

      const name = document.createElement("h3");
      name.className = "productName";
      name.textContent = object.name;
      article.appendChild(name);

      const p = document.createElement("p");
      p.className = "productDescription";
      p.textContent = object.description;
      article.appendChild(p);
    }
}