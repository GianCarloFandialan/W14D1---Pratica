// INSERISCO LE VARIABILI PRINCIPALI
const url = "https://striveschool-api.herokuapp.com/api/product/";
const productSection = document.getElementById("productSection");

//CREO LA FUNZIONE PER OTTENERE I PRODOTTI GIA PRESENTI NELL'API 
async function fetchProducts() {

  //ESEGUO IL TRY..CATCH
  try {
    //ESEGUO UNA RICHIESTA GET PER RICAVARE TUTTI GLI ELEMENTI GIA PRESENTI NELL'API
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNjYxMjBiM2IyNTAwMTUxYjU1NjEiLCJpYXQiOjE3MTUxMDMyNTAsImV4cCI6MTcxNjMxMjg1MH0.h5qDaJksi8Euk9GbpwWyiewZs9WKv-RZM6iGUIA0-Z8"
      }
    })

    //CONVERTO LA RISPOSTA IN UN OGGETTO JSON
    const products = await response.json();

    return products
  } catch (errore) {
    //IN CASO DI ERRORE FACCIO UN CONSOLE ERROR DELL'ERRORE
    console.error("Errore:", errore)
  }
  
}

//CREO LA FUNZIONE PER METTERE A SCHERMO I PRODOTTI OTTENUTI DALL'API
function generateCard(product) {

  //CREO UN DIV IN CUI ANDRO AD INSERIRE LA CARD
  const card = document.createElement("div");
  card.classList.add("card", "col", "px-0", "mx-3");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  card.appendChild(cardBody)
  const listGroup = document.createElement("ul");
  listGroup.classList.add("list-group", "list-group-flush");
  card.appendChild(listGroup)

  //CREO I VARI ELEMENTI CONTENUTI NELLA CARD
  const name = createElementWithText("a", product.name);
  const description = createElementWithText("p", product.description);
  const brand = createElementWithText("li", "Brand: " + product.brand);
  const imageUrl = document.createElement("img");
  const price = createElementWithText("li", `Prezzo: ${product.price} €`);
  const buttonsContainter = createElementWithText("li", '');

  //CREO I BOTTONI PER COMPRARE
  const buyButton = createElementWithText("button", '');
  const buyIcon = createElementWithText("i", '');

  //AGGIUNGO IL BADGE PER FAR VEDERE CHE IL PRODOTTO è STATO AGGIUNTO AL CARRELLO
  const addedToCartBadge = createElementWithText("span", 'Aggiunto al carrello');
  addedToCartBadge.classList.add("position-absolute", "top-0", "start-50", "translate-middle", "badge", "rounded-pill", "bg-success", "fs-6", "d-none");
  addedToCartBadge.setAttribute("id", `badge${product._id}`)
  card.appendChild(addedToCartBadge);

  //AGGIUNGO L'EVENTO PER POTER AGGIUNGERE AL CARRELLO AL BOTTONE
  buyButton.addEventListener("click", function buy() {
    addToCart(product)
  })

  //AGGIUNGO LE VARIE CLASSI DI BOOTSRAP A QUESTI ELEMENTI
  name.classList.add("card-title", "fs-5");
  //AGGIUNGO L'ATTRIBUTO HREF AGGIUNGERE IL LINK CON QUESRY STRING
  name.setAttribute("href", `./dettagli.html?id=${product._id}`)
  name.setAttribute("target", "_blank")
  description.classList.add("card-text");
  brand.classList.add("list-group-item");
  price.classList.add("list-group-item");
  buttonsContainter.classList.add("list-group-item");
  buyButton.classList.add("btn", "btn-success");
  buyIcon.classList.add("bi", "bi-cart");
  //AGGIUNGO L'ATTRIBUTO SRC ALL'IMMAGINE
  imageUrl.setAttribute("src", `${product.imageUrl}`);

  //AGGIUNGO L'ICONa Al BOTTONE E IL BOTTONE AL SUO CONTAINER
  buyButton.appendChild(buyIcon);
  buttonsContainter.appendChild(buyButton);

  //AGGIUNGO GLI ELEMENTI ALLA CARD
  card.insertBefore(imageUrl, card.firstChild);
  cardBody.appendChild(name);
  cardBody.appendChild(description);
  listGroup.appendChild(brand);
  listGroup.appendChild(price);
  listGroup.appendChild(buttonsContainter);

  //AGGIUNGO LA CARD AL CONTENITORE
  productSection.appendChild(card)
}

//CREO UNA FUNZIONE PER CREARE ELEMENTI CON IL RISPETTIVO TESTO
function createElementWithText(tagElement, textElement) {
  const tag = document.createElement(tagElement);
  tag.textContent = textElement;
  return tag;
}

