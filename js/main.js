// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const fileInput = document.getElementById('fileInput');
const imageInfo = document.getElementById('imageInfo');
const fileName = document.getElementById('fileName');
const imageSize = document.getElementById('imageSize');
const uploadButton = document.getElementById('uploadButton');
const analyzeButton = document.getElementById('analyzeButton');
const resultSection = document.getElementById('resultSection');
const predictionText = document.getElementById('predictionText');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceProgress = document.getElementById('confidenceProgress');
const loadingOverlay = document.getElementById('loadingOverlay');

// 模拟结果数据 - 用于演示
const mockResults = [
    { prediction: "This is a red car", confidence: 0.97 },
    { prediction: "This is a brown dog", confidence: 0.94 },
    { prediction: "This is a tall building", confidence: 0.89 },
    { prediction: "This is a green tree", confidence: 0.92 }
];

// 服务器URL - 需要替换为您的实际服务器地址
const SERVER_URL = 'http://your-autodl-ip:5000/predict';

// 事件监听器
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
analyzeButton.addEventListener('click', analyzeImage);

// 文件处理函数
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
}

// 处理文件并显示预览
function processFile(file) {
    // 显示文件信息
    fileName.textContent = file.name;
    
    // 创建文件预览
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        
        // 获取图片尺寸
        const img = new Image();
        img.onload = function() {
            imageSize.textContent = `${img.width} × ${img.height}`;
            imageInfo.style.display = 'flex';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // 启用分析按钮
    analyzeButton.disabled = false;
}

/*
// 分析图片
async function analyzeImage() {
    // 显示加载动画
    loadingOverlay.style.display = 'flex';
    
    try {
        // 发送图片到服务器
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: previewImage.src
            })
        });
        
        if (!response.ok) {
            throw new Error('服务器响应错误');
        }
        
        const result = await response.json();
        
        // 显示结果
        predictionText.textContent = result.prediction || '无法识别';
        
        const confidence = Math.round((result.confidence || 0) * 100);
        confidenceValue.textContent = `${confidence}%`;
        confidenceProgress.style.width = `${confidence}%`;
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 平滑滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('分析图片时出错:', error);
        alert('分析图片时出错，请重试');
    } finally {
        // 隐藏加载动画
        loadingOverlay.style.display = 'none';
    }
}
*/

async function analyzeImage() {
    // 显示加载动画
    loadingOverlay.style.display = 'flex';
    
    // 模拟网络延迟
    setTimeout(() => {
        try {
            // 随机选择一个模拟结果
            const mockResult = mockResults[Math.floor(Math.random() * mockResults.length)];
            
            // 显示结果
            predictionText.textContent = mockResult.prediction;
            
            const confidence = Math.round(mockResult.confidence * 100);
            confidenceValue.textContent = `${confidence}%`;
            confidenceProgress.style.width = `${confidence}%`;
            
            // 首先展开容器
            document.querySelector('.app-container').classList.add('expanded');
            
            // 然后显示结果区域（稍微延迟以确保动画顺序）
            setTimeout(() => {
                resultSection.classList.add('visible');
            }, 100);
            
        } catch (error) {
            console.error('分析图片时出错:', error);
            alert('分析图片时出错，请重试');
        } finally {
            // 隐藏加载动画
            loadingOverlay.style.display = 'none';
        }
    }, 1500); // 1.5秒的模拟延迟
}


// 支持粘贴图片
document.addEventListener('paste', function(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    
    for (let item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            processFile(file);
            break;
        }
    }
});


function processFile(file) {
    // 显示文件信息
    fileName.textContent = file.name;
    
    // 创建文件预览
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        
        // 添加有图片的类
        uploadArea.classList.add('has-image');
        
        // 获取图片尺寸
        const img = new Image();
        img.onload = function() {
            imageSize.textContent = `${img.width} × ${img.height}`;
            imageInfo.style.display = 'flex';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // 启用分析按钮
    analyzeButton.disabled = false;
}


// 显示结果
function showResults() {
    document.querySelector('.result-section').classList.add('visible');
    document.querySelector('.app-container').classList.add('expanded');
}

// 隐藏结果
function hideResults() {
    document.querySelector('.result-section').classList.remove('visible');
    document.querySelector('.app-container').classList.remove('expanded');
}


// 在识别完成后保存到历史记录
function saveToHistory(imageData, result) {
    if (window.historyManager) {
        window.historyManager.addHistory({
            image: imageData,
            result: result
        });
    }
}

// 处理历史记录中的图像
window.processHistoryImage = function(imageDataUrl) {
    // 创建图像对象
    const img = new Image();
    img.onload = function() {
        // 更新预览图
        const previewImage = document.getElementById('previewImage');
        previewImage.src = imageDataUrl;
        previewImage.style.display = 'block';
        
        // 更新图像信息
        document.getElementById('imageInfo').style.display = 'block';
        document.getElementById('fileName').textContent = '从历史记录加载';
        document.getElementById('fileSize').textContent = '未知';
        document.getElementById('fileType').textContent = '图像';
        
        // 启用识别按钮
        document.getElementById('recognizeBtn').disabled = false;
    };
    img.src = imageDataUrl;
};

// 在识别完成后调用 saveToHistory
// 找到您的识别结果处理函数，在适当的位置添加：
function handleRecognitionResult(result) {
    // 显示结果
    displayResult(result);
    
    // 保存到历史记录
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src) {
        saveToHistory(previewImage.src, result);
    }
}
