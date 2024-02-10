export function loadSprites(spritesPath: Record<string, string>) {
  return Promise
    .all(Object.values(spritesPath).map(loadImage))
    .then((sprites) => Object.fromEntries(
      Object
        .keys(spritesPath)
        .map((key, index) => [key, sprites[index]])
    )) as Promise<Record<string, HTMLImageElement>>;
}

function loadImage(src: string) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
}