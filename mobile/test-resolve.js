try {
  const react = require('react');
  console.log('React resolved successfully');
  console.log('React path:', require.resolve('react'));
} catch (e) {
  console.error('Error resolving React:', e.message);
}
