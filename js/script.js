// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loader while page loads
    const loader = document.createElement('div');
    loader.classList.add('loader');
    const loaderCircle = document.createElement('div');
    loaderCircle.classList.add('loader-circle');
    loader.appendChild(loaderCircle);
    document.body.appendChild(loader);
    
    // Hide loader after page has loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.remove();
            }, 500);
        }, 800);
    });
    
    // Add fade-in classes to elements
    const fadeElements = document.querySelectorAll('.hero h1, .hero p, .roadmap-item, .process-step, .point-item');
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.classList.add(`delay-${(index % 5) + 1}00`);
    });
    
    // Add blur-hover to comparison items
    const comparisonContainers = document.querySelectorAll('.neural-comparison, .chart-container');
    comparisonContainers.forEach(container => {
        container.classList.add('blur-container');
        const children = container.querySelectorAll('.comparison-item, .chart-column');
        children.forEach(child => {
            child.classList.add('blur-hover');
        });
    });
    
    // Add glow effect to specific elements
    const glowElements = document.querySelectorAll('.visual-content, .process-step, .chart-column.highlight');
    glowElements.forEach(el => {
        el.classList.add('glow-on-hover');
    });
    
    // Timeline animation
    const initTimeline = () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Add sequential animation delay to timeline items
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.15}s`;
            item.classList.add('fade-in');
            
            // Add hover event listeners
            item.addEventListener('mouseenter', () => {
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.add('dimmed');
                    }
                });
            });
            
            item.addEventListener('mouseleave', () => {
                timelineItems.forEach(otherItem => {
                    otherItem.classList.remove('dimmed');
                });
            });
        });
    };
    
    // Initialize timeline once it's in view
    const timelineSection = document.getElementById('ai-evolution');
    if (timelineSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initTimeline();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(timelineSection);
    }
    
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.section');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check on page load
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Add styling to the active section in navigation
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroContainer = document.querySelector('.hero');
        if (heroContainer) {
            heroContainer.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            heroContainer.style.opacity = 1 - (scrollPosition * 0.002);
        }
    });
    
    // Initialize Economics of AI section 
    const initEconomicsSection = () => {
        const implicationItems = document.querySelectorAll('.implication-item');
        
        // Add hover interactions for implication items
        implicationItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                implicationItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.6';
                    }
                });
            });
            
            item.addEventListener('mouseleave', () => {
                implicationItems.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                });
            });
        });
        
        // Add animation for the compute cost chart image
        const computeChartImage = document.querySelector('.compute-chart-image');
        if (computeChartImage) {
            computeChartImage.classList.add('fade-in');
            computeChartImage.style.animationDelay = '0.3s';
        }
    };
    
    // Initialize economics section once it's in view
    const economicsSection = document.getElementById('ai-economics');
    if (economicsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initEconomicsSection();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(economicsSection);
    }
    
    // Initialize definitions section functionality
    const initDefinitionsSection = () => {
        const definitionCards = document.querySelectorAll('.definition-card');
        const legendItems = document.querySelectorAll('.legend-item');
        
        // Add hover interactions for definition cards
        definitionCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            
            card.addEventListener('mouseenter', () => {
                // Highlight cards of the same category
                definitionCards.forEach(otherCard => {
                    if (otherCard.getAttribute('data-category') === category) {
                        otherCard.style.transform = 'translateY(-8px)';
                        otherCard.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.3)';
                        otherCard.style.zIndex = '1';
                    } else {
                        otherCard.style.opacity = '0.6';
                    }
                });
                
                // Highlight the corresponding legend item
                legendItems.forEach(item => {
                    if (item.getAttribute('data-category') === category) {
                        item.style.fontWeight = 'bold';
                    }
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset all cards
                definitionCards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                    otherCard.style.transform = '';
                    otherCard.style.boxShadow = '';
                    otherCard.style.zIndex = '';
                });
                
                // Reset legend items
                legendItems.forEach(item => {
                    item.style.fontWeight = '';
                });
            });
        });
        
        // Add interactions for legend items
        legendItems.forEach((item) => {
            const category = item.getAttribute('data-category');
            
            item.addEventListener('mouseenter', () => {
                // Highlight cards of the same category
                definitionCards.forEach(card => {
                    if (card.getAttribute('data-category') === category) {
                        card.style.transform = 'translateY(-8px)';
                        card.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.3)';
                        card.style.zIndex = '1';
                    } else {
                        card.style.opacity = '0.6';
                    }
                });
                
                item.style.fontWeight = 'bold';
            });
            
            item.addEventListener('mouseleave', () => {
                // Reset all cards
                definitionCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                    card.style.zIndex = '';
                });
                
                item.style.fontWeight = '';
            });
        });
        
        // Add animation for the definitions image
        const definitionsImage = document.querySelector('.definitions-image');
        if (definitionsImage) {
            definitionsImage.classList.add('fade-in');
            definitionsImage.style.animationDelay = '0.3s';
        }
    };
    
    // Initialize definitions section once it's in view
    const definitionsSection = document.getElementById('ai-definitions');
    if (definitionsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initDefinitionsSection();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(definitionsSection);
    }
}); 