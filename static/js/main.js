/**
 * BIGQUERY RELEASE INSIGHTS DASHBOARD - MAIN JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        updates: [],
        filteredUpdates: [],
        filters: {
            search: '',
            category: 'all'
        },
        selectedUpdate: null,
        activeStyle: 'pro', // Default tweet composer style
        lastRefreshed: null,
        theme: 'dark'
    };

    // DOM Elements
    const el = {
        notesContainer: document.getElementById('notes-container'),
        emptyState: document.getElementById('empty-state'),
        refreshBtn: document.getElementById('refresh-btn'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        themeToggleText: document.getElementById('theme-toggle-text'),
        themeIconLight: document.querySelector('.theme-icon-light'),
        themeIconDark: document.querySelector('.theme-icon-dark'),
        spinnerIcon: document.querySelector('.spinner-icon'),
        searchInput: document.getElementById('search-input'),
        categoryFilters: document.getElementById('category-filters'),
        activeFiltersContainer: document.getElementById('active-filters-container'),
        activeFiltersChips: document.getElementById('active-filters-chips'),
        clearFiltersBtn: document.getElementById('clear-filters-btn'),
        resetSearchBtn: document.getElementById('reset-search-btn'),
        lastRefreshedTime: document.getElementById('last-refreshed-time'),
        statusText: document.getElementById('status-text'),
        pulseDot: document.querySelector('.pulse-dot'),
        
        // Stats
        statTotal: document.getElementById('stat-total'),
        statFeatures: document.getElementById('stat-features'),
        statAnnouncements: document.getElementById('stat-announcements'),
        statFixes: document.getElementById('stat-fixes'),
        statCards: document.querySelectorAll('.stat-card'),

        // Tweet Modal
        tweetModal: document.getElementById('tweet-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        cancelTweetBtn: document.getElementById('cancel-tweet-btn'),
        postTweetBtn: document.getElementById('post-tweet-btn'),
        tweetTextarea: document.getElementById('tweet-textarea'),
        tweetContextDate: document.getElementById('tweet-context-date'),
        tweetContextBadge: document.getElementById('tweet-context-badge'),
        tweetContextDesc: document.getElementById('tweet-context-desc'),
        templateButtons: document.querySelectorAll('.btn-template'),
        charCount: document.getElementById('char-count'),
        charProgress: document.getElementById('char-progress'),

        // Toast
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toast-message')
    };

    // Constant for Twitter Link Character Count rules (Twitter wraps all URLs to 23 chars)
    const TWITTER_URL_LEN = 23;
    const MAX_TWEET_CHARS = 280;

    /* ==========================================================================
       INITIALIZATION & FETCHING
       ========================================================================== */

    // Fetch releases from server
    async function fetchNotes() {
        showLoading(true);
        el.statusText.textContent = "Syncing...";
        el.pulseDot.style.backgroundColor = "#F59E0B"; // Warning/Yellow color
        
        try {
            const response = await fetch('/fetch-notes');
            const data = await response.json();
            
            if (data.success) {
                state.updates = data.updates;
                state.filteredUpdates = [...data.updates];
                state.lastRefreshed = new Date();
                
                updateStats();
                applyFilters();
                
                // Update header status
                el.statusText.textContent = "Connected";
                el.statusText.style.color = "#10B981";
                el.pulseDot.style.backgroundColor = "#10B981";
                el.lastRefreshedTime.textContent = state.lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            } else {
                throw new Error(data.error || "Unknown error occurred.");
            }
        } catch (error) {
            console.error("Failed to fetch release notes:", error);
            el.statusText.textContent = "Sync Failed";
            el.statusText.style.color = "#EF4444";
            el.pulseDot.style.backgroundColor = "#EF4444";
            showToast("Failed to fetch BigQuery feed. Try again.", true);
            
            // Show error in list
            el.notesContainer.innerHTML = `
                <div class="empty-state" style="margin-left: 2.5rem;">
                    <h3>Sync Error</h3>
                    <p>Could not connect to the Google Cloud release feed. Reason: ${error.message}</p>
                    <button id="retry-fetch-btn" class="btn btn-primary">Retry Sync</button>
                </div>
            `;
            const retryBtn = document.getElementById('retry-fetch-btn');
            if (retryBtn) retryBtn.addEventListener('click', fetchNotes);
        } finally {
            showLoading(false);
        }
    }

    // Toggle Skeleton Loaders
    function showLoading(isLoading) {
        if (isLoading) {
            el.spinnerIcon.classList.add('spinning');
            el.refreshBtn.disabled = true;
            el.emptyState.style.display = 'none';
            
            // Injects skeletons
            el.notesContainer.innerHTML = `
                <div class="skeleton-group">
                    <div class="skeleton-date-marker"></div>
                    <div class="skeleton-card">
                        <div class="skeleton-header">
                            <div class="skeleton-badge"></div>
                            <div class="skeleton-text short"></div>
                        </div>
                        <div class="skeleton-body">
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text half"></div>
                        </div>
                        <div class="skeleton-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-header">
                            <div class="skeleton-badge"></div>
                            <div class="skeleton-text short"></div>
                        </div>
                        <div class="skeleton-body">
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text half"></div>
                        </div>
                        <div class="skeleton-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            el.spinnerIcon.classList.remove('spinning');
            el.refreshBtn.disabled = false;
        }
    }

    /* ==========================================================================
       STATS & FILTER LOGIC
       ========================================================================== */

    // Update Sidebar Analytics Panel
    function updateStats() {
        const total = state.updates.length;
        const features = state.updates.filter(u => u.type === 'Feature').length;
        const announcements = state.updates.filter(u => u.type === 'Announcement').length;
        const fixes = state.updates.filter(u => u.type === 'Fixed' || u.type === 'Issue').length;

        el.statTotal.textContent = total;
        el.statFeatures.textContent = features;
        el.statAnnouncements.textContent = announcements;
        el.statFixes.textContent = fixes;
    }

    // Apply active search + tag filters to the list
    function applyFilters() {
        const query = state.filters.search.toLowerCase().trim();
        const cat = state.filters.category;

        state.filteredUpdates = state.updates.filter(item => {
            // Match category
            let matchCategory = true;
            if (cat !== 'all') {
                if (cat === 'Fixed') {
                    // Group Fixed and Issue together for ease of filtering
                    matchCategory = (item.type === 'Fixed' || item.type === 'Issue');
                } else {
                    matchCategory = (item.type === cat);
                }
            }

            // Match search query (searches text, date, and type)
            let matchSearch = true;
            if (query) {
                const textContent = item.plain_text.toLowerCase();
                const typeContent = item.type.toLowerCase();
                const dateContent = item.date.toLowerCase();
                matchSearch = textContent.includes(query) || typeContent.includes(query) || dateContent.includes(query);
            }

            return matchCategory && matchSearch;
        });

        updateFilterUI();
        renderUpdates();
    }

    // Update filter widgets (chips and active buttons)
    function updateFilterUI() {
        // Update Sidebar buttons active state
        const buttons = el.categoryFilters.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            const btnCat = btn.getAttribute('data-category');
            if (btnCat === state.filters.category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Stat Cards active state
        el.statCards.forEach(card => {
            const cardCat = card.getAttribute('data-type') || 'all';
            if (cardCat === state.filters.category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Show/Hide active filter info box
        if (state.filters.search || state.filters.category !== 'all') {
            el.activeFiltersContainer.style.display = 'flex';
            el.activeFiltersChips.innerHTML = '';

            if (state.filters.category !== 'all') {
                createChip(`Category: ${state.filters.category}`, () => {
                    state.filters.category = 'all';
                    applyFilters();
                });
            }

            if (state.filters.search) {
                createChip(`Search: "${state.filters.search}"`, () => {
                    state.filters.search = '';
                    el.searchInput.value = '';
                    applyFilters();
                });
            }
        } else {
            el.activeFiltersContainer.style.display = 'none';
        }
    }

    // Helper to render filter chip element
    function createChip(text, onRemove) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            <span>${text}</span>
            <button class="filter-chip-remove">&times;</button>
        `;
        chip.querySelector('.filter-chip-remove').addEventListener('click', onRemove);
        el.activeFiltersChips.appendChild(chip);
    }

    /* ==========================================================================
       RENDERING LOGIC
       ========================================================================== */

    // Render timeline grouped by date
    function renderUpdates() {
        el.notesContainer.innerHTML = '';
        
        if (state.filteredUpdates.length === 0) {
            el.emptyState.style.display = 'flex';
            return;
        }
        
        el.emptyState.style.display = 'none';

        // Group updates by date
        const groups = {};
        state.filteredUpdates.forEach(update => {
            if (!groups[update.date]) {
                groups[update.date] = [];
            }
            groups[update.date].push(update);
        });

        // Render date groups
        Object.entries(groups).forEach(([date, items]) => {
            const groupEl = document.createElement('div');
            groupEl.className = 'timeline-group';

            // Date marker
            const markerEl = document.createElement('div');
            markerEl.className = 'date-marker';
            markerEl.innerHTML = `
                <div class="date-dot"></div>
                <div class="date-text">${date}</div>
            `;
            groupEl.appendChild(markerEl);

            // Cards for this date
            items.forEach(item => {
                const cardEl = document.createElement('div');
                cardEl.className = 'update-card';
                cardEl.dataset.id = item.id;

                // Category class and badges
                const badgeClass = getBadgeClass(item.type);
                
                cardEl.innerHTML = `
                    <div class="card-header">
                        <span class="badge ${badgeClass}">${item.type}</span>
                        <span class="card-meta">BigQuery Release</span>
                    </div>
                    <div class="card-body">
                        ${item.content}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-twitter btn-icon share-tweet-btn" title="Compose a Tweet about this update">
                            <svg class="icon-size" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Tweet Update</span>
                        </button>
                        <button class="btn btn-secondary btn-icon copy-link-btn" title="Copy to clipboard">
                            <svg class="icon-size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M8 5C8 6.10457 8.89543 7 10 7H14C15.1046 7 16 6.10457 16 5M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5M12 11H16M10 14H16M13 17H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Copy to Clipboard</span>
                        </button>
                    </div>
                `;

                // Bind actions
                cardEl.querySelector('.share-tweet-btn').addEventListener('click', () => openTweetModal(item));
                cardEl.querySelector('.copy-link-btn').addEventListener('click', () => copyDetails(item));

                groupEl.appendChild(cardEl);
            });

            el.notesContainer.appendChild(groupEl);
        });
    }

    // Helper badge class getter
    function getBadgeClass(type) {
        switch (type) {
            case 'Feature': return 'badge-feature';
            case 'Announcement': return 'badge-announcement';
            case 'Fixed':
            case 'Issue': return 'badge-fixed';
            case 'Deprecated': return 'badge-deprecated';
            case 'Changed': return 'badge-changed';
            default: return 'badge-general';
        }
    }

    /* ==========================================================================
       ACTION HANDLERS
       ========================================================================== */

    // Copies plain text or share URL to clipboard
    function copyDetails(item) {
        const text = `BigQuery Update [${item.date}] (${item.type}):\n${item.plain_text}\nRead more: ${item.feed_link}`;
        
        navigator.clipboard.writeText(text)
            .then(() => showToast("Copied update details to clipboard!"))
            .catch(err => {
                console.error("Clipboard copy failed:", err);
                showToast("Could not copy details automatically.", true);
            });
    }

    // Exports filtered updates to CSV file
    function exportToCSV() {
        const dataToExport = state.filteredUpdates;
        if (!dataToExport || dataToExport.length === 0) {
            showToast("No release notes to export.", true);
            return;
        }

        const headers = ["ID", "Date", "Raw Date", "Type", "Content (Plain Text)", "Link"];
        const rows = dataToExport.map(item => [
            item.id || '',
            item.date || '',
            item.raw_date || '',
            item.type || '',
            item.plain_text || '',
            item.feed_link || ''
        ]);

        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '';
            let stringVal = String(val);
            stringVal = stringVal.replace(/"/g, '""');
            if (stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r') || stringVal.includes('"')) {
                return `"${stringVal}"`;
            }
            return stringVal;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\r\n');

        try {
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const dateStr = new Date().toISOString().slice(0, 10);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `bigquery_release_notes_${dateStr}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast("Exported to CSV successfully!");
        } catch (error) {
            console.error("CSV Export failed:", error);
            showToast("Could not export CSV.", true);
        }
    }

    // Toggle Color Theme
    function toggleTheme() {
        const isCurrentDark = document.body.classList.contains('dark-theme') || !document.body.classList.contains('light-theme');
        
        if (isCurrentDark) {
            // Switch to Light mode
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            el.themeIconLight.style.display = 'inline-block';
            el.themeIconDark.style.display = 'none';
            el.themeToggleText.textContent = 'Dark Mode';
            state.theme = 'light';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to Dark mode
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            el.themeIconLight.style.display = 'none';
            el.themeIconDark.style.display = 'inline-block';
            el.themeToggleText.textContent = 'Light Mode';
            state.theme = 'dark';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Initialize Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            el.themeIconLight.style.display = 'inline-block';
            el.themeIconDark.style.display = 'none';
            el.themeToggleText.textContent = 'Dark Mode';
            state.theme = 'light';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            el.themeIconLight.style.display = 'none';
            el.themeIconDark.style.display = 'inline-block';
            el.themeToggleText.textContent = 'Light Mode';
            state.theme = 'dark';
        }
    }

    // Helper to display a bottom-right toast message
    function showToast(message, isError = false) {
        el.toastMessage.textContent = message;
        if (isError) {
            el.toast.style.backgroundColor = '#EF4444';
            el.toast.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
        } else {
            el.toast.style.backgroundColor = '#10B981';
            el.toast.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
        }
        
        el.toast.classList.add('show');
        setTimeout(() => {
            el.toast.classList.remove('show');
        }, 3000);
    }

    /* ==========================================================================
       TWEET COMPOSER MODAL LOGIC
       ========================================================================== */

    // Open composer overlay pre-populated
    function openTweetModal(item) {
        state.selectedUpdate = item;
        state.activeStyle = 'pro'; // Default active template style
        
        // Setup visual context indicators in modal
        el.tweetContextDate.textContent = item.date;
        el.tweetContextBadge.textContent = item.type;
        el.tweetContextBadge.className = `badge ${getBadgeClass(item.type)}`;
        el.tweetContextDesc.textContent = item.plain_text;

        // Reset Template UI
        el.templateButtons.forEach(btn => {
            if (btn.getAttribute('data-style') === 'pro') btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Set composer text
        updateComposerText();
        
        // Show modal
        el.tweetModal.classList.add('open');
        el.tweetTextarea.focus();
    }

    // Close Modal
    function closeTweetModal() {
        el.tweetModal.classList.remove('open');
        state.selectedUpdate = null;
    }

    // Handles smart templates and character caps
    function updateComposerText() {
        const item = state.selectedUpdate;
        if (!item) return;

        const date = item.date;
        const type = item.type;
        const desc = item.plain_text;
        const url = item.feed_link;

        // X intent text generator
        let tweetBody = "";
        
        // Sub-calculations for content spacing
        // URLs inside Tweets are automatically converted to https://t.co/... links and count as 23 characters.
        // We calculate maximum available characters for our description text dynamically.
        // Twitter Intent string: "Text description [link]"
        // Remaining length: 280 - (23 characters for link) - (spaces and hashtags)
        
        let linkPlaceholder = url ? ` ${url}` : "";
        let tags = "";
        let descCap = 180; // Default fallback desc cap

        if (state.activeStyle === 'pro') {
            tags = " #BigQuery #GCP #CloudData";
            // Template: "BigQuery Update ({type}): {desc} [url] #BigQuery #GCP #CloudData"
            const prefix = `BigQuery Update (${type}): `;
            const suffix = `${linkPlaceholder}${tags}`;
            const overhead = prefix.length + suffix.length - (url ? url.length - TWITTER_URL_LEN : 0);
            descCap = MAX_TWEET_CHARS - overhead - 5; // offset buffer
            
            const truncatedDesc = desc.length > descCap ? desc.substring(0, descCap) + "..." : desc;
            tweetBody = `${prefix}${truncatedDesc}${suffix}`;
            
        } else if (state.activeStyle === 'hype') {
            tags = " #DataEngineering #GoogleCloud";
            // Template: "🔥 BigQuery dropped a new update! {type}: {desc} [url] #DataEngineering #GoogleCloud"
            const prefix = `🔥 BigQuery dropped a new update! ${type}: `;
            const suffix = `${linkPlaceholder}${tags}`;
            const overhead = prefix.length + suffix.length - (url ? url.length - TWITTER_URL_LEN : 0);
            descCap = MAX_TWEET_CHARS - overhead - 5;
            
            const truncatedDesc = desc.length > descCap ? desc.substring(0, descCap) + "..." : desc;
            tweetBody = `${prefix}${truncatedDesc}${suffix}`;
            
        } else if (state.activeStyle === 'dev') {
            tags = " #BigQuery #SQL";
            // Template: "💡 Useful BigQuery feature update: {desc} [url] #BigQuery #SQL"
            const prefix = `💡 Useful BigQuery feature update: `;
            const suffix = `${linkPlaceholder}${tags}`;
            const overhead = prefix.length + suffix.length - (url ? url.length - TWITTER_URL_LEN : 0);
            descCap = MAX_TWEET_CHARS - overhead - 5;
            
            const truncatedDesc = desc.length > descCap ? desc.substring(0, descCap) + "..." : desc;
            tweetBody = `${prefix}${truncatedDesc}${suffix}`;
        }

        el.tweetTextarea.value = tweetBody;
        handleComposerInput();
    }

    // Handles character counter calculations and UI updates
    function handleComposerInput() {
        const text = el.tweetTextarea.value;
        
        // Find URLs in text to apply Twitter's 23-char rules correctly
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex) || [];
        
        let calculatedLength = text.length;
        urls.forEach(url => {
            // Subtract original length and add Twitter URL wrap length (23 chars)
            calculatedLength = calculatedLength - url.length + TWITTER_URL_LEN;
        });

        const remaining = MAX_TWEET_CHARS - calculatedLength;
        el.charCount.textContent = remaining;

        // Style warnings based on character counts
        el.charCount.classList.remove('warning', 'danger');
        if (remaining <= 0) {
            el.charCount.classList.add('danger');
            el.postTweetBtn.disabled = true;
        } else if (remaining <= 20) {
            el.charCount.classList.add('warning');
            el.postTweetBtn.disabled = false;
        } else {
            el.postTweetBtn.disabled = false;
        }

        // Circular Ring SVG Animation Calculations
        // Perimeter of ring (r=9) is 2 * PI * r = 56.54
        const perimeter = 56.54;
        const percentageFilled = Math.max(0, Math.min(100, (calculatedLength / MAX_TWEET_CHARS) * 100));
        const offset = perimeter - (percentageFilled / 100) * perimeter;
        el.charProgress.style.strokeDashoffset = offset;

        // Change color of progress ring based on limits
        if (remaining <= 0) {
            el.charProgress.style.stroke = "hsl(var(--color-deprecated))"; // Red
        } else if (remaining <= 20) {
            el.charProgress.style.stroke = "hsl(var(--color-fixed))"; // Yellow
        } else {
            el.charProgress.style.stroke = "hsl(var(--primary-glow))"; // Standard Glow Purple
        }
    }

    // Opens Tweet Intent in a new browser tab
    function postTweet() {
        const text = el.tweetTextarea.value;
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
        closeTweetModal();
        showToast("Twitter intent launched!");
    }

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */

    // Refresh action
    el.refreshBtn.addEventListener('click', fetchNotes);

    // Export CSV action
    el.exportCsvBtn.addEventListener('click', exportToCSV);

    // Toggle theme action
    el.themeToggleBtn.addEventListener('click', toggleTheme);

    // Search input typing
    el.searchInput.addEventListener('input', (event) => {
        state.filters.search = event.target.value;
        applyFilters();
    });

    // Category Sidebar filter clicks
    el.categoryFilters.addEventListener('click', (event) => {
        const btn = event.target.closest('.filter-btn');
        if (!btn) return;

        const category = btn.getAttribute('data-category');
        state.filters.category = category;
        applyFilters();
    });

    // Sidebar analytics cards click behaves as category filter toggle
    el.statCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-type') || 'all';
            state.filters.category = cat;
            applyFilters();
        });
    });

    // Clear filters button
    el.clearFiltersBtn.addEventListener('click', () => {
        state.filters.search = '';
        state.filters.category = 'all';
        el.searchInput.value = '';
        applyFilters();
    });

    // Reset search button (empty state screen)
    el.resetSearchBtn.addEventListener('click', () => {
        state.filters.search = '';
        state.filters.category = 'all';
        el.searchInput.value = '';
        applyFilters();
    });

    // Composer Template Selection clicks
    el.templateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            el.templateButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeStyle = btn.getAttribute('data-style');
            updateComposerText();
        });
    });

    // Modal closes
    el.closeModalBtn.addEventListener('click', closeTweetModal);
    el.cancelTweetBtn.addEventListener('click', closeTweetModal);
    window.addEventListener('click', (e) => {
        if (e.target === el.tweetModal) {
            closeTweetModal();
        }
    });

    // Textarea editing recalculates constraints
    el.tweetTextarea.addEventListener('input', handleComposerInput);

    // Open link intent to post
    el.postTweetBtn.addEventListener('click', postTweet);

    // Run Initial Load
    initTheme();
    fetchNotes();
});
