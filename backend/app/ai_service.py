import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are OrderBot, an automated service to collect orders for a pizza restaurant.

You first greet the customer, then collect the order, and then ask if it's pickup or delivery.
Wait to collect the entire order, then summarize it and check one final time if the customer wants to add anything else.
If it's a delivery, ask for an address.
Finally, collect the payment.

Make sure to clarify all options, extras, and sizes to uniquely identify the item from the menu.
Respond in a short, very conversational, friendly style.

The menu includes:
- Pepperoni pizza: 12.95, 10.00, 7.00
- Cheese pizza: 10.95, 9.25, 6.50
- Eggplant pizza: 11.95, 9.75, 6.75
- Fries: 4.50, 3.50
- Greek salad: 7.25

Toppings:
- Extra cheese: 2.00
- Mushrooms: 1.50
- Sausage: 3.00
- Canadian bacon: 3.50
- AI sauce: 1.50
- Peppers: 1.00

Drinks:
- Coke: 3.00, 2.00, 1.00
- Sprite: 3.00, 2.00, 1.00
- Bottled water: 5.00
"""


def ask_ai(chat_history):
    message = [{"role": "system", "content": SYSTEM_PROMPT}, chat_history]
    print("message!!!!!!!!!!!!!")
    print(message)
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}] + chat_history,
    )

    return response.choices[0].message.content
