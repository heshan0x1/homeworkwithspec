#!/usr/bin/env python3
"""
网站打包脚本
将实际网站相关的内容打包成一个zip文件，用于发布到服务中
"""

import os
import zipfile
import sys
from datetime import datetime

def get_website_files(base_dir):
    """获取网站运行所需的所有文件"""
    website_files = []

    # 要包含的文件和目录
    include_patterns = [
        'index.html',
        '404.html',
        'styles/',
        'scripts/',
        'data/',
        'works/'
    ]

    # 要排除的文件和目录
    exclude_patterns = [
        '.claude/',
        'temp_audio/',
        'openspec/',
        '.DS_Store',
        '*.backup',
        'generate_audio.py',
        'scripts/generate_audio.py',
        'scripts/generate-work.js',
        'pack_site.py',
        'README.md',
        'TESTING.md',
        '__pycache__/',
        '.git/',
        '.gitignore',
        '.claudeignore'
    ]

    for root, dirs, files in os.walk(base_dir):
        # 排除不需要的目录
        dirs[:] = [d for d in dirs if not any(
            exclude in os.path.join(root, d) for exclude in exclude_patterns
        )]

        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, base_dir)

            # 检查是否应该包含
            should_include = False

            # 检查是否匹配包含模式
            for pattern in include_patterns:
                if pattern.endswith('/'):
                    if rel_path.startswith(pattern):
                        should_include = True
                        break
                else:
                    if rel_path == pattern:
                        should_include = True
                        break

            if not should_include:
                continue

            # 检查是否匹配排除模式
            for pattern in exclude_patterns:
                if pattern.endswith('/'):
                    if rel_path.startswith(pattern):
                        should_include = False
                        break
                elif pattern.startswith('*.'):
                    # 通配符扩展名匹配，如 *.backup
                    if rel_path.endswith(pattern[1:]):
                        should_include = False
                        break
                else:
                    if rel_path == pattern:
                        should_include = False
                        break

            # 额外排除规则
            if should_include:
                # 排除 .DS_Store 文件
                if file == '.DS_Store':
                    should_include = False
                # 排除备份文件
                elif rel_path.endswith('.backup'):
                    should_include = False
                # 排除开发脚本
                elif rel_path in ['scripts/generate_audio.py', 'scripts/generate-work.js']:
                    should_include = False

            if should_include:
                website_files.append((file_path, rel_path))

    return website_files

def create_zip_archive(files, output_path):
    """创建zip压缩包"""
    print(f"创建压缩包: {output_path}")
    print(f"包含 {len(files)} 个文件")

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path, rel_path in files:
            print(f"  - {rel_path}")
            zipf.write(file_path, rel_path)

    return output_path

def main():
    # 设置工作目录为脚本所在目录
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 获取网站文件
    print("扫描网站文件...")
    website_files = get_website_files(base_dir)

    if not website_files:
        print("错误: 未找到网站文件")
        sys.exit(1)

    # 创建输出文件名（带时间戳）
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_filename = f"portfolio_site_{timestamp}.zip"
    output_path = os.path.join(base_dir, output_filename)

    # 创建zip压缩包
    try:
        archive_path = create_zip_archive(website_files, output_path)

        # 计算压缩包大小
        size_bytes = os.path.getsize(archive_path)
        size_mb = size_bytes / (1024 * 1024)

        print(f"\n✅ 打包完成!")
        print(f"压缩包: {archive_path}")
        print(f"文件数量: {len(website_files)}")
        print(f"压缩包大小: {size_mb:.2f} MB")
        print(f"\n包含的文件类型:")

        # 统计文件类型
        file_types = {}
        for _, rel_path in website_files:
            ext = os.path.splitext(rel_path)[1].lower()
            if ext:
                file_types[ext] = file_types.get(ext, 0) + 1

        for ext, count in sorted(file_types.items()):
            print(f"  {ext}: {count} 个文件")

    except Exception as e:
        print(f"❌ 创建压缩包时出错: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()