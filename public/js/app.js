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
            })
            .catch(error => {
                contentDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    // Agregar eventos a los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // Evita que el enlace siga su comportamiento predeterminado
            const pageUrl = event.target.getAttribute('href');
            loadPage(pageUrl);
        });
    });

    // Cargar la página inicial
    loadPage('./pages/home.html');
});
