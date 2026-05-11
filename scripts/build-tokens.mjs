import StyleDictionary from 'style-dictionary';
import fs from 'fs';

// Build smartphone (mobile first) as the default
const sd = new StyleDictionary({
  source: [
    'tokens/src/PRIMITIVES/**/*.json',
    'tokens/src/SEMNATIC TOKENS/smartphone.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/dist/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    }
  }
});

await sd.buildAllPlatforms();

// Build desktop tokens separately
const sdDesktop = new StyleDictionary({
  source: [
    'tokens/src/PRIMITIVES/**/*.json',
    'tokens/src/SEMNATIC TOKENS/desktop.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/dist/',
      files: [{
        destination: 'tokens-desktop-raw.css',
        format: 'css/variables'
      }]
    }
  }
});

await sdDesktop.buildAllPlatforms();

// Check file exists
const desktopPath = 'tokens/dist/tokens-desktop-raw.css';
if (!fs.existsSync(desktopPath)) {
  console.error('Desktop raw file not found:', desktopPath);
  process.exit(1);
}

// Extract only heading typography variables that differ between modes
const desktopRaw = fs.readFileSync(desktopPath, 'utf8');
const headingVars = desktopRaw
  .split('\n')
  .filter(line => line.match(/--typography-header-h[1-4]-(font-size|line-height)/))
  .join('\n');

console.log('Desktop heading vars found:', headingVars);

// Append desktop overrides as a media query
const mediaQuery = `
/* Desktop typography overrides */
@media (min-width: 768px) {
  :root {
${headingVars}
  }
}
`;

fs.appendFileSync('tokens/dist/tokens.css', mediaQuery);
fs.unlinkSync(desktopPath);

console.log('✓ tokens/dist/tokens.css built with responsive typography');