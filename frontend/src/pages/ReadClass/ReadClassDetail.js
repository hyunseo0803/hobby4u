// import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";

function ReadClassDetail() {
	const location = useLocation();
	const ClassDetail = location.state.ClassDetail;
	const DayDetail = location.state.DayDetail;
	const firstimg = ClassDetail["img"].replace("/frontend/public/", "/");
	const theme = ClassDetail["theme"]
		.replace("['", "")
		.replace("']", "")
		.replace("','", " ");

	const type_offline = ClassDetail["type"] === "offline";
	const money_free = parseInt(ClassDetail["money"]) === 0;
	useEffect(() => {
		console.log(ClassDetail);
		console.log(DayDetail);
		console.log(parseInt(ClassDetail["money"]));
	});

	return (
		<div style={{ margin: 100 }}>
			<strong>Title:</strong> {ClassDetail["title"]}
			<br />
			<strong>{theme}</strong>
			<img src={firstimg} alt="Minus Circle" width="100%" />
			<br />
			<strong>{type_offline ? "오프라인 |" : "온라인 |"}</strong>
			<strong>{money_free ? " 무료" : " 유료"}</strong>
			<br />
			<strong>데이별 활동</strong>
			<ul>
				{DayDetail.map((Item, index) => (
					<li key={index}>
						<strong>DAY:</strong> {Item["day_sequence"]}
						<br />
						<strong>Title:</strong> {Item["day_title"]}
						<br />
						<strong>Info:</strong> {Item["day_info"]}
					</li>
				))}
			</ul>
		</div>
	);
}

export default ReadClassDetail;
