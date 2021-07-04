"""
    This file contains user side types and operations
"""


import database as db
import product as pdt
import login as lo
import order as odr
import error as err
from numpy import ceil
from chatbot import TEST_KEYWORDS


# Object types

def new_user(account_name, first_name, last_name, password, email, address, city, \
            country, db_name = "database.json"):
    """
        This fuction create new user with input data
    """
    new_id = db.id_generator("user", db_name)
    dbs = db.load_json(db_name)
    return {
        "id": new_id,
        "name": account_name,
                # account name
        "fname": first_name,
        "lname": last_name,
        "password": password,
        "email": email,
        "address": address,
        "city": city,
        "country": country,
        "fund": 2000,
        "shopping_cart": [],
                # [[product_id, amount], ...]
        "order": [],
                # [order_id, ...]
        "interest": [0] * dbs["TYPE_OF_PRODUCTS"]
    }


# User related operations

def show_profile(user_id, db_name = "database.json"):
    """
        This fuction show user profile 
    """
    db.valid_id("user", user_id, db_name)
    dbs = db.load_json(db_name)
    return {
        "first_name": dbs["USER_DB"][str(user_id)]["fname"],
        "last_name": dbs["USER_DB"][str(user_id)]["lname"],
        "username": dbs["USER_DB"][str(user_id)]["name"],
        "email": dbs["USER_DB"][str(user_id)]["email"],
        "address": dbs["USER_DB"][str(user_id)]["address"],
        "city": dbs["USER_DB"][str(user_id)]["city"],
        "country": dbs["USER_DB"][str(user_id)]["country"],
        "fund": dbs["USER_DB"][str(user_id)]["fund"],
    }

def add_fund(user_id, num):
    """
        This function adds fund to a user
    """
    dbs = db.load_json()
    db.valid_id("user",user_id)
    dbs["USER_DB"][str(user_id)]["fund"] += num
    new_fund = dbs["USER_DB"][str(user_id)]["fund"]
    db.to_json(dbs)
    return {
        "fund": new_fund
    }

def add_interest(user_id, posi, num):
    """
        This function updates user's interest
        Prevent overflow
    """
    dbs = db.load_json()
    db.valid_id("user",user_id)
    dbs["USER_DB"][str(user_id)]["interest"][posi % dbs["TYPE_OF_PRODUCTS"]] \
             += num
    db.to_json(dbs)
    return dbs["USER_DB"][str(user_id)]["interest"]

def setup_interest(user_id, vec, db_name = "database.json"):
    """
        This function updates user's interest
        Prevent overflow
    """
    dbs = db.load_json(db_name)
    db.valid_id("user",user_id, db_name)
    dbs["USER_DB"][str(user_id)]["interest"] = vec
    db.to_json(dbs, db_name)
    return dbs["USER_DB"][str(user_id)]["interest"]

def change_password(user_id, old_password, new_password):
    """
    This fuction check the name and password (encrypt) match
    and then reset the password (no encrypt)
    """
    dbs = db.load_json()
    db.valid_id("user", user_id)
    if dbs["USER_DB"][str(user_id)]["password"] == old_password:
        dbs["USER_DB"][str(user_id)]["password"] = lo.encrypt_password(new_password)
        db.to_json(dbs)
        return True
    raise err.InvalidPassword

def edit_info_user(user_id, first_name, last_name, address, city, \
            country, db_name = "database.json"):
    """
        This function edits user info
        But no permission to change account name and email
        change password from us.change_password func
    """
    dbs = db.load_json(db_name)
    dbs["USER_DB"][str(user_id)]["fname"] = first_name
    dbs["USER_DB"][str(user_id)]["lname"] = last_name
    dbs["USER_DB"][str(user_id)]["address"] = address
    dbs["USER_DB"][str(user_id)]["city"] = city
    dbs["USER_DB"][str(user_id)]["country"] = country
    db.to_json(dbs, db_name)
    return {}

def my_reset_passowrd(email, db_name = "database.json"):
    """
        This function picks the email and send link to reset password
    """
    dbs = db.load_json(db_name)
    for user_id, user_info in dbs["USER_DB"].items():
        if user_info["email"] == email:
            return user_info
    raise err.InvalidEmail()

def show_user_cart(user_id, db_name = "database.json"):
    """
        This function shows the shopping cart of a user
    """
    db.valid_id("user", user_id, db_name)
    dbs = db.load_json(db_name)
    return dbs["USER_DB"][str(user_id)]["shopping_cart"]

def add_product_to_cart(user_id, product_id, amount, db_name = "database.json"):
    """
        This function adds a product into user's shopping cart
    """
    db.valid_id("user", user_id, db_name)
    db.valid_id("product", product_id, db_name)
    cart = show_user_cart(user_id, db_name)
    i = 0
    while (i < len(cart)):
        if (cart[i][0] == product_id):
            break
        i = i + 1
    dbs = db.load_json(db_name)
    if i == len(cart):
        item = [product_id, amount] # (product_id, amount)
        dbs["USER_DB"][str(user_id)]["shopping_cart"].append(item)
    else:
        product_id, old_amount = cart[i]
        pair = [product_id, amount + old_amount]
        dbs["USER_DB"][str(user_id)]["shopping_cart"][i] = pair
    db.to_json(dbs, db_name)
    return {}

