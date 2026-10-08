 const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        category: "clothes",
        price: 25,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        id: 2,
        name: "Casual Hoodie",
        category: "clothes",
        price: 45,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "shoes",
        price: 70,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        id: 4,
        name: "Classic Sneakers",
        category: "shoes",
        price: 60,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772"
    },
    {
        id: 5,
        name: "Leather Bag",
        category: "accessories",
        price: 55,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
    },
    {
        id: 6,
        name: "Classic Watch",
        category: "accessories",
        price: 80,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d"
    }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


function displayProducts(list) {

    productsContainer.innerHTML = "";

    if (list.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="category">
                    ${product.category}
                </p>

                <p class="price">
                    $${product.price}
                </p>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>
        `;

        productsContainer.appendChild(card);
    });
}


function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();
    updateCart();

}


function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>$${item.price}</p>

                <div class="quantity">

                    <button onclick="changeQuantity(${item.id}, -1)">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

        cartItems.appendChild(cartItem);
    });


    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
}


function changeQuantity(productId, amount) {

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;

    product.quantity += amount;

    if (product.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCart();
}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    updateCart();
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


/* Search */

searchInput.addEventListener("input", filterProducts);


/* Category Filter */

categoryFilter.addEventListener(
    "change",
    filterProducts
);


function filterProducts() {

    const searchValue =
        searchInput.value.toLowerCase();

    const category =
        categoryFilter.value;

    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });

    displayProducts(filteredProducts);
}


/* Cart Open / Close */

cartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("active");
});


closeCart.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
});


cartOverlay.addEventListener("click", (event) => {

    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }

});


/* Initial */

displayProducts(products);
updateCart();