from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_ai(message:str):
    response = client.chat.completions.create(
        model='openai/gpt-oss-120b',
        messages = [
            {"role":"user", "content": message}
        ]
    )

    return response.choices[0].message.content