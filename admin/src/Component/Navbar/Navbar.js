import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div id="sidebar-wrapper">
      <h1>EDUQuest</h1>
      <ul class="sidebar-nav" style={{ marginLeft: "0px" }}>
        <li class="sidebar-brand">
          <a
            href="#menu-toggle"
            id="menu-toggle"
            style={{ marginTop: "20px", float: "right" }}
          />{" "}
          <i
            class="fa fa-bars "
            style={{ fontSize: "20px !Important;", ariaHidden: "true" }}
          ></i>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-sort-alpha-asc " aria-hidden="true">
              {" "}
            </i>{" "}
            <span style={{ marginLeft: "10px;" }}>Insert Data</span>{" "}
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <i class="fa fa-play-circle-o " aria-hidden="true">
              {" "}
            </i>{" "}
            <span style={{ marginLeft: "10px;" }}>View Data</span>{" "}
          </a>
        </li>
      </ul>
    </div>
  );
}
