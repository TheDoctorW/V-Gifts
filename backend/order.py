"""
    This file contains order related functions and operations
"""


import database as db
import datetime as dt
import admin as adm
import user as usr
import product as pdt


# Object types

def new_order(user_id, product_id, datee, amount, db_name = "database.json"):
    """
        This fuction create a new product,
        category should be a lst of int with length of
        TYPE_OF_PRODUCTS
    """
    new_id = db.id_generator("order", db_name)
    user_id = int(user_id)
    product_id = int(product_id)
    amount = int(amount)
    return {
        "id": new_id,
        "user_id": user_id,
        "product_id": product_id,
        "purchase_date": datee,
                                # in format of timestamp:
                                # e.g. datee = 1545730073  ->  2018-12-25 09:27:53
        "amount": amount,
        "state": 0,             # 0: just purchase
                                # 1: delivering
                                # 2: done
                                # 3: cancelled / refunded
        "rating": 0
    }


# Order related operations

def create_order(user_id, product_id, amount, db_name = "database.json"):
    """
        This function creates an order
        and generate an order id and store it in user
        3. create order
        4. remove product from cart
        5. add order to user & order_db
        6. save to db

        This function adds order to ORDER_DB
    """
    db.valid_id("user",user_id, db_name)
    db.valid_id("product",product_id, db_name)
    # 3
    datee = int(dt.datetime.timestamp(dt.datetime.now()))
    order = new_order(user_id, product_id, datee, amount, db_name)
    db.add_order(order, db_name)
    order_id = order["id"]
    # 4 
    dbs = db.load_json(db_name)
    cart_item_pair = [product_id, amount]
    if cart_item_pair in dbs["USER_DB"][str(user_id)]["shopping_cart"]:
        dbs["USER_DB"][str(user_id)]["shopping_cart"].remove(cart_item_pair)
    # 5 add order id to user
    dbs["USER_DB"][str(user_id)]["order"].append(order["id"])
    # 6
    db.to_json(dbs, db_name)
    return {}

def rate_order(user_id, order_id, rating, db_name = "database.json"):
    """
        This function allows user to rate an order if order is completed
    """
    db.valid_id("user", user_id, db_name)
    db.valid_id("order", order_id, db_name)
    if rating <= 0.5:
        rating = 0.5
    elif rating >= 5:
        rating = 5
    dbs = db.load_json(db_name)
    if int(user_id) != int(dbs["ORDER_DB"][str(order_id)]["user_id"]):
        raise KeyError()
    prod_id = dbs["ORDER_DB"][str(order_id)]["product_id"]
    dbs["ORDER_DB"][str(order_id)]["rating"] = rating
    dbs["PRODUCT_DB"][str(prod_id)]["ratings"].append([int(user_id), float(rating)])
    db.to_json(dbs, db_name)
    return {}

def change_order_state(order_id, new_state):
    """
        This function changes the delivery state of an order
        0: just purchase
        1: delivering
        2: done
        3: cancelled
    """
    new_state = int(new_state)
    assert new_state in [0,1,2,3]
    db.valid_id("order", order_id)
    temp = db.load_json()
    temp["ORDER_DB"][str(order_id)]["state"] = new_state
    db.to_json(temp)
    return {
        "id": order_id,
        "state": new_state
    }

def refund_helper(dbs, user_id, amount):
    """
        This function adds amount to a user
        WITHOUT loading/saving from/to Database
    """
    dbs["USER_DB"][str(user_id)]["fund"] += amount
    return dbs

def order_refund(user_id, order_id, db_name = "database.json"):
    """
        This function refunds an order if 
        the order is not delivered yet (state = 0)
    """
    db.valid_id("user", user_id, db_name)
    db.valid_id("order", order_id, db_name)
    dbs = db.load_json(db_name)
    # if refund is applicable
    if dbs["ORDER_DB"][str(order_id)]["state"] == 3:
        status = "Order already refunded"
    elif dbs["ORDER_DB"][str(order_id)]["state"] == 0:
        if int(user_id) != int(dbs["ORDER_DB"][str(order_id)]["user_id"]):
            status = "Only user paid for this order can refund"
        change_order_state(order_id, 3)
        dbs = db.load_json(db_name)
        prod_id = dbs["ORDER_DB"][str(order_id)]["product_id"]
        price = dbs["PRODUCT_DB"][str(prod_id)]["price"]
        amount = dbs["ORDER_DB"][str(order_id)]["amount"]
        dbs = refund_helper(dbs, user_id, int(amount) * int(price))
        db.to_json(dbs, db_name)
        status = "Refund success"
    else:
        status = "Already on delivery, refund not applicable"
    return status

def order_receive(user_id, order_id, db_name = "database.json"):
    temp = db.load_json(db_name)
    if temp["ORDER_DB"][str(order_id)]["state"] == 3:
        status = "Order already refunded"
    elif temp["ORDER_DB"][str(order_id)]["state"] == 1:
        change_order_state(order_id, 2)
        status = "Successfully received"
    elif temp["ORDER_DB"][str(order_id)]["state"] == 2:
        status = "Already Received"
    elif temp["ORDER_DB"][str(order_id)]["state"] == 0:
        status = "Not delivered yet"
    else:
        return False
    return {}

def show_user_order(user_id, db_name = "database.json"):
    """
        This function shows order ids done by selected user
    """
    db.valid_id("user", user_id, db_name)
    dbs = db.load_json(db_name)
    return dbs["USER_DB"][str(user_id)]["order"]

def show_all_order(user_id, db_name = "database.json"):
    """
        This function shows all order belong to user with details infomation
    """
    order_lst = []
    dbs = db.load_json(db_name)
    orders = show_user_order(user_id, db_name)
    for order_id in orders:
        product_id = dbs["ORDER_DB"][str(order_id)]["product_id"]
        amount = dbs["ORDER_DB"][str(order_id)]["amount"]
        datte = dbs["ORDER_DB"][str(order_id)]["purchase_date"]
        state_in_code = dbs["ORDER_DB"][str(order_id)]["state"]
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
            "order_id": order_id,
            "product_id": product_id,
            "product_name": pdt.product_id_to_name(product_id),
            "amount": amount,
            "pic_link": dbs["PRODUCT_DB"][str(product_id)]["pic"],
            "cost": usr.individual_price(product_id, amount),
            "purchase_date": int(datte),
            "state_in_code": state_in_code,
            "state_in_text": state_in_text,
            "rating": dbs["ORDER_DB"][str(order_id)]["rating"]
        })
    return order_lst
