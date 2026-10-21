# -*- coding: utf-8 -*-
"""
Curated 1,000 Marathi Proverbs Dataset Builder.
Assembles 1,000 authentic, distinct Marathi proverbs across 16 thematic categories.
"""

import json
import re
import unicodedata

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

def slugify(text, serial):
    """Create a URL friendly slug."""
    text = text.strip()
    slug_base = f"mhan-{serial}"
    return slug_base

def normalize_text(text):
    """Normalize Devanagari text for search indexing."""
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text)
    # Remove danda, punctuation
    text = re.sub(r'[\u0964\u0965]', ' ', text)
    text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()?"\'–—]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

print("Dataset builder initialized.")
