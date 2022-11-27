const sectionElement = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity")
const totalPriceElement = document.getElementById("totalPrice")
const buttonOrderElement = document.getElementById("order")


getProductsInApi()
  .then((response) => response.json())
  .then((productsApi) => {
    GetTheProductInfoFromTheApi(productsApi)
    const inputQuantityElements = document.querySelectorAll(".itemQuantity")
    const deleteElements = document.querySelectorAll(".deleteItem")
    updateQuantity(inputQuantityElements, productsApi)
    removeProduct(deleteElements, productsApi) 
    calculateTotalQuantity()
    calculateTotalPrice(productsApi)
  })


// Recupère tous les produits présents dans le localStorage
function getProductsFromLocalStorage() {
  const contentFromLocalstorage = JSON.parse(localStorage.getItem("product"));
  return contentFromLocalstorage
}


// Recupère tous les produits dans l'API
function getProductsInApi(){
    return new Promise((resolve, reject) => {
    const productsApi = fetch(`http://localhost:3000/api/products`)
    resolve(productsApi);
    })
}


// Filtre les produits de l'api en fonction de l'id des produits présent dans le localStorage
function filterApiProductsById(productsApi, productList){
  let product = productsApi.filter(apiProduct => apiProduct._id === productList.itemId)[0]
  return product
}




// =================== AFFICHAGE DES PRODUITS =================== //


// Créer un nouvel objet et récupère les informations manquantes (price, name etc..) sur le produit dans l'API 
function GetTheProductInfoFromTheApi(productsApi){
  const contentFromLocalstorage = getProductsFromLocalStorage();
  contentFromLocalstorage.map((productList) => {
    let newProductList = {...productList};
    let filteredProduct = filterApiProductsById(productsApi, productList)
    newProductList.price = filteredProduct.price
    newProductList.name = filteredProduct.name
    newProductList.imgUrl = filteredProduct.imageUrl
    newProductList.altTxt = filteredProduct.altTxt
    displaysProductInfo(newProductList)
  })
}  


// Affiche les informations des produits qui ont été ajoutés au panier
function displaysProductInfo(newProductList){
  return new Promise((resolve, reject) => {
    const articleElement = document.createElement("article");
    articleElement.className = "cart__item";
    articleElement.dataset.id = newProductList.itemId;
    articleElement.dataset.color = newProductList.itemColor;
    articleElement.innerHTML = `<div class="cart__item__img">
                                    <img src="${newProductList.imgUrl}" alt="${newProductList.altTxt}" />
                                  </div>
                                  <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                      <h2>${newProductList.name}</h2>
                                    <p>${newProductList.itemColor}</p>
                                    <p>${newProductList.price} €</p>
                                  </div>
                                  <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                      <p>Qté :</p>
                                      <input type="number" class="itemQuantity" data-id="${newProductList.itemId}" data-color="${newProductList.itemColor}" name="itemQuantity" min="1" max="100" value=${newProductList.itemQuantity} />
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                      <p class="deleteItem">Supprimer</p>
                                    </div>
                                  </div>
                                </div>`
    resolve(sectionElement.appendChild(articleElement));
  })
}


// Met à jour la quantité des produits quand on modifie l'input Qté
function updateQuantity(inputQuantityElements, productsApi){
  inputQuantityElements.forEach(selectedInputQuantity => {
    selectedInputQuantity.addEventListener('change', () =>{
      const contentFromLocalstorage = getProductsFromLocalStorage()

      if(selectedInputQuantity.value > 0 && selectedInputQuantity.value <= 100){
        let updateQuantity = contentFromLocalstorage.find((localstorageProduct) => (localstorageProduct.itemId === selectedInputQuantity.dataset.id) && (localstorageProduct.itemColor === selectedInputQuantity.dataset.color))
        updateQuantity.itemQuantity = parseInt(selectedInputQuantity.value)
        localStorage.setItem('product', JSON.stringify(contentFromLocalstorage));
        calculateTotalQuantity()
        calculateTotalPrice(productsApi)
      }
      else{
        window.alert("Veuillez choisir une quantité entre 0 et 100")
      }
    })
  });
}


// Supprime un produit quand on clique sur supprimer
function removeProduct(deleteElements, productsApi){
  deleteElements.forEach(productToBeDeleted => {
    productToBeDeleted.addEventListener('click', () => {
      const contentFromLocalstorage = getProductsFromLocalStorage();
        const articleElement = productToBeDeleted.closest('article')
        const productslistAfterDelete = contentFromLocalstorage.filter(localstorageProduct => localstorageProduct.itemId !== articleElement.dataset.id || localstorageProduct.itemColor !== articleElement.dataset.color)
        localStorage.setItem("product", JSON.stringify(productslistAfterDelete))
        articleElement.remove()
        calculateTotalQuantity()
        calculateTotalPrice(productsApi)
    })
  })
}


// Calcul la quantité totale des produits
function calculateTotalQuantity(productsApi){
    const contentFromLocalstorage = getProductsFromLocalStorage()
    let totalProductQuantity = 0
    for (let product of contentFromLocalstorage){
      totalProductQuantity += parseInt(product.itemQuantity)
    }
    totalQuantityElement.textContent = totalProductQuantity
}


