import * as React from "react";

import "prismjs";
import "reveal.js/css/reveal.css";
import "@objectpartners/revealjs-theme";

import "./slide-deck.css";

type Slide =
  | string
  | {
      default: React.ComponentType;
    };

interface SlideDeckProps {
  slides: Slide[][];
}

export class SlideDeck extends React.Component<SlideDeckProps> {
  componentDidMount(): void {
    require.ensure(
      [
        "reveal.js",
        "reveal.js/lib/js/classList.js",
        "reveal.js/lib/js/head.min.js",
        "reveal.js/lib/js/html5shiv.js"
      ],
      () => {
        const Reveal = require("reveal.js");
        require("reveal.js/lib/js/classList.js");
        require("reveal.js/lib/js/head.min.js");
        require("reveal.js/lib/js/html5shiv.js");

        window["Reveal"] = Reveal;

        Reveal.initialize({
          history: true,
          margin: 0.1,
          dependencies: [
            {
              async: true,
              src: require("reveal.js/plugin/zoom-js/zoom.js")
            },
            {
              async: true,
              src: require("reveal.js/plugin/markdown/marked.js")
            },
            {
              async: true,
              src: require("reveal.js/plugin/notes/notes.js")
            }
          ]
        });
      }
    );
  }

  private getSectionProps(slideHtml: string): object {
    const section = slideHtml.match(/<section[^>]+/);
    if (!section) {
      return {};
    }

    const props = section
      .pop()!
      .replace(/<section\s/, "")
      .split(/([\w-]+)="([^"]+)"/)
      .filter(part => part && part.length > 0);

    return props.reduce((merged: object, part: any, index: number) => {
      if (part % 1 === 0) {
        merged[part] = "";
      } else if (props[index - 1]) {
        merged[props[index - 1]] = part;
      }
      return merged;
    }, {});
  }

  private buildSlide(
    slide: Slide,
    key: string,
    isTitle: boolean
  ): React.ReactNode {
    if (typeof slide === "string") {
      if (isTitle) {
        return (
          <div
            key={key}
            dangerouslySetInnerHTML={{ __html: slide }} // #yolo
          />
        );
      }

      const sectionProps = this.getSectionProps(slide);

      return (
        <section
          key={key}
          {...sectionProps}
          dangerouslySetInnerHTML={{ __html: slide }} // #yolo
        />
      );
    }

    const Slide = slide.default;
    if (isTitle) {
      return <Slide />;
    }

    return (
      <section key={key}>
        <Slide />
      </section>
    );
  }

  render(): React.ReactNode {
    const { slides } = this.props;
    const { PRESENTATION_DATE: date } = process.env;
    return (
      <div className="reveal">
        <div className="slides">
          {slides.map((deck: Slide[], deckIndex: number) => {
            const isTitleSlide =
              deckIndex === 0 || deckIndex === slides.length - 1;
            return (
              <section
                key={deckIndex}
                data-state={isTitleSlide ? "title" : undefined}
              >
                {deck.map((html: Slide, slideIndex: number) => {
                  const key = `${deckIndex}-${slideIndex}`;
                  return this.buildSlide(html, key, isTitleSlide);
                })}
              </section>
            );
          })}
        </div>
      </div>
    );
  }
}
