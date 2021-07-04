"""
    This file includes functions related to login/register
    for both user and admin, they are separated functions
    with similar layout. They are always used in different
    website (user/admin only).
"""


import user as usr
import database as db 
import admin as adm
import tokeen as tk
import error as err
import hashlib
import re


# User part fuctions 

def register_user(account_name, first_name, last_name, password, email, address, city, country):
    """
        This function register user and initialize their info,
        upon register, webpage should let user to further
        configure their personal information

        Calls login_user() at the end
    """
    # check the if the input account name and email is in valid format
    name_pattern = re.compile("[a-zA-Z0-9_]")
    if name_pattern.search(account_name) is None:
        raise err.InvalidUsername(description = "Incorrect syntax! You can only use number, letter and underline.")
    email_pattern = re.compile("^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$")
    if email_pattern.search(email) is None:
        raise err.InvalidEmail(description = "Incorrect email format! Please try again.")

    # check whether the account name and email has been registered
    if check_user_exist(account_name) is True:
        raise err.UsernameAlreadyExit(description = "Name is already exist! Please try another one.")
    if check_email_exist(email, "USER_DB"):
        raise err.EmailAlreadyExit(description = "Email is already exist! Please try another one.")

    # encrypt password 
    encryption = encrypt_password(password)
    # add new user to databse
    new = usr.new_user(account_name, first_name, last_name, encryption, email, address, city, country)
    db.add_user(new)

    # auto login user after register
    return login_user(account_name, password)


def login_user(name, password):
    """
        This function login user
        returns user id and token
    """
    # check if account name is in correct format
    pattern = re.compile("[a-zA-Z0-9_]")
    if pattern.search(name) is None:
        raise err.IncorrectUsername(description = "Incorrect account name! Please try again.")

    # login user and generate token
    login_token = ""
    dbs = db.load_json()
    uid = 0
    for user_id, user_info in dbs["USER_DB"].items():
        if user_info["name"] == name:
            if user_info["password"] == encrypt_password(password):
                login_token = tk.token(name)
                uid = user_id
                dbs["TOKEN_DB"][login_token] = uid
                db.to_json(dbs)
                return {
                    "id": uid,
                    "token": login_token
                }

    # raise error if password not match with accout name
    raise err.InvalidPassword(description = "Login fail! Invalid password or account name! Please try again.")

def logout_user(token):
    """
        This function logout user
    """
    dbs = db.load_json()

    if check_token(token): 
        dbs["TOKEN_DB"].pop(token)
        db.to_json(dbs)
        return True
    else:
        return False


# Admin part fuctions

def register_admin(name, password, email):
    """
        This function register admin and initialize their info,
        upon register, webpage should let admin to further
        configure their personal information
        
        Calls login_admin()
    """
    # check the if the input account name and email is in valid format
    name_pattern = re.compile("[a-zA-Z0-9_]")
    if name_pattern.search(name) is None:
        raise err.InvalidUsername(description = "Incorrect syntax! You can only use number, letter and underline.")
    email_pattern = re.compile("^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$")
    if email_pattern.search(email) is None:
        raise err.InvalidEmail(description = "Incorrect email format! Please try again.")

    # check whether the account name and email has been registered    
    if check_admin_exist(name) is True:
        raise err.UsernameAlreadyExit(description = "Name is already exist! Please try another one.")
    if check_email_exist(email, "ADMIN_DB"):
        raise err.EmailAlreadyExit(description = "Email is already exist! Please try another one.")

    # encrypt password 
    encryption = encrypt_password(password)
    # add new admin to databse
    new = adm.new_admin(name, encryption, email)
    db.add_admin(new)
    
    # auto login admin after register
    return login_admin(name, password)

