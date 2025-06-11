// Logger utility
const Logger = {
    levels: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error',
        DEBUG: 'debug'
    },

    log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        // В продакшене можно отправлять логи на сервер
        if (level === this.levels.ERROR) {
            this.handleError(logEntry);
        }

        console[level](`[${timestamp}] ${message}`, data);
    },

    handleError(errorLog) {
        // Сохраняем ошибки локально
        let errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorLog);
        localStorage.setItem('app_errors', JSON.stringify(errors.slice(-100))); // Храним последние 100 ошибок
    },

    info(message, data) {
        this.log(this.levels.INFO, message, data);
    },

    warn(message, data) {
        this.log(this.levels.WARN, message, data);
    },

    error(message, data) {
        this.log(this.levels.ERROR, message, data);
    },

    debug(message, data) {
        this.log(this.levels.DEBUG, message, data);
    }
};

// Test Logger initialization
console.log('Logger initialized:', typeof Logger !== 'undefined');
Logger.info('Logger system initialized successfully');

// Error handler
const ErrorHandler = {
    init() {
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    },

    handleGlobalError(event) {
        Logger.error('Global error occurred', {
            message: event.message,
            filename: event.filename,
            lineNo: event.lineno,
            colNo: event.colno,
            error: event.error
        });
    },

    handlePromiseError(event) {
        Logger.error('Unhandled Promise rejection', {
            reason: event.reason
        });
    }
};

// Initialize error handling
ErrorHandler.init();
console.log('ErrorHandler initialized:', typeof ErrorHandler !== 'undefined');
Logger.info('ErrorHandler system initialized successfully');

// 01. Country Selector Component
const CountrySelector = {
    init() {
        try {
            Logger.info('Initializing CountrySelector');
            console.log('CountrySelector: Starting initialization');
            
            // Получаем все селекторы стран на странице (в шапке и футере)
            const countrySelectors = document.querySelectorAll('.country-selector');
            console.log('CountrySelector: Found selectors:', countrySelectors.length);

            // Restore saved country selection
            this.restoreSavedCountry();
            
            // Setup event listeners для всех селекторов стран
            countrySelectors.forEach(selector => {
                const selectedCountry = selector.querySelector('.selected-country');
                if (selectedCountry) {
                    this.setupEventListeners(selector, selectedCountry);
                }
            });
            
            console.log('CountrySelector: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize CountrySelector', error);
            console.error('CountrySelector: Initialization failed:', error);
        }
    },

    restoreSavedCountry() {
        try {
            const selectedCountries = document.querySelectorAll('.selected-country');
            const savedCountry = localStorage.getItem('selectedCountry');
            if (savedCountry && selectedCountries.length > 0) {
                const { flag, name, currency } = JSON.parse(savedCountry);

                // Применяем сохраненную страну ко всем селекторам на странице
                selectedCountries.forEach(selectedCountry => {
                    const flagImg = selectedCountry.querySelector('img');
                    const countryNameEl = selectedCountry.querySelector('.country-name');
                    const countryCurrencyEl = selectedCountry.querySelector('.country-currency');

                    if (flagImg) flagImg.src = flag;
                    if (countryNameEl) countryNameEl.textContent = name;
                    if (countryCurrencyEl) countryCurrencyEl.textContent = currency;
                });
            }
        } catch (error) {
            Logger.error('Error restoring saved country:', error);
            localStorage.removeItem('selectedCountry');
        }
    },

    setupEventListeners(countrySelector, selectedCountry) {
        if (!countrySelector || !selectedCountry) return;

        // Определяем, находится ли селектор в футере
        const isFooterSelector = countrySelector.closest('.footer-country') !== null;

        // Toggle dropdown
        selectedCountry.addEventListener('click', (e) => {
            e.stopPropagation();
            // Закрываем все другие открытые селекторы перед открытием текущего
            document.querySelectorAll('.country-selector.active').forEach(selector => {
                if (selector !== countrySelector) {
                    selector.classList.remove('active');
                }
            });
            countrySelector.classList.toggle('active');
        });

        // Handle country selection
        const countryItems = document.querySelectorAll('.country-dropdown li');
        countryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateSelectedCountry(item);
                countrySelector.classList.remove('active');
            });
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            countrySelector.classList.remove('active');
        });
    },

    updateSelectedCountry(countryElement) {
        const selectedCountries = document.querySelectorAll('.selected-country');
        const countryFlag = countryElement.querySelector('img').src;
        const countryName = countryElement.querySelector('.country-name').textContent;
        const countryCurrency = countryElement.querySelector('.country-currency').textContent;

        // Обновляем отображение во всех селекторах стран
        selectedCountries.forEach(selectedCountry => {
            const flagImg = selectedCountry.querySelector('img');
            const countryNameEl = selectedCountry.querySelector('.country-name');
            const countryCurrencyEl = selectedCountry.querySelector('.country-currency');

            if (flagImg) flagImg.src = countryFlag;
            if (countryNameEl) countryNameEl.textContent = countryName;
            if (countryCurrencyEl) countryCurrencyEl.textContent = countryCurrency;
        });

        // Save selection
        localStorage.setItem('selectedCountry', JSON.stringify({
            flag: countryFlag,
            name: countryName,
            currency: countryCurrency
        }));

        // Update prices
        this.updatePrices(countryCurrency);
    },

    updatePrices(currency) {
        // Price conversion logic will go here
        console.log(`Prices updated for currency: ${currency}`);
    }
};

