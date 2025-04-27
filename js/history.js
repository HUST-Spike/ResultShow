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
        this.importHistoryBtn = document.getElementById('importHistoryBtn');
        this.importHistoryFile = document.getElementById('importHistoryFile');
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
        
        // 导入历史记录
        this.importHistoryBtn.addEventListener('click', () => {
            this.importHistoryFile.click();
        });
        
        this.importHistoryFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importHistory(e.target.files[0]);
            }
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
    
    // 加载历史记录
    loadHistory() {
        try {
            const historyData = localStorage.getItem(this.historyKey);
            this.history = historyData ? JSON.parse(historyData) : [];
        } catch (error) {
            console.error('Failed to load history:', error);
            this.history = [];
        }
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
    
    // 添加新的历史记录
    addHistory(data) {
        const historyItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            image: data.image,
            result: data.result
        };
        
        this.history.unshift(historyItem); // 添加到开头
        this.saveHistory();
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
            let resultPreview = '';
            if (typeof item.result === 'string') {
                resultPreview = item.result.substring(0, 100);
            } else if (item.result && item.result.text) {
                resultPreview = item.result.text.substring(0, 100);
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
    
    // 显示历史记录详情
    showHistoryDetail(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;
        
        this.currentHistory = item;
        
        // 格式化日期
        const date = new Date(item.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
        this.historyDetailDate.textContent = formattedDate;
        this.historyDetailImage.src = item.image;
        
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
    
    // 导入历史记录
    importHistory(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // 验证导入数据格式
                if (!importData.version || !importData.data || !Array.isArray(importData.data)) {
                    throw new Error('导入的文件格式不正确');
                }
                
                // 确认导入
                if (confirm(`确定要导入 ${importData.data.length} 条历史记录吗？`)) {
                    // 合并历史记录，避免重复
                    const existingIds = new Set(this.history.map(item => item.id));
                    const newRecords = importData.data.filter(item => !existingIds.has(item.id));
                    
                    this.history = [...newRecords, ...this.history];
                    
                    // 按日期排序
                    this.history.sort((a, b) => new Date(b.date) - new Date(a.date));
                    
                    this.saveHistory();
                    this.renderHistoryList();
                    
                    alert(`成功导入 ${newRecords.length} 条历史记录`);
                }
            } catch (error) {
                console.error('Failed to import history:', error);
                alert('导入失败：' + (error.message || '文件格式不正确'));
            }
        };
        
        reader.onerror = () => {
            alert('读取文件失败');
        };
        
        reader.readAsText(file);
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

// 在主 JS 文件加载后初始化历史记录管理器
document.addEventListener('DOMContentLoaded', () => {
    window.historyManager = new HistoryManager();
});

// 在识别完成后保存到历史记录
function saveToHistory(imageData, result) {
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
    }
}
