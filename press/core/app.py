import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
import re
from predict import Summarizer

app = Flask(__name__)


@app.route('/',methods=['POST'])
def predict():
    model = Summarizer()
    text = request.json.get("text", None)
    if not text:
        return "Здається ти забув про текст)"
    cleaned_text = re.sub(r'[^а-яїґє\s]', "", text.lower().replace('\n', ' '))
    return model.predict(cleaned_text)

if __name__ == "__main__":
    app.run(debug=True, port="8565")