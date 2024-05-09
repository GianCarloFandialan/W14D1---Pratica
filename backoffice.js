// INSERISCO LE VARIABILI PRINCIPALI
const url = "https://striveschool-api.herokuapp.com/api/product/";
const createProductForm = document.getElementById("createProductForm");
const productsContainer = document.getElementById("productsContainer")
const modifyModalContainer = document.getElementById("modifyModalContainer")
const deleteModalContainer = document.getElementById("deleteModalContainer")

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

//CREO LA FUNZIONE PER METTERE A SCHERMO I PRODOTTI OTTENUTI DALL'API(GENERARE LE CARD)
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
  const name = createElementWithText("h5", product.name);
  const description = createElementWithText("p", product.description);
  const brand = createElementWithText("li", "Brand: " + product.brand);
  const imageUrl = document.createElement("img");
  const price = createElementWithText("li", `Price: ${product.price} €`);
  const buttonsContainter = createElementWithText("li", '');

  //CREO I BOTTONI PER CANCELLARE O MODIFICARE
  const deleteButton = createElementWithText("button", '');
  const trashIcon = createElementWithText("i", '');
  const modifyButton = createElementWithText("button", '');
  const pencilIcon = createElementWithText("i", '');

  //AGGIUNGO LE VARIE CLASSI DI BOOTSRAP A QUESTI ELEMENTI
  name.classList.add("card-title");
  description.classList.add("card-text");
  brand.classList.add("list-group-item");
  price.classList.add("list-group-item");
  buttonsContainter.classList.add("list-group-item")

  //AGGIUNGO LE VARIE CLASSI DI BOOTSRAP AI BOTTONI E LE ICONE
  deleteButton.classList.add("btn", "btn-danger", "me-4");
  deleteButton.setAttribute("type", "button");
  deleteButton.addEventListener("click", function prova() {
    generateDeleteModal(product);
  });
  deleteButton.setAttribute("data-bs-toggle", "modal");
  deleteButton.setAttribute("data-bs-target", `#deleteModal`);
  modifyButton.classList.add("btn", "btn-success");
  modifyButton.setAttribute("type", "button");
  modifyButton.addEventListener("click", function prova() {
    generateModifyModal(product);
  });
  modifyButton.setAttribute("data-bs-toggle", "modal");
  modifyButton.setAttribute("data-bs-target", `#modifyModal`);
  trashIcon.classList.add("bi", "bi-trash");
  pencilIcon.classList.add("bi", "bi-pencil-square");

  //AGGIUNGO L'ATTRIBUTO SRC ALL'IMMAGINE
  imageUrl.setAttribute("src", `${product.imageUrl}`);
  
  //AGGIUNGO LE ICONE AI BOTTONI E I BOTTONI AL LORO CONTAINER
  deleteButton.appendChild(trashIcon);
  modifyButton.appendChild(pencilIcon);
  buttonsContainter.appendChild(deleteButton);
  buttonsContainter.appendChild(modifyButton);

  //AGGIUNGO GLI ELEMENTI ALLA CARD
  card.insertBefore(imageUrl, card.firstChild);
  cardBody.appendChild(name);
  cardBody.appendChild(description);
  listGroup.appendChild(brand);
  listGroup.appendChild(price);
  listGroup.appendChild(buttonsContainter);

  //AGGIUNGO LA CARD AL CONTENITORE
  productsContainer.appendChild(card)

  return product
}

