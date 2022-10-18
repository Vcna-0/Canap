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
