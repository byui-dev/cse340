// test-classification.js
const path = require('path');

try {
const getClassifications = require('./utilities/classification');

(async () => {
const result = await getClassifications();
console.log('✅ Classifications loaded successfully:');
console.log(result);
})();
} catch (err) {
console.error('❌ Failed to load classification module:');
console.error(err.message);
}