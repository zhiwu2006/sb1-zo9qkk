// Global variables
let wordPairs = [];
let currentGroup = 1;
let score = 0;
let totalPairs = 0;
let selectedEnglishWord = null;
let selectedChineseWord = null;
let wordsPerGroup = 12;
let clickCounts = {}; // To track click counts for each word

// Initialize function
function init() {
    // Initialize some default word pairs
    wordPairs = [
        ["apple", "苹果"],
        ["banana", "香蕉"],
        ["orange", "橙子"],
        ["grape", "葡萄"],
        ["pear", "梨"],
        ["peach", "桃子"],
        ["watermelon", "西瓜"],
        ["strawberry", "草莓"],
        ["pineapple", "菠萝"],
        ["mango", "芒果"]
    ];

    generateWords();

    // Add event listeners
    document.getElementById('reset-button').addEventListener('click', resetGame);
    document.getElementById('prev-button').addEventListener('click', showPrevGroup);
    document.getElementById('next-button').addEventListener('click', showNextGroup);
    document.getElementById('import-button').addEventListener('click', function() {
        document.getElementById('importModal').style.display = "block";
    });

    // Close modal event listeners
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('importModal').style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('importModal')) {
            document.getElementById('importModal').style.display = "none";
        }
    });

    // File import related
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

    // Text import button
    document.getElementById('submitImport').addEventListener('click', function() {
        const importText = document.getElementById("importWords").value;
        importWordsFromJSON(importText);
    });
}

// Generate words function
function generateWords() {
    const startIndex = (currentGroup - 1) * wordsPerGroup;
    const endIndex = Math.min(startIndex + wordsPerGroup, wordPairs.length);
    const currentWords = wordPairs.slice(startIndex, endIndex);

    const englishWordsDiv = document.getElementById('english-words');
    const chineseWordsDiv = document.getElementById('chinese-words');

    englishWordsDiv.innerHTML = '';
    chineseWordsDiv.innerHTML = '';

    clickCounts = {}; // Reset click counts for new words

    currentWords.forEach((pair, index) => {
        const englishWord = createWordElement(pair[0], 'english', index);
        const chineseWord = createWordElement(pair[1], 'chinese', index);

        englishWordsDiv.appendChild(englishWord);
        chineseWordsDiv.appendChild(chineseWord);
    });

    totalPairs = currentWords.length;
    updateScore();
    updateGroupInfo();
    updateNavigationButtons();
}

// Create word element function
function createWordElement(word, language, index) {
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.className = 'word';
    wordElement.dataset.index = index;
    wordElement.dataset.language = language;
    wordElement.addEventListener('click', () => selectWord(wordElement, language));
    return wordElement;
}

// Select word function
function selectWord(wordElement, language) {
    const index = wordElement.dataset.index;
    clickCounts[index] = (clickCounts[index] || 0) + 1;

    if (clickCounts[index] === 3) {
        wordElement.classList.add('hint');
    }

    if (language === 'english') {
        if (selectedEnglishWord) {
            selectedEnglishWord.classList.remove('selected');
        }
        selectedEnglishWord = wordElement;
    } else {
        if (selectedChineseWord) {
            selectedChineseWord.classList.remove('selected');
        }
        selectedChineseWord = wordElement;
    }

    wordElement.classList.add('selected');

    if (selectedEnglishWord && selectedChineseWord) {
        checkMatch();
    }
}

// Check match function
function checkMatch() {
    const englishIndex = selectedEnglishWord.dataset.index;
    const chineseIndex = selectedChineseWord.dataset.index;

    if (englishIndex === chineseIndex) {
        selectedEnglishWord.classList.add('correct');
        selectedChineseWord.classList.add('correct');
        score++;
        updateScore();

        setTimeout(() => {
            selectedEnglishWord.style.visibility = 'hidden';
            selectedChineseWord.style.visibility = 'hidden';
            selectedEnglishWord = null;
            selectedChineseWord = null;

            if (score === totalPairs) {
                showResult();
            }
        }, 500);
    } else {
        selectedEnglishWord.classList.remove('selected');
        selectedChineseWord.classList.remove('selected');
        selectedEnglishWord = null;
        selectedChineseWord = null;
    }
}

// Update score function
function updateScore() {
    document.getElementById('score').textContent = `得分：${score} / ${totalPairs}`;
}

// Update group info function
function updateGroupInfo() {
    const totalGroups = Math.ceil(wordPairs.length / wordsPerGroup);
    document.getElementById('group-info').textContent = `当前组：${currentGroup} / ${totalGroups}`;
}

// Update navigation buttons function
function updateNavigationButtons() {
    document.getElementById('prev-button').disabled = currentGroup === 1;
    document.getElementById('next-button').disabled = currentGroup * wordsPerGroup >= wordPairs.length;
}

// Show result function
function showResult() {
    document.getElementById('result').textContent = '恭喜！你已完成所有单词配对！';
}

// Reset game function
function resetGame() {
    currentGroup = 1;
    score = 0;
    selectedEnglishWord = null;
    selectedChineseWord = null;
    clickCounts = {};
    generateWords();
    document.getElementById('result').textContent = '';
}

// Show previous group function
function showPrevGroup() {
    if (currentGroup > 1) {
        currentGroup--;
        score = 0;
        generateWords();
    }
}

// Show next group function
function showNextGroup() {
    if (currentGroup * wordsPerGroup < wordPairs.length) {
        currentGroup++;
        score = 0;
        generateWords();
    }
}

// Import words from JSON function
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

        // Add new word pairs to the wordPairs array
        wordPairs = [...wordPairs, ...validPairs];

        // Reset the game and generate new words
        resetGame();

        // Close the modal
        document.getElementById('importModal').style.display = "none";

        // Clear input fields and file name
        document.getElementById("importWords").value = "";
        document.getElementById("fileName").textContent = "";
        document.getElementById("fileImport").value = "";

        alert(`Successfully imported ${validPairs.length} word pairs.`);
    } catch (error) {
        alert(`Import failed: ${error.message}`);
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);