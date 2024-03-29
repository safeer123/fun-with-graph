import React from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import functions from "./functions";

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider
        naturalSlideWidth={300}
        naturalSlideHeight={300}
        totalSlides={functions.length}
        className="carousel-root"
      >
        <div className="inputItemTitle">Click below to copy this sample function</div>
        <Slider>
          {functions.map((f, i) => (
            <Slide index={i} key={f.function} title="Click here to copy">
              <div
                className="code-slide-root"
                onClick={() => this.props.onSelect(f)}
              >
                <pre>{f.function}</pre>
              </div>
            </Slide>
          ))}
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
    );
  }
}
