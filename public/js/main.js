
// Seleccionamos todas las secciones con animaciones
const sections = document.querySelectorAll('.section');

// Función que maneja las animaciones
function triggerAnimation(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('unset'); // Aplicar la clase 'unset' cuando la sección es visible
        } else {
            entry.target.classList.remove('unset'); // Remover la clase 'unset' cuando la sección no es visible
        }
    });
}

// Configuración del IntersectionObserver
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0 // Se activa cuando el 50% del elemento es visible
};

// Creamos el observador
const observer = new IntersectionObserver(triggerAnimation, observerOptions);

// Observamos cada sección con la animación
sections.forEach(section => {
    observer.observe(section);
});
