import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Exam.css";
import { useNavigate } from "react-router-dom";
import ReadClassOptionLB from "../component/AllReadOptionLB";

function Judge(props) {
	const { readFirebasefile } = props;
	const navigate = useNavigate();
	const [judgeMy, setJudgeMy] = useState([]);
	const [judgeNP, setJudgeNP] = useState([]);
	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

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
			navigate("/judge", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	return (
		<div style={{ margin: "8%" }}>
			<div style={{ fontSize: 20, fontWeight: "bolder" }}>심사 중</div>
			{judgeMy.length > 0 ? (
				<div
					style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
				>
					{judgeMy.map((j, index) => {
						const handleImageClick = (e) => {
							e.stopPropagation();
							handleReadDetail(j.class_id);
						};

						const handleButtonClick = () => {
							handleReadDetail(j.class_id);
						};
						const isFree = j.money === "0";
						const isOnline = j.type === "online";

						return (
							<div key={index} className="class_div_btn">
								<div className="firstimg_container">
									{isImage(j.img) ? (
										<img
											className="firstimg"
											src={j.img}
											alt="gg"
											onClick={handleImageClick}
										/>
									) : (
										<video
											className="firstimg"
											src={j.img}
											alt="gg"
											onClick={handleImageClick}
											controls
										/>
									)}
								</div>
								<div
									className="class_div_MO"
									style={{
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
								</div>
								<button
									value={j.class_id}
									onClick={handleButtonClick}
									className="class_title_btn"
								>
									{j.title}
								</button>
							</div>
						);
					})}
				</div>
			) : (
				<div>심사중인 클래스가 없습니다.</div>
			)}
			<div style={{ fontSize: 20, fontWeight: "bolder" }}>Npass 클래스</div>
			{judgeNP.length > 0 ? (
				<div
					style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
				>
					{judgeNP.map((j, index) => {
						// const firstimg = j.img.replace("/frontend/public/", "/");

						const handleImageClick = (e) => {
							e.stopPropagation();
							handleReadDetail(j.class_id);
						};

						const handleButtonClick = () => {
							handleReadDetail(j.class_id);
						};
						const isFree = j.money === "0";
						const isOnline = j.type === "online";

						return (
							<div key={index} className="class_div_btn">
								<div className="firstimg_container">
									{isImage(j.img) ? (
										<img
											className="firstimg"
											src={j.img}
											alt="gg"
											onClick={handleImageClick}
										/>
									) : (
										<video
											className="firstimg"
											src={j.img}
											alt="gg"
											onClick={handleImageClick}
											controls
										/>
									)}
								</div>
								<div
									className="class_div_MO"
									style={{
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
									<div className="class_GCount">
										<div className="like">좋아요</div>
										<div className="like_text">{j.goodCount}</div>
									</div>
								</div>
								<button
									value={j.class_id}
									onClick={handleButtonClick}
									className="class_title_btn"
								>
									{j.title}
								</button>
							</div>
						);
					})}
				</div>
			) : (
				<div>Npass 클래스가 없습니다.</div>
			)}
		</div>
	);
}
export default Judge;
