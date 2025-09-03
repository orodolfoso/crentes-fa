// Global variables
let cart = [];
let currentSection = 'home';

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;

    // Close mobile menu if open
    document.getElementById('navLinks').classList.remove('active');
    document.getElementById('hamburger').classList.remove('active');
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');

    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Cart functions
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartCount();
    showCartNotification(name);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function showCartNotification(itemName) {
    // Create and show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #444141, #1a1816);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 1500;
                animation: slideIn 0.3s ease-out;
            `;
    notification.textContent = `${itemName} adicionado ao carrinho!`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'Total: R$ 0,00';
    } else {
        cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item" style="background: rgba(0,0,0,0.1); color: #333;">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>R$ ${item.price.toFixed(2)} x ${item.quantity}</small>
                        </div>
                        <div>
                            <button onclick="changeQuantity('${item.name}', -1)" style="background: #1a1816; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 5px; margin: 0 0.2rem; cursor: pointer;">-</button>
                            <span style="margin: 0 0.5rem;">${item.quantity}</span>
                            <button onclick="changeQuantity('${item.name}', 1)" style="background: #1a1816; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 5px; margin: 0 0.2rem; cursor: pointer;">+</button>
                            <button onclick="removeFromCart('${item.name}')" style="background: #af1f12ff; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 5px; margin-left: 1rem; cursor: pointer;">🗑️</button>
                        </div>
                    </div>
                `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    document.getElementById('cartModal').style.display = 'block';
}

function changeQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        } else {
            updateCartCount();
            showCart(); // Refresh cart display
        }
    }
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartCount();
    showCart(); // Refresh cart display
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function proceedToPayment() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('paymentTotal').textContent = `Total: R$ ${total.toFixed(2)}`;

    closeCart();
    document.getElementById('paymentModal').style.display = 'block';
}

function toggleCardFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardFields = document.getElementById('cardFields');

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        cardFields.style.display = 'block';
        cardFields.querySelectorAll('input').forEach(input => input.required = true);
    } else {
        cardFields.style.display = 'none';
        cardFields.querySelectorAll('input').forEach(input => input.required = false);
    }
}

function processPayment(event) {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    const buttonText = document.getElementById('paymentButtonText');

    // Show loading
    buttonText.innerHTML = '<span class="loading"></span> Processando...';
    button.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        alert('Pagamento processado com sucesso! Você receberá um e-mail de confirmação.');
        cart = [];
        updateCartCount();
        closePayment();

        // Reset button
        buttonText.textContent = 'Confirmar Pagamento';
        button.disabled = false;

        // Clear form
        event.target.reset();
    }, 3000);
}

function closePayment() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Player details modal
function showPlayerDetails(name, position, details) {
    const playerDetails = document.getElementById('playerDetails');
    playerDetails.innerHTML = `
                <div style="text-align: center; color: #2c3e50;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(45deg, #667eea, #764ba2); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; font-weight: bold;">
                        ${name.split(' ')[0].charAt(0)}${name.split(' ')[1] ? name.split(' ')[1].charAt(0) : ''}
                    </div>
                    <h2 style="margin-bottom: 0.5rem;">${name}</h2>
                    <h4 style="color: #666; margin-bottom: 1.5rem;">${position}</h4>
                    <p style="line-height: 1.8; color: #555;">${details}</p>
                    <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee;">
                        <h4 style="margin-bottom: 1rem;">Estatísticas da Temporada</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; text-align: center;">
                            <div>
                                <strong style="display: block; color: #2c3e50;">Jogos</strong>
                                <span style="color: #666;">12</span>
                            </div>
                            <div>
                                <strong style="display: block; color: #2c3e50;">Gols</strong>
                                <span style="color: #666;">${position.includes('Atacante') || position.includes('Meia') ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 3)}</span>
                            </div>
                            <div>
                                <strong style="display: block; color: #2c3e50;">Assistências</strong>
                                <span style="color: #666;">${Math.floor(Math.random() * 6) + 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    document.getElementById('playerModal').style.display = 'block';
}

function closePlayerModal() {
    document.getElementById('playerModal').style.display = 'none';
}

// Contact form
function sendMessage(event) {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.innerHTML = '<span class="loading"></span> Enviando...';
    button.disabled = true;

    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Responderemos em até 24 horas.');
        event.target.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Close modals when clicking outside
window.onclick = function (event) {
    const modals = ['cartModal', 'paymentModal', 'playerModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add CSS for slide-in animation
const style = document.createElement('style');
style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    showSection('home');
});