// Calcul le prix total des produits
function calculateTotalPrice(productsApi){
  const contentFromLocalstorage = getProductsFromLocalStorage();
  let totalPrice = 0
    contentFromLocalstorage.map((productList) => {
      let newProductList = {...productList};
      let filteredProduct = filterApiProductsById(productsApi, productList)
      let price = filteredProduct.price * productList.itemQuantity
      totalPrice += price
    })
  totalPriceElement.textContent = totalPrice
}


// ============== FORMULAIRE ============== //

const formData = [
  {
    name: "firstName",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/i,
    error: "X Veuillez indiquer un prénom valide"
  },

  {
    name: "lastName",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/i,
    error: "X Veuillez indiquer un nom valide"
  },

  {
    name: "address",
    regex: /([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)/i,
    error: "X Veuillez indiquer une adresse valide"
  },

  {
    name: "city",
    regex: /^([A-Za-zÀ-Üà-ü-]{2,20})$/i,
    error: "X Veuillez indiquer une ville valide"
  },

  {
    name: "email",
    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    error: "X Veuillez indiquer une adresse mail valide"
  }

]

const formInputElements = document.querySelectorAll('div.cart__order__form__question input');
resetForm()
checkFormEntries()
getTheOrderId()


// Ecoute les entrées du formulaire
function checkFormEntries(){
  formInputElements.forEach(selectedInputElement => {
    selectedInputElement.addEventListener('change', () =>{

      let data = findInFormDataArray(selectedInputElement)
      let formElementIsValid = checkRegex(data, selectedInputElement)
      let nameErrorElementId = selectedInputElement.name+"ErrorMsg"
      const errorMessageElement =  document.getElementById(nameErrorElementId);

      displayFormError(formElementIsValid, errorMessageElement, data)
    })
  });
}


// Trouve dans le tableau FormData l'objet correspondant à l'input selectionné
function findInFormDataArray(selectedInputElement){
  const correspondingItem = formData.find(formDataElement => formDataElement.name === selectedInputElement.name)
  return correspondingItem
}


// Vérifie la correspondance entre la valeur de l'input et l'expression rationnelle
function checkRegex(data, selectedInputElement){
  let valueformElement = data.regex.test(selectedInputElement.value)
  return valueformElement
}


// Affiche les erreurs dans le formulaire 
function displayFormError(formElementIsValid, errorMessageElement, data){
  if (formElementIsValid) {
    errorMessageElement.textContent = "✓ Valide"
  }
  else{
    errorMessageElement.textContent = data.error
  }   
}


// ============== COMMANDER ============== //


// Requete POST sur l'api pour récupèrer l'id de commande
function getTheOrderId(){
  buttonOrderElement.addEventListener("click", function(e){
    e.preventDefault()
    let formIsValid = checkAllTheFormValue()
    let productsInTheLocalstorage = checkTheQuantityProductInTheLocalStorage()

    if (productsInTheLocalstorage) {
      if (formIsValid) {
        let registerContact = registersFormValues()
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerContact)
        };
        redirectionToTheConfirmationPage(requestOptions)

      }
      else{
        window.alert("Le formulaire est invalide")
      }
    }
    else{
      window.alert("Le panier est vide")
    }
  })
}

// Vérifie s'il y a des produits dans le localStorage
function checkTheQuantityProductInTheLocalStorage(){
  let localstorageFull = true

  if ("product" in localStorage) {
    localstorageFull = true
  }
  else{
    localstorageFull = false
  }
  return localstorageFull
}


// Verifie si l'intégralité du formulaire est valide
function checkAllTheFormValue() {
  let allFormIsValid = true
    for (inputElements of formInputElements) {
      let data = findInFormDataArray(inputElements)
      let formElementIsValid = checkRegex(data, inputElements)

      if(formElementIsValid){
        allFormIsValid = true
      }
      else{
        allFormIsValid = false
        break;
      }
    } 
  return allFormIsValid
}


// Enregistre les données entrées dans le formulaire
function registersFormValues(){
  let products = []
  const contentFromLocalstorage = getProductsFromLocalStorage();
  
  for (const product of contentFromLocalstorage) {
    let productID = product.itemId
    products.push(productID)
  }

  const formsValues = {
    contact : {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value
    },
    products : products
  }  

  return formsValues
}


// Redirige vers la page de confirmation 
function redirectionToTheConfirmationPage(requestOptions){
  fetch('http://localhost:3000/api/products/order', requestOptions)
      .then(response => response.json())
      .then(data => location.href = './confirmation.html?orderId=' + data.orderId);
      removeLocalStorage();
}


// Supprime le contenu du localStorage après avoir passé commande
function removeLocalStorage(){
  localStorage.removeItem('product');
}


// Reset le formulaire quand on refresh la page
function resetForm(){
    for (let a = 0; a < formInputElements.length; a++) {
        formInputElements[a].value = "";
    }
}


