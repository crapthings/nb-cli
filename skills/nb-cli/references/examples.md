# Prompting Examples for nb-cli

### Image Generation (`nb generate`)
- `nb generate "A cyberpunk cat sitting on a neon-lit skyscraper" -o cyber-cat.jpg -s 1k -a 16:9`
- `nb generate "A watercolor painting of a serene mountain lake at sunrise" -a 3:2`
- `nb generate "A 3D render of a futuristic spaceship docking at a station" -s 2k`
- `nb generate "Editorial travel photo of a cliffside town at golden hour, aerial wide shot, warm soft light, layered depth, natural color" -o cliff-town.jpg -s 2k -a 16:9`
- `nb generate "Premium product photo of a matte black coffee grinder, centered three-quarter angle, soft studio key light, clean rim light, light gray gradient background, crisp reflections, no text" -o grinder.jpg -s 1k -a 4:5`
- `nb generate "Neo-noir portrait of a detective in rain, medium close-up, low-key lighting, wet reflections, subtle film grain, shallow depth of field" -o detective.jpg -s 1k -a 3:4`

### Icon Creation (`nb icon`)
- `nb icon "a playful banana"` -> Pre-pends "High-quality minimalist icon for: "
- `nb icon "coffee cup"` -o coffee-icon.jpg
- `nb icon "shield with a sword" -s 1k`
- `nb icon "camera aperture, centered composition, clean silhouette, no text" -o aperture-icon.jpg`

### Image Editing (`nb edit`)
- `nb edit original.jpg "Change the sky to a sunset with purple and orange hues" -o sunset.jpg`
- `nb edit city.png "Add flying cars to the background" -a 16:9`
- `nb edit cat.jpg "Make the cat wearing sunglasses and drinking a soda" -o cool-cat.jpg`
- `nb edit portrait.jpg "Change only the lighting to a moody low-key setup with subtle rim light; keep face, pose, clothing, and background unchanged" -o portrait-noir.jpg`
- `nb edit bottle.jpg "Replace only the background with a clean pale gray studio backdrop; keep the bottle edges, label, reflections, and perspective unchanged" -o bottle-clean.jpg -a 4:5`
