from PIL import Image
import numpy as np

# Load the image
img = Image.open('neon_tetra_black_base.png')
img = img.convert("RGBA")

data = np.array(img)

# Define target color (Black) and threshold
r, g, b, a = data.T
# Identify black pixels (allowing slight variance for anti-aliasing if needed, but for pixel art exact is better)
# Let's use a very strict threshold to preserve dark parts of the fish (like the eye pupil)
# The fish eye pupil might be black. 
# Strategy: Convert only background black. 
# Since it's a generated image, background should be uniform if prompted correctly.
# But "Solid BLACK" prompt usually gives exact 0,0,0.

# However, the eye might be 0,0,0 too. 
# A simple color key might remove the eye. 
# Neon Tetras have glowing eyes, but pupils are black.
# Alternative: Use the "Green Screen" approach from earlier but post-process it?
# Or just assume the fish doesn't have PURE black edges. 

# Let's try to simple alpha keying.
mask = (r <= 10) & (g <= 10) & (b <= 10)
data[..., 3][mask] = 0

# Create new image
new_img = Image.fromarray(data)
new_img.save('neon_tetra_processed.png')
print("Processed image saved as neon_tetra_processed.png")
