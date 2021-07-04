"""
    This file includes all database structure for 
    all databases, DO NOT make ANY CHANGE
    without notifying other members. Upon adding new
    attributes, PLEASE do pytest to remove any
    conflict changes.
"""


import json
import admin as adm
from chatbot import TEST_KEYWORDS
from login import encrypt_password


# Global values

TYPE_OF_PRODUCTS_INIT = 11


# Main fuctions

def init_db():
    """
        This fuction initialize the database 
        with no values but a pre-set admin for further use
    """
    dbs = {
        "TYPE_OF_PRODUCTS": TYPE_OF_PRODUCTS_INIT,   # dimension of interests
        "PROD_CATAGORY":["for men", 
                        "for women", 
                        "for children", 
                        "for friends", 
                        "for elder",
                        "for relationship", 
                        "foods", 
                        "tools", 
                        "luxuries",
                        "entertainment", 
                        "working",
                        ],
        "USER_ID": 0,
        "ADMIN_ID": 1,
        "PRODUCT_ID": 0,
        "ORDER_ID": 0,
        "USER_DB": {},
        "ADMIN_DB": {},
        "PRODUCT_DB": {},
        "ORDER_DB": {},
        "TOKEN_DB":{}
    }
    admin = adm.new_preset_admin("admin", encrypt_password("admin"), "VictimsCOMP3900@gmail.com")
    dbs["ADMIN_DB"][str(admin["id"])] = admin
    return dbs

def pretty_print(dct, level = 0, strr = "    "):
    for key in dct.keys():
        for i in range(level):
            print(strr, end = "")
        print(key, ":")
        if isinstance(dct[key], dict):
            pretty_print(dct[key], level+1)
        else:
            for i in range(level+1):
                print(strr, end = "")
            print(dct[key])
    return {}

def valid_id(option, idd, db_name = "database.json"):
    """
        This func checks if an id exist in database
        options in user/product/admin/order
    """
    dbs = load_json(db_name)
    if option == "user" or option == "users":
        if str(idd) in dbs["USER_DB"]:
            return True
    elif option == "product" or option == "products":
        if str(idd) in dbs["PRODUCT_DB"]:
            return True
    elif option == "admin" or option == "admins":
        if str(idd) in dbs["ADMIN_DB"]:
            return True
    elif option == "order" or option == "orders":
        if str(idd) in dbs["ORDER_DB"]:
            return True

    # raise key error if id not found
    raise KeyError()

def to_json(dbs, filename = "database.json"):
    """
        This fuction save database to json file
    """
    with open(filename, "w") as fp:
        json.dump(dbs, fp)
    return {}

def load_json(filename = "database.json"):
    """
        This function loads database from json file
    """
    with open(filename, "r") as fp:
        dbs = json.load(fp)
    return dbs

def add_user(user, db_name = "database.json"):
    """
        This fuction add user to database
    """
    dbs = load_json(db_name)
    dbs["USER_DB"][str(user["id"])] = user
    to_json(dbs, db_name)
    return {}

def add_admin(admin, db_name = "database.json"):
    """
        This fuction add admin to database
    """
    dbs = load_json(db_name)
    dbs["ADMIN_DB"][str(admin["id"])] = admin
    to_json(dbs, db_name)
    return {}

def add_prod(prod, db_name = "database.json"):
    """
        This fuction add product to database
    """
    dbs = load_json(db_name)
    dbs["PRODUCT_DB"][str(prod["id"])] = prod
    to_json(dbs, db_name)
    return {}

def add_order(order, db_name = "database.json"):
    """
        This fuction add order to database
    """
    dbs = load_json(db_name)
    dbs["ORDER_DB"][str(order["id"])] = order
    to_json(dbs, db_name)
    return {}

def clear_db(db_name = "database.json"):
    """
        This fuction reset all value in database to its initial value
    """
    to_json(init_db(), db_name)
    return {}

def id_generator(option, db_name = "database.json"):
    """
        This fuction generate id of objects
        options in user/product/admin/order
    """
    dbs = load_json(db_name)
    if option == "user" or option == "users":
        dbs["USER_ID"] += 1
        to_json(dbs, db_name)
        return dbs["USER_ID"]
    elif option == "product" or option == "products":
        dbs["PRODUCT_ID"] += 1
        to_json(dbs, db_name)
        return dbs["PRODUCT_ID"]
    elif option == "admin" or option == "admins":
        dbs["ADMIN_ID"] += 1
        to_json(dbs, db_name)
        return dbs["ADMIN_ID"]
    elif option == "order" or option == "orders":
        dbs["ORDER_ID"] += 1
        to_json(dbs, db_name)
        return dbs["ORDER_ID"]
    else:
        # raise key error if option not in range
        raise KeyError()

def check_interest_dim(category, db_name = "database.json"):
    """
        This fuction check user interest dimension
    """
    dbs = load_json(db_name)
    if len(category) == dbs["TYPE_OF_PRODUCTS"]:
        return True
    else:
        return False

def add_product_type(db_name = "database.json"):
    """
        This fuction add more product type
    """
    dbs = load_json(db_name)
    dbs["TYPE_OF_PRODUCTS"] += 1
    for key in dbs["PRODUCT_DB"]:
        dbs["PRODUCT_DB"][key]["category"].append(0)
    for key in dbs["USER_DB"]:
        dbs["USER_DB"][key]["interest"].append(0)
    to_json(dbs, db_name)
    return dbs["TYPE_OF_PRODUCTS"]

def get_interest_lst():
    """
        This functions returns all keywords as options to user
        to set up user's interest
    """
    return list(TEST_KEYWORDS.keys())
