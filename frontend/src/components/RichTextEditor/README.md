# How to get HTML?

1. Set the ref to editor

```JSX
const editorRef = useRef(null);

<RichTextEditor ref={editorRef} />
```

2. Create handle HTML function

```JSX
const handleGetHTML = (html = '') => {
  console.log('handleGetHTML', html);
};
```

3. Provide it as a prop onGetHTML

```JSX
<RichTextEditor ref={editorRef} onGetHTML={handleGetHTML} />
```

Done!

When you need HTML save the editor state

```JSX
editorRef.current?.save();
```
