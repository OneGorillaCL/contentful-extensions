const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
    const files = [
        './dist/contentful-elements/runtime-es5.js',
        './dist/contentful-elements/polyfills-es5.js',
        './dist/contentful-elements/scripts.js',
        './dist/contentful-elements/main-es5.js'
    ];

    await fs.ensureDir('elements');
    await concat(files, 'elements/contentful-elements.js');
    await fs.copyFile(
        './dist/contentful-elements/styles.css',
        'elements/styles.css'
    );
})();
