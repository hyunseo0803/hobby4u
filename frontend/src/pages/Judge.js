import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Exam.css";
import ClassCard from "../component/classCard";

function Judge(props) {
	const { readFirebasefile, userData } = props;
	const [judgeMy, setJudgeMy] = useState([]);
	const [judgeNP, setJudgeNP] = useState([]);

	useEffect(() => {
		readJudge();
		readJudgeNP();
	}, []);

	async function readJudge() {
		const jwt = localStorage.getItem("token");
		try {
			const response = await axios.post(
				"http://localhost:8000/api/post/read_judge_my/",
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
			const judgeItem = response.data.judge_data_list;
			const judgemy = await Promise.all(
				judgeItem.map(async (s) => {
					const judgeMY = { ...s };
					try {
						judgeMY.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return judgeMY;
				})
			);
			setJudgeMy(judgemy);
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}
	async function readJudgeNP() {
		const jwt = localStorage.getItem("token");
		try {
			const response = await axios.post(
				"http://localhost:8000/api/post/read_judge_np/",
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
			const judgenp = response.data.judge_np_list;
			const judge_np = await Promise.all(
				judgenp.map(async (s) => {
					const np = { ...s };
					try {
						np.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return np;
				})
			);
			setJudgeNP(judge_np);
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	return (
		<div
			style={{
				marginLeft: "10%",
				marginRight: "10%",
				marginTop: "8%",
				marginBottom: "2%",
			}}
		>
			<div style={{ fontSize: 20, fontWeight: "bolder" }}>심사 중</div>
			{judgeMy.length > 0 ? (
				<div
					style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
				>
					<ClassCard
						classDiv={judgeMy}
						readFirebasefile={readFirebasefile}
						userData={userData}
					/>
				</div>
			) : (
				<div>심사중인 클래스가 없습니다.</div>
			)}
			<div style={{ fontSize: 20, fontWeight: "bolder" }}>Npass 클래스</div>
			{judgeNP.length > 0 ? (
				<div
					style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
				>
					<ClassCard
						classDiv={judgeNP}
						readFirebasefile={readFirebasefile}
						userData={userData}
					/>
				</div>
			) : (
				<div>Npass 클래스가 없습니다.</div>
			)}
		</div>
	);
}
export default Judge;
