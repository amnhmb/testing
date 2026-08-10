from PIL import Image

def crop_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    # Get bounding box of the non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        cropped_img = img.crop(bbox)
        cropped_img.save(img_path, "PNG")
        print(f"Cropped {img_path} successfully.")
    else:
        print(f"Nothing to crop for {img_path} or image is empty.")

if __name__ == "__main__":
    crop_transparent(r"assets\momenkita\logo.png")
    crop_transparent(r"assets\momenkita\logo-mk.png")
