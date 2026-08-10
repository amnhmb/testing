from PIL import Image
import shutil
import os

def process_logo():
    logo_path = r"assets\momenkita\logo-mk.png"
    backup_path = r"assets\momenkita\logo-mk-backup.png"
    pattern_path = r"assets\songket\background_pattern.png"
    
    # Restore from backup first to ensure a clean slate
    if os.path.exists(backup_path):
        shutil.copy(backup_path, logo_path)
    
    # 1. Load and make background transparent
    img = Image.open(logo_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0)) # Transparent
        else:
            new_data.append(item)
    img.putdata(new_data)
    
    # 2. Crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # 3. Invert Pattern with specific green color
    pattern = Image.open(pattern_path).convert("RGBA")
    p_data = pattern.getdata()
    
    # User wants exact color of menu links: #064E3B (var(--accent))
    dom_color = (6, 78, 59)
        
    # Create inverted pattern
    inv_pattern_data = []
    for p in p_data:
        alpha_ratio = p[3] / 255.0
        # Foreground becomes white, background becomes the green color
        new_r = int(255 * alpha_ratio + dom_color[0] * (1 - alpha_ratio))
        new_g = int(255 * alpha_ratio + dom_color[1] * (1 - alpha_ratio))
        new_b = int(255 * alpha_ratio + dom_color[2] * (1 - alpha_ratio))
        # Keep alpha at 255 since we want it solid
        inv_pattern_data.append((new_r, new_g, new_b, 255))
        
    pattern.putdata(inv_pattern_data)
    
    # 4. Tile the pattern
    tiled_pattern = Image.new("RGBA", img.size)
    for y in range(0, img.size[1], pattern.size[1]):
        for x in range(0, img.size[0], pattern.size[0]):
            tiled_pattern.paste(pattern, (x, y))
            
    tiled_data = tiled_pattern.getdata()
    
    # 5. Apply to logo
    final_data = []
    img_data = img.getdata()
    
    for i, item in enumerate(img_data):
        # Identify black text (R, G, B are very low, not transparent)
        if item[0] < 60 and item[1] < 60 and item[2] < 60 and item[3] > 10:
            final_data.append(tiled_data[i])
        else:
            final_data.append(item)
            
    img.putdata(final_data)
    img.save(logo_path, "PNG")
    print("Inverted pattern applied successfully with exact green color!")

if __name__ == "__main__":
    process_logo()
