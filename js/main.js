// 01. Country Selector Component
const CountrySelector = {
    init() {
        // Получаем все селекторы стран на странице (в шапке и футере)
        const countrySelectors = document.querySelectorAll('.country-selector');

        // Restore saved country selection
        this.restoreSavedCountry();

        // Setup event listeners для всех селекторов стран
        countrySelectors.forEach(selector => {
            const selectedCountry = selector.querySelector('.selected-country');
            if (selectedCountry) {
                this.setupEventListeners(selector, selectedCountry);
            }
        });
    },

    restoreSavedCountry() {
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
        // Находим слайдер на странице продукта, а не в hero slider
        this.sliderContainer = document.querySelector('.product-page .slider');
        if (!this.sliderContainer) return;

        this.slides = this.sliderContainer.querySelectorAll('.slide');
        this.btnPrev = this.sliderContainer.querySelector('.prev');
        this.btnNext = this.sliderContainer.querySelector('.next');

        if (this.slides.length === 0) return;

        this.initSlides();
        this.setupEventListeners();
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
        const quantityContainer = document.querySelector(".quantity");
        if (!quantityContainer) return;

        this.minusBtn = quantityContainer.querySelector(".minus");
        this.plusBtn = quantityContainer.querySelector(".plus");
        this.inputBox = quantityContainer.querySelector(".input-box");

        this.updateButtonStates();
        this.setupEventListeners();
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
        console.log('MobileMenu: Начало инициализации');
        // Находим все необходимые элементы
        this.elements.menuBtn = document.querySelector('.menu-btn');
        this.elements.nav = document.querySelector('nav');
        this.elements.countrySelector = document.querySelector('.header-country');

        console.log('MobileMenu: Найденные элементы:', {
            menuBtn: this.elements.menuBtn,
            nav: this.elements.nav,
            countrySelector: this.elements.countrySelector
        });

        // Проверяем наличие всех необходимых элементов
        if (!this.elements.menuBtn || !this.elements.nav || !this.elements.countrySelector) {
            console.error('MobileMenu: Не найдены необходимые элементы', {
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
        
        console.log('MobileMenu: Инициализация завершена успешно');
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
        console.log('MobileMenu: Настройка обработчиков событий');
        // Обработчик клика по кнопке меню
        this.elements.menuBtn.addEventListener('click', (e) => {
            console.log('MobileMenu: Клик по кнопке меню');
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
        console.log('MobileMenu: toggleMenu вызван');
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        console.log('MobileMenu: Открытие меню');
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
        
        console.log('MobileMenu: Меню открыто, классы добавлены:', {
            menuBtnActive: this.elements.menuBtn.classList.contains('active'),
            navActive: this.elements.nav.classList.contains('active'),
            countrySelectorActive: this.elements.countrySelector.classList.contains('active'),
            bodyMenuOpen: this.elements.body.classList.contains('menu-open')
        });
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
        
        console.log('MobileMenu: Меню закрыто');
    },

    isMenuOpen() {
        return this.elements.nav.classList.contains('active');
    }
};

// 04. Navigation Component
const Navigation = {
    init() {
        this.setActiveMenuItem();
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
        console.log('Инициализация компонента CheckoutProcess');
        // Получаем все необходимые элементы
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.checkoutSections = document.querySelectorAll('.checkout-section');
        this.continueButtons = document.querySelectorAll('.continue-button');
        this.backButtons = document.querySelectorAll('.back-button');

        // Инициализация, если элементы найдены
        if (this.progressSteps.length > 0 && this.checkoutSections.length > 0) {
            console.log('Элементы найдены, настраиваем обработчики событий');
            this.setupEventListeners();
        } else {
            console.warn('Элементы не найдены для CheckoutProcess');
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
        const tabs = document.querySelectorAll('.tabs_item_link');
        const tabContents = document.querySelectorAll('.tabcontents > div');
        
        // Восстанавливаем сохраненный таб или показываем первый
        this.restoreSelectedTab(tabs, tabContents);
        
        // Устанавливаем обработчики событий
        this.setupEventListeners(tabs, tabContents);
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

// Функционал корзины
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Начало инициализации компонентов');
    
    // Инициализируем мобильное меню первым
    if (typeof MobileMenu !== 'undefined') {
        console.log('DOMContentLoaded: Инициализация MobileMenu');
        MobileMenu.init();
    }

    // Инициализируем другие компоненты
    if (typeof CountrySelector !== 'undefined') CountrySelector.init();
    if (typeof PhotoSlider !== 'undefined') PhotoSlider.init();
    if (typeof QuantityControl !== 'undefined') QuantityControl.init();
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof ProductSlider !== 'undefined') ProductSlider.init();
    if (typeof TabsComponent !== 'undefined') TabsComponent.init();
    if (typeof initializeCart === 'function') initializeCart();
    if (typeof SearchModal !== 'undefined') SearchModal.init();

    // Загрузка изображений слайдера и предварительная проверка
    const preloadSliderImages = () => {
        const slider = document.querySelector('.hero-slider .custom-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        if (!slides.length) return;

        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'slider-loading';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Загрузка слайдера...</div>
        `;
        slider.appendChild(loadingIndicator);

        let loadedCount = 0;
        const totalImages = slides.length;

        // Функция для обновления прогресса загрузки
        const updateProgress = () => {
            const percent = Math.round((loadedCount / totalImages) * 100);
            loadingIndicator.querySelector('.loading-text').textContent = `Загрузка: ${percent}%`;
        };

        // Функция для завершения загрузки
        const finishLoading = () => {
            // Небольшая задержка для плавности
            setTimeout(() => {
                loadingIndicator.classList.add('fade-out');
                setTimeout(() => {
                    loadingIndicator.remove();
                    initializeSlider();
                }, 500);
            }, 300);
        };

        // Проверяем загрузку всех изображений
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (!img) {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) finishLoading();
                return;
            }

            if (img.complete) {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) finishLoading();
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    updateProgress();
                    if (loadedCount === totalImages) finishLoading();
                });

                img.addEventListener('error', () => {
                    console.error(`Ошибка загрузки изображения: ${img.src}`);
                    loadedCount++;
                    updateProgress();
                    if (loadedCount === totalImages) finishLoading();
                });
            }
        });

        // Устанавливаем таймаут на случай, если что-то пойдет не так
        setTimeout(() => {
            if (loadedCount < totalImages) {
                console.warn('Превышено время ожидания загрузки изображений');
                finishLoading();
            }
        }, 10000); // 10 секунд максимум
    };

    // Инициализация слайдера
    const initializeSlider = () => {
        // Инициализируем слайдер только после загрузки всех изображений

        // Добавляем прямые обработчики на кнопки слайдера для надежности
        const prevBtn = document.querySelector('.hero-slider .prev-btn');
        const nextBtn = document.querySelector('.hero-slider .next-btn');
        const indicators = document.querySelectorAll('.hero-slider .indicator');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                HeroSlider.goToSlide(HeroSlider.currentIndex - 1, 'prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                HeroSlider.goToSlide(HeroSlider.currentIndex + 1, 'next');
            });
        }

        if (indicators && indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    HeroSlider.goToSlide(index);
                });
            });
        }
    };

    // Запускаем предзагрузку изображений слайдера
    preloadSliderImages();
    if (typeof CheckoutProcess !== 'undefined') CheckoutProcess.init();
    
    console.log('DOMContentLoaded: Инициализация компонентов завершена');
});