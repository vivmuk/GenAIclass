# How to Run the GenAI Tutorial Website

This is a simple guide to help you run the Generative AI tutorial website on your computer.

## Option 1: Open Directly in Browser (Simplest)

1. Navigate to the `genai-tutorial` folder on your computer
2. Double-click on the `index.html` file
3. The website should open automatically in your default web browser

## Option 2: Using a Local Server (Recommended for Developers)

If you have Node.js installed:

1. Open a terminal/command prompt
2. Navigate to the `genai-tutorial` folder
3. Run one of these commands to start a simple HTTP server:
   
   Using Node.js:
   ```
   npx http-server
   ```
   
   Using Python 3:
   ```
   python -m http.server
   ```
   
   Using Python 2:
   ```
   python -m SimpleHTTPServer
   ```

4. Open your browser and go to `http://localhost:8080` or the URL provided in the terminal

## Troubleshooting

### SVG Animations Not Working

If the SVG animations are not working:

1. Make sure you're using a modern browser (Chrome, Firefox, Edge, or Safari)
2. Verify that JavaScript is enabled in your browser
3. Try clearing your browser cache and reload the page

### JavaScript Console Errors

If you encounter any issues:

1. Right-click on the page and select "Inspect" or "Inspect Element"
2. Go to the "Console" tab to check for any JavaScript errors
3. Make sure all files are in their correct locations according to the file structure

## Mobile Viewing

The tutorial website is fully responsive and works on mobile devices. For the best experience on smaller screens:

1. Rotate your device to landscape orientation for charts and visualizations
2. Use the navigation links at the top to jump to specific sections

## Need Help?

If you encounter any issues running the tutorial website, please contact the GenAIV Academy support team or refer to the README.md file for additional information. 