//AGGIUNGO UN EVENTO AL CARICAMENTO DELLA PAGINA
document.addEventListener("DOMContentLoaded", function() {
  //RICHIAMO LA FUNZIONE PER VISUALIZZARE I PRODOTTI GIA PRESENTI NELL'API
  fetchProducts().then((products) => {
    products.forEach(product => {
      generateCard(product)
    });

    //AGGIUNGO UN EVENT LISTENER ALLA BARRA DI RICERCA IN MODO TALE CHE QUANDO SI PREMA INVIO NON SI CANCELLI IL SUO CONTENUTO E QUINDI LA RICERCA NON AVVENGA
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {

        // PEVENGO IL COMPORTAMENTO PREDEFINITO DEL MODULO(RICARICAMENTO DELLA PAGINA)
        e.preventDefault();

        //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO LE CARD PRIMA DI FILTRARE IN MODO TALE CHE NON SI SDOPPINO LE CARD
        while (productSection.firstChild) {
          productSection.removeChild(productSection.lastChild)
        }

        //OTTENGO GLI UTENTI FILTRATI
        const filteredProducts = filterProducts(products);

        //GENERO LE CARD CON SOLO GLI UTENTI FILTRATI
        filteredProducts.forEach((filteredProduct) => {
          generateCard(filteredProduct);
        })
      }
    })

    //AGGIUNGO LA STESSA FUNZIONE EVENT LISTENER PER LA  RICERCA AL PREMERE DEL BOTTONE CERCA
    searchButton.addEventListener("click", (e) => {

      // PEVENGO IL COMPORTAMENTO PREDEFINITO DEL MODULO(RICARICAMENTO DELLA PAGINA)
      e.preventDefault();

      //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO LE CARD PRIMA DI FILTRARE IN MODO TALE CHE NON SI SDOPPINO LE CARD
      while (productSection.firstChild) {
        productSection.removeChild(productSection.lastChild)
      }

      //OTTENGO GLI UTENTI FILTRATI
      const filteredProducts = filterProducts(products);

      //GENERO LE CARD CON SOLO GLI UTENTI FILTRATI
      filteredProducts.forEach((filteredProduct) => {
        generateCard(filteredProduct);
      })
    })

    //AGGIUNGO UN EVENTO ALLA BARRA DI RICERCA PER FILTRARE I LIST ITEMS SUGGERITI IN BASE A COSA SI CERCA
    searchBar.addEventListener("input", () => {

      //OTTENGO GLI UTENTI FILTRATI
      const filteredProducts = filterProducts(products);

      //CREO UNA CONDIZIONE PER CUI MI CREA I LIST ITEMS SUGGERITI SOLO NEL MOMENTO IN CUI NELL'INPUT CI SIA DEL CONTENUTO
      if (searchBar.value == '') {
        return
      } else {
        //GENERO I LIST ITEMS SUGGERITI CON SOLO GLI UTENTI FILTRATI
        filteredProducts.forEach((filteredProduct) => {
          suggestSearchBar(filteredProduct);
        })
      }
    })
  });

});

//EXTRA, AGGIUNGO UNA BARRA DI RICERCA PER FILTRARE LE CARD IN BASE AL NOME DEL PRODOTTO CHE SI CERCA
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const searchSuggestionList = document.getElementById("searchSuggestionList");
const sortSelect = document.getElementById("sortSelect");

//CREO LA VARIABILE DEL CONTENITORE DEI CONTENUTI DEL CARRELLO
const cartItemsContainer = document.getElementById("cartItemsContainer");

//FUNZIONE PER FILTRARE GLI UTENTI BASE ALL'INPUT DI RICERCA
function filterProducts(products) {

  //CREO UN CICLO PER SVUOTARE GLI ELEMENTI SUGGESTED
  while (searchSuggestionList.firstChild) {
    searchSuggestionList.removeChild(searchSuggestionList.lastChild)
  }

  //CREO LA VARIABILE IN CUI OTTENGO IL VALROE DELLA BARRA DI RICERCA
  const searchBarText = searchBar.value.toLowerCase();

  //RESTITUISCO I PRODOTTI FILTRATI(QUELLI CON IL NOME CHE INCLUDONO IL RISULTATO DELLA RICERCA)
  return products.filter(product => product.name.toLowerCase().includes(searchBarText));
};

//FUNZIONE PER GENERARE GLI ELEMENTI "SUGGESTED" NELLA BARRA DI RICERCA
function suggestSearchBar(product) {

  //CREO UN LIST ITEM IN CUI CI SARA UN PRODOTTO CONSIGLIATO
  const li = document.createElement("li");
  li.classList.add("p-2", "suggested-item")
  const a = document.createElement("a");
  a.textContent = product.name;
  a.setAttribute("href", `./dettagli.html?id=${product._id}`);
  a.classList.add("link-underline", "link-underline-opacity-0", "link-dark")
  li.appendChild(a);
  searchSuggestionList.appendChild(li);
}

