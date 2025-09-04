
import os
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, send_file
from werkzeug.utils import secure_filename
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


UPLOAD_FOLDER = None
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
app.config['UPLOAD_FOLDER'] = os.path.abspath('static/uploads')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = os.environ.get('MODEL_PATH', 'best_model.h5')
try:
    model = load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(
        f"Unable to load the model from {MODEL_PATH}. Ensure the file exists and is a valid Keras model.\n"
        f"Original error: {e}"
    )

IMG_SIZE = (224, 224)
CLASSES = ['FAKE', 'REAL']


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def preprocess_image(img_path: str) -> np.ndarray:
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = (img_array / 127.5) - 1.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array



@app.route('/home')
def home():
    return send_file('Index.html')

@app.route('/')
def root():
    return redirect(url_for('home'))

@app.route('/back')
def back_to_home():
    return redirect(url_for('home'))



@app.route('/detect', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Vérifier si un fichier a été uploadé
        if 'file' not in request.files:
            flash('Aucun fichier sélectionné')
            return redirect(request.url)
        file = request.files['file']
        
        # Vérifier si le fichier a un nom
        if file.filename == '':
            flash('Aucun fichier sélectionné')
            return redirect(request.url)
        
        # Vérifier le type de fichier
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            # Prétraiter l'image et faire une prédiction
            try:
                img_array = preprocess_image(filepath)
                
                # Vérifier si le modèle est chargé
                if model is None:
                    flash("Erreur: Modèle non chargé")
                    return redirect(request.url)
                
                # Faire la prédiction
                prediction = model.predict(img_array)[0][0]
                
                # Interpréter le résultat
                if prediction > 0.5:
                    label = "Générée par IA"
                    confidence = prediction
                else:
                    label = "Authentique"
                    confidence = 1 - prediction
                
                # Formater le résultat
                confidence_percent = f"{confidence * 100:.2f}"
                
                return render_template(
                    'result.html',
                    filename=filename,
                    label=label,
                    confidence=confidence_percent
                )
                
            except Exception as e:
                flash(f"Erreur lors du traitement: {str(e)}")
                return redirect(request.url)
        else:
            flash('Types de fichier autorisés: png, jpg, jpeg')
            return redirect(request.url)
    return render_template('index.html')



@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)
