const productImg = document.querySelector('.item__img');
const productTittle = document.querySelector('#title');
const productPrice = document.querySelector('#price');
const productDescription = document.querySelector('#description');
const colorSelect = document.querySelector('#colors');
const addCartButton = document.querySelector('#addToCart');
const quantityInput = document.querySelector('#quantity');

// ----------------------------------------------------------
// ----------------------------------------------------------

// getIdFromUrl()
//   .then((urlId)=> {
//     getProductInApi(urlId)
//       .then((response) => response.json())  
//       .then((productFilter) => {
//       displaySelectedProduct(productFilter)
//       })  
//   })


// function getProductInApi(urlId){
//   return new Promise((resolve, reject) => {
//     const reponse = fetch(`http://localhost:3000/api/products/${urlId}`)
//     resolve(reponse)
//   })
// }

// ----------------------------------------------------------
// ----------------------------------------------------------
let productId = getIdFromUrl();

// Recupère l'id dans l'url
function getIdFromUrl(){
  const str = window.location.href;
  const url = new URL(str);
  const urlId = url.searchParams.get('id');
  getProductInApi(urlId)

  return urlId;
}

// Recupère l'id du produit dans l'API
function getProductInApi(urlId){
  fetch(`http://localhost:3000/api/products/${urlId}`)
  .then((response) => response.json())
  .then((value) => {
    displaySelectedProduct(value)
  })
  .catch(console.error);
}


// Affiche les infos du produit selectionné
function displaySelectedProduct(productFilter) {
  const img = document.createElement('img');
  img.src = productFilter.imageUrl;
  img.alt = productFilter.altTxt;
  productImg.appendChild(img);
  productTittle.textContent = productFilter.name;
  productPrice.textContent = productFilter.price;
  productDescription.textContent = productFilter.description;
  for (const product of productFilter.colors) {
    const options = document.createElement('option');
    options.value = product;
    options.textContent = product;
    colorSelect.appendChild(options);
  }
}


addCartButton.addEventListener('click', () => {
  checkInputValues();
});


// Vérifie la valeur des inputs
function checkInputValues(){
  if (quantityInput.value && colorSelect.value != ''){
    if (quantityInput.value > 0 && quantityInput.value <= 100){
        registerNewProduct()
    }else{
      window.alert('Veuillez choisir une quantité entre 0 et 100');
    }
  }else{
    window.alert('Veuillez choisir une couleur et une quantité');
  }
}

// Enregistre le nouveau produit 
function registerNewProduct(){
  const newItem = {
    itemId: productId,
    itemColor: colorSelect.value,
    itemQuantity: parseInt(quantityInput.value),
  };
  compareStorageContents(newItem);
}

// Compare le nouveau produit avec le contenu du localStorage
function compareStorageContents(newItem){
  const localStorageContent = JSON.parse(localStorage.getItem("product"));
  if (localStorageContent){
    const identicalProduct = localStorageContent.find(element => element.itemId === productId && element.itemColor === colorSelect.value); 
    if(identicalProduct){
      let newQuantity = parseInt(identicalProduct.itemQuantity) + parseInt(quantityInput.value);
      if (newQuantity < 100) {
          window.alert('Le produit a bien été ajouté au panier');
          identicalProduct.itemQuantity = newQuantity
          addProductInLocalStorage(localStorageContent);
      } else {
        window.alert('Vous ne pouvez pas ajoutez plus de 100 articles du même produit')
      }   
    }
    else{
      window.alert('Le produit a bien été ajouté au panier');
      localStorageContent.push(newItem);
      addProductInLocalStorage(localStorageContent);
    }
  }
  else{
    window.alert('Le produit a bien été ajouté au panier');
    let newArray =[];
    newArray.push(newItem);
    window.localStorage.setItem("product", JSON.stringify(newArray));
  }
}

// Ajoute le nouveau produit dans le localStorage
function addProductInLocalStorage(localStorageContent){
  localStorage.setItem("product", JSON.stringify(localStorageContent));
}





