document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initPriceChart();
    initPriceCategoryDropdown();
    initContactForm();
});

// Navbar 
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    
    const sections = [];
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href !== '#') {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ id: href, element: section });
            }
        }
    });
    
    function updateActiveNavLink() {
        const navbarHeight = navbar.offsetHeight;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let currentSection = '';
        
        sections.forEach(({ id, element }) => {
            const sectionTop = element.offsetTop;
            const sectionBottom = sectionTop + element.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    updateActiveNavLink();

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Smooth Scrolling 
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations 
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.slideanim');
    
    function checkVisibility() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('slide');
            }
        });
    }
    
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

// Price Chart using D3.js
const priceDataByCategory = {
    adult: [
        { name: 'Istralandia', price: 36, location: 'Istra', color: '#156EA1' },
        { name: 'Aquacolors Poreč', price: 36, location: 'Istra', color: '#1a7ab5' },
        { name: 'Aquapark Dalmatia', price: 30, location: 'Dalmacija', color: '#2088c3' },
        { name: 'Aquapark Čikat', price: 20, location: 'Kvarner', color: '#2896d1' },
        { name: 'Aquapark Martilandia', price: 18, location: 'Istra', color: '#3397d0' },
        { name: 'Aquapark Dalmaland', price: 31, location: 'Dalmacija', color: '#4aa3d8' }
    ],
    child: [
        { name: 'Istralandia', price: 29, location: 'Istra', color: '#156EA1' },
        { name: 'Aquacolors Poreč', price: 29, location: 'Istra', color: '#1a7ab5' },
        { name: 'Aquapark Dalmatia', price: 15, location: 'Dalmacija', color: '#2088c3' },
        { name: 'Aquapark Čikat', price: 15, location: 'Kvarner', color: '#2896d1' },
        { name: 'Aquapark Martilandia', price: 12, location: 'Istra', color: '#3397d0' },
        { name: 'Aquapark Dalmaland', price: 26, location: 'Dalmacija', color: '#4aa3d8' }
    ],
    senior: [
        { name: 'Istralandia', price: 29, location: 'Istra', color: '#156EA1' },
        { name: 'Aquacolors Poreč', price: 29, location: 'Istra', color: '#1a7ab5' },
        { name: 'Aquapark Dalmatia', price: 15, location: 'Dalmacija', color: '#2088c3' },
        { name: 'Aquapark Čikat', price: 15, location: 'Kvarner', color: '#2896d1' },
        { name: 'Aquapark Martilandia', price: 14, location: 'Istra', color: '#3397d0' },
        { name: 'Aquapark Dalmaland', price: 26, location: 'Dalmacija', color: '#4aa3d8' }
    ],
    family: [
        { name: 'Istralandia', price: 130, location: 'Istra', color: '#156EA1' },
        { name: 'Aquacolors Poreč', price: 130, location: 'Istra', color: '#1a7ab5' },
        { name: 'Aquapark Dalmatia', price: 60, location: 'Dalmacija', color: '#2088c3' },
        { name: 'Aquapark Čikat', price: 50, location: 'Kvarner', color: '#2896d1' },
        { name: 'Aquapark Martilandia', price: 42, location: 'Istra', color: '#3397d0' },
        { name: 'Aquapark Dalmaland', price: 83, location: 'Dalmacija', color: '#4aa3d8' }
    ]
};

let aquaparkData = priceDataByCategory.adult;
let currentChartType = 'bar';
let currentCategory = 'adult';

function initPriceChart() {
    createBarChart();
    
    document.querySelectorAll('.chart-controls button').forEach(button => {
        button.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            
            document.querySelectorAll('.chart-controls button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            currentChartType = chartType;
            if (chartType === 'bar') {
                createBarChart();
            } else {
                createPieChart();
            }
        });
    });
    
    window.addEventListener('resize', debounce(function() {
        if (currentChartType === 'bar') {
            createBarChart();
        } else {
            createPieChart();
        }
    }, 250));
}

