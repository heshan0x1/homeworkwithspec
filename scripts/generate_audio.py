#!/usr/bin/env python3
"""
生成作品音频文件脚本
使用 macOS `say` 命令生成 AIFF，然后用 `ffmpeg` 转换为 MP3
"""

import os
import json
import subprocess
import sys

# 作品目录
WORKS_DIR = os.path.join(os.path.dirname(__file__), '..', 'works')

# 中文语音（根据系统可用语音调整）
CHINESE_VOICE = 'Tingting'  # 普通话女声

def get_works_with_audio():
    """获取所有有音频的作品目录"""
    works = []
    for item in os.listdir(WORKS_DIR):
        work_dir = os.path.join(WORKS_DIR, item)
        if not os.path.isdir(work_dir):
            continue

        data_file = os.path.join(work_dir, 'data.json')
        if not os.path.exists(data_file):
            continue

        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if 'audio' in data and 'transcript' in data['audio']:
                works.append({
                    'id': data['id'],
                    'dir': work_dir,
                    'transcript': data['audio']['transcript'],
                    'audio_src': data['audio']['src']
                })
        except (json.JSONDecodeError, KeyError) as e:
            print(f"错误读取 {data_file}: {e}")
            continue

    return works

def generate_audio(work):
    """为单个作品生成音频文件"""
    work_id = work['id']
    work_dir = work['dir']
    transcript = work['transcript']
    audio_src = work['audio_src']

    # 音频文件路径（相对于作品目录）
    audio_rel_path = audio_src
    audio_full_path = os.path.join(work_dir, audio_rel_path)

    # 确保音频目录存在
    audio_dir = os.path.dirname(audio_full_path)
    os.makedirs(audio_dir, exist_ok=True)

    print(f"处理作品: {work_id}")
    print(f"  音频文件: {audio_full_path}")
    print(f"  转录文本长度: {len(transcript)} 字符")

    # 临时 AIFF 文件
    temp_aiff = os.path.join(work_dir, 'temp_description.aiff')

    try:
        # 1. 使用 say 命令生成 AIFF
        print("  生成 AIFF 音频...")
        say_cmd = ['say', '-v', CHINESE_VOICE, '-o', temp_aiff, transcript]
        result = subprocess.run(say_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  say 命令失败: {result.stderr}")
            return False

        # 2. 使用 ffmpeg 转换为 MP3
        print("  转换为 MP3...")
        ffmpeg_cmd = ['ffmpeg', '-i', temp_aiff, '-codec:a', 'libmp3lame',
                     '-qscale:a', '2', '-y', audio_full_path]
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  ffmpeg 转换失败: {result.stderr}")
            # 尝试使用备用参数
            ffmpeg_cmd2 = ['ffmpeg', '-i', temp_aiff, '-codec:a', 'libmp3lame',
                          '-b:a', '128k', '-y', audio_full_path]
            result2 = subprocess.run(ffmpeg_cmd2, capture_output=True, text=True)
            if result2.returncode != 0:
                print(f"  备用转换也失败: {result2.stderr}")
                return False

        # 3. 清理临时文件
        if os.path.exists(temp_aiff):
            os.remove(temp_aiff)

        # 4. 检查生成的文件
        if os.path.exists(audio_full_path):
            file_size = os.path.getsize(audio_full_path)
            print(f"  生成成功! 文件大小: {file_size} 字节")
            return True
        else:
            print("  错误: 输出文件不存在")
            return False

    except Exception as e:
        print(f"  处理过程中出错: {e}")
        return False
    finally:
        # 清理临时文件（如果存在）
        if os.path.exists(temp_aiff):
            os.remove(temp_aiff)

def main():
    print("开始生成作品音频文件...")
    print(f"作品目录: {WORKS_DIR}")
    print(f"使用语音: {CHINESE_VOICE}")
    print()

    # 检查 ffmpeg 是否可用
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("错误: ffmpeg 未安装。请先安装 ffmpeg (brew install ffmpeg)")
        sys.exit(1)

    # 获取有音频的作品
    works = get_works_with_audio()
    print(f"找到 {len(works)} 个有音频的作品:")
    for work in works:
        print(f"  - {work['id']}")
    print()

    # 为每个作品生成音频
    success_count = 0
    for work in works:
        print("-" * 50)
        if generate_audio(work):
            success_count += 1
        print()

    print("=" * 50)
    print(f"完成! 成功生成 {success_count}/{len(works)} 个作品的音频")

    if success_count < len(works):
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()