//CREO UNA FUNZIONE PER GENERARE I MODALI PER MODIFICARE
function generateModifyModal(product) {

  //INIZIO A CREARE IL MODALE DI BOOTSTRAP A MANO EVITANDO DI USARE L'INNERHTML PER LE QUESTIONI DI SICUREZZA CITATE NELLE LEZIONI E LO AGGIUNGO ALL'INTERNO DEL SUO CONTAINER
  //COME PROCEDIMENTO OGNI VOLTA CREO L'ELEMENTO, GLI AGGIUNGO LE CLASSE E GLI ATTRIBUTI NECESSARI E POI LO AGGIUNGO ALL'ELEMENTO CHE LO DOVREBBE CONTENERE
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade", "show");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "modifyModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("id", `modifyModal`);
  modal.setAttribute("aria-modal", `true`);
  modal.setAttribute("role", `dialog`);
  modal.style.display = "block";
  modifyModalContainer.appendChild(modal)

  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");
  modal.appendChild(modalDialog)

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalDialog.appendChild(modalContent);

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalContent.appendChild(modalHeader);

  const modalTitle = createElementWithText("h1", "Modifica")
  modalTitle.classList.add("modal-title", "fs-5");
  modalTitle.setAttribute("id", "modifyModalLabel");
  modalHeader.appendChild(modalTitle);

  const closeButton = document.createElement("button");
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.setAttribute("type", "button");
  modalHeader.appendChild(closeButton);
  
  //AGGIUNGO UN EVENTO LEGATO AL CLICK DEL BOTTONE PER CHIUDERE
  closeButton.addEventListener("click", (e) => {

    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    e.preventDefault();
    
    //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO I MODALI
    while (modifyModalContainer.firstChild) {
      modifyModalContainer.removeChild(modifyModalContainer.lastChild);
    }
  }, {once : true})

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalContent.appendChild(modalBody);

  const modifyProductForm = document.createElement("form");
  modifyProductForm.setAttribute("id", "modifyProductForm");
  modalBody.appendChild(modifyProductForm);

  const nameDiv = document.createElement("div");
  modifyProductForm.appendChild(nameDiv);
  const labelName = createElementWithText("label", "Nome:");
  labelName.setAttribute("for", "nameModify");
  nameDiv.appendChild(labelName);
  const inputName = document.createElement("input");
  inputName.classList.add("form-control");
  inputName.setAttribute("type", "text");
  inputName.setAttribute("autocomplete", "off");
  inputName.setAttribute("id", "nameModify");
  nameDiv.appendChild(inputName);

  const descriptionDiv = document.createElement("div");
  modifyProductForm.appendChild(descriptionDiv);
  const labelDescription = createElementWithText("label", "Descrizione:");
  labelDescription.setAttribute("for", "descriptionModify");
  descriptionDiv.appendChild(labelDescription);
  const inputDescription = document.createElement("input");
  inputDescription.classList.add("form-control");
  inputDescription.setAttribute("type", "text");
  inputDescription.setAttribute("autocomplete", "off");
  inputDescription.setAttribute("id", "descriptionModify");
  descriptionDiv.appendChild(inputDescription);

  const brandDiv = document.createElement("div");
  modifyProductForm.appendChild(brandDiv);
  const labelBrand = createElementWithText("label", "Brand:");
  labelBrand.setAttribute("for", "brandModify");
  brandDiv.appendChild(labelBrand);
  const inputBrand = document.createElement("input");
  inputBrand.classList.add("form-control");
  inputBrand.setAttribute("type", "text");
  inputBrand.setAttribute("autocomplete", "off");
  inputBrand.setAttribute("id", "brandModify");
  brandDiv.appendChild(inputBrand);

  const imageUrlDiv = document.createElement("div");
  modifyProductForm.appendChild(imageUrlDiv);
  const labelImageUrl = createElementWithText("label", "Url immagine:");
  labelImageUrl.setAttribute("for", "imageUrlModify");
  imageUrlDiv.appendChild(labelImageUrl);
  const inputImageUrl = document.createElement("input");
  inputImageUrl.classList.add("form-control");
  inputImageUrl.setAttribute("type", "url");
  inputImageUrl.setAttribute("autocomplete", "off");
  inputImageUrl.setAttribute("id", "imageUrlModify");
  imageUrlDiv.appendChild(inputImageUrl);

  const priceDiv = document.createElement("div");
  modifyProductForm.appendChild(priceDiv);
  const labelPrice = createElementWithText("label", "Prezzo:");
  labelPrice.setAttribute("for", "priceModify");
  priceDiv.appendChild(labelPrice);
  const inputPrice = document.createElement("input");
  inputPrice.classList.add("form-control");
  inputPrice.setAttribute("type", "number");
  inputPrice.setAttribute("autocomplete", "off");
  inputPrice.setAttribute("id", "priceModify");
  priceDiv.appendChild(inputPrice);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modifyProductForm.appendChild(modalFooter);

  const closeButtonBottom = createElementWithText("button", "Chiudi");
  closeButtonBottom.classList.add("btn", "btn-secondary");
  closeButtonBottom.setAttribute("type", "button");
  closeButtonBottom.setAttribute("data-bs-dismiss", "modal");
  modalFooter.appendChild(closeButtonBottom);

  //AGGIUNGO UN EVENTO LEGATO AL CLICK DEL BOTTONE PER CHIUDERE
  closeButtonBottom.addEventListener("click", (e) => {

    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    e.preventDefault();
    
    //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO I MODALI
    while (modifyModalContainer.firstChild) {
      modifyModalContainer.removeChild(modifyModalContainer.lastChild);
    }
  }, {once : true})

  const modifyButtonModal = createElementWithText("button", "Modifica");
  modifyButtonModal.classList.add("btn", "btn-success");
  modifyButtonModal.setAttribute("type", "submit");
  modifyButtonModal.setAttribute("data-bs-dismiss", "modal");
  modalFooter.appendChild(modifyButtonModal);

  //AGGIUNGO UNA FUNZIONE AL SUBMIT DEL FORM PREMENDO IL TASTO MODIFICA
  modifyProductForm.addEventListener("submit", function(event) {

    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    event.preventDefault();

    //CREO LE VARIABILI CHE POTENZIALMENTE POTREBBERO SOSTITUIRE UN VALORE
    let productNameModify = '';
    let productDescriptionModify = '';
    let productBrandModify = '';
    let productImageUrlModify = '';
    let productPriceModify = '';

    //MI RICAVO LE COSTANTI DAI VARI INPUT, SE LA CASELLA DI INPUT VIENE LASCIATA VUOTA, NON SI MODIFICA IL SUO CONTNEUTO E SI RIUSA QUELLO GIA FORNITO
    if (document.getElementById("nameModify").value != '') {
      productNameModify = document.getElementById("nameModify").value;
    } else {
      productNameModify = product.name;
    }
    if (document.getElementById("descriptionModify").value != '') {
      productDescriptionModify = document.getElementById("descriptionModify").value;
    } else {
      productDescriptionModify = product.description;
    }
    if (document.getElementById("brandModify").value != '') {
      productBrandModify = document.getElementById("brandModify").value;
    } else {
      productBrandModify = product.brand;
    }
    if (document.getElementById("imageUrlModify").value != '') {
      productImageUrlModify = document.getElementById("imageUrlModify").value;
    } else {
      productImageUrlModify = product.imageUrl;
    }
    if (document.getElementById("priceModify").value != '') {
      productPriceModify = document.getElementById("priceModify").value;
    } else {
      productPriceModify = product.price;
    }

    //DALLE COSTANTI OTTENUTE DAGL INPUT CREO UN OGGETTO CHE FINIRA POI NEL BODY DELLA RICHIESTA PUT "body: JSON.stringify(modifiedProduct)"
    const modifyObject = {
      name: productNameModify,
      description: productDescriptionModify,
      brand: productBrandModify,
      imageUrl: productImageUrlModify,
      price: productPriceModify,
    }

    //RICHIAMO LA FUNZIONE PER MODIFICARE IL PRODOTTO NELL'API
    modifyProduct(modifyObject, product._id)

    //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO I MODALI
    while (modifyModalContainer.firstChild) {
      modifyModalContainer.removeChild(modifyModalContainer.lastChild);
    }
  })

}

