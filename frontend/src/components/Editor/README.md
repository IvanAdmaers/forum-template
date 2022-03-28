This package uses Editor.js. So, you should import it only on client-side

Based on https://github.com/myovchev/next-editorjs

# Import

```javascript
const Editor = dynamic(
  () => import('components/Editor'),
  { ssr: false }
);
```
