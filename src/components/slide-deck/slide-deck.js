import React, { Component } from "react";

import "prismjs";
import "reveal.js/css/reveal.css";
import "@objectpartners/revealjs-theme";

import "./slide-deck.css";

export class SlideDeck extends Component {
  componentDidMount() {
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

        window.Reveal = Reveal;

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

  getSectionProps(html) {
    const section = html.match(/<section[^>]+/);
    if (!section) {
      return {};
    }

    const props = section
      .pop()
      .replace(/<section\s/, "")
      .split(/([\w-]+)="([^"]+)"/)
      .filter(part => part && part.length > 0);

    return props.reduce((merged, part, index) => {
      if (part % 1 === 0) {
        merged[part] = "";
      } else if (props[index - 1]) {
        merged[props[index - 1]] = part;
      }
      return merged;
    }, {});
  }

  buildSlide(html, key, isTitle) {
    if (html.default) {
      const Slide = html.default;
      if (isTitle) {
        return <Slide />;
      }

      return (
        <section key={key}>
          <Slide />
        </section>
      );
    }

    if (isTitle) {
      return (
        <div
          key={key}
          dangerouslySetInnerHTML={{ __html: html }} // #yolo
        />
      );
    }

    const sectionProps = this.getSectionProps(html);

    return (
      <section
        key={key}
        {...sectionProps}
        dangerouslySetInnerHTML={{ __html: html }} // #yolo
      />
    );
  }

  render() {
    const { slides } = this.props;
    const { PRESENTATION_DATE: date } = process.env;
    return (
      <div className="reveal">
        <div className="slides">
          {slides.map((deck, deckIndex) => {
            const isTitleSlide =
              deckIndex === 0 || deckIndex === slides.length - 1;
            return (
              <section
                key={deckIndex}
                data-state={isTitleSlide ? "title" : undefined}
              >
                {deck.map((html, slideIndex) => {
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
