from PIL import Image

def make_black_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is dark/black (R, G, B are all low)
        # We need to preserve the beige outline. Beige is usually high R and G, lower B (e.g., #d4af37 or similar)
        # Black text will have very low RGB values.
        # Let's say if R, G, B are all < 60, it's the black text.
        if item[0] < 60 and item[1] < 60 and item[2] < 60 and item[3] > 0:
            # Make it transparent
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print(f"Black pixels made transparent successfully for {img_path}")

if __name__ == "__main__":
    make_black_transparent(r"assets\momenkita\logo-mk.png")
