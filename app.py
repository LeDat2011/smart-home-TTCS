from flask import Flask, render_template, jsonify, request
import firebase_admin
from firebase_admin import credentials, db

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# Khởi tạo Firebase Admin SDK
try:
    cred = credentials.Certificate(r"D:\SMARTHOME\FACE-TRACKING\FACE-MAIN\testesp32-7e391-firebase-adminsdk-xo01w-69f96d0823.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://testesp32-7e391-default-rtdb.firebaseio.com/'
    })
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

# Tham chiếu đến cơ sở dữ liệu Firebase
ref = db.reference()

@app.route('/')
def home():
    """
    Trang chủ hiển thị giao diện dashboard.
    """
    return render_template('index.html')

@app.route('/api/status', methods=['GET'])
def get_status():
    """
    API để lấy trạng thái hiện tại từ Firebase.
    """
    try:
        data = ref.get()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': 'Không thể lấy dữ liệu từ Firebase', 'details': str(e)}), 500

@app.route('/api/toggle', methods=['POST'])
def toggle_led():
    """
    API để thay đổi trạng thái LED và cập nhật Firebase.
    """
    data = request.json
    room = data.get('room')
    led = data.get('led')
    status = data.get('status')

    # Kiểm tra dữ liệu đầu vào
    if not room or not led or status not in ['ON', 'OFF']:
        return jsonify({'error': 'Dữ liệu đầu vào không hợp lệ'}), 400

    try:
        # Cập nhật trạng thái trong Firebase
        ref.child(room).child(led).update({'status': status})
        return jsonify({'message': 'Cập nhật trạng thái LED thành công!', 'status': status}), 200
    except Exception as e:
        return jsonify({'error': 'Không thể cập nhật Firebase', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
