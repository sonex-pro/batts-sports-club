/**
 * 🤖 Automated Webflow Asset Extractor
 * 
 * A powerful browser script that automatically finds, downloads, and inventories
 * ALL images from any Webflow site, including background images and responsive variants.
 * 
 * Usage:
 * 1. Go to your live Webflow site (yoursite.webflow.io)
 * 2. Open browser console (F12 → Console tab)
 * 3. Copy and paste this entire script
 * 4. Run: downloadAllImages()
 */

// Global variables to store found assets
let foundImages = [];
let downloadedCount = 0;

/**
 * Main function to find and download all images on the current page
 */
function downloadAllImages() {
    console.log('🚀 Starting Webflow Asset Extraction...');
    
    // Clear previous results
    foundImages = [];
    downloadedCount = 0;
    
    // Find all image sources
    findAllImageSources();
    
    // Remove duplicates
    const uniqueImages = [...new Set(foundImages)];
    foundImages = uniqueImages;
    
    console.log(`📊 Found ${foundImages.length} unique images`);
    
    if (foundImages.length === 0) {
        console.log('❌ No images found on this page');
        return;
    }
    
    // Start downloading
    console.log('⬇️ Starting downloads...');
    downloadImages();
}

/**
 * Comprehensive image source detection
 */
function findAllImageSources() {
    console.log('🔍 Scanning for images...');
    
    // 1. Regular <img> tags
    const imgTags = document.querySelectorAll('img');
    imgTags.forEach(img => {
        if (img.src && !img.src.startsWith('data:') && !isFavicon(img.src)) {
            foundImages.push({
                url: img.src,
                type: 'img-tag',
                alt: img.alt || 'No alt text',
                element: img.outerHTML.substring(0, 100) + '...'
            });
        }
        
        // Check srcset for responsive images
        if (img.srcset) {
            const srcsetUrls = parseSrcset(img.srcset);
            srcsetUrls.forEach(url => {
                if (!isFavicon(url)) {
                    foundImages.push({
                        url: url,
                        type: 'srcset',
                        alt: img.alt || 'No alt text',
                        element: img.outerHTML.substring(0, 100) + '...'
                    });
                }
            });
        }
    });
    
    // 2. Background images from CSS
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
            const urls = extractUrlsFromCss(backgroundImage);
            urls.forEach(url => {
                if (!url.startsWith('data:') && !isFavicon(url)) {
                    foundImages.push({
                        url: url,
                        type: 'background-image',
                        alt: element.getAttribute('alt') || element.getAttribute('title') || 'Background image',
                        element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : '')
                    });
                }
            });
        }
    });
    
    // 3. CSS background images from stylesheets
    findCssBackgroundImages();
    
    // 4. Webflow-specific image detection
    findWebflowImages();
    
    console.log(`✅ Scan complete. Found ${foundImages.length} image references`);
}

/**
 * Parse srcset attribute to extract URLs
 */
function parseSrcset(srcset) {
    return srcset.split(',')
        .map(src => src.trim().split(' ')[0])
        .filter(url => url && !url.startsWith('data:'));
}

/**
 * Extract URLs from CSS background-image property
 */
function extractUrlsFromCss(cssValue) {
    const urlRegex = /url\(['"]?([^'"]*?)['"]?\)/g;
    const urls = [];
    let match;
    
    while ((match = urlRegex.exec(cssValue)) !== null) {
        urls.push(match[1]);
    }
    
    return urls;
}

/**
 * Find background images defined in CSS stylesheets
 */
function findCssBackgroundImages() {
    try {
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(stylesheet => {
            try {
                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                
                rules.forEach(rule => {
                    if (rule.style && rule.style.backgroundImage) {
                        const urls = extractUrlsFromCss(rule.style.backgroundImage);
                        urls.forEach(url => {
                            if (!url.startsWith('data:')) {
                                foundImages.push({
                                    url: url,
                                    type: 'css-background',
                                    alt: 'CSS background image',
                                    element: rule.selectorText || 'Unknown selector'
                                });
                            }
                        });
                    }
                });
            } catch (e) {
                // Skip stylesheets that can't be accessed (CORS)
                console.log('⚠️ Skipped external stylesheet (CORS)');
            }
        });
    } catch (e) {
        console.log('⚠️ Error scanning CSS stylesheets:', e.message);
    }
}

/**
 * Webflow-specific image detection
 */
function findWebflowImages() {
    // Webflow often uses data attributes and specific classes
    const webflowSelectors = [
        '[data-w-id]',
        '.w-background-video',
        '.w-lightbox-img',
        '[style*="background-image"]'
    ];
    
    webflowSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Check for inline background images
                const style = element.getAttribute('style');
                if (style && style.includes('background-image')) {
                    const urls = extractUrlsFromCss(style);
                    urls.forEach(url => {
                        if (!url.startsWith('data:')) {
                            foundImages.push({
                                url: url,
                                type: 'webflow-background',
                                alt: element.getAttribute('alt') || 'Webflow background',
                                element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : '')
                            });
                        }
                    });
                }
            });
        } catch (e) {
            console.log('⚠️ Error with Webflow selector:', selector);
        }
    });
}

