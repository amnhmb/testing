// Language i18n State & Controller
let currentLang = localStorage.getItem('thirtyone_lang') || 'en';

window.setLanguage = function(lang) {
    if (typeof i18nTranslations === 'undefined' || !i18nTranslations[lang]) return;
    currentLang = lang;
    localStorage.setItem('thirtyone_lang', lang);

    // Update active button state in header switcher
    const btnEN = document.getElementById('langBtnEN');
    const btnMS = document.getElementById('langBtnMS');
    if (btnEN && btnMS) {
        if (lang === 'en') {
            btnEN.classList.add('active');
            btnMS.classList.remove('active');
        } else {
            btnMS.classList.add('active');
            btnEN.classList.remove('active');
        }
    }

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (i18nTranslations[lang] && i18nTranslations[lang][key]) {
            elem.innerText = i18nTranslations[lang][key];
        }
    });

    // Translate static material cards
    document.querySelectorAll('.prod-material').forEach(card => {
        const titleElem = card.querySelector('.material-title');
        if (!titleElem) return;
        const titleText = titleElem.textContent.trim();
        const data = getMaterialData(titleText);
        if (data) {
            const descElem = card.querySelector('.collection-name');
            if (descElem) {
                descElem.innerText = i18nTranslations[lang][data.descKey] || data.desc;
            }
            const labelElem = card.querySelector('.stat-label');
            if (labelElem) {
                labelElem.innerText = i18nTranslations[lang]['spec_recommend_label'] || 'Recommend';
            }
            const valueElem = card.querySelector('.stat-value');
            if (valueElem) {
                valueElem.innerText = i18nTranslations[lang][data.recKey] || data.recommend;
            }
        }
    });

    // Toggle language-specific sub-captions in WhatsApp guide
    document.querySelectorAll('.wa-guide-subtitle, .wa-guide-desc-sub, .wa-guide-step-sub, .wa-guide-footer-sub').forEach(el => {
        el.style.display = (lang === 'ms') ? 'block' : 'none';
    });

    // Update quote progress texts
    if (typeof updateQuoteStep === 'function') {
        const stepLabel = i18nTranslations[lang].qb_step_label || 'Step';
        const stepOf = i18nTranslations[lang].qb_step_of || 'of';
        const progressElem = document.getElementById('quoteProgress');
        if (progressElem) {
            progressElem.innerText = currentQuoteStep <= 7 ? `${stepLabel} ${currentQuoteStep} ${stepOf} 7` : (lang === 'ms' ? 'Semakan' : 'Summary');
        }
    }

    if (typeof updateQuoteStepOwn === 'function') {
        const stepLabel = i18nTranslations[lang].qb_step_label || 'Step';
        const stepOf = i18nTranslations[lang].qb_step_of || 'of';
        const progressElemOwn = document.getElementById('quoteProgressOwn');
        if (progressElemOwn) {
            const stepDisplayNum = typeof currentQuoteStepOwn !== 'undefined' ? currentQuoteStepOwn - 1 : 1;
            progressElemOwn.innerText = (typeof currentQuoteStepOwn !== 'undefined' && currentQuoteStepOwn <= 7) ? `${stepLabel} ${stepDisplayNum} ${stepOf} 6` : (lang === 'ms' ? 'Semakan' : 'Summary');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.setLanguage(currentLang);
});

// Configuration State
let quoteSelections = {
    design: null,
    alterDesign: 'No',
    quantity: null,
    isEstimatedQuantity: false,
    material: null,
    cutting: null,
    sleeve: null,
    nameset: 'No',
    neck: null
};
let currentQuoteStep = 1;

// Init Quote Builder using configData from config.js
initQuoteBuilder();

// Catalog State
const cardsPerPage = 16;
const catalogGrid = document.getElementById('catalogGrid');
if (typeof catalogHTML !== 'undefined') {
    // Replace all src="Image/..." attributes with a placeholder SVG and store the real source in data-src.
    // Also inject explicit width, height, and loading="lazy" attributes for Lighthouse performance/SEO diagnostics.
    const lazyCatalogHTML = catalogHTML.replace(
        /<img\s+src="([^"]+)"/gi,
        '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 13\'%3E%3C/svg%3E" data-src="$1" width="300" height="390" loading="lazy"'
    );
    catalogGrid.innerHTML = lazyCatalogHTML;
}

const allCards2026 = Array.from(catalogGrid.getElementsByClassName('prod-2026'));
const allCards2025 = Array.from(catalogGrid.getElementsByClassName('prod-2025'));
const allCardsWC = Array.from(catalogGrid.getElementsByClassName('prod-wc'));
const allCardsMaterial = Array.from(catalogGrid.getElementsByClassName('prod-material'));
const allCardsNeck = Array.from(catalogGrid.getElementsByClassName('prod-neck'));
const allCardsCutting = Array.from(catalogGrid.getElementsByClassName('prod-cutting'));
const allCardsNameset = Array.from(catalogGrid.getElementsByClassName('prod-nameset'));
const allCardsSponsor = Array.from(catalogGrid.getElementsByClassName('prod-sponsor'));
const allCardsSizeShirt = Array.from(catalogGrid.getElementsByClassName('prod-sizechart-shirt'));
const allCardsSizePants = Array.from(catalogGrid.getElementsByClassName('prod-sizechart-pants'));
const allCardsSizeMuslimah = Array.from(catalogGrid.getElementsByClassName('prod-sizechart-muslimah'));
const allCardsPlacement = Array.from(catalogGrid.getElementsByClassName('prod-placementguide'));

let currentEdition = '2026';
let currentPage = 1;
let currentCards = [];

