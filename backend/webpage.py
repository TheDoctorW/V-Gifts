"""
    This file contains webpage operations
    including:
        item sorting
        order sorting
        product recommendation
"""


import random as rd
import numpy as np
import database as db
import user as us


def unit_vector(vector):
    """
        Returns the unit vector of the vector.  
    """
    # deal with [0, 0, 0, ..., 0]
    if_all_zero = sum(map(abs,vector))
    if if_all_zero == 0:
        return vector
    # regular calculation
    return vector / np.linalg.norm(vector)

def angle_between(v1, v2):
    """ 
        Returns the angle in radians between vectors "v1" and "v2"
    """
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    return np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0))

def prod_recommendation(user_id, prod_lst = [], db_name = "database.json", num = 100):
    """
        This function calculates the similarity between
        user_interest vector and
        product category
        to rank products and recommend

        returns a list of product_id, sorted
    """
    # item & value calculator
    lst = prod_picker(user_id, prod_lst, db_name)
    # return sorted result (descending)
    rt = sorting_merge(lst, 1)
    if len(rt) <= num:
        return rt
    else:
        return rt[:num]

def interest_calculator(v_1, v_2, key):
    """
        for example
        u_interest = [1, 2, 3, 4, 5]
        it_category = [6, 7, 8, 9, 10]
    """
    return (key, angle_between(v_1, v_2))

def prod_picker(user_id, prod_lst = [], db_name = "database.json"): # percent -> the chance of product is joining the recommendation
    # prod_lst = DB
    dbs = db.load_json(db_name)
    prod_lst = dbs["PRODUCT_DB"].keys() if prod_lst == [] else prod_lst
    user_v = dbs["USER_DB"][str(int(user_id))]["interest"]
    # append to lst
    lst = []
    for item in prod_lst:
        v_1 = dbs["PRODUCT_DB"][item]["category"]
        lst.append(interest_calculator(v_1, user_v, item))
    return lst

def sorting_helper(lst1, lst2, posi, mode = 0):
    if len(lst1) == 0:
        return lst2
    if len(lst2) == 0:
        return lst1
    new = []
    while len(lst1) > 0 and len(lst2) > 0:
        l1 = lst1[0]
        l2 = lst2[0]
        if mode == 0: # ascending
            if l1[posi] <= l2[posi]:
                new.append(l1)
                lst1.pop(0)
            else: # l1[1] > l2[1]
                new.append(l2)
                lst2.pop(0)
        else: # mode != 0, descending
            if l1[posi] > l2[posi]:
                new.append(l1)
                l1 = lst1.pop(0)
            else: # l1[1] <= l2[1]
                new.append(l2)
                l2 = lst2.pop(0)

    # merge tails
    if len(lst1) == 0:
        new.extend(lst2)
    else: # len(lst2) == 0
        new.extend(lst1)

    return new

def sorting_merge(lst, posi = 1, mode = 0): # lst -> [(id, value), ....]
    """
        This function sorts a list [(id, value), ...]
        depends on the aspect chosen
        mode == 0: ascending
        mode == 1: descending
        posi => position of the value being compared
    """
    midd = int(len(lst)/2)
    if midd == 0:
        return lst
    left = sorting_merge(lst[:midd], posi, mode)
    right = sorting_merge(lst[midd:], posi, mode)
    new = sorting_helper(left, right, posi, mode)
    return new

def order_filter_sort(order_keys, option = None, mode = 1, db_name = "database.json"):
    """
        This function is used to reorder order_list
        option => any key of order_db items
        mode = 1  -> decending
        mode = 0  -> ascending
    """
    dbs = db.load_json(db_name)
    order_keys = list(dbs["ORDER_DB"].keys())
    rt = []
    temp_lst = [] # [[key, <option>], ...]
    for item in order_keys:
        temp_lst.append([item, dbs["ORDER_DB"][item]["id"]])
    # sort list for all options
    if option is None:
        return order_keys
    else:
        if option not in dbs["ORDER_DB"][order_keys[0]]:
            raise KeyError()
        else:
            for item in temp_lst:
                item[1] = dbs["ORDER_DB"][item[0]][option]
            temp_lst = sorting_merge(temp_lst, 1, mode)
    # turn into list of keys
    for item in temp_lst:
        rt.append(item[0])
    return rt

