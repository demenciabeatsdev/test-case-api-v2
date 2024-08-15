document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

    // Función para cargar el contenido de una página
    function loadPage(pageUrl) {
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la página');
                }
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
                if (pageUrl.includes('levelsuite1.html')) {
                    loadLevelSuite1Script();  // Cargar y ejecutar script específico
                }
            })
            .catch(error => {
                contentDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    // Cargar la página inicial
    loadPage('./pages/home.html');

    // Agregar eventos a los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // Evita que el enlace siga su comportamiento predeterminado
            const pageUrl = event.target.getAttribute('href');
            loadPage(pageUrl);
        });
    });

    // Función para cargar y ejecutar el script de levelsuite1.js
    function loadLevelSuite1Script() {
        // Verificar si el script ya está cargado
        if (!document.querySelector('script[src="./js/levelsuite1.js"]')) {
            const script = document.createElement('script');
            script.src = './js/levelsuite1.js';
            script.onload = () => {
                console.log('Level Suite 1 script loaded and executed.');
                initializeLevelSuite1();  // Ejecutar la inicialización
            };
            document.body.appendChild(script);
        } else {
            console.log('Level Suite 1 script already loaded.');
            initializeLevelSuite1();  // Ejecutar la inicialización si ya está cargado
        }
    }
});
