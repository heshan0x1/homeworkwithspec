#!/bin/bash
# 网站打包脚本 - 包装Python脚本的Shell脚本

set -e

echo "📦 开始打包网站..."

# 检查Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ 需要Python3，但未找到"
    exit 1
fi

# 运行Python打包脚本
python3 pack_site.py

echo ""
echo "✅ 打包完成！"
echo "📁 生成的zip文件已保存在当前目录"