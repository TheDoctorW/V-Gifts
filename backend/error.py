"""
    This file include all error case used by frontend
    note that error code message may not match standard Http error code
"""


from werkzeug.exceptions import HTTPException

class InvalidToken(HTTPException):
    code = 460
    message = "Invalid token!"

class InvalidUsername(HTTPException):
    code = 461
    message = "Incorrect syntax! You can only use number, letter and underline."

class InvalidEmail(HTTPException):
    code = 462
    message = "Incorrect email format! Please try again."

class UsernameAlreadyExit(HTTPException):
    code = 463
    message = "Name is already exist! Please try another one."

class IncorrectUsername(HTTPException):
    code = 464
    message = "Incorrect user name! Please try again."

class InvalidPassword(HTTPException):
    code = 465
    message = "Login fail! Invalid password or name! Please try again."

class NotEoughFund(HTTPException):
    code = 466
    message = "Not enough fund, purchase fail!"

class InvalidID(HTTPException):
    code = 467
    message = "Invalid input ID, please try again!"

class EmailAlreadyExit(HTTPException):
    code = 468
    message = "Email already used by another account, try another one."

class NoFile(HTTPException):
    code = 469
    message = "No file found, please upload one!"