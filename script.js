const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addresInput = document.getElementById("address")
const addresWarn = document.getElementById("adress-warning")

let cart = [];


//Abrir modal 
cartBtn.addEventListener("click", function (){
    updateCartModal()
    cartModal.style.display = "flex"
})

//fechar modal
cartModal.addEventListener("click", function(event){
    if(event.target == cartModal){
    cartModal.style.display = "none"
    }
})

//fechar modal pelo botão
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(){
    let parentButton= event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name,price)

        // add no carrinho
    }
})

//função para add no carrinho

function addToCart(name,price){
    const existingItem= cart.find(item => item.name == name)

    if(existingItem){
        existingItem.quantity += 1
    }else{
    cart.push({
    name,
    price,
    quantity: 1,
    })
}   
   updateCartModal()
}

//Atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0

    cart.forEach(item => {
        const cartItemsCElement = document.createElement("div");
        cartItemsCElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemsCElement.innerHTML = `
            <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
            </div>
        `

        total += item.price * item.quantity;
        

        cartItemsContainer.appendChild(cartItemsCElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//remover item modal

cartItemsContainer.addEventListener("click",function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity >1){
        item.quantity -= 1;
        updateCartModal;
        return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addresInput.addEventListener("input", function(event){
    let inpuitvalue = event.target.value;

    if(inpuitvalue !== ""){
        addresInput.classList.remove("border-red-500")
        addresWarn.classList.add("hidden")
    }
})

//finalizar pedido
checkoutBtn.addEventListener("click",function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Restaurante fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }


    if(cart.length == 0) return;
    if(addresInput.value === ""){
        addresWarn.classList.remove("hidden")
        addresInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "5555555555"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addresInput.value}`, "_blank")

    cart= [];
    updateCartModal();
})


//Horário 
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <22;
    //restaurante aberto - true
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}