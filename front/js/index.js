const sectionItems = document.querySelector('#items');

// Requête API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((value) => {
    displayProducts(value);
  })
  .catch(console.error);


// Affiche les produits 
function displayProducts(value) {
  for (const object of value) {
    const aElement = document.createElement('a');
    aElement.href = './product.html?id=' + object._id;
    aElement.innerHTML = ` <article>
                          <img src="${object.imageUrl}" alt="${object.altTxt}">
                          <h3 class="productName">${object.name}</h3>
                          <p class="productDescription">${object.description}</p>
                        </article>`;
    sectionItems.appendChild(aElement);
  }
}
