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
