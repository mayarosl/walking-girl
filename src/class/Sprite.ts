interface SpriteProps {
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  position: {
    x: number,
    y: number
  }
}

export class Sprite {
  private ctx: CanvasRenderingContext2D;
  public image: HTMLImageElement;
  public position: {
    x: number,
    y: number
  };

  constructor({
    ctx,
    image,
    position,
  }: SpriteProps) {
    this.ctx = ctx;
    this.image = image;
    this.position = position
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y
    )
  }
}