function createBarChart() {
    d3.select('#priceChart').html('');
    
    const container = document.getElementById('priceChart');
    const containerWidth = container.offsetWidth;
    
    const margin = { top: 40, right: 30, bottom: 100, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const sortedData = [...aquaparkData].sort((a, b) => b.price - a.price);
    
    const svg = d3.select('#priceChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0);
    
    const x = d3.scaleBand()
        .range([0, width])
        .domain(sortedData.map(d => d.name))
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.price) + 5])
        .range([height, 0]);
    
    const defs = svg.append('defs');
    
    sortedData.forEach((d, i) => {
        const gradient = defs.append('linearGradient')
            .attr('id', `gradient-${i}`)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#3397d0');
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#156EA1');
    });
    
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-family', 'Lato, sans-serif');
    
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '€'))
        .selectAll('text')
        .style('font-size', '12px')
        .style('font-family', 'Lato, sans-serif');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-family', 'Montserrat, sans-serif')
        .text('Cijena ulaznice (€)');
    
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat('')
        )
        .style('stroke-dasharray', '3,3')
        .style('opacity', 0.3);
    
    svg.selectAll('.bar')
        .data(sortedData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', (d, i) => `url(#gradient-${i})`)
        .attr('rx', 5)
        .attr('ry', 5)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.8);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            
            tooltip.html(`<strong>${d.name}</strong><br/>Cijena: ${d.price}€<br/>Regija: ${d.location}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.price))
        .attr('height', d => height - y(d.price));
    
    svg.selectAll('.bar-label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.price) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#156EA1')
        .style('opacity', 0)
        .text(d => d.price + '€')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 1);
}

function createPieChart() {
    d3.select('#priceChart').html('');
    
    const container = document.getElementById('priceChart');
    const containerWidth = container.offsetWidth;
    
    const width = Math.min(containerWidth, 500);
    const height = 350;
    const radius = Math.min(width, height) / 2 - 40;
    
    const sortedData = [...aquaparkData].sort((a, b) => b.price - a.price);
    
    const svg = d3.select('#priceChart')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', height + 180)
        .append('g')
        .attr('transform', `translate(${containerWidth / 2},${height / 2})`);
    
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0);
    
    const colorRange = ['#0d4a6e', '#156EA1', '#1a7ab5', '#2088c3', '#2896d1', '#4aa3d8'];
    const color = d3.scaleOrdinal()
        .domain(sortedData.map(d => d.name))
        .range(colorRange);
    
    const pie = d3.pie()
        .value(d => d.price)
        .sort(null);
       
    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius);
    
    const arcHover = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius + 10);
    
    const labelArc = d3.arc()
        .innerRadius(radius * 0.75)
        .outerRadius(radius * 0.75);
    
    const slices = svg.selectAll('.slice')
        .data(pie(sortedData))
        .enter()
        .append('g')
        .attr('class', 'slice');
    
    slices.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.name))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arcHover);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            
            tooltip.html(`<strong>${d.data.name}</strong><br/>Cijena: ${d.data.price}€<br/>Regija: ${d.data.location}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arc);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .style('opacity', 1)
        .attrTween('d', function(d) {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
                return arc(interpolate(t));
            };
        });
    
    slices.append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .style('opacity', 0)
        .text(d => d.data.price + '€')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 1);
    
    const legend = svg.selectAll('.legend')
        .data(sortedData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
            const itemsPerRow = Math.max(1, Math.floor(containerWidth / 200));
            const row = Math.floor(i / itemsPerRow);
            const col = i % itemsPerRow;
            const xPos = col * (containerWidth / itemsPerRow) - containerWidth / 2 + 50;
            const yPos = radius + 80 + (row * 30);
            return `translate(${xPos}, ${yPos})`;
        });
    
    legend.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('rx', 3)
        .attr('fill', d => color(d.name));
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 14)
        .style('font-size', '12px')
        .style('font-family', 'Lato, sans-serif')
        .text(d => d.name);
}

// Price Category Dropdown
function initPriceCategoryDropdown() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const chartContainer = document.getElementById('priceChart');
    
    if (!categoryButtons.length) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            if (category === currentCategory) return;
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            chartContainer.classList.add('fade-out');
            
            setTimeout(() => {
                currentCategory = category;
                aquaparkData = priceDataByCategory[currentCategory];
                
                if (currentChartType === 'bar') {
                    createBarChart();
                } else {
                    createPieChart();
                }
                
                chartContainer.classList.remove('fade-out');
                chartContainer.classList.add('fade-in');
            }, 300);
        });
    });
}

// Contact 
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            showNotification('Molimo ispunite sva obavezna polja.', 'error');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Šaljem...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Hvala vam! Vaša poruka je uspješno poslana.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Utility Functions
function showNotification(message, type) {

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// Interactive Park Cards
document.querySelectorAll('.park-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Newsletter 
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    
    if (emailInput.value) {
        showNotification('Uspješno ste se prijavili na newsletter!', 'success');
        emailInput.value = '';
    }
});

// Back to top button
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Akvaparkovi u Hrvatskoj - Website loaded successfully!');