// 02. Photo Slider Component
const PhotoSlider = {
    slides: null,
    btnPrev: null,
    btnNext: null,
    currentSlide: 0,
    sliderContainer: null,

    init() {
        try {
            Logger.info('Initializing PhotoSlider');
            console.log('PhotoSlider: Starting initialization');
            
            // Находим слайдер на странице продукта, а не в hero slider
            this.sliderContainer = document.querySelector('.product-page .slider');
            console.log('PhotoSlider: Found slider container:', !!this.sliderContainer);
            
            if (!this.sliderContainer) {
                console.log('PhotoSlider: No slider container found, skipping initialization');
                return;
            }

            this.slides = this.sliderContainer.querySelectorAll('.slide');
            this.btnPrev = this.sliderContainer.querySelector('.prev');
            this.btnNext = this.sliderContainer.querySelector('.next');

            console.log('PhotoSlider: Found elements:', {
                slides: this.slides.length,
                prevBtn: !!this.btnPrev,
                nextBtn: !!this.btnNext
            });

            if (this.slides.length === 0) {
                console.log('PhotoSlider: No slides found, skipping initialization');
                return;
            }

            this.initSlides();
            this.setupEventListeners();
            
            console.log('PhotoSlider: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize PhotoSlider', error);
            console.error('PhotoSlider: Initialization failed:', error);
        }
    },

    initSlides() {
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * index}%)`;
        });
    },

    goToSlide(current) {
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - current)}%)`;
        });
    },

    nextSlide() {
        this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(this.currentSlide);
    },

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(this.currentSlide);
    },

    setupEventListeners() {
        if (this.btnNext && this.btnPrev) {
            this.btnNext.addEventListener('click', () => this.nextSlide());
            this.btnPrev.addEventListener('click', () => this.prevSlide());
        }
    }
};

// 03. Quantity Control Component
const QuantityControl = {
    init() {
        try {
            Logger.info('Initializing QuantityControl');
            console.log('QuantityControl: Starting initialization');
            
            const quantityContainer = document.querySelector(".quantity");
            console.log('QuantityControl: Found container:', !!quantityContainer);
            
            if (!quantityContainer) {
                console.log('QuantityControl: No container found, skipping initialization');
                return;
            }

            this.minusBtn = quantityContainer.querySelector(".minus");
            this.plusBtn = quantityContainer.querySelector(".plus");
            this.inputBox = quantityContainer.querySelector(".input-box");

            console.log('QuantityControl: Found elements:', {
                minusBtn: !!this.minusBtn,
                plusBtn: !!this.plusBtn,
                inputBox: !!this.inputBox
            });

            this.updateButtonStates();
            this.setupEventListeners();
            
            console.log('QuantityControl: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize QuantityControl', error);
            console.error('QuantityControl: Initialization failed:', error);
        }
    },

    updateButtonStates() {
        const value = parseInt(this.inputBox.value);
        this.minusBtn.disabled = value <= 1;
        this.plusBtn.disabled = value >= parseInt(this.inputBox.max);
    },

    handleQuantityChange() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : value;
        this.updateButtonStates();
        // Execute your code here based on the updated quantity value
        console.log("Quantity changed:", value);
    },

    decreaseValue() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : Math.max(value - 1, 1);
        this.inputBox.value = value;
        this.updateButtonStates();
        this.handleQuantityChange();
    },

    increaseValue() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : Math.min(value + 1, parseInt(this.inputBox.max));
        this.inputBox.value = value;
        this.updateButtonStates();
        this.handleQuantityChange();
    },

    setupEventListeners() {
        this.minusBtn.addEventListener('click', () => this.decreaseValue());
        this.plusBtn.addEventListener('click', () => this.increaseValue());
        this.inputBox.addEventListener('input', () => this.handleQuantityChange());
    }
};

