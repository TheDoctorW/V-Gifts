"""
    This file contains fuctions related to products
"""

import csv
import database as db
import chatbot as ct
import webpage as wbp
from numpy import ceil


# Object types

def new_product(name, price, description, category, deli_days, pic_link, db_name = "database.json"):
    """
        This fuction create a new product,
        category should be a lst of int with length of
        TYPE_OF_PRODUCTS
    """
    new_id = db.id_generator("product", db_name)
    # assert db.check_interest_dim(category)
    # catagory is now calculated by query_analysis
    category = None
    price = int(price)
    deli_days = int(deli_days)
    if description == "" or description is None:
        description = name
        category = ct.query_analysis_test3(name)
    else:
        category = ct.query_analysis_test3(name + ". " + description)
    return {
        "id": new_id,
        "name": name,
        "price": price,
        "description": description,
        "category": category, # [0] * dbs["TYPE_OF_PRODUCTS"]
        "delivery": deli_days,
        "ratings": [],
                    # [(u_id, rating), ...]
        "pic": pic_link
    }


# Products related operators

def edit_product(prod_id, prod_name, prod_descrip, prod_price, \
                prod_delivery, prod_pic, db_name = "database.json"):
    """
        This function edits product info with inputs above
        and returns the id of this product
    """
    dbs = db.load_json(db_name)
    prod_id = int(prod_id)
    prod_price = float(prod_price)
    prod_delivery = int(prod_delivery)
    if str(prod_id) not in dbs["PRODUCT_DB"]:
        raise KeyError()
    dbs["PRODUCT_DB"][str(prod_id)]["name"] = prod_name
    prod_category = None
    if prod_descrip == "" or prod_descrip is None:
        prod_descrip = prod_name
        prod_category = ct.query_analysis_test3(prod_name)
    else:
        prod_category = ct.query_analysis_test3(prod_name + ". " + prod_descrip)
    dbs["PRODUCT_DB"][str(prod_id)]["category"] = prod_category
    dbs["PRODUCT_DB"][str(prod_id)]["description"] = prod_descrip
    dbs["PRODUCT_DB"][str(prod_id)]["price"] = prod_price
    dbs["PRODUCT_DB"][str(prod_id)]["delivery"] = prod_delivery
    dbs["PRODUCT_DB"][str(prod_id)]["pic"] = prod_pic
    db.to_json(dbs, db_name)
    return {
        "id": prod_id
    }

def product_id_to_name(prod_id, db_name = "database.json"):
    """
        This fuction convert product id to it's name
    """
    dbs = db.load_json(db_name)
    if str(prod_id) not in dbs["PRODUCT_DB"]:
        raise KeyError()
    return dbs["PRODUCT_DB"][str(prod_id)]["name"]

def delete_product(prod_id, db_name = "database.json"):
    """
        This function deletes a product by id
        and returns the id of this product
    """
    dbs = db.load_json(db_name)
    if str(prod_id) not in dbs["PRODUCT_DB"]:
        raise KeyError()
    else:
        rt = dbs["PRODUCT_DB"].pop(str(prod_id))
        db.to_json(dbs, db_name)
        return {
            "prod_info": rt
        }

def prod_rating_calculator(prod_id, db_name = "database.json"):
    """
        This function is used to obtain total 
        rating for a product from individual 
        user ratings
    """
    db.valid_id("product", prod_id)
    dbs = db.load_json(db_name)
    rating_lst = dbs["PRODUCT_DB"][str(prod_id)]["rating"]
    if len(rating_lst) == 0:
        return 0
    summ = 0
    for rating in rating_lst:
        summ += rating[1]
    return summ / len(rating_lst)

def show_product_detail(prod_id, db_name = "database.json"):
    """
        This function shows the details of a product
    """
    db.valid_id("product", prod_id)
    dbs = db.load_json()
    rating = round(wbp.rating_calc(prod_id), 2)
    return {
        "id": dbs["PRODUCT_DB"][str(prod_id)]["id"],
        "name": dbs["PRODUCT_DB"][str(prod_id)]["name"],
        "price": dbs["PRODUCT_DB"][str(prod_id)]["price"],
        "description": dbs["PRODUCT_DB"][str(prod_id)]["description"],
        "delivery": dbs["PRODUCT_DB"][str(prod_id)]["delivery"],
        "rating": rating,
        "pic_link": dbs["PRODUCT_DB"][str(prod_id)]["pic"],
    }

