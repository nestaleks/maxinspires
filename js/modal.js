// Modal Manager для централизованного управления модальными окнами
const ModalManager = {
    activeModals: [],
    
    init() {
        console.log('ModalManager: Starting initialization');
        this.setupGlobalHandlers();
        console.log('ModalManager: Initialization completed');
    },

    setupGlobalHandlers() {
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                console.log('ModalManager: Closing modal via Escape key');
                const topModal = this.activeModals[this.activeModals.length - 1];
                topModal.close();
            }
        });

        // Закрытие по клику вне модального окна
        document.addEventListener('click', (e) => {
            if (this.activeModals.length > 0) {
                const topModal = this.activeModals[this.activeModals.length - 1];
                if (!e.target.closest('.modal-content') && !e.target.closest('.modal-trigger')) {
                    console.log('ModalManager: Closing modal via outside click');
                    topModal.close();
                }
            }
        });
    },

    register(modal) {
        if (!this.activeModals.includes(modal)) {
            this.activeModals.push(modal);
            console.log('ModalManager: Modal registered, total active:', this.activeModals.length);
        }
    },

    unregister(modal) {
        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
            console.log('ModalManager: Modal unregistered, total active:', this.activeModals.length);
        }
    }
};

// Base Modal Class
class BaseModal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            closeOnEscape: true,
            closeOnOutsideClick: true,
            animationDuration: 300,
            onOpen: null,
            onClose: null,
            ...options
        };
        
        this.isOpen = false;
    }

    open() {
        if (this.isOpen || !this.element) return;
        
        this.element.classList.add('modal-opening');
        this.element.classList.add('active');
        
        // Управление доступностью
        this.element.setAttribute('aria-hidden', 'false');
        this.trapFocus();
        
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.element.classList.remove('modal-opening');
            this.isOpen = true;
            if (this.options.onOpen) this.options.onOpen();
        }, this.options.animationDuration);

        ModalManager.register(this);
    }

    close() {
        if (!this.isOpen || !this.element) return;
        
        this.element.classList.add('modal-closing');
        
        setTimeout(() => {
            this.element.classList.remove('active', 'modal-closing');
            this.element.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            this.isOpen = false;
            if (this.options.onClose) this.options.onClose();
        }, this.options.animationDuration);

        ModalManager.unregister(this);
    }

    trapFocus() {
        if (!this.element) return;
        
        const focusableElements = this.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });

        firstFocusable.focus();
    }
}

// Search Modal Component
const SearchModal = {
    modal: null,
    searchDelay: 300,
    searchTimer: null,

    init() {
        try {
            console.log('SearchModal: Starting initialization');
            
            this.searchTrigger = document.querySelector('.search-trigger');
            this.searchModal = document.querySelector('.search-modal');
            this.searchClose = document.querySelector('.search-close');
            this.searchInput = document.querySelector('.search-form input');
            this.searchForm = document.querySelector('.search-form');

            console.log('SearchModal: Found elements:', {
                searchTrigger: !!this.searchTrigger,
                searchModal: !!this.searchModal,
                searchClose: !!this.searchClose,
                searchInput: !!this.searchInput,
                searchForm: !!this.searchForm
            });

            if (!this.searchModal) {
                console.warn('SearchModal: Элементы поиска не найдены');
                return;
            }

            // Создаем экземпляр модального окна
            this.modal = new BaseModal(this.searchModal, {
                onOpen: () => {
                    console.log('SearchModal: Opening modal');
                    this.searchInput?.focus();
                    this.searchModal.classList.add('active');
                },
                onClose: () => {
                    console.log('SearchModal: Closing modal');
                    this.searchModal.classList.remove('active');
                    this.searchInput.value = '';
                    clearTimeout(this.searchTimer);
                }
            });

            this.setupEventListeners();
            console.log('SearchModal: Initialization completed');
        } catch (error) {
            console.error('SearchModal: Ошибка инициализации', error);
        }
    },

    setupEventListeners() {
        if (this.searchTrigger && this.modal) {
            this.searchTrigger.addEventListener('click', () => this.modal.open());
        }
        if (this.searchClose && this.modal) {
            this.searchClose.addEventListener('click', () => this.modal.close());
        }

        // Добавляем debounce для поиска
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(() => {
                    this.handleSearch();
                }, this.searchDelay);
            });
        }

        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
    },

    async handleSearch() {
        if (!this.searchInput || !this.searchModal || !this.modal) return;
        
        const query = this.searchInput.value.trim();
        if (!query) return;

        try {
            // Здесь будет логика поиска
            console.log('Поисковый запрос:', query);
            
            // Анимация загрузки
            this.searchModal.classList.add('searching');
            
            // Имитация задержки поиска
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.searchModal.classList.remove('searching');
            this.modal.close();
        } catch (error) {
            console.error('Ошибка поиска:', error);
            if (this.searchModal) {
                this.searchModal.classList.remove('searching');
            }
            // Показываем уведомление об ошибке
            this.showError('Произошла ошибка при поиске');
        }
    },

    showError(message) {
        if (!this.searchModal) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'search-error';
        errorElement.textContent = message;
        
        this.searchModal.appendChild(errorElement);
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 3000);
    }
};

// Initialize Modal Manager
document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
    SearchModal.init();
});