// 保留原有的代码
// ...

// 修改处理导入的部分
const fileInput = document.getElementById("fileImport");
const fileNameSpan = document.getElementById("fileName");

fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            importWordsFromJSON(content);
        };
        reader.readAsText(file);
    }
});

function importWordsFromJSON(jsonString) {
    try {
        const newPairs = JSON.parse(jsonString);
        if (!Array.isArray(newPairs)) {
            throw new Error("Invalid JSON format. Expected an array.");
        }

        const validPairs = newPairs.filter(pair => 
            Array.isArray(pair) && pair.length === 2 &&
            typeof pair[0] === 'string' && typeof pair[1] === 'string'
        ).map(pair => [pair[0].trim(), pair[1].trim()]);

        if (validPairs.length === 0) {
            throw new Error("No valid word pairs found in the JSON.");
        }

        // 将新单词对添加到 wordPairs 数组
        wordPairs.push(...validPairs);

        // 重新生成单词并开始新游戏
        resetGame();

        // 关闭模态框
        modal.style.display = "none";

        // 清空输入框和文件名
        document.getElementById("importWords").value = "";
        fileNameSpan.textContent = "";
        fileInput.value = "";

        alert(`成功导入 ${validPairs.length} 个单词对。`);
    } catch (error) {
        alert(`导入失败：${error.message}`);
    }
}

// 修改文本导入按钮的处理函数
submitImport.onclick = function() {
    const importText = document.getElementById("importWords").value;
    importWordsFromJSON(importText);
}

// 保留原有的代码
// ...