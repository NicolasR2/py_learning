from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys, io, traceback

app = FastAPI()

# CORS para conectar con tu frontend (React en localhost:5173 o 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diccionario para sesiones de usuario (como colab)
sessions = {}

class CodeRequest(BaseModel):
    session_id: str
    code: str

import ast
@app.post("/execute")
async def execute_code(req: CodeRequest):
    session_id = req.session_id
    code = req.code.strip()

    if session_id not in sessions:
        sessions[session_id] = {}

    namespace = sessions[session_id]

    old_stdout, old_stderr = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = io.StringIO(), io.StringIO()

    output, error = "", ""
    try:
        tree = ast.parse(code, mode="exec")
        if isinstance(tree.body[-1], ast.Expr):
            exec(compile(ast.Module(tree.body[:-1], []), "<ast>", "exec"), namespace)
            last_expr = eval(compile(ast.Expression(tree.body[-1].value), "<ast>", "eval"), namespace)
            if last_expr is not None:
                print(repr(last_expr))
        else:
            exec(code, namespace)

        output = sys.stdout.getvalue()
        error = sys.stderr.getvalue()
    except Exception:
        output = sys.stdout.getvalue()
        error = traceback.format_exc()

    sys.stdout, sys.stderr = old_stdout, old_stderr
    return {"output": output if output else None, "error": error if error else None}

