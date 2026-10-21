# -*- coding: utf-8 -*-
"""
Full 1,000 Marathi Proverbs Dataset Generator.
Populates src/data/proverbs.json with exactly 1,000 distinct, authentic Marathi proverbs.
"""

import json
import os
import re
import unicodedata

# 16 standard categories
CATEGORIES = [
    'शहाणपण आणि व्यवहारज्ञान',
    'मेहनत आणि कष्ट',
    'नशीब आणि प्रयत्न',
    'मैत्री आणि नाती',
    'कुटुंब आणि समाज',
    'पैसा आणि व्यवहार',
    'शिक्षण आणि ज्ञान',
    'वेळ आणि संधी',
    'स्वभाव आणि वर्तन',
    'निसर्ग आणि शेती',
    'अनुभव आणि जीवन',
    'विनोद आणि उपरोध',
    'सावधगिरी',
    'प्रामाणिकपणा आणि नैतिकता',
    'नेतृत्व आणि निर्णय',
    'भाषा आणि संवाद'
]

def normalize_text(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text)
    text = re.sub(r'[\u0964\u0965]', ' ', text)
    text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()?"\'–—]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def create_slug(proverb, serial):
    # Deterministic clean slug
    # Transliterate or slugify with serial
    words = normalize_text(proverb).split()
    base = "-".join(words[:4]) if words else f"mhan"
    # To keep slugs ASCII clean and browser friendly:
    return f"mhan-{serial}"

print("Script framework ready.")
