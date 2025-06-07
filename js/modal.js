// 01. Search Modal Component
const SearchModal = {
    init() {
        this.searchTrigger = document.querySelector('.search-trigger');
        this.searchModal = document.querySelector('.search-modal');
        this.searchClose = document.querySelector('.search-close');
        this.searchInput = document.querySelector('.search-form input');
        this.searchForm = document.querySelector('.search-form');

        if (!this.searchModal) return;
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Open search modal
        this.searchTrigger?.addEventListener('click', () => {
            this.openSearchModal();
        });

        // Close search modal
        this.searchClose?.addEventListener('click', () => {
            this.closeSearchModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchModal.classList.contains('active')) {
                this.closeSearchModal();
            }
        });

        // Handle search form submission
        this.searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });
    },

    openSearchModal() {
        this.searchModal.classList.add('active');
        // Focus on input field
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    },

    closeSearchModal() {
        this.searchModal.classList.remove('active');
        this.searchInput.value = ''; // Clear input field
    },

    handleSearch() {
        const searchQuery = this.searchInput.value.trim();
        if (searchQuery) {
            // Add search logic here
            console.log('Search query:', searchQuery);
            // Close modal after processing
            this.closeSearchModal();
        }
    }
};



// 03. Tabs Component for Product Page
const ProductTabs = {
    init() {
        const tabs = document.querySelectorAll('.tabs_item');
        const contents = document.querySelectorAll('.tabcontents > div');

        if (!tabs.length || !contents.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();

                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('selected'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active class to current tab and content
                this.classList.add('selected');

                // Get the target content id from href attribute
                const target = this.querySelector('a').getAttribute('href').substring(1);
                document.getElementById(target).classList.add('active');
            });
        });

        // Activate first tab by default
        if (tabs[0] && !tabs[0].classList.contains('selected')) {
            tabs[0].classList.add('selected');

            const firstTarget = tabs[0].querySelector('a').getAttribute('href').substring(1);
            document.getElementById(firstTarget)?.classList.add('active');
        }
    }
};

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SearchModal.init();
    ProductTabs.init();
});