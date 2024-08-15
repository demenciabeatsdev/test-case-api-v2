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
                    loadScript('levelsuite1', initializeLevelSuite1);  // Cargar y ejecutar script específico
                } else if (pageUrl.includes('levelsuite2.html')) {
                    loadScript('levelsuite2', initializeLevelSuite2);  // Cargar y ejecutar script específico                
                } else if (pageUrl.includes('actions.html')) {
                    loadScript('actions', initializeAction);  // Cargar y ejecutar script específico
                } else if (pageUrl.includes('expectedresults.html')) {
                    loadScript('expectedresults', initializeExpectedResults);  // Cargar y ejecutar script específico
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

    // Función para cargar y ejecutar un script dado su nombre
    function loadScript(scriptName, callback) {
        const scriptPath = `./js/${scriptName}.js`;
        
        // Verificar si el script ya está cargado
        if (!document.querySelector(`script[src="${scriptPath}"]`)) {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                console.log(`${scriptName} script loaded and executed.`);
                if (typeof callback === 'function') {
                    callback();  // Ejecutar la inicialización si hay un callback proporcionado
                }
            };
            document.body.appendChild(script);
        } else {
            console.log(`${scriptName} script already loaded.`);
            if (typeof callback === 'function') {
                callback();  // Ejecutar la inicialización si el script ya está cargado
            }
        }
    }
});
