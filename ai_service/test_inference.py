from PIL import Image
import numpy as np
import subprocess
import os

# Create green plant leaf image
arr = np.zeros((300, 300, 3), dtype=np.uint8)
arr[:, :, 1] = 160  # Green channel
arr[100:200, 100:200, 0] = 120 # Brown lesion spot
arr[100:200, 100:200, 1] = 70
img = Image.fromarray(arr)
test_path = os.path.join(os.path.dirname(__file__), 'test_leaf.jpg')
img.save(test_path)
print('Test image saved:', test_path)

# Run predict.py
cmd = ['python', os.path.join(os.path.dirname(__file__), 'predict.py'), test_path, 'Tomato']
res = subprocess.run(cmd, capture_output=True, text=True)
print('Predict stdout:', res.stdout)
print('Predict stderr:', res.stderr)