// Helper to assign categories, names, and starting prices to designs
function getProductCategoryAndName(ref, isWorldCup) {
    if (ref === 'For Your Own Design') {
        return {
            category: 'Sports',
            name: 'For Your Custom Design',
            price: 'From RM29.00'
        };
    }

    if (isWorldCup) {
        let country = 'World Cup';
        if (ref.includes('Argentina')) country = 'Argentina';
        else if (ref.includes('Brazil')) country = 'Brazil';
        else if (ref.includes('Portugal')) country = 'Portugal';
        else if (ref.includes('Spain')) country = 'Spain';
        else if (ref.includes('England')) country = 'England';

        return {
            category: 'Sports',
            name: `${country} 2026`,
            price: 'From RM39.00'
        };
    }

    const cleanNumStr = ref.replace(/^(25#|26#)/, '');
    const num = parseInt(cleanNumStr) || 0;
    let category = 'Sports';

    // Deterministic category assignment matching the requested categories
    if (num % 5 === 0) {
        category = 'Event';
    } else if (num % 4 === 0) {
        category = 'Uniform';
    } else if (num % 3 === 0) {
        category = 'Casual';
    } else if (num % 2 === 0) {
        category = 'Corporate';
    } else {
        category = 'Sports';
    }

    const price = `From RM${29 + (num % 3) * 5}.00`;
    const name = (ref.startsWith('25#') || ref.startsWith('26#')) ? ref : `26#${ref}`;

    return { category, name, price };
}

let activeCategoryFilter = null;

function filterByCategory(category) {
    activeCategoryFilter = category ? category.toLowerCase() : null;

    // Switch to 'all' edition if currently on non-catalog screens (e.g. printing, sizechart, specs)
    if (['material','cutting','neck','nameset','sponsor','placementguide','sizechart-shirt','sizechart-pants','sizechart-muslimah'].includes(currentEdition)) {
        currentEdition = 'all';
        const allEditionBtns = document.querySelectorAll('.edition-btn, .spec-btn, .sub-spec-btn');
        allEditionBtns.forEach(btn => btn.classList.remove('active'));
        document.getElementById('btnCollection')?.classList.add('active');
        document.getElementById('collectionSubMenu')?.classList.add('active');
        document.getElementById('btnAll')?.classList.add('active');
    }

    // Scroll to catalog section
    const shopSection = document.getElementById('shop');
    if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateCurrentCards(currentEdition);

    if (activeCategoryFilter) {
        currentCards = currentCards.filter(card => {
            const cardCat = card.getAttribute('data-category');
            const ref = card.getAttribute('data-ref');
            const img = card.querySelector('img');
            const src = img ? decodeURIComponent(img.src) : '';
            const isOwn = ref === 'For Your Own Design' || src.includes('For Your Own Design');
            return isOwn || cardCat === activeCategoryFilter;
        });

        ensureOwnDesignAtTopLeft(currentCards);
    }

    // Highlight category cards
    const catCards = document.querySelectorAll('.category-card');
    catCards.forEach(c => {
        if (c.getAttribute('data-category') === activeCategoryFilter) {
            c.classList.add('active');
        } else {
            c.classList.remove('active');
        }
    });

    displayPage(1, false);
    savePageState();
}

// Auto-derive Reference Numbers
function initReferenceNumbers() {
    const allCards = catalogGrid.querySelectorAll('.product-card');
    allCards.forEach(card => {
        if (card.classList.contains('prod-2026') || card.classList.contains('prod-2025') || card.classList.contains('prod-wc')) {
            const img = card.querySelector('img');
            if (img && img.src) {
                const decodedSrc = decodeURIComponent(img.src);
                let refNumber = '';
                let isWorldCup = card.classList.contains('prod-wc');

                if (decodedSrc.includes('For Your Own Design')) {
                    refNumber = 'For Your Own Design';
                    card.setAttribute('data-ref', refNumber);
                } else {
                    const match = decodedSrc.match(/((?:25#|26#)\d+)/) || decodedSrc.match(/\((\d+)\)/);
                    if (match && match[1]) {
                        const rawMatch = match[1];
                        if (isWorldCup) {
                            let countryName = 'World Cup';
                            if (decodedSrc.includes('Argentina')) countryName = 'Argentina';
                            else if (decodedSrc.includes('Brazil')) countryName = 'Brazil';
                            else if (decodedSrc.includes('Portugal')) countryName = 'Portugal';
                            else if (decodedSrc.includes('Spain')) countryName = 'Spain';
                            else if (decodedSrc.includes('England')) countryName = 'England';
                            refNumber = `${countryName} 2026`;
                        } else {
                            refNumber = rawMatch;
                        }
                        card.setAttribute('data-ref', refNumber);
                    }
                }

                if (refNumber) {
                    const meta = getProductCategoryAndName(refNumber, isWorldCup);
                    card.setAttribute('data-category', meta.category.toLowerCase());

                    // Check if card originally had a .badge-new or .badge-wc
                    const hasNewBadge = !!card.querySelector('.badge-new');
                    const hasWcBadge = !!card.querySelector('.badge-wc');

                    // Inject elegant details block below the image
                    const details = document.createElement('div');
                    details.className = 'product-info-overlay';
                    
                    let badgeHtml = '';
                    if (hasNewBadge) {
                        badgeHtml += `<span class="product-title-badge-new">New</span>`;
                    }
                    if (hasWcBadge) {
                        badgeHtml += `<span class="product-title-badge-wc">World Cup</span>`;
                    }

                    details.innerHTML = `
                        <h3 class="product-title">${meta.name}</h3>
                        ${badgeHtml}
                    `;
                    card.appendChild(details);
                }
            }
        } else if (card.classList.contains('prod-material')) {
            const img = card.querySelector('img');
            if (img && img.src) {
                // Extract filename without extension
                const fileNameMatch = img.src.match(/([^\/]+)(?=\.\w+$)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    const refName = decodeURIComponent(fileNameMatch[1]);
                    card.setAttribute('data-ref', refName);

                    const refBadge = document.createElement('span');
                    refBadge.className = 'ref-number-badge';
                    refBadge.innerText = refName;

                    // Look for image container to append badge
                    const imgContainer = card.querySelector('.image-container, .placementguide-image-block');
                    if (imgContainer) {
                        imgContainer.appendChild(refBadge);
                    }
                }
            }
        }
    });
}
let allCardsAll = [];

function initAllCardsAll() {
    let ownDesignCard = null;
    const nonEventCards = [];

    // Collect all design cards from 2025 and 2026 (excluding World Cup / Event Edition)
    [...allCards2025, ...allCards2026].forEach(card => {
        const img = card.querySelector('img');
        const src = img ? decodeURIComponent(img.src) : '';
        const isOwnDesign = card.getAttribute('data-ref') === 'For Your Own Design' || src.includes('For Your Own Design');
        if (isOwnDesign) {
            if (!ownDesignCard) ownDesignCard = card;
        } else {
            nonEventCards.push(card);
        }
    });

    // Shuffle removed as requested

    allCardsAll = ownDesignCard ? [ownDesignCard, ...nonEventCards] : nonEventCards;
}

initReferenceNumbers();
initAllCardsAll();
currentCards = allCardsAll;
initQuoteBuilder();

// State Persistence Functions (Scroll Position, Active Edition, Page Number, Category Filter)
function savePageState() {
    try {
        const state = {
            edition: currentEdition || 'all',
            page: currentPage || 1,
            category: activeCategoryFilter || null,
            scrollY: window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
        };
        sessionStorage.setItem('thirtyone_catalog_state', JSON.stringify(state));
    } catch (e) {}
}

function restorePageState() {
    try {
        const rawState = sessionStorage.getItem('thirtyone_catalog_state');
        if (!rawState) return false;

        const state = JSON.parse(rawState);
        if (!state) return false;

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        if (state.category) {
            activeCategoryFilter = state.category;
            const catCards = document.querySelectorAll('.category-card');
            catCards.forEach(c => {
                if (c.getAttribute('data-category') === activeCategoryFilter) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });
        }

        if (state.edition) {
            currentEdition = state.edition;
            const allEditionBtns = document.querySelectorAll('.edition-btn, .spec-btn, .sub-spec-btn');
            allEditionBtns.forEach(btn => btn.classList.remove('active'));

            if (currentEdition === '2026' || currentEdition === '2025' || currentEdition.startsWith('20')) {
                document.getElementById('btnCollection')?.classList.add('active');
                document.getElementById('collectionSubMenu')?.classList.add('active');
                document.getElementById(`btn${currentEdition}`)?.classList.add('active');
            } else if (currentEdition === 'all') {
                document.getElementById('btnCollection')?.classList.remove('active');
                document.getElementById('collectionSubMenu')?.classList.remove('active');
            } else if (currentEdition === 'worldcup') document.getElementById('btnWC')?.classList.add('active');
            else if (currentEdition === 'material') document.getElementById('btnMaterial')?.classList.add('active');
            else if (currentEdition === 'cutting') document.getElementById('btnCutting')?.classList.add('active');
            else if (currentEdition === 'neck') document.getElementById('btnNeck')?.classList.add('active');

            if (currentEdition === 'nameset' || currentEdition === 'sponsor' || currentEdition === 'placementguide') {
                document.getElementById('btnPrinting')?.classList.add('active');
                document.getElementById('printingSubMenu')?.classList.add('active');

                if (currentEdition === 'nameset') document.getElementById('btnNameset')?.classList.add('active');
                if (currentEdition === 'sponsor') document.getElementById('btnSponsor')?.classList.add('active');
                if (currentEdition === 'placementguide') document.getElementById('btnPlacementGuide')?.classList.add('active');
            } else {
                document.getElementById('printingSubMenu')?.classList.remove('active');
            }

            if (currentEdition.startsWith('sizechart')) {
                document.getElementById('btnSizeChart')?.classList.add('active');
                document.getElementById('sizeChartSubMenu')?.classList.add('active');
                if (currentEdition === 'sizechart-shirt') document.getElementById('btnSizeShirt')?.classList.add('active');
                if (currentEdition === 'sizechart-pants') document.getElementById('btnSizePants')?.classList.add('active');
                if (currentEdition === 'sizechart-muslimah') document.getElementById('btnSizeMuslimah')?.classList.add('active');
            } else if (!currentEdition.startsWith('sizechart')) {
                document.getElementById('sizeChartSubMenu')?.classList.remove('active');
            }
        }

        updateCurrentCards(currentEdition);

        if (activeCategoryFilter) {
            currentCards = currentCards.filter(card => {
                const cardCat = card.getAttribute('data-category');
                return cardCat === activeCategoryFilter;
            });
        }

        const targetPage = state.page || 1;
        displayPage(targetPage, false);

        if (typeof state.scrollY === 'number' && state.scrollY > 0) {
            const scrollPos = state.scrollY;
            window.scrollTo(0, scrollPos);
            setTimeout(() => { window.scrollTo(0, scrollPos); }, 50);
            setTimeout(() => { window.scrollTo(0, scrollPos); }, 200);
        }

        return true;
    } catch (e) {
        return false;
    }
}

// Add event listeners to automatically save position & state on scroll and before refresh
window.addEventListener('beforeunload', savePageState);
window.addEventListener('pagehide', savePageState);
window.addEventListener('scroll', savePageState, { passive: true });

// Initialize or Restore Page State
if (!restorePageState()) {
    displayPage(1, false);
}

function ensureOwnDesignAtTopLeft(cards) {
    if (!cards || cards.length === 0) return cards;

    const ownIdx = cards.findIndex(card => {
        const ref = card.getAttribute('data-ref');
        const img = card.querySelector('img');
        const src = img ? decodeURIComponent(img.src) : '';
        return ref === 'For Your Own Design' || src.includes('For Your Own Design');
    });

    if (ownIdx > 0) {
        const ownCard = cards.splice(ownIdx, 1)[0];
        cards.unshift(ownCard);
    } else if (ownIdx === -1) {
        const allCardsInGrid = Array.from(catalogGrid.querySelectorAll('.product-card'));
        const globalOwnCard = allCardsInGrid.find(card => {
            const ref = card.getAttribute('data-ref');
            const img = card.querySelector('img');
            const src = img ? decodeURIComponent(img.src) : '';
            return ref === 'For Your Own Design' || src.includes('For Your Own Design');
        });
        if (globalOwnCard) {
            cards.unshift(globalOwnCard);
        }
    }

    return cards;
}

function updateCurrentCards(edition) {
    switch (edition) {
        case 'all': currentCards = [...allCardsAll]; break;
        case '2026': currentCards = [...allCards2026]; break;
        case '2025': currentCards = allCards2025.length > 0 ? [...allCards2025] : [...allCards2026]; break;
        case 'worldcup': currentCards = [...allCardsWC]; break;
        case 'material': currentCards = [...allCardsMaterial]; break;
        case 'cutting': currentCards = [...allCardsCutting]; break;
        case 'neck': currentCards = [...allCardsNeck]; break;
        case 'nameset': currentCards = [...allCardsNameset]; break;
        case 'sponsor': currentCards = [...allCardsSponsor]; break;
        case 'sizechart-shirt': currentCards = [...allCardsSizeShirt]; break;
        case 'sizechart-pants': currentCards = [...allCardsSizePants]; break;
        case 'sizechart-muslimah': currentCards = [...allCardsSizeMuslimah]; break;
        case 'placementguide': currentCards = [...allCardsPlacement]; break;
        default: 
            const dynamicCards = Array.from(catalogGrid.getElementsByClassName(`prod-${edition}`));
            currentCards = dynamicCards.length > 0 ? [...dynamicCards] : [...allCardsAll];
    }

    const isSpecSection = ['material','cutting','neck','nameset','sponsor','placementguide','sizechart-shirt','sizechart-pants','sizechart-muslimah'].includes(edition);
    if (!isSpecSection) {
        ensureOwnDesignAtTopLeft(currentCards);
    }
}

function applySkeletonLoader(card) {
    const imgs = card.querySelectorAll('img');
    
    // Load real images from data-src when card becomes active/visible
    imgs.forEach(img => {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc && img.src !== dataSrc) {
            img.src = dataSrc;
        }
    });

    let loadedCount = 0;
    const totalImgs = imgs.length;

    if (totalImgs > 0) {
        let hasUnloaded = false;
        imgs.forEach(img => {
            if (!img.complete) {
                hasUnloaded = true;
                
                if (img.dataset.skeletonBound === 'true') {
                    return;
                }
                img.dataset.skeletonBound = 'true';

                const loadHandler = () => {
                    loadedCount++;
                    if (loadedCount === totalImgs) {
                        card.classList.remove('skeleton-loading');
                    }
                    img.dataset.skeletonBound = 'false';
                    img.removeEventListener('load', loadHandler);
                    img.removeEventListener('error', errorHandler);
                };
                const errorHandler = () => {
                    loadedCount++;
                    if (loadedCount === totalImgs) {
                        card.classList.remove('skeleton-loading');
                    }
                    img.dataset.skeletonBound = 'false';
                    img.removeEventListener('load', loadHandler);
                    img.removeEventListener('error', errorHandler);
                };
                img.addEventListener('load', loadHandler);
                img.addEventListener('error', errorHandler);
            }
        });

        if (hasUnloaded) {
            card.classList.add('skeleton-loading');
        } else {
            card.classList.remove('skeleton-loading');
        }
    } else {
        card.classList.remove('skeleton-loading');
    }
}

function displayPage(page, shouldScroll = true) {
    const totalPages = Math.ceil(currentCards.length / cardsPerPage);
    if (page > totalPages && totalPages > 0) {
        page = totalPages;
    }

    currentPage = page;
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    Array.from(catalogGrid.getElementsByClassName('product-card')).forEach(card => card.style.display = 'none');
    catalogGrid.classList.remove('grid-nameset-layout', 'grid-sponsor-layout', 'grid-sizechart-layout', 'grid-neck-layout', 'grid-cutting-layout', 'grid-material-layout', 'grid-placementguide-layout');
    document.getElementById('sponsorDisclaimer').style.display = 'none';

    let isCustomLayout = false;
    if (currentEdition === 'nameset') { catalogGrid.classList.add('grid-nameset-layout'); isCustomLayout = true; }
    else if (currentEdition === 'sponsor') { catalogGrid.classList.add('grid-sponsor-layout'); document.getElementById('sponsorDisclaimer').style.display = 'block'; isCustomLayout = true; }
    else if (currentEdition.startsWith('sizechart')) { catalogGrid.classList.add('grid-sizechart-layout'); isCustomLayout = true; }
    else if (currentEdition === 'neck') { catalogGrid.classList.add('grid-neck-layout'); isCustomLayout = true; }
    else if (currentEdition === 'cutting') { catalogGrid.classList.add('grid-cutting-layout'); isCustomLayout = true; }
    else if (currentEdition === 'material') { catalogGrid.classList.add('grid-material-layout'); isCustomLayout = true; }
    else if (currentEdition === 'placementguide') { catalogGrid.classList.add('grid-placementguide-layout'); isCustomLayout = true; }

    if (isCustomLayout) {
        currentCards.forEach(card => {
            card.style.display = 'block';
            applySkeletonLoader(card);
        });
        document.getElementById('paginationContainer').innerHTML = '';
    } else {
        currentCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'block';
                applySkeletonLoader(card);
            }
        });

        // Enforce DOM prepending of For Your Own Design so it is physically the first child node in catalogGrid
        const isSpecSection = ['material','cutting','neck','nameset','sponsor','placementguide','sizechart-shirt','sizechart-pants','sizechart-muslimah'].includes(currentEdition);
        if (!isSpecSection) {
            const ownDesignCard = currentCards.find(card => {
                const ref = card.getAttribute('data-ref');
                const img = card.querySelector('img');
                const src = img ? decodeURIComponent(img.src) : '';
                return ref === 'For Your Own Design' || src.includes('For Your Own Design');
            }) || Array.from(catalogGrid.querySelectorAll('.product-card')).find(card => {
                const ref = card.getAttribute('data-ref');
                const img = card.querySelector('img');
                const src = img ? decodeURIComponent(img.src) : '';
                return ref === 'For Your Own Design' || src.includes('For Your Own Design');
            });

            if (ownDesignCard) {
                catalogGrid.prepend(ownDesignCard);
                // Ensure we only force display block if it is within the paginated range (e.g. page 1)
                const ownIndex = currentCards.indexOf(ownDesignCard);
                if (ownIndex >= start && ownIndex < end) {
                    ownDesignCard.style.display = 'block';
                    applySkeletonLoader(ownDesignCard);
                }
            }
        }

        setupPaginationButtons();
    }

    if (shouldScroll) {
        let scrollOffset = 150;

        if (currentEdition === 'sizechart-shirt' || currentEdition === 'sizechart-pants' || currentEdition === 'sizechart-muslimah' || currentEdition === 'placementguide' || currentEdition === 'nameset' || currentEdition === 'cutting' || currentEdition === 'neck') {
            scrollOffset = 200;
        }
        else if (currentEdition === 'sponsor') {
            scrollOffset = 235;
        }

        window.scrollTo({ top: catalogGrid.offsetTop - scrollOffset, behavior: 'smooth' });
    }
    savePageState();
}

function setupPaginationButtons() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(currentCards.length / cardsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-btn');
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => displayPage(i, true));
        paginationContainer.appendChild(button);
    }
}