def remove_prod_from_cart(user_id, cart_item_pair, db_name = "database.json"):
    """
        cart_item_pair -> (product_id, amount)
        This function removes product from cart
    """
    product_id, amount = cart_item_pair
    db.valid_id("user",user_id, db_name)
    db.valid_id("product",product_id, db_name)
    dbs = db.load_json(db_name)
    dbs["USER_DB"][str(user_id)]["shopping_cart"].remove(cart_item_pair)
    db.to_json(dbs, db_name)
    return {}

def individual_price(product_id, amount, db_name = "database.json"):
    """
        This fuction caculate individual product price using amount
    """
    dbs = db.load_json(db_name)
    price = amount * int(dbs["PRODUCT_DB"][str(product_id)]["price"])
    return price

def total_price(lst, db_name = "database.json"):
    """
        This function calculates the total price of item in cart
    """
    price = 0
    for cart_item_pair in lst:
        product_id, amount = cart_item_pair
        price += int(individual_price(product_id, amount, db_name))
    return price

def change_cart_amount(user_id, cart_index, new_amount, db_name = "database.json"):
    """
        This fuction change the amount of product in user's cart
        auto remove product from cart when amount = 0
    """
    db.valid_id("user", user_id, db_name)
    dbs = db.load_json(db_name)
    pair = dbs["USER_DB"][str(user_id)]["shopping_cart"][cart_index]
    if new_amount == 0:
        dbs["USER_DB"][str(user_id)]["shopping_cart"].pop(cart_index)
    else:
        product_id, amount = pair
        pair = [product_id, new_amount]
        dbs["USER_DB"][str(user_id)]["shopping_cart"][cart_index] = pair
    db.to_json(dbs, db_name)
    return {}

def show_all_cart(user_id, db_name = "database.json"):
    """
        This fuction show the user's cart with details information
    """
    cart_lst = []
    dbs = db.load_json(db_name)
    cart = show_user_cart(user_id, db_name)
    for pair in cart:
        product_id, amount = pair
        cart_lst.append({
            "product_id": product_id,
            "product_name": pdt.product_id_to_name(product_id),
            "pic_link": dbs["PRODUCT_DB"][str(product_id)]["pic"],
            "amount": amount,
            "price": dbs["PRODUCT_DB"][str(product_id)]["price"],
            "cost": individual_price(product_id, amount)
        })
    return cart_lst

def get_user_cart_n(user_id, db_name = "database.json"):
    dbs = db.load_json(db_name)
    n1 = len(dbs["USER_DB"][str(user_id)]["shopping_cart"])
    n2 = 0
    if n1 == 0:
        pass
    else:
        for p_pair in dbs["USER_DB"][str(user_id)]["shopping_cart"]:
            n2 += p_pair[1]
    return {
        "cart_product_num": n1,
        "cart_product_total": n2
    }

def purchase(user_id, cart, db_name = "database.json"):
    """
        This function makes payment
        lst -> [[product_id, amount], ...]
        1. check fund
        2. make payments
    """
    # 1
    db.valid_id("user", user_id, db_name)
    total_cost = total_price(cart, db_name)
    dbs = db.load_json(db_name)
    user_fund = dbs["USER_DB"][str(user_id)]["fund"]
    if user_fund < total_cost:
        # not enough fund
        raise err.NotEoughFund(description = "Not enough fund, purchase fail!")
    else:
        # 2
        # enough fund
        dbs["USER_DB"][str(user_id)]["fund"] -= total_cost
        db.to_json(dbs, db_name)
        for cart_item_pair in cart:
            product_id, amount = cart_item_pair
            increment_user_interest(user_id, product_id, db_name)
            result = odr.create_order(user_id, product_id, amount, db_name)
    return {}

def increment_user_interest(user_id, product_id, db_name = "database.json"):
    """
        This function changes user's interest upon purchasing products
    """
    dbs = db.load_json(db_name)
    vec_1 = dbs["PRODUCT_DB"][str(product_id)]["category"]
    for i in range(len(vec_1)):
        dbs["USER_DB"][str(user_id)]["interest"][i] = \
                round(dbs["USER_DB"][str(user_id)]["interest"][i]/2.0 + vec_1[i]/2.0, 2)
    db.to_json(dbs, db_name)
    return {}

def edit_user_interest(u_id, interest_lst, db_name = "database.json"):
    """
        This function is used to directly edit 
        user's interest vecetor
    """
    db.valid_id("user", u_id, db_name)
    dbs = db.load_json(db_name)
    # 11 product types
    interest_vector = [0] * 11
    for ctgry in interest_lst:
        for item in TEST_KEYWORDS[ctgry]:
            interest_vector[item] += 1
            
    dbs["USER_DB"][str(u_id)]["interest"] = interest_vector
    db.to_json(dbs, db_name)
    return {}
