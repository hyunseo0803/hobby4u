import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Exam.css";
import { useNavigate } from "react-router-dom";
import ReadClassOptionLB from "../component/AllReadOptionLB";

function Exam(props) {
	const navigate = useNavigate();
	const [judgeMy, setJudgeMy] = useState([]);
	const [judgeNP, setJudgeNP] = useState([]);
	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
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
			setJudgeMy(judgeItem);
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
			const judgeItem = response.data.judge_np_list;
			setJudgeNP(judgeItem);
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}
	function handleReadDetail(value) {
		axios
			.get(`http://localhost:8000/api/post/read_some_data/?class_id=${value}`)
			.then((response) => {
				navigate("/judge", {
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

	return (
		<div style={{ margin: "8%" }}>
			<div style={{ fontSize: 20, fontWeight: "bolder" }}>심사 중</div>
			{judgeMy.length > 0 ? (
				<div
					style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}
				>
					{judgeMy.map((j, index) => {
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

						// const likeStatusItem = like_status
						// 	? like_status.find((item) => item.class_id === classItem.class_id)
						// 	: null;

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

						// const likeStatusItem = like_status
						// 	? like_status.find((item) => item.class_id === classItem.class_id)
						// 	: null;

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
export default Exam;
