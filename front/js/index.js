const sectionItems = document.querySelector('#items');

// Requête API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((value) => {
    displayProducts(value);
  })
  .catch(console.error);

function displayProducts(value) {
  for (const object of value) {
    const a = document.createElement('a');
    a.href = './product.html?id=' + object._id;
    let htmlelement = ` <article>
                          <img src="${object.imageUrl}" alt="${object.altTxt}">
                          <h3 class="productName">${object.name}</h3>
                          <p class="productDescription">${object.description}</p>
                        </article>`;
    a.innerHTML = htmlelement;
    sectionItems.appendChild(a);
  }
}