//CREO UNA FUNZIONE PER AGGIUNGERE AL CARRELLO UN PRODOTTO
function addToCart(product) {
  //CREO UN ITEM LIST E UN DIV ROW CHE INSERIRSCO NEL PROPRIO CONTENITORE
  const li = document.createElement("li");
  li.classList.add("cart-item");
  cartItemsContainer.appendChild(li);
  const row = document.createElement("div");
  row.classList.add("row");
  li.appendChild(row);

  //CREO IL CONTENITORE IN CUI METTERO IL PREZZO ED IL NOME
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("col-9", "fs-5");
  row.appendChild(infoContainer);

  //CREO IL DIV DEL NOME E QUELLO DEL PREZZO
  const nome = createElementWithText("div", product.name);
  nome.classList.add("fw-bold", "cartProductName");
  infoContainer.appendChild(nome);
  const price = createElementWithText("div", `Prezzo: ${product.price}€`);
  infoContainer.appendChild(price);

  //CREO IL CONTENITORE IN CUI METTERO IL PREZZO ED IL NOME
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("col-3");
  row.appendChild(buttonContainer);

  //CREO IL CONTENITORE IN CUI METTERO IL BOTTONE
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  buttonContainer.appendChild(deleteButton);
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("bi", "bi-trash");
  deleteButton.appendChild(trashIcon);

  //CREO LA VARIABILE PER MIRARE IL BADGE DEL PRODOTTO SU CUI STO LAVORANDO
  const badge = document.getElementById(`badge${product._id}`);
  badge.classList.remove("d-none")

  //CREO LA VARIABILE PER LA SCRIATTA DEL CARRELLO VUOTO EE QUELLADEL NUMERO DEI PRODOTTI, LE FACCIO COMPARIRE E SCOMPARIRE NEL CASO IN CUI IL CARRELLO è VUOTO O HA ELEMENTI
  const emptyCart = document.getElementById("emptyCart");
  emptyCart.classList.add("d-none");
  const numberCartPorducts = document.getElementById("numberCartPorducts");
  //COME CONTENUTO DEL NUMERO DEI PRODOTTI VADO AD INSERIRE IL NUMERO DEI PRODOTTI USUFRENDO DEL NUMERO DI ELEMENTI NEL CONTENITORE
  numberCartPorducts.textContent = `Numero prodotti: ${cartItemsContainer.childElementCount}`;
  numberCartPorducts.classList.remove("d-none");

  //CREO LA VARIABILE PER IL BOTTONE DI PAGAMENTO
  const paymentButton = document.getElementById("paymentButton");
  paymentButton.classList.remove("d-none");

  //CREO UN EVENTO LEGATO AL PREMERE DEL BOTTONE DELETE
  deleteButton.addEventListener("click", function deleteItem() {

    //RIMUOVO IL PRODOTTO DALLA LISTA
    li.remove();

    //AGGIORNO LA SCRITTA DEL NUMERO DI PRODOTTI NEL CARRELLO
    numberCartPorducts.textContent = `Numero prodotti: ${cartItemsContainer.childElementCount}`;

    //CREO LA VARIABILE CHE HA COME TARGET IL NOME DEI PRODOTTI NEL CARRELLO
    const cartNames = document.getElementsByClassName("cartProductName");

    //TRASFORMO LA COLLEZIONE HTML IN UN ARRAY IN MDO TALE DA POTER USARE I METODI PER ARRAY SU DI ESSA
    const cartNamesArray = Array.from(cartNames);

    //USO IL METODO FIND PER VERIFICARE SE ESISTE ANCORA UN ELEMENTO CON IL NOME DEL PRODOTTO CANELLATO NEL CARRELLO E METTO UNA CONDIZIONE
    const test = cartNamesArray.find(item => item.textContent.includes(product.name))
    if (test === undefined) {

      //SE NON CI SONO PIU PRODOTTI CON LO STESSO NOME DEL PRODOTTO APPENA RIMOSSO, RIMUOVO LA SCRITTA "AGGIUNTO AL CARRELLO"
      badge.classList.add("d-none")

      //PONGO ANCHE UNA CONDIZIONE NEL CASO IL CARRELLO SIA VUOTO E NEL CASO LO SIA FACCIO COMPARIRE LA SCRITTA CHE è VUOTO E RIMUOVO IL RESTO
      if (cartItemsContainer.childElementCount == 0) {
        emptyCart.classList.remove("d-none");
        numberCartPorducts.classList.add("d-none");
        paymentButton.classList.add("d-none");
      }
    }
  })
}

//AGGIUNGO UNA FUNZIONE PER CUI SI ACCEDE AL BACKOFFICE SOLO METENDO LE CREDENZIALI GIUSTE
const backofficeButton = document.getElementById("backofficeButton");
const nameBackoffice = document.getElementById("nameBackoffice");
const passwordBackoffice = document.getElementById("passwordBackoffice");
const backofficeForm = document.getElementById("backofficeForm");

//CREO UN EVENTO LEGATO AL SUBMIT DI QUESTO BOTTONE
backofficeForm.addEventListener("submit", function(e) {
  //FACCIO SI CHE AL SUMBIT LE AZIONI DI DEFAULT NON VENGANO ESEGUITE
  e.preventDefault();

  //SE LE CREDENZIALI SONO CORRETTE PER ACCEDERE AL BACKOFFICE, REINDIRIZZO AL BACKOFFICE, ALTRIMENTI FACCIO UN ALERT IN CUI SEGNALO L'ERRORE
  if (nameBackoffice.value == "backoffice" && passwordBackoffice.value == "backoffice") {
    location.href = "backoffice.html";
  } else {
    alert("Password o nome utente sbagliato")
  }
})