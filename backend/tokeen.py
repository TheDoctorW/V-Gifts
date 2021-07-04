"""
    This file help to generate token for user/admin usage
"""

import base64
import hmac
import hashlib 
import binascii
import datetime
import time
import json


header ='{"alg":"HS256","typ":"JWT"}'
key = "victimH16A"

# convert utf-8 string to byte format
def toBytes(string):
	return bytes(string, 'utf-8')

def encodeBase64(text):
	return base64.urlsafe_b64encode(text).replace(b'=', b'')

def get_payload(name):
    payload = {"user": name, "timestamp": time.time()}
    payload = json.dumps(payload).encode('utf-8')
    return payload

def create_signature(key, unsignedToken):
    # signature = HMAC-SHA256(key, unsignedToken)
	signature = hmac.new(toBytes(key), unsignedToken, hashlib.sha256).digest()
	return encodeBase64(signature)

def token(name):
    unsignedToken = encodeBase64(toBytes(header)) + toBytes('.') + encodeBase64(get_payload(name))
    signature = create_signature(key,unsignedToken)
    token = unsignedToken.decode("utf-8")  + '.' + signature.decode("utf-8")
    return token