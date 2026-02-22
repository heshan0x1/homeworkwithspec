#!/usr/bin/env python3
"""
生成作品音频文件并更新配置文件
将MP3替换为M4A格式
"""

import os
import json
import subprocess
import shutil
from pathlib import Path

def extract_transcript(data_file):
    """从data.json提取转录文本"""
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'audio' in data and 'transcript' in data['audio']:
        return data['audio']['transcript']
    return None

def generate_audio(text, output_file):
    """使用say和afconvert生成M4A音频文件"""
    # 创建临时目录
    temp_dir = Path("/tmp/audio_gen")
    temp_dir.mkdir(exist_ok=True)

    # 保存文本到临时文件
    text_file = temp_dir / "text.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(text)

    # 生成AIFF文件
    aiff_file = temp_dir / "audio.aiff"
    say_cmd = ['say', '-v', 'Ting-Ting', '-o', str(aiff_file), '-f', str(text_file)]
    subprocess.run(say_cmd, check=True)

    # 转换为M4A
    afconvert_cmd = ['afconvert', '-f', 'm4af', '-d', 'aac ', str(aiff_file), output_file]
    subprocess.run(afconvert_cmd, check=True)

    # 清理临时文件
    text_file.unlink(missing_ok=True)
    aiff_file.unlink(missing_ok=True)

    print(f"✓ 生成音频文件: {output_file}")

def update_data_json(data_file, new_audio_ext='.m4a'):
    """更新data.json中的音频文件扩展名"""
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'audio' in data:
        old_src = data['audio']['src']
        # 替换扩展名
        base_name = os.path.splitext(old_src)[0]
        new_src = base_name + new_audio_ext
        data['audio']['src'] = new_src

        # 写回文件
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"✓ 更新 {data_file}: {old_src} -> {new_src}")
        return True
    return False

def update_html_file(html_file):
    """更新HTML文件中的audio标签"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 替换MP3为M4A，更新type
    new_content = content.replace('src="audio/description.mp3"', 'src="audio/description.m4a"')
    new_content = new_content.replace('type="audio/mpeg"', 'type="audio/mp4"')

    if new_content != content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ 更新 {html_file}")
        return True
    return False

def main():
    base_dir = Path(".")
    works = ["family-portrait", "sunset-painting", "winter-scene"]

    for work in works:
        print(f"\n处理作品: {work}")

        work_dir = base_dir / "works" / work
        data_file = work_dir / "data.json"
        html_file = work_dir / "index.html"
        audio_dir = work_dir / "audio"

        # 确保audio目录存在
        audio_dir.mkdir(exist_ok=True)

        # 提取转录文本
        transcript = extract_transcript(data_file)
        if not transcript:
            print(f"⚠  {work} 没有转录文本，跳过")
            continue

        # 生成音频文件
        audio_file = audio_dir / "description.m4a"
        generate_audio(transcript, str(audio_file))

        # 更新data.json
        update_data_json(data_file)

        # 更新HTML文件
        update_html_file(html_file)

    print("\n✅ 所有作品处理完成！")

if __name__ == "__main__":
    main()