def order_filter_switch(order_keys, option, minn = None, maxx = None, db_name = "database.json"):
    """
        This function filters order based on
        option and the value of the option

        Only allows option with values in range 
        to be returned
    """
    dbs = db.load_json(db_name)
    # order_keys = list(dbs["ORDER_DB"].keys())
    rt = []
    # sort list for all options
    temp_lst = []
    if option not in dbs["ORDER_DB"][order_keys[0]]:
        raise KeyError()
    else:
        for key in order_keys:
            # must have min and max at the same time
            if minn != None and maxx != None \
                and dbs["ORDER_DB"][key][option] >= minn \
                and dbs["ORDER_DB"][key][option] <= maxx:
                temp_lst.append([key, dbs["ORDER_DB"][key][option]])
            else:
                temp_lst.append([key, dbs["ORDER_DB"][key][option]])
    # turn into list of keys
    for item in temp_lst:
        rt.append(item[0])
    return rt

def order_filter(option_lst, mode = 1, permission = "admin", u_id = -1, db_name = "database.json"):
    """
        option_lst => [[option, min, max], ...]
        A combination of
        order_filter_switch
        and
        order_filter_sort
    """
    dbs = db.load_json(db_name)
    if permission == "admin":
        order_keys = list(dbs["ORDER_DB"].keys())
    elif permission == "user":
        order_keys = dbs["USER_DB"][str(u_id)]["order"]
    else:
        raise ValueError() 
    
    for options in option_lst:
        option, minn, maxx = options
        order_keys = order_filter_sort(order_keys, option)
        order_keys = order_filter_switch(order_keys, option, minn, maxx)
    
    return order_keys

def prod_filter(option_lst, mode = 1, db_name = "database.json"):
    """
        This function is used to filter/reorder product_list
        option_lst => [[option, min, max], ...]
        product:{
            "id": new_id,
            "name": name,
            "price": price,
            "description": description,
            "category": category, # [0] * dbs["TYPE_OF_PRODUCTS"]
            "delivery": deli_days,
            "ratings": [],
                        # [(u_id, rating), ...]
            "pic": None
        }
    """
    dbs = db.load_json(db_name)
    prod_keys = list(dbs["PRODUCT_DB"].keys())
    for options in option_lst:
        option, minn, maxx = options
        prod_keys = prod_filter_sort(prod_keys, option, mode)
        prod_keys = prod_filter_switch(prod_keys, option, minn, maxx)
    
    return prod_keys

def prod_filter_switch(prod_keys, option, minn = None, maxx = None, db_name = "database.json"):
    """
        This function filters order based on
        option and the value of the option (["price", "delivery"])

        Only allows option with values in range 
        to be returned

        usually apply to:
            1. price
            2. delivery days
    """
    dbs = db.load_json(db_name)
    # order_keys = list(dbs["ORDER_DB"].keys())
    rt = []
    # sort list for all options
    temp_lst = []
    if option not in dbs["PRODUCT_DB"][prod_keys[0]]:
        raise KeyError()
    else:
        for key in prod_keys:
            # must have min and max at the same time
            if minn != None and maxx != None \
                and dbs["PRODUCT_DB"][key][option] >= minn \
                and dbs["PRODUCT_DB"][key][option] <= maxx:
                temp_lst.append([key, dbs["PRODUCT_DB"][key][option]])
    # turn into list of keys
    for item in temp_lst:
        rt.append(item[0])
    return rt

def prod_filter_sort(prod_keys, option = None, mode = 1, db_name = "database.json"):
    """
        This function is used to reorder order_list
        mode = 1  -> decending
        mode = 0  -> ascending
    """
    dbs = db.load_json(db_name)
    rt = []
    temp_lst = [] # [[key, <option>], ...]
    for item in prod_keys:
        temp_lst.append([item, dbs["PRODUCT_DB"][item]["id"]])
    # sort list for all options
    if option is None:
        return prod_keys
    else:
        if option not in dbs["PRODUCT_DB"][prod_keys[0]]:
            raise KeyError()
        else:
            for item in temp_lst:
                item[1] = dbs["PRODUCT_DB"][item[0]][option]
            temp_lst = sorting_merge(temp_lst, 1, mode)
    # turn into list of keys
    for item in temp_lst:
        rt.append(item[0])
    return rt

