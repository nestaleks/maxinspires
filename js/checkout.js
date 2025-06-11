// Модуль для обработки процесса оформления заказа
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js загружен');

    const CheckoutManager = {
        state: {
            customer: {},
            shipping: {
                method: 'standard',
                cost: 0
            },
            payment: {
                method: 'credit-card'
            },
            order: {
                subtotal: 59.97,
                taxes: 5.99,
                total: 65.96
            }
        },

        init() {
            this.setupFormValidation();
            this.setupEventListeners();
            this.initializeOrderSummary();
        },

        setupFormValidation() {
            const forms = document.querySelectorAll('.checkout-form');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (this.validateForm(form)) {
                        this.processForm(form);
                    }
                });

                // Живая валидация
                const inputs = form.querySelectorAll('input[required]');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });
                });
            });
        },

        validateField(input) {
            const isValid = input.checkValidity();
            input.classList.toggle('invalid', !isValid);
            
            // Показываем сообщение об ошибке
            let errorMessage = input.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
            errorMessage.textContent = isValid ? '' : input.validationMessage;
            
            return isValid;
        },

        validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            return isValid;
        },

        setupEventListeners() {
            // Обработчики для кнопок навигации
            document.querySelectorAll('.continue-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const currentSection = button.closest('.checkout-section');
                    if (this.validateForm(currentSection.querySelector('form'))) {
                        this.goToNextStep(currentSection);
                    }
                });
            });

            // Обработчики для способов доставки
            document.querySelectorAll('.shipping-option input[type="radio"]').forEach(option => {
                option.addEventListener('change', () => {
                    this.updateShippingMethod(option.id);
                });
            });

            // Обработчики для способов оплаты
            document.querySelectorAll('.payment-method input[type="radio"]').forEach(method => {
                method.addEventListener('change', () => {
                    this.updatePaymentMethod(method.id);
                });
            });

            // Обработка кнопки завершения заказа
            const completeOrderBtn = document.querySelector('.complete-order');
            if (completeOrderBtn) {
                completeOrderBtn.addEventListener('click', () => this.completeOrder());
            }
        },

        goToNextStep(currentSection) {
            const sections = document.querySelectorAll('.checkout-section');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex < sections.length - 1) {
                this.showSection(currentIndex + 1);
            }
        },

        showSection(index) {
            document.querySelectorAll('.checkout-section').forEach((section, i) => {
                section.classList.toggle('hidden', i !== index);
            });

            document.querySelectorAll('.progress-step').forEach((step, i) => {
                step.classList.toggle('active', i <= index);
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        updateShippingMethod(methodId) {
            const methods = {
                'standard': { cost: 0, name: 'Standard Shipping' },
                'express': { cost: 12.00, name: 'Express Shipping' },
                'next-day': { cost: 25.00, name: 'Next Day Delivery' }
            };

            this.state.shipping = {
                method: methodId,
                cost: methods[methodId].cost
            };

            this.updateOrderSummary();
        },

        updatePaymentMethod(methodId) {
            this.state.payment.method = methodId;
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.remove('active');
            });
            const selectedForm = document.querySelector(`.${methodId}-form`);
            if (selectedForm) {
                selectedForm.classList.add('active');
            }
        },

        updateOrderSummary() {
            const subtotal = this.state.order.subtotal;
            const shipping = this.state.shipping.cost;
            const taxes = this.state.order.taxes;
            const total = subtotal + shipping + taxes;

            // Обновляем отображение
            document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
            document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
            document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `$${taxes.toFixed(2)}`;
            document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
        },

        initializeOrderSummary() {
            this.updateOrderSummary();
        },

        async completeOrder() {
            try {
                if (!this.validateAllForms()) {
                    throw new Error('Please check all required fields');
                }

                // Здесь будет логика отправки заказа
                const orderData = {
                    ...this.state,
                    orderId: this.generateOrderId(),
                    timestamp: new Date().toISOString()
                };

                console.log('Order completed:', orderData);
                // После успешного оформления заказа
                this.handleOrderSuccess();
            } catch (error) {
                console.error('Error completing order:', error);
                this.handleOrderError(error);
            }
        },

        validateAllForms() {
            let isValid = true;
            document.querySelectorAll('.checkout-form').forEach(form => {
                if (!this.validateForm(form)) {
                    isValid = false;
                }
            });
            return isValid;
        },

        generateOrderId() {
            return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        },

        handleOrderSuccess() {
            // Можно добавить анимацию успешного оформления
            const checkoutContent = document.querySelector('.checkout-content');
            checkoutContent.innerHTML = `
                <div class="order-success">
                    <div class="success-icon">✓</div>
                    <h2>Thank you for your order!</h2>
                    <p>Your order has been successfully placed.</p>
                    <p>Order ID: ${this.generateOrderId()}</p>
                    <a href="./index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        },

        handleOrderError(error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-notification';
            errorMessage.textContent = error.message || 'An error occurred while processing your order';
            document.body.appendChild(errorMessage);
            
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
    };

    // Инициализация
    CheckoutManager.init();
});
