# -*- coding: utf-8 -*-
"""
Full Generator for 1,000 Marathi Proverbs Dataset.
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

def normalize(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text)
    text = re.sub(r'[\u0964\u0965]', ' ', text)
    text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()?"\'–—]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip().lower()

print("Ready to generate.")
