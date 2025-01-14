# Backend

## How to run development server locally

1. Install dependencies (python 3.11). You might want to create a virtual environment first.

```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory with the following variables:
```bash
GOOGLE_CLIENT_ID 
GOOGLE_CLIENT_SECRET 
GOOGLE_TOKEN_ENDPOINT 
REDIRECT_URI 
MONGODB_URL 
DATABASE_NAME
```

3. Run the server

```bash
fastapi dev main.py
```

4. Open the browser and go to `http://127.0.0.1:8000/docs` to see the API documentation.
