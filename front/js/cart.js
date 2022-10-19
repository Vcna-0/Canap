const sectionElement = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity")
const totalPriceElement = document.getElementById("totalPrice")

function getContentFromLocalStorage() {
  const contentFromLocalstorage = JSON.parse(localStorage.getItem("product"));
  return contentFromLocalstorage
}


getProductInApi()
  .then((response) => response.json())
  .then((productsApi) => {
    GetTheProductInfoFromTheApi(productsApi)
    const inputQuantityElements = document.querySelectorAll(".itemQuantity")
    const deleteElements = document.querySelectorAll(".deleteItem")
    updateQuantity(inputQuantityElements)
    removeProduct(deleteElements) 
    calculateTotalQuantity()
  })



//  Recupère l'id des produits dans l'API
function getProductInApi(){
    return new Promise((resolve, reject) => {
    const productsApi = fetch(`http://localhost:3000/api/products`)
    resolve(productsApi);
    })
}


// ============== AFFICHAGE DES PRODUITS ============== //


// Récupère les informations sur le produit dans l'API
function GetTheProductInfoFromTheApi(productsApi){
    contentFromLocalstorage.map((productList) => {
      let modifiedProductList = {...productList};
      modifiedProductList.price = productsApi.filter(apiProduct => apiProduct._id === modifiedProductList.itemId)[0].price
      modifiedProductList.name = productsApi.filter(apiProduct => apiProduct._id === productList.itemId)[0].name
      modifiedProductList.imgUrl = productsApi.filter(apiProduct => apiProduct._id === productList.itemId)[0].imageUrl
      modifiedProductList.altTxt = productsApi.filter(apiProduct => apiProduct._id === productList.itemId)[0].altTxt
      displaysProductInfo(modifiedProductList)
    })
}  



// Affiche les informations des produits qui ont été ajouter au panier
function displaysProductInfo(modifiedProductList){
  return new Promise((resolve, reject) => {
    const articleElement = document.createElement("article");
    articleElement.className = "cart__item";
    articleElement.dataset.id = modifiedProductList.itemId;
    articleElement.dataset.color = modifiedProductList.itemColor;
    articleElement.innerHTML = `<div class="cart__item__img">
                                    <img src="${modifiedProductList.imgUrl}" alt="${modifiedProductList.altTxt}" />
                                  </div>
                                  <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                      <h2>${modifiedProductList.name}</h2>
                                    <p>${modifiedProductList.itemColor}</p>
                                    <p>${modifiedProductList.price} €</p>
                                  </div>
                                  <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                      <p>Qté :</p>
                                      <input type="number" class="itemQuantity" data-id="${modifiedProductList.itemId}" data-color="${modifiedProductList.itemColor}" name="itemQuantity" min="1" max="100" value=${modifiedProductList.itemQuantity} />
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                      <p class="deleteItem">Supprimer</p>
                                    </div>
                                  </div>
                                </div>`
                                
    resolve(sectionElement.appendChild(articleElement));

  })
}


// Met à jour la quantité des produits
function updateQuantity(inputQuantityElements){
  inputQuantityElements.forEach(selectedInputQuantity => {
    selectedInputQuantity.addEventListener('change', () =>{
      if(selectedInputQuantity.value > 0 && selectedInputQuantity.value <= 100){
        let updateQuantity = contentFromLocalstorage.find(localstorageProduct => (localstorageProduct.itemId === selectedInputQuantity.dataset.id) && (localstorageProduct.itemColor === selectedInputQuantity.dataset.color))
        updateQuantity.itemQuantity = parseInt(selectedInputQuantity.value)
        localStorage.setItem('product', JSON.stringify(contentFromLocalstorage));
        calculateTotalQuantity()
      }else{
        window.alert("Veuillez choisir une quantité entre 0 et 100")
      }
    })
  });
}


// Supprime un produit quand on clique sur supprimer
function removeProduct(deleteElements){
  deleteElements.forEach(product => {
    product.addEventListener('click', () => {
      const articleElement = product.closest('article')
      const productToRemove = contentFromLocalstorage.find(localstorageProduct => localstorageProduct.itemId === articleElement.dataset.id && localstorageProduct.itemColor === articleElement.dataset.color)
      contentFromLocalstorage.splice(productToRemove, 1)
      localStorage.setItem("product", JSON.stringify(contentFromLocalstorage))
      articleElement.remove()
    })
  })
}

function calculateTotalQuantity(){
    let localStorageProducts = contentFromLocalstorage;
    let totalProductQuantity = 0;                          
    for (let product of localStorageProducts){            
        totalProductQuantity += parseInt(product.itemQuantity);         
    }
    totalQuantityElement.textContent = totalProductQuantity
}

// function calculateTotalPrice(){
// }

// ============== FORMULAIRE ============== //


const formData = [
  {
    name: "firstName",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/g,
    error: "Veuillez indiquer un prénom valide"
  },

  {
    name: "lastName",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/g,
    error: "Veuillez indiquer un nom valide"
  },

  {
    name: "address",
    regex: /([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)/g,
    error: "Veuillez indiquer une adresse valide"
  },

  {
    name: "city",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/g,
    error: "Veuillez indiquer une ville valide"
  },

  {
    name: "email",
    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    error: "Veuillez indiquer une adresse mail valide"
  }

]

const formInputElements = document.querySelectorAll('div.cart__order__form__question input');
resetForm()


formInputElements.forEach(selectedFormElement => {
  selectedFormElement.addEventListener('change', () =>{
    
    const informationsToDisplay = formData.find(formDataElement => formDataElement.name === selectedFormElement.name)
    let formElementIsValid = informationsToDisplay.regex.test(selectedFormElement.value)
    let nameErrorElementId = selectedFormElement.name+"ErrorMsg"
    const errorMessageElement =  document.getElementById(nameErrorElementId);

    if (formElementIsValid) {
      errorMessageElement.textContent = " "
    }
    else{
      errorMessageElement.textContent = informationsToDisplay.error
    }    
  })
});

// Reset le formulaire 
function resetForm(){
    for (let a = 0; a < formInputElements.length; a++) {
        formInputElements[a].value = "";
    }
}

