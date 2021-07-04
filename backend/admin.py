"""
    This fill contains functions related to admin
"""


import database as db
import user as usr
import product as pdt


# Object types

def new_preset_admin(name, password, email):
    """
        This fuction create a preset admin with id = 1
    """
    return {
        "id": 1,
        "name": name,
        "password": password,
        "email": email
    }

def new_admin(name, password, email, db_name = "database.json"):
    """
        This fuction create new admin with input data
    """
    new_id = db.id_generator("admin", db_name)
    return {
        "id": new_id,
        "name": name,
        "password": password,
        "email": email
    }


# Admin related operators

def edit_admin(admin_id, name, password, email, db_name = "database.json"):
    """
        This function edits admin info with inputs above
        and returns the id of this admin
    """
    dbs = db.load_json(db_name)
    if str(admin_id) not in dbs["ADMIN_DB"]:
        raise KeyError()
    dbs["ADMIN_DB"][str(admin_id)]["name"] = name
    dbs["ADMIN_DB"][str(admin_id)]["password"] = password
    dbs["ADMIN_DB"][str(admin_id)]["email"] = email
    db.to_json(dbs, db_name)
    return {
        "id": admin_id
    }

def get_user_list():
    """
        This functions returns all user's basic infomation for admin
    """
    dbs = db.load_json()
    usr_lst = []
    for key in dbs["USER_DB"].keys():
        usr_lst.append({
            "user_id": dbs["USER_DB"][key]["id"],
            "account_name": dbs["USER_DB"][key]["name"],
            "first_name": dbs["USER_DB"][key]["fname"],
            "last_name": dbs["USER_DB"][key]["lname"],
            "email": dbs["USER_DB"][key]["email"],
            "address": dbs["USER_DB"][key]["address"],
            "city": dbs["USER_DB"][key]["city"],
            "country": dbs["USER_DB"][key]["country"]
        })
    return usr_lst

def show_profile(admin_id):
    """
        This function show the details of admin
    """
    db.valid_id("admin", admin_id)
    dbs = db.load_json()
    return {
        "username": dbs["ADMIN_DB"][str(admin_id)]["name"],
        "email": dbs["ADMIN_DB"][str(admin_id)]["email"]
    }

def get_all_order():
    """
        This fuction get all order's details information for all users
    """
    dbs = db.load_json()
    order_lst = []
    for key in dbs["ORDER_DB"].keys():
        uid = dbs["ORDER_DB"][key]["user_id"]
        product_id = dbs["ORDER_DB"][key]["product_id"]
        amount = dbs["ORDER_DB"][key]["amount"]
        datte = dbs["ORDER_DB"][key]["purchase_date"]
        state_in_code = dbs["ORDER_DB"][key]["state"]
        if state_in_code == 0:
            state_in_text = "Just purchase"
        elif state_in_code == 1:
            state_in_text = "Delivering"
        elif state_in_code == 2:
            state_in_text = "Done"
        elif state_in_code == 3:
            state_in_text = "Cancelled / Refunded"
        else:
            state_in_text = "Invalid state"
        order_lst.append({
            "order_id": key,
            "user_id": uid,
            "product_id": product_id,
            "product_name": pdt.product_id_to_name(product_id),
            "amount": amount,
            "pic_link": dbs["PRODUCT_DB"][str(product_id)]["pic"],
            "cost": usr.individual_price(product_id, amount),
            "purchase_date": int(datte),
            "state_in_code": state_in_code,
            "state_in_text": state_in_text,
            "rating": dbs["ORDER_DB"][key]["rating"]
        })
    return order_lst

def get_all_admin():
    """
        This fuction get all admin information in database
    """
    dbs = db.load_json()
    admin_lst = []
    for key in dbs["ADMIN_DB"].keys():
        admin_lst.append({
            "admin_id": key,
            "username": dbs["ADMIN_DB"][key]["name"],
            "email": dbs["ADMIN_DB"][key]["email"]
        })
    return admin_lst
