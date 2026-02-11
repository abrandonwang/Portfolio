// Three.js Background Animation
let scene, camera, renderer, particles;

/*function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(posArray, 3)
    );
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xa855f7, // Purple for light mode
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    animate();
}
    */
/*
function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0005;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}*/

/*window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});*/

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update particle color based on theme
    if (particles) {
        particles.material.color.setHex(newTheme === 'dark' ? 0x22c55e : 0xa855f7); // Green for dark, purple for light
    }
});

// Dev Tools Button
const devToolsBtn = document.getElementById('dev-tools');
devToolsBtn.addEventListener('click', () => {
    console.log('Developer Tools - Portfolio by Brandon Wang');
    console.log('Built with Three.js, vanilla JavaScript');
    console.log('Theme:', document.documentElement.getAttribute('data-theme'));
    alert('Developer Tools\n\nCheck the console for more info!');
});

// Gallery Navigation - Horizontal Scroll with smooth momentum
const gallery = document.querySelector('.gallery');
const galleryItems = document.querySelectorAll('.gallery-item');


// Touch/Swipe support for gallery on mobile
let touchStartX = 0;
let touchStartScrollLeft = 0;

gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScrollLeft = gallery.scrollLeft;
});

gallery.addEventListener('touchmove', (e) => {
    if (!touchStartX) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    gallery.scrollLeft = touchStartScrollLeft + diff;
});

gallery.addEventListener('touchend', (e) => {
    touchStartX = 0;
});

// Project Modal
const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
let activeCard = null;
let isAnimating = false;

const projectData = [
    /*{
        title: 'Apple',
        type: 'Internship',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop',
        description: 'I interned at Apple as a Product Design Prototyper, working on AI wearable devices. Using Unity and C#, I built rapid prototypes that were demoed to Alex Himel, VP of AR, and Mark Zuckerberg, CEO.',
        detailImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop'
    },
    {
        title: 'Doji',
        type: 'Internship',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop',
        description: 'Contributed to building modern web applications with a focus on performance and user experience. Collaborated with a talented team to deliver high-quality products.',
        detailImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop'
    },*/
    {
        title: 'navigational keyboard',
        type: 'class project',
        year: '2024',
        image: 'images/navkeyboard.png',
        description: 'For DTC 1, I built a navigational keyboard that allows users with cerebral palsy to type using a joystick. It was published to the chrome web store and is currently being used by <a href = "https://www.misericordia.com/">Misericordia.</a> It was also featured in the Northwestern Daily and on the DTC website.',
        detailImage: 'images/navkeyboard.png',
        description1: 'features:',
        detailImage1: 'images/nav1keyboard.png'
    },
    {
        title: 'algorithm visualizer',
        type: 'side project',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop',
        description: 'In my second project, I built an algorithm visualizer using basic web dev languages. It visualizes sorting algorithms i.e. quicksort, mergesort and includes pseudocode that highlights the current operation being executed.',
        detailImage: 'images/alg1visual.png',
        description1: 'I also including two searching algs: linear and binary with a speed and array size configuration implemented.',
        detailImage1: 'images/alg2visual.png'
    },
    {
        title: 'password generator',
        type: 'first project',
        year: '2024',
        image: 'images/passwordpic.png',
        description: 'In my first project, I built a password generator using basic web dev languages. It generates strong passwords based on user-selected length and includes a web-based strength checking algorithm.',
        detailImage: 'images/passwordpic.png',
        description1: 'features:',
        detailImage1: 'images/password1pic.png'
    },
    {
        title: 'personal website',
        type: 'side project',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
        description: 'In summer 2024, I built a Three.js personal website: <a href="https://brandonwang.work" target="_blank">brandonwang.work</a>',
        detailImage: 'images/portfolio1pic.png',
        description1: 'This was my first prototype:',
        detailImage1: 'images/oldporfolio.png'
    }
];

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openModal(index);
    });
});

function openModal(index) {
    const project = projectData[index];
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title">${project.title}</h1>
            <h2 class="modal-subtitle">${project.type}</h2>
            <span class="modal-year">${project.year}</span>
        </div>
        
        <p class="modal-description">${project.description}</p>
        
        <img src="${project.detailImage}" alt="${project.title}" class="modal-image">
        ${project.description1 ? `<p class="modal-description1">${project.description1}</p>` : ''}
        ${project.detailImage1 ? `<img src="${project.detailImage1}" alt="${project.title}" class="modal-image">` : ''}
    `;
    
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});




// Chat Functionality
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

// Simple responses for the AI chat (placeholder)
const responses = [
    "That's a great question! I'm passionate about building software that makes a real difference in people's lives.",
    "I love working on challenging problems and learning new technologies. It's what drives me every day.",
    "My experience at Apple, Doji, Meta, and Things has taught me so much about building scalable, user-friendly applications.",
    "I'm currently studying Computer Science at Northwestern University and always looking for new opportunities to grow.",
    "Feel free to check out my work on GitHub or reach out via email. I'd love to connect!",
    "Technology has the power to shape our future in incredible ways. I'm excited to be part of that journey.",
    "I believe in writing clean, maintainable code and creating delightful user experiences.",
    "Collaboration and continuous learning are key to success in software engineering."
];

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, false);
        }, 1000);
    }
}

chatSend.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Parallax effect on scroll
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    if (particles) {
        particles.rotation.y = scrollY * 0.0005;
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.work-section, .chat-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

console.log('loaded successfully');
console.log('Built with Three.js');