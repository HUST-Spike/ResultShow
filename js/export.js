// 导出功能相关代码

// DOM 元素
const exportResultBtn = document.getElementById('exportResultBtn');
const exportOptions = document.getElementById('exportOptions');

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const exportResultBtn = document.getElementById('exportResultBtn');
    const exportOptions = document.getElementById('exportOptions');
    
    // 将导出选项菜单移到 body 下，避免被容器裁剪
    document.body.appendChild(exportOptions);
    exportOptions.classList.add('body-level-dropdown');
    
    // 点击导出按钮时显示选项
    exportResultBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const btnRect = exportResultBtn.getBoundingClientRect();
        
        // 设置下拉菜单位置（相对于视口）
        exportOptions.style.left = (btnRect.left + (btnRect.width / 2)) + 'px';
        exportOptions.style.top = (btnRect.bottom + 5) + 'px'; // 按钮下方5px
        exportOptions.style.transform = 'translateX(-50%)'; // 居中对齐
        
        // 显示或隐藏菜单
        if (exportOptions.style.display === 'none' || exportOptions.style.display === '') {
            exportOptions.style.display = 'block';
        } else {
            exportOptions.style.display = 'none';
        }
    });
    
    // 点击其他地方时隐藏选项
    document.addEventListener('click', function(e) {
        if (!exportOptions.contains(e.target) && !exportResultBtn.contains(e.target)) {
            exportOptions.style.display = 'none';
        }
    });
    
    // 给导出选项添加点击事件
    document.querySelectorAll('.export-option').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            exportResult(format);
            exportOptions.style.display = 'none';
        });
    });
});

// 导出结果函数
function exportResult(format) {
    // 获取当前识别结果
    const prediction = document.getElementById('predictionText').textContent;
    const confidence = document.getElementById('confidenceValue').textContent;
    const imageElement = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName').textContent;
    
    // 生成导出的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let exportFileName = `识别结果_${timestamp}`;
    
    switch(format) {
        case 'txt':
            // 导出为文本文件
            const textContent = `识别结果:\n${prediction}\n\n置信度: ${confidence}\n\n导出时间: ${new Date().toLocaleString()}`;
            downloadFile(textContent, `${exportFileName}.txt`, 'text/plain');
            break;
            
        case 'json':
            // 导出为JSON文件
            const jsonData = {
                prediction: prediction,
                confidence: confidence.replace('%', ''),
                exportTime: new Date().toISOString(),
                imageFileName: fileName
            };
            downloadFile(JSON.stringify(jsonData, null, 2), `${exportFileName}.json`, 'application/json');
            break;
            
        case 'img':
            // 使用JSZip打包图片和结果
            exportImageWithResults(imageElement.src, prediction, confidence, exportFileName);
            break;
    }
}

// 新增：导出图片与结果为ZIP的功能
function exportImageWithResults(imageSrc, prediction, confidence, fileName) {
    try {
        // 创建一个新的JSZip实例
        const zip = new JSZip();
        
        // 添加结果文本文件
        const resultText = `识别结果:\n${prediction}\n\n置信度: ${confidence}\n\n导出时间: ${new Date().toLocaleString()}`;
        zip.file("结果.txt", resultText);
        
        // 将图片添加到zip中
        // 首先需要将base64图片转为二进制
        const base64Data = imageSrc.split(',')[1];
        zip.file("原始图片.png", base64Data, {base64: true});
        
        // 生成并下载zip文件
        zip.generateAsync({type: "blob"})
            .then(function(content) {
                // 使用FileSaver或内置下载方法保存文件
                const url = URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.zip`;
                document.body.appendChild(link);
                link.click();
                
                // 清理
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            });
    } catch(error) {
        console.error("创建ZIP文件失败:", error);
        alert("导出ZIP文件失败，请重试");
    }
}

// 辅助函数：下载文件
function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
}