// 02. Mobile Menu Component
const MobileMenu = {
    elements: {
        menuBtn: null,
        nav: null,
        countrySelector: null,
        body: document.body,
        overlay: null
    },

    init() {
        try {
            Logger.info('Initializing MobileMenu');
            console.log('MobileMenu: Starting initialization');
            
            // Находим все необходимые элементы
            this.elements.menuBtn = document.querySelector('.menu-btn');
            this.elements.nav = document.querySelector('nav');
            this.elements.countrySelector = document.querySelector('.header-country');

            console.log('MobileMenu: Found elements:', {
                menuBtn: !!this.elements.menuBtn,
                nav: !!this.elements.nav,
                countrySelector: !!this.elements.countrySelector
            });

            // Проверяем наличие всех необходимых элементов
            if (!this.elements.menuBtn || !this.elements.nav || !this.elements.countrySelector) {
                console.warn('MobileMenu: Не найдены необходимые элементы', {
                    menuBtn: !!this.elements.menuBtn,
                    nav: !!this.elements.nav,
                    countrySelector: !!this.elements.countrySelector
                });
                return;
            }

            // Создаем оверлей для затемнения фона
            this.createOverlay();
            
            // Инициализируем обработчики событий
            this.initEventListeners();
            
            Logger.info('MobileMenu initialized successfully');
            console.log('MobileMenu: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize MobileMenu', error);
            console.error('MobileMenu: Initialization failed:', error);
        }
    },

    createOverlay() {
        // Создаем элемент оверлея, если его еще нет
        if (!document.querySelector('.mobile-menu-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(overlay);
            this.elements.overlay = overlay;
        }
    },

    initEventListeners() {
        Logger.info('MobileMenu: Настройка обработчиков событий');
        // Обработчик клика по кнопке меню
        this.elements.menuBtn.addEventListener('click', (e) => {
            Logger.info('MobileMenu: Клик по кнопке меню');
            e.stopPropagation();
            this.toggleMenu();
        });

        // Обработчик клика по оверлею
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Обработчик клика по ссылкам в меню
        const menuLinks = this.elements.nav.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Обработчик клика по документу для закрытия меню при клике вне
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen() && 
                !this.elements.nav.contains(e.target) && 
                !this.elements.menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1023 && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        Logger.info('MobileMenu: toggleMenu вызван');
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        Logger.info('MobileMenu: Открытие меню');
        // Добавляем классы для открытия меню
        this.elements.menuBtn.classList.add('active');
        this.elements.nav.classList.add('active');
        this.elements.countrySelector.classList.add('active');
        this.elements.body.classList.add('menu-open');
        
        // Показываем оверлей
        if (this.elements.overlay) {
            this.elements.overlay.classList.add('active');
        }

        // Блокируем скролл
        this.elements.body.style.overflow = 'hidden';
        
        Logger.info('MobileMenu: Меню открыто');
    },

    closeMenu() {
        // Удаляем классы для закрытия меню
        this.elements.menuBtn.classList.remove('active');
        this.elements.nav.classList.remove('active');
        this.elements.countrySelector.classList.remove('active');
        this.elements.body.classList.remove('menu-open');
        
        // Скрываем оверлей
        if (this.elements.overlay) {
            this.elements.overlay.classList.remove('active');
        }

        // Разблокируем скролл
        this.elements.body.style.overflow = '';
        
        Logger.info('MobileMenu: Меню закрыто');
    },

    isMenuOpen() {
        return this.elements.nav.classList.contains('active');
    }
};

// 04. Navigation Component
const Navigation = {
    init() {
        try {
            Logger.info('Initializing Navigation');
            console.log('Navigation: Starting initialization');
            
            this.setActiveMenuItem();
            
            console.log('Navigation: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize Navigation', error);
            console.error('Navigation: Initialization failed:', error);
        }
    },

    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('nav ul li a');

        menuLinks.forEach(link => {
            // Get path from link href
            const linkPath = new URL(link.href).pathname;
            
            // Remove any trailing slashes for comparison
            const normalizedCurrentPath = currentPath.replace(/\/$/, '');
            const normalizedLinkPath = linkPath.replace(/\/$/, '');
            
            // Compare paths and set active class
            if (normalizedCurrentPath === normalizedLinkPath || 
                (normalizedCurrentPath === '/' && normalizedLinkPath === '/index.html') ||
                (normalizedCurrentPath === '/index.html' && normalizedLinkPath === '/')) {
                link.classList.add('active');
            }
        });
    }
};

