
# HTML Basics

HTML (HyperText Markup Language) is the foundation of web development. It provides the structure and content for web pages.

## What is HTML?

HTML is a markup language that uses tags to define elements on a web page. Each tag tells the browser how to display or structure the content.

## Basic HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph of text.</p>
</body>
</html>
```

## Essential HTML Elements

### Headings
Use headings to create a hierarchy of content:

```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h4>Sub-subsection Title</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>
```

### Paragraphs and Text
```html
<p>This is a paragraph of text.</p>
<strong>Bold text</strong>
<em>Italic text</em>
<mark>Highlighted text</mark>
```

### Lists
**Unordered Lists:**
```html
<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>
```

**Ordered Lists:**
```html
<ol>
    <li>Step one</li>
    <li>Step two</li>
    <li>Step three</li>
</ol>
```

### Links and Images
```html
<a href="https://example.com">Visit Example.com</a>
<img src="image.jpg" alt="Description of image">
```

### Forms
```html
<form>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    
    <button type="submit">Submit</button>
</form>
```

## Semantic HTML

Use semantic elements to give meaning to your content:

- `<header>`: Page or section header
- `<nav>`: Navigation links
- `<main>`: Main content area
- `<article>`: Standalone content
- `<section>`: Thematic grouping of content
- `<aside>`: Sidebar content
- `<footer>`: Page or section footer

## HTML Attributes

Attributes provide additional information about elements:

```html
<div class="container" id="main-content">
    <a href="https://example.com" target="_blank" rel="noopener">
        External Link
    </a>
</div>
```

## Best Practices

1. **Use semantic HTML**: Choose elements based on meaning, not appearance
2. **Write accessible HTML**: Include alt attributes for images, labels for form inputs
3. **Keep it clean**: Use proper indentation and organize your code
4. **Validate your HTML**: Use tools to check for errors
5. **Use lowercase**: For element names and attributes

## Common Mistakes to Avoid

- Forgetting to close tags
- Nesting elements incorrectly
- Using deprecated elements
- Missing alt attributes on images
- Not using semantic elements

## Practice Exercise

Create a simple blog post structure using:
- A main heading
- Author information
- Publication date
- Several paragraphs with subheadings
- A list of related topics
- A footer with copyright information

## Next Steps

Now that you understand HTML basics, the next chapter will cover CSS and how to style your HTML elements to create beautiful, responsive designs.

---

*Keep practicing and building! 💪*