function switchEdition(edition) {
    currentEdition = edition;

    // Reset category filter when switching main sections
    activeCategoryFilter = null;
    const catCards = document.querySelectorAll('.category-card');
    catCards.forEach(c => c.classList.remove('active'));

    const allEditionBtns = document.querySelectorAll('.edition-btn, .spec-btn, .sub-spec-btn');
    allEditionBtns.forEach(btn => btn.classList.remove('active'));

    if (edition === '2026' || edition === '2025' || edition.startsWith('20')) {
        document.getElementById('btnCollection')?.classList.add('active');
        document.getElementById('collectionSubMenu')?.classList.add('active');
        document.getElementById(`btn${edition}`)?.classList.add('active');
    } else if (edition === 'all') {
        document.getElementById('btnCollection')?.classList.remove('active');
        document.getElementById('collectionSubMenu')?.classList.remove('active');
    } else {
        document.getElementById('collectionSubMenu')?.classList.remove('active');
    }

    if (edition === 'worldcup') document.getElementById('btnWC')?.classList.add('active');
    else if (edition === 'material') document.getElementById('btnMaterial')?.classList.add('active');
    else if (edition === 'cutting') document.getElementById('btnCutting')?.classList.add('active');
    else if (edition === 'neck') document.getElementById('btnNeck')?.classList.add('active');

    if (edition === 'nameset' || edition === 'sponsor' || edition === 'placementguide') {
        document.getElementById('btnPrinting')?.classList.add('active');
        document.getElementById('printingSubMenu')?.classList.add('active');

        if (edition === 'nameset') document.getElementById('btnNameset')?.classList.add('active');
        if (edition === 'sponsor') document.getElementById('btnSponsor')?.classList.add('active');
        if (edition === 'placementguide') document.getElementById('btnPlacementGuide')?.classList.add('active');
    } else {
        document.getElementById('printingSubMenu')?.classList.remove('active');
    }

    if (edition === 'sizechart-shirt') {
        document.getElementById('btnSizeChart')?.classList.add('active');
        document.getElementById('sizeChartSubMenu')?.classList.add('active');
        document.getElementById('btnSizeShirt')?.classList.add('active');
    } else if (edition === 'sizechart-pants') {
        document.getElementById('btnSizeChart')?.classList.add('active');
        document.getElementById('sizeChartSubMenu')?.classList.add('active');
        document.getElementById('btnSizePants')?.classList.add('active');
    } else if (edition === 'sizechart-muslimah') {
        document.getElementById('btnSizeChart')?.classList.add('active');
        document.getElementById('sizeChartSubMenu')?.classList.add('active');
        document.getElementById('btnSizeMuslimah')?.classList.add('active');
    } else if (!edition.startsWith('sizechart')) {
        document.getElementById('sizeChartSubMenu')?.classList.remove('active');
    }

    updateCurrentCards(edition);
    displayPage(1, true);
    savePageState();
}

