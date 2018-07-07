import * as React from "react";

import "./person-list.css";

interface PersonListProps {}

const PersonList: React.SFC<PersonListProps> = ({ children }) => (
  <div className="person-list">{children}</div>
);

export default PersonList;
