"""
    This file implements a chatbot AI based on provided keyword list
    It uses Information Retrieval technic to calculate the 
        interest vector in user"s query and compare with that of 
        product description, to find the best match.
    Upon if the top match is pretty poor (??? w8 definition), 
        chatbot AI should (??? not decided yet)
"""


import re
import database as db


TEST_KEYWORDS = {
    "men": [0], "man": [0], "dad": [0], "groom": [0], "bridegroom": [0], 
    "father's": [0], "men's": [0], "man's": [0], "family": [0, 1, 2, 4], 
    "women": [1], "woman": [1], "mom": [1], "bride": [1], "mother": [1], 
    "women's": [1], "woman's": [1], "mother's": [1], "lady": [1], "ladies": [1], 
    "lego": [2], "toy": [2], "piano": [2], "bag": [2, 3, 7], "teen": [2], 
    "kid": [2], "kids": [2], "girls": [2], "girl": [2], "boys": [2], "boy": [2], 
    "birthday": [2], "whiskey": [3], "cocktail": [3], "music": [3, 9], "music box": [3], "bluetooth": [3], "friendship": [3], "friend": [3], "friends": [3], "grandma": [4], "grandmother": [4], "grandpa": [4], "grandfather": [4], "couple": [5], "love": [5], "candle": [5], "cooking": [6], "organic": [6], "grilling": [6], "grill": [6], "cook": [6], "pork": [6], "beef": [6], "snack": [6], "sweet": [6], "hot": [6], "spicy": [6], "protein": [6], 
    "health": [6], "healthy": [6], "food": [6, 6], "chocolate": [6], "honey": [6], 
    "wellness": [6], "gluten-free": [6], "vegetarianism": [6], "vegan": [6], "foods": [6], "survival": [7], "gear": [7], "tool": [7], "tools": [7], "flash": [7], "necklace": [8], "earrings": [8], "jewelry": [8], "ring": [8], "gold": [8], "luxury": [8], "pendant": [8], "cloth": [9], "hoodies": [9], "hoody": [9], "travel": [9], "outdoor": [9], "entertainment": [9], 
    "office": [10], "pen": [10], "pens": [10], "professional": [10], "working": [10], 
    "work": [10], "notebook": [10]
}

NUM_CATA = 11

TEST_QRY = \
    "I want a toy for children, and my wife. But I don\"t like it for men.\
    My neighbor's husband doesn't like toy."

TEST_QRY_UPPER = \
    "I want a toy for children, and my wife. But I don\"t like it for men.\
    My neighbor's husband doesn't like toy.".upper()

TEST_QRY_1 = \
    "I don't want cat toys nor dog toys"

def query_analysis_test0(qry):
    """
        This function simply returns the frequency 
        of catagory of keywords
    """
    lst = re.split("[,.; ]", qry)
    vec = [0] * NUM_CATA
    kwds = TEST_KEYWORDS
    for wd in lst:
        if wd in kwds.keys():
            for cate in kwds[wd]:
                vec[cate] += 1
    return vec

def deminishing_returns(num):
    """
        This function returns a slightly larger number
        then input, with a reduced increasing rate
        for each recursive call.
        e.g. 0 --> 0, 1 --> 1, 2 --> 1.5
    """
    if num == 0:
        return 0.0
    else:
        summ = 0
        if num > 0:
            while num > 0:
                summ += 1.0/num
                num -= 1
            return summ 
        else: # num < 0
            n = -1 * num 
            while n > 0:
                summ += 1.0/n
                n -= 1
            return -1 * summ

def query_analysis_test1(qry):
    """
        This function returns the weighted
        frequency of catagory of keywords

        For high frequency words, the score increases slower
    """
    lst = re.split("[,.; ]", qry)
    vec = [0] * NUM_CATA
    kwds = TEST_KEYWORDS
    for wd in lst:
        if wd in kwds.keys():
            for cate in kwds[wd]:
                vec[cate] += 1
    return list(map(deminishing_returns, vec))

def adding_lsts(lst1, lst2): # -> lst
    assert len(lst1) == len(lst2)
    new = []
    for i in range(len(lst1)):
        new.append(lst1[i] + lst2[i])
    return new

def query_analysis_test2(qry):
    """
        This function returns the weighted score
        of word frequency, but qry is seperated into sections
    """
    qrys = qry.split(".")
    vec = [0] * NUM_CATA
    for qryy in qrys:
        vec = adding_lsts(vec, 
                            query_analysis_test0(qryy))
    return list(map(deminishing_returns, vec))

def query_analysis_test3(qry):
    """
        This function identifies negation in qry,
        and punishes the direction on value negated

        <qry> should include product name if name mentions 
        important keywords
    """
    qrys = qry.split(".")
    vec = [0] * NUM_CATA
    for qryy in qrys:
        vec = adding_lsts(vec, 
                            query_analysis_test1(qry.lower()))
    return list(map(deminishing_returns, vec))