def rating_calc(prod_id, db_name = "database.json"):
    dbs = db.load_json(db_name)
    ratings = dbs["PRODUCT_DB"][str(prod_id)]["ratings"]
    if len(ratings) == 0:
        return 0
    else:
        rt_lst = []
        for item in ratings:
            rt_lst.append(item[1])
        return sum(rt_lst) / len(rt_lst)

def prod_filter_type(prod_lst = [], ctgry = [], \
        price_rg = [0, 99999999], db_name = "database.json"):
    """
        This function filters product by category
        and price range
    """
    dbs = db.load_json(db_name)
    all_prod = prod_lst if prod_lst != [] else list(dbs["PRODUCT_DB"].keys())
    # filter catagory
    rt1 = []
    rt2 = []
    # if category is chosen
    if ctgry != [] or ctgry != None:
        for prod in all_prod:
            prod_summ = 1
            # for all choson category, product has a positive direction on that category
            for i in range(len(ctgry)):
                if ctgry[i] > 0:
                    prod_summ *= ctgry[i] * dbs["PRODUCT_DB"][prod]["category"][i]
            if prod_summ > 0:
                rt1.append(prod)
    else:
        rt1 = all_prod
    # filter price
    rt2 = []
    for prod in rt1:
        if int(dbs["PRODUCT_DB"][prod]["price"]) >= int(price_rg[0]) \
            and int(dbs["PRODUCT_DB"][prod]["price"]) <= int(price_rg[-1]):
            rt2.append(prod)
    return rt2

def keyword_searcher(keyword = "", db_name = "database.json"):
    dbs = db.load_json(db_name)
    if keyword == "":
        return list(dbs["PRODUCT_DB"].keys())
    else:
        rt = []
        keywords = keyword.lower().split(" ")
        for kwd in keywords:
            for prod in list(dbs["PRODUCT_DB"].keys()):
                if kwd in dbs["PRODUCT_DB"][prod]["name"].lower() \
                    or kwd in dbs["PRODUCT_DB"][prod]["description"].lower():
                    rt.append(prod)
        rt = list(set(rt))
        return rt

def search_filter_recommendation(keyword = "", ctgry = [], \
            price_rg = [0, 99999999], user_id = -1, page = -1, db_name = "database.json"):
    """
        This function searches with a keyword, filter with selection,
        and rank product based on recommendation
        keyword_searcher(keyword = "", db_name = "database.json") -> list
        prod_filter_type(prod_lst = [], ctgry = [], \
            price_rg = [0, 99999999], db_name = "database.json") -> list
        prod_recommendation(user_id, prod_lst = [], db_name = \
            "database.json", num = 100) -> list
    """
    flag = True
    rt0 = keyword_searcher(keyword, db_name)
    if len(rt0) == 0:
        rt0 = []
        flag = False
    rt1 = prod_filter_type(rt0, ctgry, price_rg, db_name)
    if user_id != -1:
        rt2 = prod_recommendation(user_id, rt1, db_name)
        rt3 = []
        for item in rt2:
            rt3.append(item[0])
    else:
        rt3 = rt1
    # deal with page number
    if page != -1:
        rt4 = []
        for i in range(len(rt3)):
            if i >= (page-1)*9 and i < page*9:
                # e.g. page 1 => item 0~8
                rt4.append(rt3[i])
    else: # return all prods
        rt4 = rt3
    # append prod info
    dbs = db.load_json(db_name)
    lst = []
    for key in rt4:
        rtt = round(rating_calc(dbs["PRODUCT_DB"][key]["id"]),2)
        lst.append({
            "product_id": dbs["PRODUCT_DB"][key]["id"],
            "name": dbs["PRODUCT_DB"][key]["name"],
            "price": dbs["PRODUCT_DB"][key]["price"],
            "rating": rtt,
            "pic_link": dbs["PRODUCT_DB"][key]["pic"]
        })
    return {
        "product_lst": lst,
        "total_pages": us.ceil((len(rt3)/9)),
        "flag": flag
    }