def show_product_lst(page = -1, user_id = -1, num_each_page = 9, rec_num = 6, db_name = "database.json"):
    """
        This function shows a lst of product
    """
    dbs = db.load_json(db_name)
    proc_lst = []
    for key in dbs["PRODUCT_DB"].keys():
        rating = round(wbp.rating_calc(dbs["PRODUCT_DB"][key]["id"]),2)
        proc_lst.append({
            "product_id": dbs["PRODUCT_DB"][key]["id"],
            "name": dbs["PRODUCT_DB"][key]["name"],
            "price": dbs["PRODUCT_DB"][key]["price"],
            "rating": rating,
            "pic_link": dbs["PRODUCT_DB"][key]["pic"]
        })
    proc_rt = []
    if page != -1:
        for i in range(len(proc_lst)):
            if i >= (page - 1) * num_each_page and i < page * num_each_page:
                # e.g. page 1 => item 0~8
                proc_rt.append(proc_lst[i])
    else: # return all prods
        proc_rt = proc_lst
    if user_id == -1:
        rec_rt = []
    else:
        # if a user presist, execute recommendation algo
        # technically fetchs all product
        rec_lst = wbp.search_filter_recommendation(user_id = user_id)["product_lst"]
        rec_pid = []
        for item in rec_lst:
            rec_pid.append(item["product_id"])
        rec_rt = []
        if rec_num >= len(rec_lst):
            rec_num = len(rec_lst)
        for i in range(rec_num):
            prod_id = rec_pid[i]
            rating = round(wbp.rating_calc(prod_id),2)
            rec_rt.append({
                "product_id": prod_id,
                "name": dbs["PRODUCT_DB"][str(prod_id)]["name"],
                "price": dbs["PRODUCT_DB"][str(prod_id)]["price"],
                "rating": rating,
                "pic_link": dbs["PRODUCT_DB"][str(prod_id)]["pic"]
            })
    return {
        "recommendation_list": rec_rt,
        "product_lst": proc_rt,
        "total_pages": ceil((len(proc_lst)/num_each_page))
    }

def add_prod_from_csv(filename, db_name = "database.json"):
    """
        This function allows admin to import prod data from
        csv file
    """
    if filename[-4:] != ".csv":
        return "File format is not accepted"
    else:
        csvf = open(filename, "r")
        csvfr = csv.reader(csvf)
        n_prod = []
        row_n = 0
        for rows in csvfr:
            row_n += 1
            # 6 inputs for new_product()
            if len(rows) == 6:
                name, price, description, category, \
                        deli_days, pic_link = rows
                n_prod.append(new_product(name, int(price), description, category, \
                        int(deli_days), pic_link, db_name))
            elif len(rows) == 0:
                continue
            else:
                csvf.close()
                return "Error information in provided csv file, row {}, \
                            roll back database".format(row_n)
        # if all fows are good
        for prod in n_prod:
            db.add_prod(prod, db_name)
        csvf.close()
        return "Success, {} products imported".format(row_n)

def add_prod_to_csv(filename, db_name = "database.json"):
    """
        This function allows admin to import prod data from
        csv file
    """
    if filename[-4:] != ".csv":
        return "File format is not accepted (not *.csv)"
    else:
        dbs = db.load_json(db_name)
        csvf = open(filename, "w", newline="")
        csvfw = csv.writer(csvf)
        row_n = 0
        for prod_key in dbs["PRODUCT_DB"].keys():
            row_n += 1
            csvfw.writerow([
                dbs["PRODUCT_DB"][prod_key]["name"],
                dbs["PRODUCT_DB"][prod_key]["price"],
                dbs["PRODUCT_DB"][prod_key]["description"],
                dbs["PRODUCT_DB"][prod_key]["category"],
                dbs["PRODUCT_DB"][prod_key]["delivery"],
                dbs["PRODUCT_DB"][prod_key]["pic"]
            ])
        csvf.close()
        return "{} rows of products saved into {}".format(row_n, filename)