function toggleCollectionSubMenu() {
    const subMenu = document.getElementById('collectionSubMenu');
    const mainBtn = document.getElementById('btnCollection');

    if (subMenu && mainBtn) {
        const isCurrentlyActive = mainBtn.classList.contains('active');
        if (isCurrentlyActive) {
            // switchEdition('all'); // Disabled so it doesn't turn off
        } else {
            const currentYear = new Date().getFullYear().toString();
            const yearBtn = document.getElementById(`btn${currentYear}`);
            const targetEdition = yearBtn ? currentYear : '2026';
            switchEdition(targetEdition);
        }
    }
}
window.toggleCollectionSubMenu = toggleCollectionSubMenu;

function togglePrintingSubMenu() {
    const subMenu = document.getElementById('printingSubMenu');
    const mainBtn = document.getElementById('btnPrinting');

    subMenu.classList.toggle('active');
    mainBtn.classList.toggle('active');

    if (subMenu.classList.contains('active')) {
        switchEdition('nameset');
    }
}

function toggleSizeChartSubMenu() {
    const subMenu = document.getElementById('sizeChartSubMenu');
    const mainBtn = document.getElementById('btnSizeChart');

    subMenu.classList.toggle('active');
    mainBtn.classList.toggle('active');

    if (subMenu.classList.contains('active')) {
        switchEdition('sizechart-shirt');
    }
}