// 05. Checkout Process Component
const CheckoutProcess = {
    init() {
        try {
            Logger.info('Initializing CheckoutProcess');
            console.log('CheckoutProcess: Starting initialization');
            
            // Получаем все необходимые элементы
            this.progressSteps = document.querySelectorAll('.progress-step');
            this.checkoutSections = document.querySelectorAll('.checkout-section');
            this.continueButtons = document.querySelectorAll('.continue-button');
            this.backButtons = document.querySelectorAll('.back-button');

            console.log('CheckoutProcess: Found elements:', {
                progressSteps: this.progressSteps.length,
                checkoutSections: this.checkoutSections.length,
                continueButtons: this.continueButtons.length,
                backButtons: this.backButtons.length
            });

            // Инициализация, если элементы найдены
            if (this.progressSteps.length > 0 && this.checkoutSections.length > 0) {
                console.log('CheckoutProcess: Elements found, setting up event listeners');
                this.setupEventListeners();
            } else {
                console.log('CheckoutProcess: Elements not found, skipping initialization');
            }
            
            console.log('CheckoutProcess: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize CheckoutProcess', error);
            console.error('CheckoutProcess: Initialization failed:', error);
        }
    },

    setupEventListeners() {
        // Обработчики для кнопок "Продолжить"
        this.continueButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentSection = button.closest('.checkout-section');
                const currentIndex = Array.from(this.checkoutSections).indexOf(currentSection);
                const nextIndex = currentIndex + 1;

                if (nextIndex < this.checkoutSections.length) {
                    this.goToStep(nextIndex);
                }
            });
        });

        // Обработчики для кнопок "Назад"
        this.backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentSection = button.closest('.checkout-section');
                const currentIndex = Array.from(this.checkoutSections).indexOf(currentSection);
                const prevIndex = currentIndex - 1;

                if (prevIndex >= 0) {
                    this.goToStep(prevIndex);
                }
            });
        });

        // Обработчик для выбора способа доставки
        const shippingOptions = document.querySelectorAll('.shipping-option input[type="radio"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateOrderSummary(option.id);
            });
        });

        // Обработчик для выбора способов оплаты
        const paymentMethods = document.querySelectorAll('.payment-method input[type="radio"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                // Скрываем все формы оплаты
                document.querySelectorAll('.payment-form').forEach(form => {
                    form.classList.remove('active');
                });

                // Отображаем форму для выбранного метода
                const methodId = method.id;
                if (methodId === 'credit-card') {
                    document.querySelector('.credit-card-form').classList.add('active');
                } else if (methodId === 'paypal') {
                    document.querySelector('.paypal-form').classList.add('active');
                } else if (methodId === 'apple-pay') {
                    document.querySelector('.apple-pay-form').classList.add('active');
                }
            });
        });
    },

    goToStep(stepIndex) {
        // Обновляем активный шаг в прогресс-баре
        this.progressSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Показываем нужную секцию и скрываем остальные
        this.checkoutSections.forEach((section, index) => {
            if (index === stepIndex) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        // Прокручиваем к верху страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};


// Tabs functionality
const TabsComponent = {
    init() {
        try {
            Logger.info('Initializing TabsComponent');
            console.log('TabsComponent: Starting initialization');
            
            const tabs = document.querySelectorAll('.tabs_item_link');
            const tabContents = document.querySelectorAll('.tabcontents > div');
            
            console.log('TabsComponent: Found elements:', {
                tabs: tabs.length,
                tabContents: tabContents.length
            });
            
            // Восстанавливаем сохраненный таб или показываем первый
            this.restoreSelectedTab(tabs, tabContents);
            
            // Устанавливаем обработчики событий
            this.setupEventListeners(tabs, tabContents);
            
            console.log('TabsComponent: Initialization completed');
        } catch (error) {
            Logger.error('Failed to initialize TabsComponent', error);
            console.error('TabsComponent: Initialization failed:', error);
        }
    },

    restoreSelectedTab(tabs, tabContents) {
        const savedTab = localStorage.getItem('selectedTab');
        if (savedTab && document.querySelector(savedTab)) {
            this.activateTab(
                document.querySelector(`[href="${savedTab}"]`),
                tabs,
                tabContents
            );
        } else {
            // Активируем первый таб по умолчанию
            tabs[0].parentElement.classList.add('selected');
            tabContents[0].classList.add('active');
        }
    },

    activateTab(selectedTab, tabs, tabContents) {
        // Удаляем классы активности
        tabs.forEach(tab => tab.parentElement.classList.remove('selected'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Активируем выбранный таб
        selectedTab.parentElement.classList.add('selected');
        const tabId = selectedTab.getAttribute('href');
        document.querySelector(tabId).classList.add('active');
        
        // Сохраняем выбор
        localStorage.setItem('selectedTab', tabId);
    },

    setupEventListeners(tabs, tabContents) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.activateTab(tab, tabs, tabContents);
            });
        });
    }
};

