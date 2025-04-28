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

// 修改事件监听器，原来的直接点击分析代码改为显示下拉菜单
analyzeButton.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const analyzeOptions = document.getElementById('analyzeOptions');
    const btnRect = analyzeButton.getBoundingClientRect();
    
    // 设置下拉菜单位置（相对于视口）
    analyzeOptions.style.left = (btnRect.left + (btnRect.width / 2)) + 'px';
    analyzeOptions.style.top = (btnRect.bottom + 5) + 'px'; // 按钮下方5px
    analyzeOptions.style.transform = 'translateX(-50%)'; // 居中对齐
    
    // 显示或隐藏菜单
    if (analyzeOptions.style.display === 'none' || analyzeOptions.style.display === '') {
        analyzeOptions.style.display = 'block';
    } else {
        analyzeOptions.style.display = 'none';
    }
});

// 点击其他地方时隐藏选项
document.addEventListener('click', function(e) {
    const analyzeOptions = document.getElementById('analyzeOptions');
    if (analyzeOptions && !analyzeOptions.contains(e.target) && !analyzeButton.contains(e.target)) {
        analyzeOptions.style.display = 'none';
    }
});

// 给分析选项添加点击事件
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.analyze-option').forEach(button => {
        button.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            analyzeImage(modelType);
            document.getElementById('analyzeOptions').style.display = 'none';
        });
    });
});

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

async function analyzeImage(modelType = 'integrated') {
    // 显示加载动画
    loadingOverlay.style.display = 'flex';
    
    // 记录选择的模型类型（可以用于后续处理）
    console.log(`使用模型: ${modelType}`);
    
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
            
            // 设置模型信息
            const modelTypeValue = document.getElementById('modelTypeValue');
            switch(modelType) {
                case 'integrated':
                    modelTypeValue.textContent = '模型集成：准确率最高';
                    break;
                case 'troika':
                    modelTypeValue.textContent = 'Troika(ViT-L/14)';
                    break;
                case 'dfsp-vit-l14':
                    modelTypeValue.textContent = 'DFSP(ViT-L/14)';
                    break;
                case 'dfsp-vit-b32':
                    modelTypeValue.textContent = 'DFSP(ViT-B/32)：推理最快';
                    break;
                default:
                    modelTypeValue.textContent = modelType;
            }
            
            // 添加模型类型到保存的结果中
            mockResult.modelType = modelType;
            
            // 首先展开容器
            document.querySelector('.app-container').classList.add('expanded');
            
            // 然后显示结果区域（稍微延迟以确保动画顺序）
            setTimeout(() => {
                resultSection.classList.add('visible');
            }, 100);
            
            // 保存到历史记录
            if (window.historyManager && previewImage.src) {
                window.historyManager.addHistory({
                    image: previewImage.src,
                    result: mockResult
                });
                console.log("已保存到历史记录");
            }
            
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
        previewImage.src = imageDataUrl;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        uploadArea.classList.add('has-image');
        
        // 更新图像信息
        imageInfo.style.display = 'flex';
        fileName.textContent = '从历史记录加载';
        imageSize.textContent = `${img.width} × ${img.height}`;
        
        // 启用识别按钮
        analyzeButton.disabled = false;
    };
    img.src = imageDataUrl;
};

// 在显示结果的函数中添加设置模型信息
function displayResult(result) {
    // 显示结果文本
    predictionText.textContent = result.prediction;
    
    // 设置置信度
    const confidencePercent = Math.round(result.confidence * 100);
    confidenceValue.textContent = confidencePercent + '%';
    
    // 确保DOM已更新后再设置宽度
    requestAnimationFrame(() => {
        confidenceProgress.style.width = confidencePercent + '%';
    });
    
    // 设置模型信息
    const modelTypeValue = document.getElementById('modelTypeValue');
    if (result.modelType) {
        switch(result.modelType) {
            case 'integrated':
                modelTypeValue.textContent = '模型集成：准确率最高';
                break;
            case 'troika':
                modelTypeValue.textContent = 'Troika(ViT-L/14)';
                break;
            case 'dfsp-vit-l14':
                modelTypeValue.textContent = 'DFSP(ViT-L/14)';
                break;
            case 'dfsp-vit-b32':
                modelTypeValue.textContent = 'DFSP(ViT-B/32)：推理最快';
                break;
            default:
                modelTypeValue.textContent = result.modelType;
        }
    } else {
        modelTypeValue.textContent = '未知模型';
    }
    
    // 显示结果区域
    resultSection.classList.add('visible');
    document.querySelector('.app-container').classList.add('expanded');
}

// 在识别完成后调用 saveToHistory
// 找到您的识别结果处理函数，在适当的位置添加：
// 在你处理识别结果的函数中，加入下面的代码
function handleRecognitionResult(result) {
    // 显示结果
    displayResult(result);
    
    // 保存到历史记录 - 确保这行代码存在
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src) {
        saveToHistory(previewImage.src, result);
        console.log("保存历史记录"); // 添加调试信息
    }
}

// 在文件结尾添加初始化代码
document.addEventListener('DOMContentLoaded', function() {
    // 确保分析选项被移到body下
    const analyzeOptions = document.getElementById('analyzeOptions');
    if (analyzeOptions) {
        document.body.appendChild(analyzeOptions);
    }
    
    // 初始化分析选项的点击事件
    document.querySelectorAll('.analyze-option').forEach(button => {
        button.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            analyzeImage(modelType);
            if (analyzeOptions) {
                analyzeOptions.style.display = 'none';
            }
        });
    });
});

