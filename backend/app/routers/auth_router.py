# from fastapi import APIRouter, HTTPException
# from app import models, schemas, auth
# from app.db import database
# from sqlalchemy import select
# from datetime import timedelta

# router = APIRouter()

# # ---------- SIGNUP ----------
# @router.post("/signup", response_model=schemas.UserOut)
# async def signup(user: schemas.UserCreate):
#     query = select(models.users).where(models.users.c.email == user.email)
#     existing = await database.fetch_one(query)
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_password = auth.get_password_hash(user.password)
#     insert_query = models.users.insert().values(
#         email=user.email,
#         hashed_password=hashed_password,
#         full_name=user.full_name,
#         role=user.role,
#     )
#     user_id = await database.execute(insert_query)

#     return {"id": user_id, "email": user.email, "full_name": user.full_name, "role": user.role}

# # ---------- LOGIN ----------
# @router.post("/login", response_model=schemas.Token)
# async def login(form_data: schemas.UserCreate):
#     query = select(models.users).where(models.users.c.email == form_data.email)
#     user = await database.fetch_one(query)
#     if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
#         raise HTTPException(status_code=400, detail="Invalid email or password")

#     access_token = auth.create_access_token(
#         data={"sub": user["email"], "user_id": user["id"], "role": user["role"]}
#     )
#     return {"access_token": access_token, "token_type": "bearer"}



from fastapi import APIRouter, HTTPException
from app import models, schemas, auth
from app.db import database
from sqlalchemy import select

router = APIRouter()

# ---------- SIGNUP ----------
@router.post("/signup", response_model=schemas.UserOut)
async def signup(user: schemas.UserCreate):
    query = select(models.users).where(models.users.c.email == user.email)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.get_password_hash(user.password)
    insert_query = models.users.insert().values(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
    )
    user_id = await database.execute(insert_query)

    return {
        "id": user_id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }

# ---------- LOGIN ----------
@router.post("/login", response_model=schemas.Token)
async def login(user_data: schemas.UserLogin):
    query = select(models.users).where(models.users.c.email == user_data.email)
    user = await database.fetch_one(query)
    if not user or not auth.verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = auth.create_access_token(
        data={"sub": user["email"], "user_id": user["id"], "role": user["role"]}
    )

    return {"access_token": access_token, "token_type": "bearer"}
