import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Allclass() {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	// const [classdata, setClassdata] = useState({
	// 	class_data: {},
	// 	day_data: {},
	// });
	// const [class_data, setClassdata] = useState([]);

	function handleReadDetail(value) {
		axios
			.get(`http://localhost:8000/api/post/read_some_data/?class_id=${value}`)
			.then((response) => {
				// console.log({ classData: response.data.day_data });
				navigate("/readClass/classDetail", {
					state: {
						ClassDetail: response.data.class_data,
						DayDetail: response.data.day_data,
					},
				});
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/post/read_all_data/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const data = response.data;
				setData(data);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}, []);

	return (
		<div style={{ margin: 100 }}>
			{" "}
			<ul>
				{data.map((classItem, index) => (
					<li key={index}>
						<strong>id:</strong>{" "}
						<button
							value={classItem.class_id}
							onClick={(e) => handleReadDetail(e.target.value)}
						>
							{" "}
							{classItem.class_id}
						</button>
						<br />
						<strong>Title:</strong> {classItem.title}
						<br />
						<strong>Info:</strong> {classItem.info}
					</li>
				))}
			</ul>
		</div>
	);
}

export default Allclass;