// Performance optimization utilities
const PerformanceOptimizer = {
    init() {
        this.initLazyLoading();
        this.initScriptLoader();
    },

    initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Используем нативную ленивую загрузку
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
            });
        } else {
            // Fallback для старых браузеров
            this.initIntersectionObserver();
        }
    },

    initIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },

    initScriptLoader() {
        // Откладываем загрузку неважных скриптов
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadDeferredScripts();
            }, 2000);
        });
    },

    loadDeferredScripts() {
        const deferredScripts = [
            // Список скриптов для отложенной загрузки
            { src: './js/analytics.js', async: true },
            { src: './js/social-widgets.js', async: true }
        ];

        deferredScripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = script.src;
            if (script.async) scriptElement.async = true;
            document.body.appendChild(scriptElement);
        });
    }
};

// Cart initialization function
function initializeCart() {
    try {
        Logger.info('Initializing cart functionality');
        
        // Инициализация корзины
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        updateCartCount(cartItems.length);
        
        // Обработчики для кнопок "Add to Cart"
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                addToCart(btn);
            });
        });
        
    } catch (error) {
        Logger.error('Failed to initialize cart', error);
    }
}

// Update cart count in header
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });
}

// Add item to cart
function addToCart(button) {
    try {
        const productCard = button.closest('.product-item');
        if (!productCard) return;
        
        const productId = productCard.dataset.productId || Date.now().toString();
        const productName = productCard.querySelector('.product-title a')?.textContent || 'Product';
        const productPrice = productCard.querySelector('.product-current-price')?.textContent || '0';
        const productImage = productCard.querySelector('.product-image img')?.src || '';
        
        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(cart.length);
        
        // Показываем уведомление
        showNotification('Product added to cart!');
        
    } catch (error) {
        Logger.error('Failed to add item to cart', error);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Preload slider images
function preloadSliderImages() {
    try {
        Logger.info('Preloading slider images');
        
        const sliderImages = document.querySelectorAll('.slider img, .product-slider img');
        const imagePromises = Array.from(sliderImages).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = reject;
                }
            });
        });
        
        Promise.all(imagePromises)
            .then(() => Logger.info('All slider images preloaded'))
            .catch(error => Logger.error('Failed to preload some images', error));
            
    } catch (error) {
        Logger.error('Failed to preload slider images', error);
    }
}

// Инициализируем оптимизатор после загрузки основного контента
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting application initialization');
    Logger.info('DOM Content Loaded - Starting application initialization');
    
    PerformanceOptimizer.init();
    
    try {
        Logger.info('Application initialization started');
        
        // Initialize components
        const components = [MobileMenu, CountrySelector, PhotoSlider, QuantityControl, Navigation, TabsComponent];
        Logger.info('Components to initialize:', components.map(c => c.constructor.name || 'Anonymous'));
        
        components.forEach((component, index) => {
            if (typeof component !== 'undefined' && component.init) {
                try {
                    Logger.info(`Initializing component ${index + 1}/${components.length}`);
                    component.init();
                    Logger.info(`Component ${index + 1} initialized successfully`);
                } catch (error) {
                    Logger.error(`Failed to initialize component ${index + 1}`, { 
                        component: component.constructor.name || 'Anonymous',
                        error 
                    });
                }
            } else {
                Logger.warn(`Component ${index + 1} is undefined or missing init method`);
            }
        });

        if (typeof initializeCart === 'function') {
            try {
                Logger.info('Initializing cart functionality');
                initializeCart();
                Logger.info('Cart functionality initialized successfully');
            } catch (error) {
                Logger.error('Failed to initialize cart', error);
            }
        }

        // Initialize slider
        try {
            Logger.info('Preloading slider images');
            preloadSliderImages();
            Logger.info('Slider images preloaded successfully');
        } catch (error) {
            Logger.error('Failed to preload slider images', error);
        }

        if (typeof CheckoutProcess !== 'undefined') {
            try {
                Logger.info('Initializing CheckoutProcess');
                CheckoutProcess.init();
                Logger.info('CheckoutProcess initialized successfully');
            } catch (error) {
                Logger.error('Failed to initialize CheckoutProcess', error);
            }
        }

        Logger.info('Application initialization completed');
        console.log('Application initialization completed successfully');
    } catch (error) {
        Logger.error('Critical error during application initialization', error);
        console.error('Critical error during application initialization:', error);
    }
});