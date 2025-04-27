/**
 * 历史记录管理模块
 */
class HistoryManager {
    constructor() {
        this.historyKey = 'ocr_history';
        this.maxHistoryItems = 50; // 最大保存记录数
        this.currentHistory = null;
        
        this.initElements();
        this.initEventListeners();
        this.loadHistory();
    }
    
    initElements() {
        // 按钮
        this.historyBtn = document.getElementById('historyBtn');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        this.closeDetailBtn = document.getElementById('closeDetailBtn');
        this.reprocessHistoryBtn = document.getElementById('reprocessHistoryBtn');
        this.deleteHistoryBtn = document.getElementById('deleteHistoryBtn');
        
        // 面板
        this.historyPanel = document.getElementById('historyPanel');
        this.historyDetailPanel = document.getElementById('historyDetailPanel');
        
        // 内容区域
        this.historyList = document.getElementById('historyList');
        this.historyEmpty = document.getElementById('historyEmpty');
        this.historyDetailDate = document.getElementById('historyDetailDate');
        this.historyDetailImage = document.getElementById('historyDetailImage');
        this.historyDetailResult = document.getElementById('historyDetailResult');
        
        // 如果有任何元素未找到，在控制台输出警告
        const elements = [
            this.historyBtn, this.closeHistoryBtn, this.clearHistoryBtn, 
            this.exportHistoryBtn, this.closeDetailBtn, this.reprocessHistoryBtn, 
            this.deleteHistoryBtn, this.historyPanel, this.historyDetailPanel,
            this.historyList, this.historyEmpty, this.historyDetailDate,
            this.historyDetailImage, this.historyDetailResult
        ];
        
        elements.forEach((el, index) => {
            if (!el) {
                console.warn(`历史记录管理器: 元素 #${index} 未找到`);
            }
        });
    }
    
    initEventListeners() {
        // 打开历史记录面板
        this.historyBtn.addEventListener('click', () => {
            this.showHistoryPanel();
        });
        
        // 关闭历史记录面板
        this.closeHistoryBtn.addEventListener('click', () => {
            this.hideHistoryPanel();
        });
        
        // 清空历史记录
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
        
        // 导出历史记录
        this.exportHistoryBtn.addEventListener('click', () => {
            this.exportHistory();
        });
        
       
        // 关闭详情面板
        this.closeDetailBtn.addEventListener('click', () => {
            this.hideDetailPanel();
        });
        
        // 重新处理历史记录
        this.reprocessHistoryBtn.addEventListener('click', () => {
            this.reprocessHistory();
        });
        
        // 删除当前历史记录
        this.deleteHistoryBtn.addEventListener('click', () => {
            this.deleteCurrentHistory();
        });
    }
    

    loadHistory() {
        const historyKey = 'ocr_history';
        const historyJson = localStorage.getItem(historyKey);
        
        if (historyJson) {
            try {
                this.history = JSON.parse(historyJson);
                
                // 按日期排序（新的在前）
                this.history.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                
                console.log('历史记录加载成功，共 ' + this.history.length + ' 条记录');
            } catch (e) {
                console.error('解析历史记录失败:', e);
                this.history = [];
            }
        } else {
            this.history = [];
        }
        
        this.updateHistoryList();
    }
    
    // 保存历史记录
    saveHistory() {
        try {
            // 限制历史记录数量
            if (this.history.length > this.maxHistoryItems) {
                this.history = this.history.slice(0, this.maxHistoryItems);
            }
            localStorage.setItem(this.historyKey, JSON.stringify(this.history));
        } catch (error) {
            console.error('Failed to save history:', error);
            alert('保存历史记录失败，可能是存储空间不足。');
        }
    }
    

    addHistory(data) {
        const id = 'record_' + Date.now();
        const record = {
            id: id,
            date: new Date().toISOString(), // 使用ISO格式确保排序正确
            image: data.image,
            result: data.result
        };
        
        this.history.unshift(record); // 新记录添加到最前面
        this.saveHistory();
        this.updateHistoryList();
        return record;
    }
    
    // 显示历史记录面板
    showHistoryPanel() {
        this.renderHistoryList();
        this.historyPanel.style.display = 'flex';
        setTimeout(() => {
            this.historyPanel.classList.add('active');
        }, 10);
    }
    
    // 隐藏历史记录面板
    hideHistoryPanel() {
        this.historyPanel.classList.remove('active');
        setTimeout(() => {
            this.historyPanel.style.display = 'none';
        }, 300);
    }
    
