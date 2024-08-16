document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

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
                    loadScript('levelsuite1', initializeLevelSuite1);
                } else if (pageUrl.includes('levelsuite2.html')) {
                    loadScript('levelsuite2', initializeLevelSuite2);
                } else if (pageUrl.includes('actions.html')) {
                    loadScript('actions', initializeAction);
                } else if (pageUrl.includes('expectedresults.html')) {
                    loadScript('expectedresults', initializeExpectedResults);
                } else if (pageUrl.includes('testcasecreate.html')) {
                    loadScript('testcasecreate', testCaseCreate);
                } else if (pageUrl.includes('exporttestcase.html')) {
                    loadScript('exporttestcase', initializeTestCaseFilter);
                }
            })
            .catch(error => {
                contentDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function loadScript(scriptName, callback) {
        const scriptPath = `./js/${scriptName}.js`;

        if (!document.querySelector(`script[src="${scriptPath}"]`)) {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                console.log(`${scriptName} script loaded.`);
                if (typeof callback === 'function') {
                    callback();
                }
            };
            document.body.appendChild(script);
        } else {
            console.log(`${scriptName} script already loaded.`);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    loadPage('./pages/home.html');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageUrl = event.target.getAttribute('href');
            loadPage(pageUrl);
        });
    });
});