/**
 * Download all found images
 */
function downloadImages() {
    let delay = 0;
    
    foundImages.forEach((imageData, index) => {
        setTimeout(() => {
            downloadImage(imageData.url, index + 1);
        }, delay);
        
        // Add small delay between downloads to avoid overwhelming the browser
        delay += 200;
    });
}

/**
 * Download a single image
 */
async function downloadImage(url, index) {
    try {
        // Convert relative URLs to absolute
        const absoluteUrl = new URL(url, window.location.href).href;
        
        // Extract filename
        const urlObj = new URL(absoluteUrl);
        let filename = urlObj.pathname.split('/').pop();
        
        // If no filename or extension, generate one
        if (!filename || !filename.includes('.')) {
            const extension = getImageExtension(absoluteUrl) || 'jpg';
            filename = `webflow-image-${index}.${extension}`;
        }
        
        // Add prefix to avoid naming conflicts
        filename = `webflow-${filename}`;
        
        // Fetch the actual image data
        console.log(`⬇️ Downloading (${index}/${foundImages.length}): ${filename}`);
        
        const response = await fetch(absoluteUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Create download link with blob data
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(blobUrl);
        
        downloadedCount++;
        console.log(`✅ Saved (${downloadedCount}/${foundImages.length}): ${filename}`);
        
        // Update progress
        if (downloadedCount === foundImages.length) {
            console.log('🎉 All images downloaded and saved locally!');
            console.log('📁 Check your Downloads folder for the actual image files');
            console.log('💡 Run exportImageList() to create a CSV inventory');
            console.log('🔒 These files are now yours - independent of Webflow hosting');
        }
        
    } catch (error) {
        console.error(`❌ Failed to download ${url}:`, error.message);
        downloadedCount++;
    }
}

/**
 * Check if URL is a favicon
 */
function isFavicon(url) {
    const faviconPatterns = [
        'favicon.ico',
        'favicon.png',
        'favicon.svg',
        'apple-touch-icon',
        'android-chrome',
        'mstile-',
        'browserconfig.xml'
    ];
    
    const urlLower = url.toLowerCase();
    return faviconPatterns.some(pattern => urlLower.includes(pattern));
}

/**
 * Try to determine image extension from URL
 */
function getImageExtension(url) {
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'];
    const urlLower = url.toLowerCase();
    
    for (const ext of extensions) {
        if (urlLower.includes(`.${ext}`)) {
            return ext;
        }
    }
    
    return null;
}

/**
 * Export the image list as a CSV file
 */
function exportImageList() {
    if (foundImages.length === 0) {
        console.log('❌ No images found. Run downloadAllImages() first.');
        return;
    }
    
    console.log('📊 Creating CSV inventory...');
    
    // Create CSV content
    const headers = ['URL', 'Type', 'Alt Text', 'Element', 'Filename'];
    const csvRows = [headers.join(',')];
    
    foundImages.forEach((imageData, index) => {
        const urlObj = new URL(imageData.url, window.location.href);
        let filename = urlObj.pathname.split('/').pop();
        
        if (!filename || !filename.includes('.')) {
            const extension = getImageExtension(imageData.url) || 'jpg';
            filename = `webflow-image-${index + 1}.${extension}`;
        } else {
            filename = `webflow-${filename}`;
        }
        
        const row = [
            `"${imageData.url}"`,
            `"${imageData.type}"`,
            `"${imageData.alt.replace(/"/g, '""')}"`,
            `"${imageData.element.replace(/"/g, '""')}"`,
            `"${filename}"`
        ];
        
        csvRows.push(row.join(','));
    });
    
    // Create and download CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `webflow-assets-${window.location.hostname}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    
    console.log('✅ CSV inventory exported!');
    console.log(`📄 File: webflow-assets-${window.location.hostname}-${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Show summary of found images
 */
function showImageSummary() {
    if (foundImages.length === 0) {
        console.log('❌ No images found. Run downloadAllImages() first.');
        return;
    }
    
    console.log('\n📊 IMAGE SUMMARY');
    console.log('================');
    console.log(`Total images found: ${foundImages.length}`);
    
    // Group by type
    const typeGroups = {};
    foundImages.forEach(img => {
        typeGroups[img.type] = (typeGroups[img.type] || 0) + 1;
    });
    
    console.log('\nBy type:');
    Object.entries(typeGroups).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });
    
    console.log('\nFirst 10 images:');
    foundImages.slice(0, 10).forEach((img, index) => {
        console.log(`  ${index + 1}. ${img.url} (${img.type})`);
    });
    
    if (foundImages.length > 10) {
        console.log(`  ... and ${foundImages.length - 10} more`);
    }
}

// Helper functions for easy access
window.downloadAllImages = downloadAllImages;
window.exportImageList = exportImageList;
window.showImageSummary = showImageSummary;

// Welcome message
console.log(`
🤖 WEBFLOW ASSET EXTRACTOR LOADED
==================================

Quick Start:
1. downloadAllImages()     - Find and download all images
2. exportImageList()       - Create CSV inventory
3. showImageSummary()      - View found images summary

Ready to extract assets from: ${window.location.href}
`);
