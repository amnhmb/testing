from PIL import Image

def fill_pattern(logo_path, pattern_path, output_path):
    logo = Image.open(logo_path).convert("RGBA")
    pattern = Image.open(pattern_path).convert("RGBA")
    
    # Tile the pattern to cover the logo
    tiled_pattern = Image.new("RGBA", logo.size)
    for y in range(0, logo.size[1], pattern.size[1]):
        for x in range(0, logo.size[0], pattern.size[0]):
            tiled_pattern.paste(pattern, (x, y))
            
    logo_data = logo.getdata()
    tiled_data = tiled_pattern.getdata()
    
    new_data = []
    for i, item in enumerate(logo_data):
        # The pixels we made transparent from black are exactly (0, 0, 0, 0)
        if item == (0, 0, 0, 0):
            # Fill with pattern pixel. 
            # Pattern pixel might be transparent, so we composite it on a solid color if needed?
            # Or just use the pattern pixel directly. But pattern has opacity natively sometimes.
            # Let's just use the pattern pixel directly.
            # Wait, if we want it to look good, maybe we multiply the pattern alpha? Let's just use it exactly.
            p_pixel = tiled_data[i]
            # Since the text is black originally, the pattern usually replaces the black.
            # But the pattern image might be light colored and rely on body background? 
            # If pattern is transparent PNG, it has actual colors. We will just use the pattern pixel.
            # If pattern pixel is mostly transparent, we might want to blend it over a dark background?
            # Let's just use the raw pattern pixel. If the user wants opacity tweaks, we can do it later.
            # Actually, to make it visible as text, let's mix the pattern over a dark color? 
            # No, user asked to replace with pattern. Let's just use pattern pixel.
            # Let's blend it over black so the text is still somewhat readable?
            # User said: "warna hitam dalam tu transparent kan dan ganti dengan corak background dalam tu"
            # So just the pattern.
            new_data.append(p_pixel)
        else:
            new_data.append(item)
            
    logo.putdata(new_data)
    logo.save(output_path, "PNG")
    print("Pattern applied successfully inside M and K!")

if __name__ == "__main__":
    fill_pattern(r"assets\momenkita\logo-mk.png", r"assets\songket\background_pattern.png", r"assets\momenkita\logo-mk.png")
