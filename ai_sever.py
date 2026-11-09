from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'skin_disease_cnn_optimized.keras'
IMG_SIZE = (224, 224)

disease_classes = {
    0: 'Bệnh dày sừng quang hóa (akiec)',
    1: 'Ung thư biểu mô tế bào đáy (bcc)',
    2: 'Dày sừng tiết bã (bkl)',
    3: 'U xơ da (df)',
    4: 'Ung thư hắc tố (mel)',
    5: 'Nốt ruồi hắc tố (nv)',
    6: 'Tổn thương mạch máu (vasc)'
}

print("⏳ Đang load model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model đã load xong!")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Không tìm thấy file ảnh'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File rỗng'}), 400
    try:
        image_bytes = file.read()
        img = Image.open(io.BytesIO(image_bytes))

        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(IMG_SIZE)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)[0]

        predicted_idx = int(np.argmax(predictions))
        confidence = float(predictions[predicted_idx])
        disease_name = disease_classes[predicted_idx]

        top_3_indices = np.argsort(predictions)[-3:][::-1]
        top_3 = [
            {'disease': disease_classes[i], 'probability': float(predictions[i])}
            for i in top_3_indices
        ]

        print(f"✅ Kết quả: {disease_name} ({confidence:.2%})")

        return jsonify({
            'success': True,
            'prediction': disease_name,
            'confidence': confidence,
            'top_3': top_3
        })

    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 AI Server đang chạy tại http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)