//CREO LA FUNZIONE PER MODIFICARE UN PRODOTTO
async function modifyProduct(modifiedProduct, id) {

  //ESEGUO IL TRY..CATCH
  try {
    //ESEGUO UNA RICHIESTA PUT PER POTER MODIFICARE IL PRODOTTO SPECIFICO NELL'API
    const response = await fetch(url + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: 
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNjYxMjBiM2IyNTAwMTUxYjU1NjEiLCJpYXQiOjE3MTUxMDMyNTAsImV4cCI6MTcxNjMxMjg1MH0.h5qDaJksi8Euk9GbpwWyiewZs9WKv-RZM6iGUIA0-Z8",
      },
      body: JSON.stringify(modifiedProduct),
    })

    if (response.ok) {
      //RICARICO LA PAGINA UN AUTOMATICO COSI SI AGGIORNA L'ELEMENTO MODIFICATO
      location.reload() 
    }

  } catch (errore) {
      //IN CASO DI ERRORE FACCIO UN CONSOLE ERROR DELL'ERRORE
      console.error("Errore:", errore)
  }
  
};

//CREO UNA FUNZIONE PER GENERARE IL MODALE PER CANCELLARE UN PRODOTTO
function generateDeleteModal(product) {

  //INIZIO A CREARE IL MODALE DI BOOTSTRAP A MANO EVITANDO DI USARE L'INNERHTML PER LE QUESTIONI DI SICUREZZA CITATE NELLE LEZIONI E LO AGGIUNGO ALL'INTERNO DEL SUO CONTAINER
  //COME PROCEDIMENTO OGNI VOLTA CREO L'ELEMENTO, GLI AGGIUNGO LE CLASSE E GLI ATTRIBUTI NECESSARI E POI LO AGGIUNGO ALL'ELEMENTO CHE LO DOVREBBE CONTENERE
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade", "show");
  modal.setAttribute("id", "deleteModal");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("data-bs-keyboard", "false");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "staticBackdropLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-modal", `true`);
  modal.setAttribute("role", `dialog`);
  modal.style.display = "block";
  deleteModalContainer.appendChild(modal);

  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");
  modal.appendChild(modalDialog)

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalDialog.appendChild(modalContent);

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalContent.appendChild(modalHeader);

  const modalTitle = createElementWithText("h1", "CANCELLAZIONE");
  modalTitle.setAttribute("id", "staticBackdropLabel");
  modalHeader.appendChild(modalTitle);

  const closeButton = document.createElement("button");
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.setAttribute("type", "button");
  modalHeader.appendChild(closeButton);
  
  //AGGIUNGO UN EVENTO LEGATO AL CLICK DEL BOTTONE PER CHIUDERE
  closeButton.addEventListener("click", (e) => {

    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    e.preventDefault();
    
    //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO I MODALI
    while (deleteModalContainer.firstChild) {
      deleteModalContainer.removeChild(deleteModalContainer.lastChild);
    }
  }, {once : true})

  const modalBody = createElementWithText("div", "Sei sicuro di voler cancellare l'elemento?");
  modalBody.classList.add("modal-body");
  modalContent.appendChild(modalBody);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalContent.appendChild(modalFooter);

  const closeButtonBottom = createElementWithText("button", "Chiudi");
  closeButtonBottom.classList.add("btn", "btn-secondary");
  closeButtonBottom.setAttribute("type", "button");
  closeButtonBottom.setAttribute("data-bs-dismiss", "modal");
  modalFooter.appendChild(closeButtonBottom);

  //AGGIUNGO UN EVENTO LEGATO AL CLICK DEL BOTTONE PER CHIUDERE
  closeButtonBottom.addEventListener("click", (e) => {

    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    e.preventDefault();
    
    //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO I MODALI
    while (deleteModalContainer.firstChild) {
      deleteModalContainer.removeChild(deleteModalContainer.lastChild);
    }
  }, {once : true})

  const modifyButtonModal = createElementWithText("button", "Cancella");
  modifyButtonModal.classList.add("btn", "btn-danger");
  modifyButtonModal.setAttribute("type", "button");
  modifyButtonModal.setAttribute("data-bs-dismiss", "modal");
  modalFooter.appendChild(modifyButtonModal);

  modifyButtonModal.addEventListener("click", () => {
    //RICHIAMO LA FUNZIONE PER MODIFICARE IL PRODOTTO NELL'API
    deleteProduct(product._id)
  })
}  

