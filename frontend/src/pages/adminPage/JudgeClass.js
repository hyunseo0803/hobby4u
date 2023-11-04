import axios from "axios";
import React, { useEffect, useState } from "react";

function JudgeClass() {
	const [judgeDATA, setJudgeData] = useState("");
	function readJudge() {
		axios
			.get("http://localhost:8000/api/manager/read_judge_class/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const judgeItem = response.data.judge_data_list;
				setJudgeData(judgeItem);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	useEffect(() => {
		console.log(judgeDATA);
	});
	return (
		<div style={{ backgroundColor: "#d3d3d3", width: "100%" }}>
			<button style={{ border: "none" }} onClick={readJudge}>
				admin 페이지 _심사클래스 불러오기
			</button>
		</div>
	);
}

export default JudgeClass;