// Lightbox & Quote Builder Interactivity
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const quoteBuilderModal = document.getElementById('quoteBuilderModal');
let currentRefNumber = null;

catalogGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    // Block popup for nameset, sponsor
    if (card.classList.contains('prod-nameset') ||
        card.classList.contains('prod-sponsor')) {
        return;
    }

    const isSizeChartOrMaterial = card.classList.contains('prod-sizechart-shirt') ||
        card.classList.contains('prod-sizechart-pants') ||
        card.classList.contains('prod-sizechart-muslimah') ||
        card.classList.contains('prod-material') ||
        card.classList.contains('prod-neck') ||
        card.classList.contains('prod-cutting') ||
        card.classList.contains('prod-placementguide');

    // Get image from appropriate container
    const imgs = Array.from(card.querySelectorAll('.image-container img, .sizechart-image-block img, .neck-image-block img, .sponsor-image-block img, .nameset-image-block img, .placementguide-image-block img, .card-image-wrapper img, .neck-image-wrapper img'));
    if (imgs.length === 0) return;

    lightboxImg.src = imgs[0].src;

    // Show/hide action buttons based on card type
    const actionContainer = document.querySelector('.lightbox-action-container');
    if (isSizeChartOrMaterial) {
        actionContainer.style.display = 'none';
    } else {
        actionContainer.style.display = '';
        currentRefNumber = card.getAttribute('data-ref');
        const isNumOnly = /^\d+$/.test(currentRefNumber);
        document.getElementById('lightboxRefDisplay').innerText = isNumOnly ? `Design #${currentRefNumber}` : `Design: ${currentRefNumber}`;
    }

    lightboxOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
});

function closeLightbox() {
    const content = document.querySelector('.lightbox-content');
    const navPrev = document.getElementById('lightboxPrev');
    const navNext = document.getElementById('lightboxNext');

    // Hide content immediately to prevent flash
    content.style.opacity = '0';
    navPrev.style.opacity = '0';
    navNext.style.opacity = '0';

    lightboxOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');

    // Reset after fade-out completes (300ms)
    setTimeout(() => {
        lightboxImg.src = '';
        document.querySelector('.lightbox-action-container').style.display = '';
        content.style.opacity = '';
        navPrev.style.opacity = '';
        navNext.style.opacity = '';
    }, 300);
}

document.getElementById('lightboxClose').addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
});

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
        closeLightbox();
    }
});


document.getElementById('openQuoteBuilderBtn').addEventListener('click', () => {
    try {
        lightboxOverlay.classList.remove('active');
        if (currentRefNumber === 'For Your Own Design') {
            if (typeof quoteSelectionsOwn === 'undefined') {
                alert('appOwn.js failed to load properly. quoteSelectionsOwn is undefined.');
                return;
            }
            quoteSelectionsOwn.design = currentRefNumber;
            openQuoteBuilderOwn();
        } else {
            quoteSelections.design = currentRefNumber;
            openQuoteBuilder();
        }
    } catch (e) {
        alert("Error opening Quote Builder: " + e.message);
    }
});



// Preview Cards Mapping & Logic
const materialDetailsMap = {
    "Eyelet 165GSM (BEST SELLER)": {
        title: "EYELET",
        image: "Image/Material/Eyelet.webp",
        badges: ["Image/Material/Recommend.webp", "Image/Material/Hot Sale.webp"],
        desc: "Eyelet 160gsm is a lightweight, breathable jersey fabric that dries sweat quickly. Perfect for sports gear with bright, long-lasting printed colors.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_eyelet_desc",
        recKey: "mat_eyelet_rec"
    },
    "Diamond 160GSM": {
        title: "DIAMOND",
        image: "Image/Material/Diamond.webp",
        badges: ["Image/Material/Recommend.webp"],
        desc: "Diamond 160gsm is a lightweight, breathable jersey fabric with a stylish diamond texture that wicks sweat quickly. Ideal for activewear, it delivers vivid, long-lasting printed colors while keeping you comfortable and moving freely.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_diamond_desc",
        recKey: "mat_diamond_rec"
    },
    "Lycra 280GSM": {
        title: "LYCRA",
        image: "Image/Material/Lycra.webp",
        badges: ["Image/Material/Recommend.webp"],
        desc: "Lycra 280gsm is a premium, thicker jersey fabric with extra stretch and great durability. Perfect for formal teamwear, it offers a neat fit and vibrant, long-lasting printed colors that keep their shape over time.",
        recommend: "Sports (Indoor) • Corporate • Casual • Event",
        descKey: "mat_lycra_desc",
        recKey: "mat_lycra_rec"
    },
    "Interlock 160GSM": {
        title: "INTERLOCK",
        image: "Image/Material/Interlock.webp",
        badges: [],
        desc: "Interlock 160gsm is a smooth, lightweight jersey fabric with great stretch and durability. Perfect for teamwear, it offers comfortable breathability and vibrant, long-lasting printed colors that won't fade or crack.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_interlock_desc",
        recKey: "mat_interlock_rec"
    },
    "Mini Eyelet 165GSM": {
        title: "MINI-EYELET",
        image: "Image/Material/Mini-Eyelet.webp",
        badges: [],
        desc: "Mini Eyelet 160gsm is a lightweight, breathable jersey fabric with tiny holes for extra airflow and quick sweat drying. Perfect for sportswear, it offers bright, long-lasting printed colors while remaining soft, durable, and comfortable.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_mini_eyelet_desc",
        recKey: "mat_mini_eyelet_rec"
    },
    "RJPK 180GSM": {
        title: "RJPK",
        image: "Image/Material/RJPK.webp",
        badges: [],
        desc: "RJPK 180gsm is a medium-weight, durable jersey fabric with a structured feel while remaining soft and breathable. Perfect for premium team jerseys, it wicks sweat away and features vibrant, long-lasting printed colors that won't fade or crack.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_rjpk_desc",
        recKey: "mat_rjpk_rec"
    },
    "Mesh 230GSM": {
        title: "MESH",
        image: "Image/Material/Mesh.webp",
        badges: ["Image/Material/Premium.webp"],
        desc: "Mesh 230gsm is a durable, thicker jersey fabric with a classic netted texture that provides maximum airflow and ventilation. Perfect for sports jerseys and activewear, it dries sweat quickly and features bright, long-lasting printed colors while keeping you comfortable and cool.",
        recommend: "Sports • Casual • Event",
        descKey: "mat_mesh_desc",
        recKey: "mat_mesh_rec"
    },
    "Popcorn 160GSM": {
        title: "POPCORN",
        image: "Image/Material/Popcorn.webp",
        badges: ["Image/Material/Premium.webp"],
        desc: "Popcorn 160gsm is a lightweight, breathable jersey fabric featuring a unique textured \"popcorn\" knit pattern that promotes airflow and wicks sweat quickly. Ideal for activewear and sports jerseys, it provides a comfortable, soft feel with bright, long-lasting printed colors that won't fade or crack.",
        recommend: "Sports • Corporate • Casual • Uniform • Event",
        descKey: "mat_popcorn_desc",
        recKey: "mat_popcorn_rec"
    }
};

