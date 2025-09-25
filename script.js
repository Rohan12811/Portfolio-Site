const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;

    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", current > 30);

    if (current > lastScroll && current > 120) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScroll = current;
});

const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("section[id]");

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const target = link.getAttribute("href");
        link.classList.toggle("is-active", target === "#" + id);
    });
};

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach((section) => observer.observe(section));
} else {
    const handleScroll = () => {
        let selectedId = null;
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35) {
                selectedId = section.id;
            }
        });

        if (selectedId) {
            setActiveLink(selectedId);
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

const projectCards = document.querySelectorAll('.project-card[data-project]');
const projectDetails = document.querySelectorAll('.project-detail[data-project]');
const detailMap = new Map();
projectDetails.forEach((detail) => {
    detailMap.set(detail.dataset.project, detail);
    if (!detail.classList.contains('is-active')) {
        detail.setAttribute('hidden', 'hidden');
    }
});

const activateProject = (projectId) => {
    if (!detailMap.has(projectId)) {
        return;
    }

    projectCards.forEach((card) => {
        const isActive = card.dataset.project === projectId;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    projectDetails.forEach((detail) => {
        const isActive = detail.dataset.project === projectId;
        detail.classList.toggle('is-active', isActive);
        detail.toggleAttribute('hidden', !isActive);
    });
};

if (projectCards.length && projectDetails.length) {
    const presetActive = document.querySelector('.project-card.is-active');
    const initialProject = (presetActive || projectCards[0]).dataset.project;
    activateProject(initialProject);

    projectCards.forEach((card) => {
        card.addEventListener('click', () => activateProject(card.dataset.project));
    });
}
