// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Filter posts
            blogPosts.forEach(post => {
                if (selectedCategory === 'all' || post.getAttribute('data-category') === selectedCategory) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeIn 0.5s ease';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortPosts');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const postsGrid = document.getElementById('postsGrid');
            const posts = Array.from(postsGrid.children);
            
            posts.sort((a, b) => {
                const dateA = new Date(a.querySelector('.date').textContent);
                const dateB = new Date(b.querySelector('.date').textContent);
                
                if (this.value === 'newest') {
                    return dateB - dateA;
                } else if (this.value === 'oldest') {
                    return dateA - dateB;
                } else if (this.value === 'popular') {
                    // Sort by read time as a proxy for popularity
                    const timeA = parseInt(a.querySelector('.read-time').textContent);
                    const timeB = parseInt(b.querySelector('.read-time').textContent);
                    return timeB - timeA;
                }
            });
            
            // Re-append sorted posts
            posts.forEach(post => postsGrid.appendChild(post));
        });
    }

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading more posts
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> All articles loaded';
                this.style.background = '#10b981';
                
                setTimeout(() => {
                    this.style.display = 'none';
                }, 1000);
            }, 1500);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    this.querySelector('input[type="email"]').value = '';
                }, 2000);
            }, 1000);
        });
    }

    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.featured-post, .newsletter-signup, .blog-post, .category-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click functionality to blog posts
    blogPosts.forEach(post => {
        post.addEventListener('click', function() {
            // Simulate opening a blog post
            const title = this.querySelector('h4').textContent;
            alert(`Opening: ${title}\n\n(This would normally navigate to the full article)`);
        });
    });
}); 