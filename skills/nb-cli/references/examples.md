# Prompting Examples for nb-cli

### Image Generation (`nb generate`)
- `nb generate "A cyberpunk cat sitting on a neon-lit skyscraper" -o cyber-cat.jpg -s 1k -a 16:9`
- `nb generate "A watercolor painting of a serene mountain lake at sunrise" -a 3:2`
- `nb generate "A 3D render of a futuristic spaceship docking at a station" -s 2k`

### Icon Creation (`nb icon`)
- `nb icon "a playful banana"` -> Pre-pends "High-quality minimalist icon for: "
- `nb icon "coffee cup"` -o coffee-icon.png
- `nb icon "shield with a sword" -s 1k`

### Image Editing (`nb edit`)
- `nb edit original.jpg "Change the sky to a sunset with purple and orange hues" -o sunset.jpg`
- `nb edit city.png "Add flying cars to the background" -a 16:9`
- `nb edit cat.jpg "Make the cat wearing sunglasses and drinking a soda" -o cool-cat.png`
