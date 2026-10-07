// Guards the "style everything with Tailwind" rule: src/index.css is the only stylesheet,
// and no component imports CSS or injects a <style> tag.
const stylesheets = Object.keys(import.meta.glob('/src/**/*.css'));
const sources = import.meta.glob(['/src/**/*.{js,jsx}', '!/src/test/**', '!/src/**/*.test.*'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

test('src/index.css is the only stylesheet', () => {
  expect(stylesheets).toEqual(['/src/index.css']);
});

test.each(Object.entries(sources))('%s uses no CSS imports or <style> tags', (_path, source) => {
  const cssImports = [...source.matchAll(/import\s+['"]([^'"]+\.css)['"]/g)].map(m => m[1]);
  // Only the Tailwind entry (index.css, imported by main.jsx) is allowed.
  expect(cssImports.filter(file => file !== './index.css')).toEqual([]);
  expect(source).not.toMatch(/<style[\s>]/);
});
