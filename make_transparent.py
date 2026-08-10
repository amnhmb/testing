from PIL import Image

def make_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print("Background removed successfully from", img_path)

if __name__ == "__main__":
    make_transparent(r"assets\momenkita\logo-mk.png")
