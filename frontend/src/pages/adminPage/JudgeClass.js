import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, getDownloadURL } from "firebase/storage";

function JudgeClass(props) {
	const { asapJudgeList, readFirebasefile } = props;
	const navigate = useNavigate();
	const [judgeDATA, setJudgeData] = useState([]);
	const [clickAsapBtn, setClickAsapBtn] = useState(false);
	// const [classDetail, setClassDetail] = useState([]);
	// const [dayDetail, setDayDetail] = useState([]);
	useEffect(() => {
		readJudge();
	}, []);

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

	async function handleReadDetail(value) {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_some_data/?class_id=${value}`
			);
			const classdetail = response.data.class_data;
			const daydetail = response.data.day_data;
			const updatedClassDetail = { ...classdetail };
			const classImg = await readFirebasefile("classFile", classdetail.img);
			const classfile = await readFirebasefile("file", classdetail["file"]);
			if (classdetail["infoimg1"]) {
				const intro1 = await readFirebasefile("intro", classdetail["infoimg1"]);
				updatedClassDetail.infoimg1 = intro1;
			}
			if (classdetail["infoimg2"]) {
				const intro2 = await readFirebasefile("intro", classdetail["infoimg2"]);
				updatedClassDetail.infoimg2 = intro2;
			}
			if (classdetail["infoimg3"]) {
				const intro3 = await readFirebasefile("intro", classdetail["infoimg3"]);
				updatedClassDetail.infoimg3 = intro3;
			}

			updatedClassDetail.img = classImg;
			updatedClassDetail.file = classfile;

			const updatedDayDetail = await Promise.all(
				daydetail.map(async (day) => {
					const updatedDay = { ...day };
					try {
						updatedDay.day_file = await readFirebasefile("day", day.day_file);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedDay;
				})
			);
			navigate("/manager/judge/classdetail", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	// useEffect(() => {
	// 	console.log("classDetail updated:", classDetail);
	// }, [classDetail]);
	return (
		<div
			style={{
				backgroundColor: "#d3d3d3",
				width: "100%",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					// backgroundColor: "red",
					width: "90%",
					// top: 10,
					// height: "88%",
					display: "flex",
					flexDirection: "column",
					flexWrap: "wrap",
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
					borderRadius: 10,
				}}
			>
				<div style={{ padding: 20, marginTop: 15 }}>
					<input type="text" />
					<button>검색</button>
				</div>
				<button onClick={() => setClickAsapBtn(!clickAsapBtn)}>
					심사 얼마 안남음
				</button>

				<div
					style={{
						// backgroundColor: "yellow",
						width: "86%",
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						marginTop: 20,
					}}
				>
					{clickAsapBtn ? (
						<>
							{asapJudgeList.map((j, index) => (
								<div
									key={index}
									style={{
										width: "47%",
										display: "flex",
										flexDirection: "row",
										backgroundColor: "white",
										padding: 10,
										borderRadius: 15,
										margin: 15,
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "flex-end",
											marginLeft: 15,
										}}
									>
										<div style={{ marginRight: 15 }}>{j.title}</div>
										<div style={{ fontSize: 12, color: "gray" }}>
											{j.id.nickname}
										</div>
									</div>
									<div>
										<button
											style={{
												border: "none",
												backgroundColor: "transparent",
												borderRadius: 10,
												color: "royalblue",
												height: 50,
											}}
											onClick={() => handleReadDetail(j.class_id)}
										>
											심사하기
										</button>
									</div>
								</div>
							))}
						</>
					) : (
						<>
							{judgeDATA.map((j, index) => (
								<div
									key={index}
									style={{
										width: "47%",
										display: "flex",
										flexDirection: "row",
										backgroundColor: "white",
										padding: 10,
										borderRadius: 15,
										margin: 15,
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "flex-end",
											marginLeft: 15,
										}}
									>
										<div style={{ marginRight: 15 }}>{j.title}</div>
										<div style={{ fontSize: 12, color: "gray" }}>
											{j.id.nickname}
										</div>
									</div>
									<div>
										<button
											style={{
												border: "none",
												backgroundColor: "transparent",
												borderRadius: 10,
												color: "royalblue",
												height: 50,
											}}
											onClick={() => handleReadDetail(j.class_id)}
										>
											심사하기
										</button>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default JudgeClass;