const neckCardMap = {
    "Roundneck": "Image/Neck/Round.webp",
    "V-neck": "Image/Neck/V-neck.webp",
    "V-neck End": "Image/Neck/V-neck End.webp",
    "V-Neck End": "Image/Neck/V-neck End.webp",
    "Collar Button (Polo)": "Image/Neck/Polo.webp",
    "Mandarin Zip": "Image/Neck/Mandarin Zip.webp",
    "Retro": "Image/Neck/Retro.webp",
    "Retro End": "Image/Neck/Retro End.webp",
    "V-neck Outer": "Image/Neck/V-neck Outer.webp",
    "V-neck Outer (NFL)": "Image/Neck/V-neck Outer.webp"
};

function getMaterialData(label) {
    if (!label) return null;
    if (materialDetailsMap[label]) return materialDetailsMap[label];
    const lower = label.toLowerCase();
    if (lower.includes("eyelet") && !lower.includes("mini")) return materialDetailsMap["Eyelet 165GSM (BEST SELLER)"];
    if (lower.includes("diamond")) return materialDetailsMap["Diamond 160GSM"];
    if (lower.includes("lycra")) return materialDetailsMap["Lycra 280GSM"];
    if (lower.includes("interlock")) return materialDetailsMap["Interlock 160GSM"];
    if (lower.includes("mini")) return materialDetailsMap["Mini Eyelet 165GSM"];
    if (lower.includes("rjpk")) return materialDetailsMap["RJPK 180GSM"];
    if (lower.includes("mesh")) return materialDetailsMap["Mesh 230GSM"];
    if (lower.includes("popcorn")) return materialDetailsMap["Popcorn 160GSM"];
    return null;
}

function getNeckCardImg(label) {
    if (!label) return null;
    if (neckCardMap[label]) return neckCardMap[label];
    const lower = label.toLowerCase();
    if (lower.includes("round")) return "Image/Neck/Round.webp";
    if (lower.includes("v-neck end") || lower.includes("v-neck-end")) return "Image/Neck/V-neck End.webp";
    if (lower.includes("v-neck outer")) return "Image/Neck/V-neck Outer.webp";
    if (lower.includes("v-neck") || lower.includes("vneck")) return "Image/Neck/V-neck.webp";
    if (lower.includes("polo") || lower.includes("collar")) return "Image/Neck/Polo.webp";
    if (lower.includes("mandarin")) return "Image/Neck/Mandarin Zip.webp";
    if (lower.includes("retro end")) return "Image/Neck/Retro End.webp";
    if (lower.includes("retro")) return "Image/Neck/Retro.webp";
    return null;
}

const cuttingCardMap = {
    "Baseball": "Image/Cutting/Baseball.webp",
    "Baseball Cutting": "Image/Cutting/Baseball.webp",
    "Boxy": "Image/Cutting/Boxy.webp",
    "Boxy Cutting": "Image/Cutting/Boxy.webp",
    "Normal": "Image/Cutting/Normal.webp",
    "Normal Cutting": "Image/Cutting/Normal.webp",
    "Raglan": "Image/Cutting/Raglan.webp",
    "Raglan Cutting": "Image/Cutting/Raglan.webp",
    "Singlet": "Image/Cutting/Singlet.webp",
    "Singlet Cutting": "Image/Cutting/Singlet.webp",
    "Sleeveless": "Image/Cutting/Sleeveless.webp",
    "Sleeveless Cutting": "Image/Cutting/Sleeveless.webp"
};

function getCuttingCardImg(label) {
    if (!label) return null;
    if (cuttingCardMap[label]) return cuttingCardMap[label];
    const lower = label.toLowerCase();
    if (lower.includes("baseball")) return "Image/Cutting/Baseball.webp";
    if (lower.includes("boxy")) return "Image/Cutting/Boxy.webp";
    if (lower.includes("raglan")) return "Image/Cutting/Raglan.webp";
    if (lower.includes("singlet")) return "Image/Cutting/Singlet.webp";
    if (lower.includes("sleeveless")) return "Image/Cutting/Sleeveless.webp";
    if (lower.includes("normal") || lower.includes("standard")) return "Image/Cutting/Normal.webp";
    return null;
}

