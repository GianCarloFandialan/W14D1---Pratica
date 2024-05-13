const params = new URLSearchParams(location.search);
const id = params.get('id');
const informationContainer = document.getElementById("informationContainer");

//CREO LA FUNZIONE PER OTTENERE LE INFORMAZIONI DEL PRODOTTO DALL'API
async function fetchDetails() {

  //ESEGUO IL TRY..CATCH
  try {
    //ESEGUO UNA RICHIESTA GET PER RICAVARE TUTTI GLI ELEMENTI GIA PRESENTI NELL'API
    const response = await fetch(`https://striveschool-api.herokuapp.com/api/product/${id}`, 
    {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNjYxMjBiM2IyNTAwMTUxYjU1NjEiLCJpYXQiOjE3MTUxMDMyNTAsImV4cCI6MTcxNjMxMjg1MH0.h5qDaJksi8Euk9GbpwWyiewZs9WKv-RZM6iGUIA0-Z8"
      }
    }
    )

    //CONVERTO LA RISPOSTA IN UN OGGETTO JSON
    const details = await response.json();
    
    console.log(details);
    //RESTITUISCO LE INFORMAZIONI OTTENUTE
    return details

  } catch (error) {
        //IN CASO DI ERRORE FACCIO UN CONSOLE ERROR DELL'ERRORE
        console.error("Errore:", error)
  }
  

}

fetchDetails()

document.addEventListener("DOMContentLoaded", () => {
  fetchDetails().then((details) => {
    //CREO IL DIV CHE CONTERRA L'IMMAGINE E GLI AGGIUNGO QUALCHE CLASSE
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("col-3");

    //CREO L'IMMAGINE E LE AGGIUNGO QUALCHE CLASSE
    const img = document.createElement("img");

    //AGGIUNGO L'ATTIBUTO SRC ESTRAENDOLO DAI DETTAGLI OTTENUTI
    img.setAttribute("src", `${details.imageUrl}`);

    //AGGIUNGO L'IMMAGINE E IL SUO CONENITORE ALLA PAGINA
    informationContainer.appendChild(imageDiv);
    imageDiv.appendChild(img);

    //CREO IL DIV CHE CONTERRA I DETTAGLI E GLI AGGIUNGO QUALCHE CLASSE
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("col-9");
    informationContainer.appendChild(detailsDiv);

    //CREO IL TITOLO DEL PRODOTTO, GLI AGGIUNGO IL CONTENUTO ESTRATTO E LO AGGIUNGO ALLA PAGINA
    const h1 = document.createElement("h1");
    h1.textContent = `${details.name}`
    detailsDiv.appendChild(h1);

    //CREO IL DIV CONTENTENTE IL BRAND DEL PRODOTTO, GLI AGGIUNGO IL CONTENUTO ESTRATTO E LO AGGIUNGO ALLA PAGINA
    const divBrand = document.createElement("div");
    divBrand.classList.add("my-3");
    divBrand.textContent = `Brand: ${details.brand}`
    detailsDiv.appendChild(divBrand);

    //CREO IL DIV CONTENTENTE IL PREZZO DEL PRODOTTO, GLI AGGIUNGO IL CONTENUTO ESTRATTO E LO AGGIUNGO ALLA PAGINA
    const divPrezzo = document.createElement("div");
    divPrezzo.classList.add("my-3");
    divPrezzo.textContent = `Prezzo: ${details.price}`
    detailsDiv.appendChild(divPrezzo);

    //CREO IL DIV CONTENTENTE LA DESCRZIONE DEL PRODOTTO, GLI AGGIUNGO IL CONTENUTO ESTRATTO E LO AGGIUNGO ALLA PAGINA
    const divDescrizione = document.createElement("div");
    divDescrizione.classList.add("my-3");
    divDescrizione.textContent = `Description: ${details.description}`
    detailsDiv.appendChild(divDescrizione);

    //CREO UN BOTTONE PER POTER "AGGIUNGERE AL CARRELLO" (FUNZIONE SOLO VISIVA)
    const cartButton = document.createElement("div");
    cartButton.classList.add("my-3", "btn", "btn-success");
    cartButton.textContent = 'Aggiungi al carrello'
    detailsDiv.appendChild(cartButton);

    //CREO L'ICONA DA AGGIUNGERE AL BOTTONE
    const cartIcon = document.createElement("div");
    cartIcon.classList.add("bi", "bi-cart");
    cartButton.appendChild(cartIcon);
  })
})