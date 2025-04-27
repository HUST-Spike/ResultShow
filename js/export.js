// 导出功能相关代码

// DOM 元素
const exportResultBtn = document.getElementById('exportResultBtn');
const exportOptions = document.getElementById('exportOptions');

// 导出按钮点击事件
exportResultBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (exportOptions.style.display === 'none' || exportOptions.style.display === '') {
        exportOptions.style.display = 'block';
        console.log('显示下拉菜单'); // 调试信息
    } else {
        exportOptions.style.display = 'none';
        console.log('隐藏下拉菜单'); // 调试信息
    }
});

// 点击其他地方时隐藏导出选项
document.addEventListener('click', function(event) {
    if (!exportOptions.contains(event.target) && !exportResultBtn.contains(event.target)) {
        exportOptions.style.display = 'none';
    }
});

// 给导出选项添加点击事件
document.addEventListener('DOMContentLoaded', function() {
    const exportOptionButtons = document.querySelectorAll('.export-option');
    exportOptionButtons.forEach(button => {
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
            // 提示用户此功能需要额外库
            alert('导出图片与结果为zip需要额外的库支持，您可以单独保存图片，并导出结果文本。');
            // 这里可以添加使用JSZip等库打包图片和结果的代码
            break;
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