function updateMaterialPreview(containerId, selectedVal) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = getMaterialData(selectedVal);
    if (data) {
        const badgesHtml = data.badges.map(b => `<img src="${b}" alt="badge" class="stat-icon">`).join('');
        const descText = (typeof i18nTranslations !== 'undefined' && i18nTranslations[currentLang] && i18nTranslations[currentLang][data.descKey]) || data.desc;
        const recText = (typeof i18nTranslations !== 'undefined' && i18nTranslations[currentLang] && i18nTranslations[currentLang][data.recKey]) || data.recommend;
        const recLabel = (typeof i18nTranslations !== 'undefined' && i18nTranslations[currentLang] && i18nTranslations[currentLang]['spec_recommend_label']) || 'Recommend';

        container.innerHTML = `
            <div class="product-card prod-material qb-material-card-full">
                <div class="card-image-wrapper">
                    <img src="${data.image}" alt="${data.title}" class="card-image">
                </div>
                <div class="card-content">
                    <div class="header-inline">
                        <h1 class="material-title">${data.title} ${badgesHtml}</h1>
                        <span class="collection-name" data-i18n="${data.descKey}">${descText}</span>
                    </div>
                    <div class="stats-container">
                        <div class="stat-box">
                            <span class="stat-label" data-i18n="spec_recommend_label">${recLabel}</span>
                            <span class="stat-value" data-i18n="${data.recKey}">${recText}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

function updateNeckPreview(containerId, selectedVal) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const imgPath = getNeckCardImg(selectedVal);
    if (imgPath) {
        container.innerHTML = `
            <div class="qb-card-preview">
                <img src="${imgPath}" alt="${selectedVal}" class="qb-card-preview-img">
            </div>
        `;
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

function updateCuttingPreview(containerId, selectedVal) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const imgPath = getCuttingCardImg(selectedVal);
    if (imgPath) {
        container.innerHTML = `
            <div class="qb-card-preview">
                <img src="${imgPath}" alt="${selectedVal}" class="qb-card-preview-img">
            </div>
        `;
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

function openQuoteBuilder() {
    quoteBuilderModal.classList.add('active');
    quoteBuilderModal.scrollTop = 0;
    document.body.classList.add('no-scroll');
    currentQuoteStep = 1;

    // Reset quantity checkbox and state
    document.getElementById('qbQuantityNotSure').checked = false;
    document.getElementById('qbQuantity').disabled = false;
    document.getElementById('qbQuantity').style.opacity = '';
    document.getElementById('qbQuantity').value = configData.minimumOrderQuantity;
    quoteSelections.isEstimatedQuantity = false;

    // Reset sleeve state
    document.querySelector('input[name="sleeveShortOpt"][value="all"]').checked = true;
    document.querySelector('input[name="sleeveLongOpt"][value="all"]').checked = false;
    if (typeof updateSleeveState === 'function') updateSleeveState();

    // Reset card previews
    updateMaterialPreview('qbMaterialPreview', '');
    updateCuttingPreview('qbCuttingPreview', '');
    updateNeckPreview('qbNeckPreview', '');

    updateQuoteStep();
}

document.getElementById('quoteBuilderClose').addEventListener('click', () => {
    quoteBuilderModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Quote Builder Logic
function initQuoteBuilder() {
    // Populate dynamic selects
    document.getElementById('qbQuantity').min = configData.minimumOrderQuantity;
    document.getElementById('qbQuantity').value = configData.minimumOrderQuantity;

    populateSelect('qbMaterial', configData.materials);
    populateSelect('qbCutting', configData.cuttings);
    populateSelect('qbNeck', configData.necks);

    // Bind change listeners for material, cutting & neck previews
    document.getElementById('qbMaterial').addEventListener('change', (e) => {
        updateMaterialPreview('qbMaterialPreview', e.target.value);
    });

    document.getElementById('qbCutting').addEventListener('change', (e) => {
        updateCuttingPreview('qbCuttingPreview', e.target.value);
    });

    document.getElementById('qbNeck').addEventListener('change', (e) => {
        updateNeckPreview('qbNeckPreview', e.target.value);
    });

    // Quantity Not Sure (Estimate Quantity) Change Event Listener
    document.getElementById('qbQuantityNotSure').addEventListener('change', (e) => {
        // Quantity input box remains enabled regardless of checkbox state
    });

    // Sleeve Not Sure Event Listener is added below where updateSleeveState is defined
}

function populateSelect(id, list) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">-- Choose Option --</option>';
    list.forEach(item => {
        select.innerHTML += `<option value="${item.label}">${item.label}</option>`;
    });
}

function updateQuoteStep() {
    document.querySelectorAll('#quoteBuilderModal .quote-step').forEach(el => el.style.display = 'none');
    document.getElementById(`step${currentQuoteStep}`).style.display = 'block';

    const stepLabel = (typeof i18nTranslations !== 'undefined' && i18nTranslations[currentLang]?.qb_step_label) || 'Step';
    const stepOf = (typeof i18nTranslations !== 'undefined' && i18nTranslations[currentLang]?.qb_step_of) || 'of';
    const progressText = currentQuoteStep <= 7 ? `${stepLabel} ${currentQuoteStep} ${stepOf} 7` : (currentLang === 'ms' ? 'Semakan' : 'Summary');
    document.getElementById('quoteProgress').innerText = progressText;

    if (currentQuoteStep === 3) {
        updateMaterialPreview('qbMaterialPreview', document.getElementById('qbMaterial').value);
    } else if (currentQuoteStep === 4) {
        updateCuttingPreview('qbCuttingPreview', document.getElementById('qbCutting').value);
    } else if (currentQuoteStep === 5) {
        updateNeckPreview('qbNeckPreview', document.getElementById('qbNeck').value);
    }

    if (currentQuoteStep === 8) {
        // Build summary
        let designStr = quoteSelections.design === 'Custom' || quoteSelections.design === 'For Your Own Design' ? (currentLang === 'ms' ? 'Reka Bentuk Sendiri' : 'Use My Own Design') : (/^\d+$/.test(quoteSelections.design) ? `#${quoteSelections.design}` : quoteSelections.design);
        if (quoteSelections.alterDesign === 'Yes') designStr += (currentLang === 'ms' ? ' (Edit Mockup)' : ' (Edit Mockup)');

        let qtyDisplay = `${quoteSelections.quantity} ${currentLang === 'ms' ? 'helai' : 'pieces'}`;
        if (quoteSelections.isEstimatedQuantity) {
            qtyDisplay += ' (Estimated)';
        }
        document.getElementById('summaryDesign').innerText = designStr;
        document.getElementById('summaryQuantity').innerText = qtyDisplay;
        document.getElementById('summaryMaterial').innerText = quoteSelections.material;
        document.getElementById('summaryCutting').innerText = quoteSelections.cutting;
        document.getElementById('summarySleeve').innerText = quoteSelections.sleeve;
        document.getElementById('summaryNameset').innerText = quoteSelections.nameset;
        document.getElementById('summaryNeck').innerText = quoteSelections.neck;
    }
}

function nextStep() {
    if (currentQuoteStep === 1) {
        quoteSelections.alterDesign = document.querySelector('input[name="alterDesign"]:checked').value;
    }
    if (currentQuoteStep === 2) {
        const isEstimated = document.getElementById('qbQuantityNotSure').checked;
        const qtyVal = parseInt(document.getElementById('qbQuantity').value) || 0;
        if (qtyVal < configData.minimumOrderQuantity) {
            alert(`${currentLang === 'ms' ? 'Kuantiti minimum adalah' : 'Minimum order is'} ${configData.minimumOrderQuantity}`); return;
        }
        quoteSelections.quantity = qtyVal;
        quoteSelections.isEstimatedQuantity = isEstimated;
    }
    if (currentQuoteStep === 3) {
        if (!document.getElementById('qbMaterial').value) { alert(currentLang === 'ms' ? 'Sila pilih material' : 'Please select material'); return; }
        quoteSelections.material = document.getElementById('qbMaterial').value;
    }
    if (currentQuoteStep === 4) {
        if (!document.getElementById('qbCutting').value) { alert(currentLang === 'ms' ? 'Sila pilih cutting' : 'Please select cutting'); return; }
        quoteSelections.cutting = document.getElementById('qbCutting').value;
    }
    if (currentQuoteStep === 5) {
        if (!document.getElementById('qbNeck').value) { alert(currentLang === 'ms' ? 'Sila pilih kolar' : 'Please select neck'); return; }
        quoteSelections.neck = document.getElementById('qbNeck').value;
    }
    if (currentQuoteStep === 6) {
        const sleeveNotSure = document.getElementById('qbSleeveNotSure')?.checked;
        if (sleeveNotSure) {
            quoteSelections.sleeve = currentLang === 'ms' ? "Belum Pasti Lagi" : "Not Sure Yet";
            document.getElementById('sleeveError').style.display = 'none';
        } else {
            const totalQty = parseInt(quoteSelections.quantity);
            if (document.querySelector('input[name="sleeveShortOpt"][value="all"]').checked) {
                quoteSelections.sleeve = currentLang === 'ms' ? "Lengan Pendek (Semua)" : "Short Sleeve (All)";
            } else if (document.querySelector('input[name="sleeveLongOpt"][value="all"]').checked) {
                quoteSelections.sleeve = currentLang === 'ms' ? "Lengan Panjang (Semua)" : "Long Sleeve (All)";
            } else {
                const sQty = parseInt(document.getElementById('qbSleeveShortQty').value) || 0;
                const lQty = parseInt(document.getElementById('qbSleeveLongQty').value) || 0;

                if (quoteSelections.quantity !== "Not Sure Yet" && quoteSelections.quantity !== "Belum Pasti Lagi" && sQty + lQty !== totalQty) {
                    document.getElementById('sleeveError').style.display = 'block';
                    return;
                }
                document.getElementById('sleeveError').style.display = 'none';

                let sleeveStr = [];
                if (sQty > 0) sleeveStr.push(currentLang === 'ms' ? `Lengan Pendek (${sQty})` : `Short Sleeve (${sQty})`);
                if (lQty > 0) sleeveStr.push(currentLang === 'ms' ? `Lengan Panjang (${lQty})` : `Long Sleeve (${lQty})`);
                quoteSelections.sleeve = sleeveStr.join(', ') || (currentLang === 'ms' ? "Tiada konfigurasi lengan" : "No sleeve config selected");
            }
        }
    }
    if (currentQuoteStep === 7) {
        quoteSelections.nameset = document.querySelector('input[name="addNameset"]:checked').value;
    }

    currentQuoteStep++;
    updateQuoteStep();
}

