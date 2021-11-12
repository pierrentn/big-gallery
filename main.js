/**
 *
 * @param {number} x - Position of the image [0,1]
 * @param {number} h - X position of the mouse [0,1]
 * @returns
 */
function scaling(x, h) {
  const a = -0.7;
  const k = 1;
  return a * Math.pow(x - h, 2) + k;
}

class Gallery {
  constructor(el) {
    //Images container
    this.root = el;
    //Images
    this.images = Array.from(el.children);
    //Image size calculated depending viewport width
    this.imageSize = window.innerWidth / this.images.length;
    this.setImageSize();

    //Space in percentage between images
    this.spaceBetweenImages = 5;

    this.rootScaleInterval = 0.2;

    this.speed = 0.02;

    //X position of the mouse [0,1]
    this.mousePosition = 0.02;
    //Position of the mouse delayed depending the speed value [0,1]
    this.mouseDelayedPos = 0.02;

    this.loop();
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  setImageSize() {
    this.images.forEach((image) => {
      image.style.setProperty("width", `${this.imageSize}px`);
    });
  }

  handleMouseMove(e) {
    this.mousePosition = e.clientX / window.innerWidth;
  }

  loop() {
    this.scaleRatioCalculation();
    this.scaleImages();

    requestAnimationFrame(this.loop.bind(this));
  }

  scaleRatioCalculation() {
    let // Scale outputted by scale function
      scaleArray = [],
      scaleSum = 0,
      // Scale calculated from scaleArray adjusted to fit screen
      scaleRatioArray = [],
      //scaleRatioArray values converted to percentage used to translate images
      scaleOffsetArray = [0];

    // Distance between the mouse and and delayed mouse
    let mouseDelta = this.mousePosition - this.mouseDelayedPos;

    this.mouseDelayedPos = this.mouseDelayedPos + mouseDelta * this.speed;
    const h = this.mouseDelayedPos;

    //We calculate the scale using the scaling function foreach images
    for (let i = 0; i < this.images.length; i++) {
      const x = (1 / (this.images.length - 1)) * i;
      let scale = 1 * scaling(x, h);
      scaleArray.push(scale);
      scaleSum += scale;
    }

    //We convert the ratio depending the number of images;
    scaleArray.forEach((ratio, i) => {
      const newScale = (ratio * this.images.length) / scaleSum;
      scaleRatioArray.push(newScale);
      if (i !== this.images.length - 1) {
        scaleOffsetArray[i + 1] =
          scaleOffsetArray[scaleOffsetArray.length - 1] + (1 - newScale) * 100;
      }
    });
    this.scaleRatioArray = scaleRatioArray;
    this.scaleOffsetArray = scaleOffsetArray;
  }

  scaleImages() {
    this.images.forEach((image, j) => {
      const scale =
        j == 0
          ? this.scaleRatioArray[j]
          : this.scaleRatioArray[j] - this.spaceBetweenImages / 100;
      const offset =
        j == 0
          ? this.scaleOffsetArray[j]
          : this.scaleOffsetArray[j] - this.spaceBetweenImages;

      image.style.setProperty(
        "transform",
        `translateX(${-offset}%) scale(${scale})`
      );
    });
  }
}

new Gallery(document.querySelector(".row"));
