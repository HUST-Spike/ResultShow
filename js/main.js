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

// 分析图片 - 使用模拟数据
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