def register_admin_nologin(name, password, email):
    """
        This function create admin and initialize their info,
        upon register, webpage should let admin to further
        configure their personal information, it is used 
        when admin create new admin
    """
    # check the if the input account name and email is in valid format
    name_pattern = re.compile("[a-zA-Z0-9_]")
    if name_pattern.search(name) is None:
        raise err.InvalidUsername(description = "Incorrect syntax! You can only use number, letter and underline.")
    email_pattern = re.compile("^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$")
    if email_pattern.search(email) is None:
        raise err.InvalidEmail(description = "Incorrect email format! Please try again.")

    # check whether the account name and email has been registered    
    if check_admin_exist(name) is True:
        raise err.UsernameAlreadyExit(description = "Name is already exist! Please try another one.")
    if check_email_exist(email, "ADMIN_DB"):
        raise err.EmailAlreadyExit(description = "Email is already exist! Please try another one.")

    # encrypt password 
    encryption = encrypt_password(password)
    # add new admin to databse
    new = adm.new_admin(name, encryption, email)
    db.add_admin(new)

    return {}

def login_admin(name, password):
    """
        This function login admin
        returns admin_id and token
    """
    # check if account name is in correct format
    pattern = re.compile("[a-zA-Z0-9_]")
    if pattern.search(name) is None:
        raise err.IncorrectUsername(description = "Incorrect account name! Please try again.")

    # login admin and generate token
    login_token = ""
    dbs = db.load_json()
    aid = 0
    for admin_id, admin_info in dbs["ADMIN_DB"].items():
        if admin_info["name"] == name:
            if admin_info["password"] == encrypt_password(password):
                login_token = tk.token(name)
                aid = admin_id
                dbs["TOKEN_DB"][login_token] = aid
                db.to_json(dbs)
                return {
                    "id": aid,
                    "token":login_token
                }
    
    # raise error if password not match with accout name
    raise err.InvalidPassword(description = "Login fail! Invalid password or account name! Please try again.")

def logout_admin(token):
    """
        This function logout admin
    """
    dbs = db.load_json()
    if check_token(token):
        dbs["TOKEN_DB"].pop(token)
        db.to_json(dbs)
        return True
    else:
        return False


# Helper functions

def check_user_exist(name):
    """
        This fuction check whether user has already exist when register
    """
    dbs = db.load_json()
    if dbs["USER_DB"] is None:
        return True
    for user_id, user_info in dbs["USER_DB"].items():
        if user_info["name"] == name: 
            return True
    return False
    
def check_admin_exist(name):
    """
        This fuction check whether admin has already exist when register
    """
    dbs = db.load_json()
    if dbs["ADMIN_DB"] is None:
        return True
    for admin_id, admin_info in dbs["ADMIN_DB"].items():
        if admin_info["name"] == name: 
            return True
    return False

def check_email_exist(email, option):
    """
        This fuction check if email has already exist when register
        option in ["ADMIN_DB", "USER_DB"]
    """
    dbs = db.load_json()
    for idd, info in dbs[option].items():
        if info["email"] == email: 
            return True
    return False

def encrypt_password(password):
    """
        This fuction encrypt the password with sha256 and store in database
    """
    sha_signature = \
        hashlib.sha256(password.encode()).hexdigest()
    
    return sha_signature

def verify_password(password):
    """
        This fuction verify the password mathch in database
    """
    dbs = db.load_json()
    sha_signature = \
        hashlib.sha256(password.encode()).hexdigest()
    for user_id, user_info in dbs["USER_DB"]:
        if user_info["password"] == sha_signature:
            return True
    return False

def check_token(token):
    """
        This fuction check if token is in the database
    """
    dbs = db.load_json()
    for user_token, token_id in dbs["TOKEN_DB"].items():
        if token == user_token:
            return True
    return False

def token_to_id(token):
    """
        This fuction transfer token to id
        raise error when token not found in database
    """
    dbs = db.load_json()
    for key, attr in dbs["TOKEN_DB"].items():
        if key == token:
            return attr
    raise err.InvalidToken(description = "Invalid token!")