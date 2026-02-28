// ================= MENU TOGGLE =================
const menuToggle = document.querySelector('.menu-toggle');
const navBar = document.querySelector('.nav-bar');

menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navBar.classList.toggle('active');
});

// ================= CART SYSTEM =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addButtons = document.querySelectorAll(".add-to-cart-btn");
const cartBtn = document.querySelector(".view-cart-btn");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const closeCartBtn = document.querySelector(".close-cart");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-info">
                <strong>${item.name}</strong><br>
                P${item.price} × ${item.quantity}
            </div>
            <div class="cart-actions">
                <button class="minus-btn">-</button>
                <button class="plus-btn">+</button>
                <button class="remove-btn">x</button>
            </div>
        `;

        // PLUS
        div.querySelector(".plus-btn").addEventListener("click", () => {
            cart[index].quantity++;
            updateCartUI();
        });

        // MINUS
        div.querySelector(".minus-btn").addEventListener("click", () => {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        });

        // REMOVE
        div.querySelector(".remove-btn").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    if (cartTotal) {
        cartTotal.textContent = `Total: P${total}`;
    }

    if (cartBtn) {
        cartBtn.textContent = `View Cart (${cart.length})`;
    }

    saveCart();
}

// ================= ADD TO CART =================
addButtons.forEach(button => {
    button.addEventListener("click", function () {

        const product = this.closest(".coffee-menu");
        const name = product.querySelector("h4").textContent;
        const price = parseFloat(product.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();
    });
});

// ================= MODAL OPEN / CLOSE =================
cartBtn?.addEventListener("click", () => {
    cartModal?.classList.add("show-cart");
});

closeCartBtn?.addEventListener("click", () => {
    cartModal?.classList.remove("show-cart");
});

// ================= REMOVE ALL =================
document.querySelector(".remove-all-btn")?.addEventListener("click", () => {
    if (confirm("Remove all items from cart?")) {
        cart = [];
        updateCartUI();
    }
});

// ================= PAY NOW =================
document.querySelector(".pay-now-btn")?.addEventListener("click", () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemList = cart
        .map(i => `• ${i.name} x${i.quantity} — P${i.price * i.quantity}`)
        .join("\n");

    alert(`✅ Order Placed!\n\n${itemList}\n\nTotal: P${total}\n\nThank you for your order!`);

    cart = [];
    updateCartUI();
    cartModal?.classList.remove("show-cart");
});

// ================= FILTER SYSTEM =================
const filterButtons = document.querySelectorAll(".coffee-btn");
const coffeeItems = document.querySelectorAll(".coffee-menu");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.textContent.toLowerCase();

        coffeeItems.forEach(item => {
            if (category === "all" || item.dataset.category === category) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });

    });
});

// ================= INITIAL LOAD =================
updateCartUI();