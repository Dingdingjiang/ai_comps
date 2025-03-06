以下是将上述截取 Markdown 代码块正文的逻辑封装成一个函数的示例，该函数接收 Markdown 代码字符串作为输入，返回截取出来的所有代码块正文内容组成的数组。

```javascript
function extractMarkdownCodeBlocks(markdown) {
    const codeBlocks = [];
    // 正则表达式用于匹配行内代码块
    const inlineRegex = /`([^`]+)`/g;
    // 正则表达式用于匹配围栏式代码块
    const fencedRegex = /(?:```|~~~)(?:\w+)?\n([\s\S]*?)\n(?:```|~~~)/g;

    // 提取行内代码块
    let inlineMatch;
    while ((inlineMatch = inlineRegex.exec(markdown))!== null) {
        codeBlocks.push(inlineMatch[1]);
    }

    // 提取围栏式代码块
    let fencedMatch;
    while ((fencedMatch = fencedRegex.exec(markdown))!== null) {
        codeBlocks.push(fencedMatch[1]);
    }

    return codeBlocks;
}

// 示例使用
const markdown = `这是一个行内代码块 \`let x = 1;\` 和一个围栏式代码块的示例：
\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`
继续文本，还有一个行内代码块 \`const y = 2;\`。`;

const extractedCode = extractMarkdownCodeBlocks(markdown);
console.log(extractedCode);
```

### 代码解释：
1. **函数定义**：定义了一个名为 `extractMarkdownCodeBlocks` 的函数，它接受一个参数 `markdown`，表示输入的 Markdown 代码字符串。
2. **初始化结果数组**：创建一个空数组 `codeBlocks`，用于存储截取出来的代码块正文内容。
3. **定义正则表达式**：
    - `inlineRegex`：用于匹配行内代码块，捕获其中的代码内容。
    - `fencedRegex`：用于匹配围栏式代码块，捕获其中的代码内容。
4. **提取行内代码块**：使用 `while` 循环和 `exec` 方法遍历所有匹配到的行内代码块，将捕获的代码内容添加到 `codeBlocks` 数组中。
5. **提取围栏式代码块**：同样使用 `while` 循环和 `exec` 方法遍历所有匹配到的围栏式代码块，将捕获的代码内容添加到 `codeBlocks` 数组中。
6. **返回结果**：最后返回 `codeBlocks` 数组，其中包含了所有截取出来的代码块正文内容。

通过调用这个函数并传入 Markdown 代码字符串，你可以方便地获取其中的代码块内容。 