//CREO LA FUNZIONE PER CANCELLARE UN PRODOTTO
async function deleteProduct(id) {

  //ESEGUO IL TRY..CATCH
  try {
    //ESEGUO UNA RICHIESTA PUT PER POTER MODIFICARE IL PRODOTTO SPECIFICO NELL'API
    const response = await fetch(url + id, {
      method: "DELETE",
      headers: {
        authorization: 
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNjYxMjBiM2IyNTAwMTUxYjU1NjEiLCJpYXQiOjE3MTUxMDMyNTAsImV4cCI6MTcxNjMxMjg1MH0.h5qDaJksi8Euk9GbpwWyiewZs9WKv-RZM6iGUIA0-Z8",
      },
    })

    if (response.ok) {
      //RICARICO LA PAGINA UN AUTOMATICO COSI SCOMPARE L'ELEMENTO CANCELLATO
      location.reload() 
    }

  } catch (errore) {
      //IN CASO DI ERRORE FACCIO UN CONSOLE ERROR DELL'ERRORE
      console.error("Errore:", errore)
  }
  
};

//CREO UNA FUNZIONE PER CREARE ELEMENTI CON IL RISPETTIVO TESTO
function createElementWithText(tagElement, textElement) {
  const tag = document.createElement(tagElement);
  tag.textContent = textElement;
  return tag;
}

