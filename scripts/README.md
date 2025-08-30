# 🤖 Automated Webflow Asset Extractor

A powerful browser script that automatically finds, downloads, and inventories **ALL** images from any Webflow site, including background images and responsive variants.

## 🚀 Quick Start Instructions

### Step 1: Navigate to Your Webflow Site
Go to your live Webflow site (e.g., `yoursite.webflow.io`)

### Step 2: Open Browser Console
- **Chrome/Edge**: Press `F12` → Click `Console` tab
- **Firefox**: Press `F12` → Click `Console` tab  
- **Safari**: Press `Cmd+Option+C`

### Step 3: Load the Script
1. Open `scripts/download-webflow-assets.js`
2. Copy the entire script content
3. Paste it into the browser console
4. Press `Enter`

### Step 4: Extract Assets
Run these commands in the console:

```javascript
// Download all images from current page
downloadAllImages()


// (Optional) View summary of found images
showImageSummary()
```

## 📋 What the Script Does

### 🔍 **Comprehensive Image Detection**
- **Regular `<img>` tags** - Standard image elements
- **Responsive images** - Extracts all variants from `srcset` attributes
- **CSS background images** - From inline styles and stylesheets
- **Webflow-specific images** - Background videos, lightbox images, data attributes

### ⬇️ **Automatic Downloads**
- Downloads all found images to your `Downloads` folder
- Adds `webflow-` prefix to prevent naming conflicts
- Handles relative URLs and converts to absolute paths
- Shows real-time progress in console

### 📊 **CSV Inventory Creation**
Creates a detailed spreadsheet with:
- **URL** - Original image source
- **Type** - How the image was found (img-tag, background-image, etc.)
- **Alt Text** - Accessibility text or description
- **Element** - HTML element or CSS selector where found
- **Filename** - Downloaded filename

## 🎯 Page-by-Page Workflow

Since you want to migrate **one page at a time**, follow this process:

### For Each Page:
1. **Navigate** to the specific Webflow page
2. **Run the script** (paste once per page)
3. **Execute commands**:
   ```javascript
   downloadAllImages()
   exportImageList()
   ```
4. **Organize assets** - Move downloaded images to your project structure
5. **Repeat** for next page

### Recommended Page Order:
1. **Homepage** - Usually has the most shared assets
2. **About/Services** - Core content pages
3. **Gallery/Portfolio** - Image-heavy pages
4. **Contact/Other** - Remaining pages

## 📁 Organizing Downloaded Assets

After downloading, move images into your project structure:

```
public/images/
├── homepage/
├── about/
├── services/
├── gallery/
├── shared/          # Images used across multiple pages
└── backgrounds/     # Background images and hero images
```

## 🛠️ Advanced Usage

### View Found Images Before Downloading
```javascript
// Load the script first, then:
findAllImageSources()  // Scan without downloading
showImageSummary()     // View what was found
```

### Download Specific Image Types
The script categorizes images as:
- `img-tag` - Regular HTML images
- `srcset` - Responsive image variants
- `background-image` - CSS background images
- `css-background` - Stylesheet background images
- `webflow-background` - Webflow-specific backgrounds

## 🔧 Troubleshooting

### No Images Found
- Check if page has fully loaded
- Try scrolling to load lazy-loaded images
- Some images might be loaded dynamically

### Download Blocked
- Browser might block multiple downloads
- Allow downloads when prompted
- Try downloading in smaller batches

### CORS Errors
- External stylesheets may be inaccessible
- This is normal and won't affect most images
- Script will skip and continue

### Missing Images
- Some images might be loaded via JavaScript
- Try interacting with the page (hover, click) to trigger loading
- Re-run the script after interactions

## 📈 Expected Results

### Typical Webflow Page Yields:
- **Homepage**: 15-30 images
- **Gallery Page**: 20-50+ images  
- **About Page**: 5-15 images
- **Contact Page**: 3-10 images

### File Types Detected:
- JPG/JPEG, PNG, WebP, AVIF
- SVG icons and graphics
- GIF animations
- Background images and hero banners

## 🎉 Next Steps

Once you have assets downloaded:

1. **Review CSV inventory** - Understand what assets you have
2. **Organize by page/section** - Group related images
3. **Optimize if needed** - Compress large images
4. **Update file paths** - Reference new locations in your code
5. **Test thoroughly** - Ensure all images display correctly

## 💡 Pro Tips

- **Run on live site** - Not the Webflow designer
- **One page at a time** - Easier to organize and track
- **Check mobile views** - Some images only appear on mobile
- **Save CSV files** - Keep inventory for reference
- **Backup originals** - Keep downloaded files as backup

---

**Ready to start?** Navigate to your first Webflow page and run the script!
