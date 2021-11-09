function scaling(x, h = 1) {
  const a = -0.7;
  const k = 1;
  return a * Math.pow(x - h, 2) + k;
}

class Gallery {
  constructor(el) {
    this.root = el;
    this.images = Array.from(el.children);
    this.imageSize = window.innerWidth / this.images.length;
    this.setImageSize();

    //In %
    this.spaceBetweenImages = 20;

    this.baseScaling = 0.5;
    this.scalingValue = 0.75;

    this.rootScaleInterval = 0.2;

    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  setImageSize() {
    this.images.forEach((image) => {
      image.style.setProperty("width", `${this.imageSize}px`);
    });
  }

  handleMouseMove(e) {
    this.mousePosition = e.clientX / window.innerWidth;

    this.scaleRatioCalculation();
    this.scaleImages(e);
  }

  scaleRatioCalculation() {
    let scaleArray = [],
      scaleRatioArray = [],
      scaleOffsetArray = [0],
      scaleSum = 0;

    //We calculate the scale using the scaling function foreach image
    for (let i = 0; i < this.images.length; i++) {
      const h = this.mousePosition;
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
          : this.scaleRatioArray[j] -
            this.spaceBetweenImages / 100 / this.images.length;
      const offset =
        j == 0
          ? this.scaleOffsetArray[j]
          : this.scaleOffsetArray[j] -
            this.spaceBetweenImages / this.images.length;

      image.style.setProperty(
        "transform",
        `translateX(${-offset}%) scale(${scale})`
      );
    });
  }
}

new Gallery(document.querySelector(".row"));
