// Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load components with the data-component attribute
    const componentElements = document.querySelectorAll('[data-component]');
    
    componentElements.forEach(function(element) {
        const componentName = element.getAttribute('data-component');
        
        // Fetch the component HTML
        fetch(`components/${componentName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
                return response.text();
            })
            .then(html => {
                console.log(`Loading component: ${componentName}`);
                element.innerHTML = html;
                
                // Dispatch an event to notify that the component has been loaded
                const event = new CustomEvent('component-loaded', { 
                    detail: { componentName: componentName }
                });
                document.dispatchEvent(event);
                console.log(`Component loaded: ${componentName}`);
            })
            .catch(error => {
                console.error('Error loading component:', error);
            });
    });
});
