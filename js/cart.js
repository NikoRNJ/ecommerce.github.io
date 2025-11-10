/**
 * Gestión del Carrito de Compras
 * Sistema modular para manejar planes/productos en el carrito
 */

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const saved = localStorage.getItem('webflow_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('webflow_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // Agregar item al carrito
    addItem(id, name, price) {
        const existingItem = this.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: id,
                name: name,
                price: parseInt(price),
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${name} agregado al carrito`);
    }

    // Remover item del carrito
    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
    }

    // Actualizar cantidad
    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
            }
        }
    }

    // Calcular total
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Obtener cantidad de items
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Actualizar UI del carrito
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="bi bi-cart-x"></i>
                        <p>Tu carrito está vacío</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toLocaleString('es-CL')}</div>
                            <div class="cart-item-quantity">
                                <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toLocaleString('es-CL')}`;
        }
    }

    // Mostrar notificación
    showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #00d4ff, #00ffff);
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.5);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Adjuntar event listeners
    attachEventListeners() {
        // Botones "Agregar al carrito"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const name = e.currentTarget.dataset.name;
                const price = e.currentTarget.dataset.price;
                this.addItem(id, name, price);
            });
        });

        // Toggle carrito modal
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');

        if (cartIcon && cartModal) {
            cartIcon.addEventListener('click', () => {
                cartModal.classList.add('active');
                cartModal.style.display = 'block';
                cartOverlay.classList.add('active');
            });

            closeCart.addEventListener('click', () => {
                cartModal.classList.remove('active');
                cartOverlay.classList.remove('active');
                setTimeout(() => {
                    cartModal.style.display = 'none';
                }, 300);
            });

            cartOverlay.addEventListener('click', () => {
                cartModal.classList.remove('active');
                cartOverlay.classList.remove('active');
                setTimeout(() => {
                    cartModal.style.display = 'none';
                }, 300);
            });
        }
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
    }
}

// Inicializar carrito globalmente
let cart;

document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