function prevStep() {
    if (currentQuoteStep > 1) {
        currentQuoteStep--;
        updateQuoteStep();
    }
}

document.querySelectorAll('.qb-next').forEach((btn) => {
    btn.addEventListener('click', nextStep);
});
document.querySelectorAll('.qb-prev').forEach((btn) => {
    btn.addEventListener('click', prevStep);
});

// WhatsApp Generator
document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
    let designText = quoteSelections.design === 'Custom' || quoteSelections.design === 'For Your Own Design' 
        ? (currentLang === 'ms' ? 'Reka Bentuk Sendiri' : 'Use My Own Design') 
        : (/^\d+$/.test(quoteSelections.design) ? `#${quoteSelections.design}` : quoteSelections.design);
    if (quoteSelections.alterDesign === 'Yes') {
        designText += (currentLang === 'ms' ? ' (Edit Mockup)' : ' (Edit Mockup)');
    }

    // Format quantity text
    let qtyText = `${quoteSelections.quantity} ${currentLang === 'ms' ? 'helai' : 'pieces'}`;
    if (quoteSelections.isEstimatedQuantity) {
        qtyText += ' (Estimated)';
    }

    const greeting = i18nTranslations[currentLang]?.wa_greeting || "Hi ThirtyOne Lab! I'm interested in ordering:";
    const closing = i18nTranslations[currentLang]?.wa_closing || "Could I get a quotation for this order?";

    // SPEC LABELS STRICTLY STAY IN ENGLISH AS REQUESTED BY USER
    const message = `${greeting}

Design: ${designText}
Quantity: ${qtyText}
Material: ${quoteSelections.material}
Cutting: ${quoteSelections.cutting}
Neck/Collar: ${quoteSelections.neck}
Sleeve: ${quoteSelections.sleeve}
Nameset: ${quoteSelections.nameset}

${closing}`;

    const encoded = encodeURIComponent(message);
    const myWhatsAppNumber = "601125614436";
    window.open(`https://wa.me/${myWhatsAppNumber}?text=${encoded}`, '_blank');
});

// Init layout
updateCurrentCards(currentEdition);
displayPage(currentPage, false);

// Sleeve Table Logic
const sleeveShortAll = document.querySelector('input[name="sleeveShortOpt"][value="all"]');
const sleeveShortFill = document.querySelector('input[name="sleeveShortOpt"][value="fill"]');
const sleeveShortQty = document.getElementById('qbSleeveShortQty');

const sleeveLongAll = document.querySelector('input[name="sleeveLongOpt"][value="all"]');
const sleeveLongFill = document.querySelector('input[name="sleeveLongOpt"][value="fill"]');
const sleeveLongQty = document.getElementById('qbSleeveLongQty');

function updateSleeveState(event) {
    const sleeveNotSure = document.getElementById('qbSleeveNotSure');
    if (event && sleeveNotSure && sleeveNotSure.checked) {
        sleeveNotSure.checked = false;
    }

    // Uncheck quantity "Not sure yet" if Short or Long Sleeve "All" is selected
    if (sleeveShortAll.checked || sleeveLongAll.checked) {
        const qtyNotSure = document.getElementById('qbQuantityNotSure');
        if (qtyNotSure && qtyNotSure.checked) {
            qtyNotSure.checked = false;
            const qtyInput = document.getElementById('qbQuantity');
            qtyInput.disabled = false;
            qtyInput.style.opacity = '';
        }
    }

    // Handle mutual exclusivity of options
    if (sleeveShortAll.checked && event && (event.target === sleeveShortAll || event.target.name === 'sleeveShortOpt')) {
        sleeveLongAll.checked = false;
        sleeveLongFill.checked = false;
    } else if (sleeveLongAll.checked && event && (event.target === sleeveLongAll || event.target.name === 'sleeveLongOpt')) {
        sleeveShortAll.checked = false;
        sleeveShortFill.checked = false;
    } else if (sleeveShortFill.checked && event && event.target === sleeveShortFill) {
        sleeveLongFill.checked = true;
        sleeveLongAll.checked = false;
    } else if (sleeveLongFill.checked && event && event.target === sleeveLongFill) {
        sleeveShortFill.checked = true;
        sleeveShortAll.checked = false;
    }

    if (sleeveShortAll.checked) {
        sleeveShortQty.disabled = true;
        sleeveShortQty.value = '';

        sleeveLongAll.checked = false;
        sleeveLongFill.checked = false;
        sleeveLongQty.disabled = true;
        sleeveLongQty.value = '';
    } else if (sleeveLongAll.checked) {
        sleeveLongQty.disabled = true;
        sleeveLongQty.value = '';

        sleeveShortAll.checked = false;
        sleeveShortFill.checked = false;
        sleeveShortQty.disabled = true;
        sleeveShortQty.value = '';
    } else {
        // Both are Fill in
        sleeveShortQty.disabled = !sleeveShortFill.checked;
        if (!sleeveShortFill.checked) sleeveShortQty.value = '';
        sleeveLongQty.disabled = !sleeveLongFill.checked;
        if (!sleeveLongFill.checked) sleeveLongQty.value = '';
    }
}

document.querySelectorAll('input[name="sleeveShortOpt"], input[name="sleeveLongOpt"]').forEach(radio => {
    radio.addEventListener('change', updateSleeveState);
});
updateSleeveState();

// Sleeve Not Sure Event Listener
const sleeveNotSureElem = document.getElementById('qbSleeveNotSure');
if (sleeveNotSureElem) {
    sleeveNotSureElem.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('sleeveError').style.display = 'none';
            sleeveShortAll.checked = false;
            sleeveShortFill.checked = false;
            sleeveLongAll.checked = false;
            sleeveLongFill.checked = false;
            sleeveShortQty.disabled = true;
            sleeveShortQty.value = '';
            sleeveLongQty.disabled = true;
            sleeveLongQty.value = '';
        } else {
            sleeveShortAll.checked = true;
            updateSleeveState();
        }
    });
}

// Image protection (prevent right-click and drag on images except inside lightbox content)
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG' && !e.target.closest('.lightbox-content')) {
        e.preventDefault();
    }
}, false);

document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG' && !e.target.closest('.lightbox-content')) {
        e.preventDefault();
    }
}, false);

window.startCustomDesign = function() {
    currentRefNumber = 'For Your Own Design';
    if (typeof quoteSelectionsOwn !== 'undefined') {
        quoteSelectionsOwn.design = currentRefNumber;
        openQuoteBuilderOwn();
    } else {
        quoteSelections.design = currentRefNumber;
        openQuoteBuilder();
    }
};

window.filterByCategory = filterByCategory;