    // 渲染历史记录列表
    renderHistoryList() {
        console.log("渲染历史记录:", this.history); // 添加这行
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyEmpty.style.display = 'block';
            return;
        }
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyEmpty.style.display = 'block';
            return;
        }
        
        this.historyEmpty.style.display = 'none';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.id = item.id;
            
            // 格式化日期
            const date = new Date(item.date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            // 获取结果预览文本
            // 获取结果预览文本
            let resultPreview = '';
            if (typeof item.result === 'string') {
                resultPreview = item.result.substring(0, 100);
            } else if (item.result && item.result.text) {
                resultPreview = item.result.text.substring(0, 100);
            } else if (item.result && item.result.prediction) {
                // 处理包含prediction和confidence的结果
                resultPreview = `${item.result.prediction} (置信度: ${(item.result.confidence * 100).toFixed(1)}%)`;
            }
            
            if (resultPreview.length >= 100) {
                resultPreview += '...';
            }
            
            historyItem.innerHTML = `
                <div class="history-item-image">
                    <img src="${item.image}" alt="历史图片">
                </div>
                <div class="history-item-content">
                    <div class="history-item-date">${formattedDate}</div>
                    <div class="history-item-preview">${resultPreview || '无识别结果'}</div>
                </div>
                <button class="history-item-delete" data-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            `;
            
            // 点击项目查看详情
            historyItem.addEventListener('click', (e) => {
                // 如果点击的是删除按钮，则不显示详情
                if (e.target.closest('.history-item-delete')) {
                    return;
                }
                this.showHistoryDetail(item.id);
            });
            
            // 删除单个历史记录
            const deleteBtn = historyItem.querySelector('.history-item-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistory(item.id);
            });
            
            this.historyList.appendChild(historyItem);
        });
    }
    
        // 在 showHistoryDetail 函数中添加图片加载错误处理
    showHistoryDetail(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;
        
        console.log("显示历史详情:", item); // 添加这行
        console.log("图片URL类型:", typeof item.image); // 检查图片类型
        console.log("图片URL长度:", item.image ? item.image.length : 0); // 检查长度
        
        this.currentHistory = item;
        
        // 格式化日期
        const date = new Date(item.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
        this.historyDetailDate.textContent = formattedDate;
        
        // 添加图片加载错误处理
        this.historyDetailImage.onerror = (e) => {
            console.error("图片加载失败", e);
            // 设置一个默认图片
            this.historyDetailImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAA70lEQVR4nO3bMQ0AMAgAMJzfA4kRRKr4+FMj4KVFdM7MBnx31QMYExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExLbFg8AvbJIaeQAAAAASUVORK5CYII=';
        };
        
        // 检查图片URL是否有效
        if (!item.image || typeof item.image !== 'string' || item.image.length < 10) {
            console.error("无效的图片URL", item.image);
            this.historyDetailImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAA70lEQVR4nO3bMQ0AMAgAMJzfA4kRRKr4+FMj4KVFdM7MBnx31QMYExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExITEhMSExLbFg8AvbJIaeQAAAAASUVORK5CYII=';
        } else {
            this.historyDetailImage.src = item.image;
        }
        
        // 处理结果显示
        let resultHtml = '';
        if (typeof item.result === 'string') {
            resultHtml = `<pre>${item.result}</pre>`;
        } else if (item.result && item.result.text) {
            resultHtml = `<pre>${item.result.text}</pre>`;
            
            // 如果有结构化数据，也显示
            if (item.result.structured) {
                resultHtml += '<h4>结构化数据</h4>';
                resultHtml += `<pre>${JSON.stringify(item.result.structured, null, 2)}</pre>`;
            }
        } else if (item.result && item.result.prediction) {
            // 处理包含prediction和confidence的结果
            resultHtml = `<div class="prediction-result">
                <h4>预测结果</h4>
                <p class="prediction">${item.result.prediction}</p>
                <h4>置信度</h4>
                <div class="confidence-bar-container">
                    <div class="confidence-bar" style="width: ${item.result.confidence * 100}%"></div>
                    <span>${(item.result.confidence * 100).toFixed(1)}%</span>
                </div>
            </div>`;
        } else {
            resultHtml = '<p>无识别结果</p>';
        }
        
        this.historyDetailResult.innerHTML = resultHtml;
        
        // 显示详情面板
        this.historyDetailPanel.style.display = 'flex';
        setTimeout(() => {
            this.historyDetailPanel.classList.add('active');
        }, 10);
    }
    
    // 隐藏详情面板
    hideDetailPanel() {
        this.historyDetailPanel.classList.remove('active');
        setTimeout(() => {
            this.historyDetailPanel.style.display = 'none';
            this.currentHistory = null;
        }, 300);
    }
    
    // 删除单个历史记录
    deleteHistory(id) {
        if (confirm('确定要删除这条历史记录吗？')) {
            this.history = this.history.filter(item => item.id !== id);
            this.saveHistory();
            this.renderHistoryList();
            
            // 如果当前正在查看的是被删除的记录，关闭详情面板
            if (this.currentHistory && this.currentHistory.id === id) {
                this.hideDetailPanel();
            }
        }
    }
    
    // 删除当前查看的历史记录
    deleteCurrentHistory() {
        if (this.currentHistory) {
            this.deleteHistory(this.currentHistory.id);
        }
    }
    
    // 清空所有历史记录
    clearHistory() {
        if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
            this.history = [];
            this.saveHistory();
            this.renderHistoryList();
            this.hideDetailPanel();
        }
    }
    
    // 导出历史记录
    exportHistory() {
        if (this.history.length === 0) {
            alert('没有历史记录可导出');
            return;
        }
        
        try {
            const exportData = {
                version: '1.0',
                date: new Date().toISOString(),
                data: this.history
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ocr-history-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Failed to export history:', error);
            alert('导出历史记录失败');
        }
    }

    
    // 重新处理历史记录
    reprocessHistory() {
        if (!this.currentHistory) return;
        
        // 将图像数据传递给主应用进行处理
        if (typeof window.processHistoryImage === 'function') {
            window.processHistoryImage(this.currentHistory.image);
            this.hideDetailPanel();
            this.hideHistoryPanel();
        } else {
            alert('重新处理功能不可用');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化历史记录管理器
    window.historyManager = new HistoryManager();
    console.log("历史记录管理器初始化完成");
});

// 在识别完成后保存到历史记录
function saveToHistory(imageData, result) {
    console.log("尝试保存历史记录", window.historyManager); // 添加调试信息
    
    if (window.historyManager) {
        window.historyManager.addHistory({
            image: imageData,
            result: result
        });
        
        // 添加新记录提示效果
        const historyBtn = document.getElementById('historyBtn');
        historyBtn.classList.add('has-new');
        
        // 5秒后移除提示效果
        setTimeout(() => {
            historyBtn.classList.remove('has-new');
        }, 5000);
    } else {
        console.error("historyManager 未初始化"); // 错误提示
    }
}
