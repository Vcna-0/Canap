let orderIdElement = document.getElementById("orderId")

// Recupère l'id de commande dans l'url
function getOrderIdFromUrl(){
  const str = window.location.href;
  const url = new URL(str);
  const urlId = url.searchParams.get('orderId');
  return urlId;
}

orderIdElement.textContent = getOrderIdFromUrl()