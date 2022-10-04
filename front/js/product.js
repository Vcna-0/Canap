const productImg = document.querySelector('.item__img');
const productTittle = document.querySelector('#title');
const productPrice = document.querySelector('#price');
const productDescription = document.querySelector('#description');
const colorSelect = document.querySelector('#colors');
const addCartButton = document.querySelector('#addToCart');
const quantityInput = document.querySelector('#quantity');

// Récuppère l'id dans l'URL
const str = window.location.href;
const url = new URL(str);
const urlId = url.searchParams.get('id');

fetch(`http://localhost:3000/api/products/${urlId}`)
  .then((response) => response.json())
  .then((value) => {
    displaySelectedProduct(value)
  })
  .catch(console.error);


// Affiche les informations du produit selectionné
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


//  Vérifie la valeur des inputs "quantité" et "couleur"
function checkInputValues(){
  if (quantityInput.value && colorSelect.value != ''){
    if (quantityInput.value > 0 && quantityInput.value <= 100){
      window.alert('Le produit a bien été ajouté au panier');
      RegisterNewObject();
      // compareStorageContents()
    }else{
      window.alert('Veuillez choisir une quantité entre 0 et 100');
    }
  }else{
    window.alert('Veuillez choisir une couleur et une quantité');
  }
}

function RegisterNewObject(){
   const newItem = {
    itemId: urlId,
    itemColor: colorSelect.value,
    itemQuantity: parseInt(quantityInput.value),
  };

  compareStorageContents(newItem);
}

function compareStorageContents(newItem){
  const localStorageContent = JSON.parse(localStorage.getItem("product"));

  // const newItem = {
  //   itemId: urlId,
  //   itemColor: colorSelect.value,
  //   itemQuantity: quantityInput.value,
  // };

  if (localStorageContent){
   const identicalProduct = localStorageContent.find(element => element.itemId === urlId && element.itemColor === colorSelect.value); 
    if(identicalProduct){
        let newQuantity = parseInt(identicalProduct.itemQuantity) + parseInt(quantityInput.value);
        identicalProduct.itemQuantity = newQuantity
        addLocalStorage(localStorageContent);
    }else{
      localStorageContent.push(newItem);
      addLocalStorage(localStorageContent);
    }
  }else{
    let newArray =[];
    newArray.push(newItem);
    window.localStorage.setItem("product", JSON.stringify(newArray));
  }

}




function addLocalStorage(localStorageContent){
  localStorage.setItem("product", JSON.stringify(localStorageContent));
}



function checkCardQuantity(identicalProduct){
  if (identicalProduct.itemQuantity >= 100){
    window.alert('Vous ne pouvez pas ajouter plus de 100 items au panier');
  }
}