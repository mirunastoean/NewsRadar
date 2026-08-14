import jwt
import requests
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
KEYCLOAK_CERTS_URL = "http://localhost:8080/realms/newsradar/protocol/openid-connect/certs"

def get_public_key(kid: str):
    response = requests.get(KEYCLOAK_CERTS_URL)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Eroare la contactarea Keycloak")
    
    keys = response.json().get("keys", [])
    for key in keys:
        if key["kid"] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)
            
    raise HTTPException(status_code=401, detail="Cheia publica nu a fost gasita")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = get_public_key(unverified_header["kid"])
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience="account",
            options={"verify_aud": False} 
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirat")
    except jwt.JWTClaimsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Claims invalide")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid")