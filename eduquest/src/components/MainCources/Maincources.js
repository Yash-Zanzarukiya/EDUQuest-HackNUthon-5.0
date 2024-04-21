import React from "react";
import { Col, Row } from "reactstrap";
import { cource_list } from "../../assests/assets";
import CourseCard from "../Courses-section/CourseCard";

export default function Maincources({ data }) {
    console.log(data);
  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
        <a href="">
          <button className="btn mx-2">React</button>
        </a>
      </div>
      <Row>
        {cource_list.map(
          (item) =>
            item.isPublished && (
              <Col lg="4" md="6" sm="6" key={item.id}>
                <a href="" style={{ textDecoration: "none" }}>
                  <CourseCard item={item} />
                </a>
              </Col>
            )
        )}
      </Row>
    </div>
  );
}
