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
  const price = createElementWithText("li", `Price: ${product.price} €`);

  //AGGIUNGO LE VARIE CLASSI DI BOOTSRAP A QUESTI ELEMENTI
  name.classList.add("card-title", "fs-5");
  //AGGIUNGO L'ATTRIBUTO HREF AGGIUNGERE IL LINK CON QUESRY STRING
  name.setAttribute("href", `./dettagli.html?id=${product._id}`)
  description.classList.add("card-text");
  brand.classList.add("list-group-item");
  price.classList.add("list-group-item");
  //AGGIUNGO L'ATTRIBUTO SRC ALL'IMMAGINE
  imageUrl.setAttribute("src", `${product.imageUrl}`)

  //AGGIUNGO GLI ELEMENTI ALLA CARD
  card.insertBefore(imageUrl, card.firstChild);
  cardBody.appendChild(name);
  cardBody.appendChild(description);
  listGroup.appendChild(brand);
  listGroup.appendChild(price);

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

//CREO UNA FUNZIONE PER ORDINARE LE VARIE CARD
function sort(array) {
  if (sortSelect.value == "Ordine di caricamento") {
    
  } else if (sortSelect.value == "Brand") {
    
  } else if (sortSelect.value == "Prezzo: crescente") {
    array.sort
  } else if (sortSelect.value == "Prezzo: decrescente") {
    
  }
}

