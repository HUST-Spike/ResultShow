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