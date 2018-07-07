import * as React from "react";

import "./person.css";

const TwitterIcon = require("react-icons/lib/fa/twitter");

interface PersonProps {
  avatar: any;
  name: string;
  title: string;
  twitter: string;
}

const Person: React.SFC<PersonProps> = ({ avatar, name, title, twitter }) => (
  <div className="person">
    <img className="person-avatar" src={avatar} />
    <div className="person-details">
      <h2 className="person-name">{name}</h2>
      <h3 className="person-title">{title}</h3>
      <a
        className="person-twitter"
        href={`https://twitter.com/${twitter}`}
        target="_blank"
        rel="noopener"
      >
        <TwitterIcon className="icon" color="#1da1f2" />@{twitter}
      </a>
    </div>
  </div>
);

export default Person;