//CREO LA FUNZIONE PER VISUALIZZARE I PRODOTTI CREATI
async function createProduct(createdProduct) {

  //ESEGUO IL TRY..CATCH
  try {
    //ESEGUO UNA RICHIESTA POST PER CREARE UN NUOVO PRODOTTO NELL'API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: 
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNjYxMjBiM2IyNTAwMTUxYjU1NjEiLCJpYXQiOjE3MTUxMDMyNTAsImV4cCI6MTcxNjMxMjg1MH0.h5qDaJksi8Euk9GbpwWyiewZs9WKv-RZM6iGUIA0-Z8",
      },
      body: JSON.stringify(createdProduct),
    })

    //CONVERTO LA RISPOSTA IN UN OGGETTO JSON
    const product = await response.json();

    generateCard(product)

  } catch (errore) {
      //IN CASO DI ERRORE FACCIO UN CONSOLE ERROR DELL'ERRORE
      console.error("Errore:", errore)
  }
  
}

//AGGIUNGO UN EVENTO AL CARICAMENTO DELLA PAGINA
document.addEventListener("DOMContentLoaded", function() {
  
  //CREO UN EVENTO LEGATO AL SUBMIT DEL FORM
  createProductForm.addEventListener("submit", function(event) {
    //AGGIUNGO IL PREVENT DEFAULT PER EVITAE CHE OGNI VOLTA CHE SI EFFETTUA IL SUBMIT SI RICARICHI LA PAGINA
    event.preventDefault();

    //MI RICAVO LE COSTANTI DAI VARI INPUT 
    const productName = document.getElementById("name").value;
    const productDescription = document.getElementById("description").value;
    const productBrand = document.getElementById("brand").value;
    const productImageUrl = document.getElementById("imageUrl").value;
    const productPrice = document.getElementById("price").value;

    //DALLE COSTANTI OTTENUTE DAGL INPU CREO UN OGGETTO CHE FINIRA POI NEL BODY DELLA RICHIESTA POST "body: JSON.stringify(product)"
    const productObject = {
      name: productName,
      description: productDescription,
      brand: productBrand,
      imageUrl: productImageUrl,
      price: productPrice,
    }

    //RICHIAMO LA FUNZIONE PER FARE IL POST DEL PRODOTTO AVENTE COME DATI I DATI DELL'OGGETTO CHE A SUA VOLTA CREERA LA CARD
    createProduct(productObject)

    //RESETTO IL MODULO IN MODO TALE DA FACILITARE L'AGGIUNTA DI NUOVO PRODOTTO DA CAPO
    createProductForm.reset();
  });

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
        while (productsContainer.firstChild) {
          productsContainer.removeChild(productsContainer.lastChild);
        }

        //OTTENGO GLI UTENTI FILTRATI
        const filteredProducts = filterProducts(products);

        //GENERO LE CARD CON SOLO GLI UTENTI FILTRATI
        filteredProducts.forEach((filteredProduct) => {
          generateCard(filteredProduct);
        })

        //AL PREMERE DEL TASTO INVIO SVUOTO L'INPUT
        // searchBar.value = "";
      } 
    })

    //AGGIUNGO LA STESSA FUNZIONE EVENT LISTENER PER LA  RICERCA AL PREMERE DEL BOTTONE CERCA
    searchButton.addEventListener("click", (e) => {

      // PEVENGO IL COMPORTAMENTO PREDEFINITO DEL MODULO(RICARICAMENTO DELLA PAGINA)
      e.preventDefault();

      //CREO UN CICLO PER SVUOTARE LA SEZIONE IN CUI CI SONO LE CARD PRIMA DI FILTRARE IN MODO TALE CHE NON SI SDOPPINO LE CARD
      while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.lastChild)
      }

      //OTTENGO GLI UTENTI FILTRATI
      const filteredProducts = filterProducts(products);
      console.log(filteredProducts);

      //GENERO LE CARD CON SOLO GLI UTENTI FILTRATI
      filteredProducts.forEach((filteredProduct) => {
        generateCard(filteredProduct);
      })
    })

    //AGGIUNGO UN EVENTO ALLA BARRA DI RICERCA PER FILTRARE LE CARD IN BASE A COSA SI CERCA
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
  })
});

//EXTRA, AGGIUNGO UNA BARRA DI RICERCA PER FILTRARE LE CARD IN BASE AL NOME DEL PRODOTTO CHE SI CERCA
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const searchSuggestionList = document.getElementById("searchSuggestionList");

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
