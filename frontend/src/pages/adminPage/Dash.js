import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BsChatTextFill } from "react-icons/bs";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import "../../styles/Dash.css";

import ReactApexChart from "react-apexcharts";

function Dash(props) {
	const {
		adminData,
		isJudgeFinish,
		notJudgeFinish,
		asapJudge,
		finishJudgeCnt,
		deadlineJudge,
	} = props;
	const [boardContent, setBoardContent] = useState("");
	const [getContent, setGetContent] = useState();

	useEffect(() => {
		readContent();
		finishJudgeCnt();
		deadlineJudge();
	}, []);
	useEffect(() => console.log(isJudgeFinish, notJudgeFinish));

	useEffect(() => {
		console.log(adminData.nickname);
	});
	const uploadContent = async () => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/manager/create_board_content/",
				{ boardContent: boardContent, writer: adminData.nickname }
			);
			// console.log(response.data.status);
			// if (response.data) {
			setBoardContent("");
			console.log("ok 받음");

			readContent();

			// }
		} catch (error) {
			console.error(error);
		}
	};

	const readContent = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/manager/read_board_content/"
			);
			console.log(response.data.boardList);
			setGetContent(response.data.boardList);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteContent = async (index) => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/manager/delete_board_content/",
				{ index: index }
			);
			readContent();
		} catch (error) {
			console.error(error);
		}
	};

	const donutData = {
		series: [notJudgeFinish, isJudgeFinish],
		options: {
			chart: {
				type: "donut",
			},

			legend: {
				position: "bottom",
				onItemClick: {
					toggleDataSeries: false,
				},
			},
			responsive: [
				{
					breakpoint: 480,
				},
			],
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							total: {
								showAlways: true,
								show: true,
								label: "Total",
								fontSize: "35px",
								color: "black",
							},
							value: {
								fontSize: "35px",
								show: true,
								color: "royalblue",
							},
						},
					},
				},
			},

			colors: ["#df6033", "#6bb6a1"],

			labels: ["심사 미완료", "심사 완료"],
			dataLabels: {
				style: {
					fontSize: "20px", // 데이터값(라벨)의 폰트 크기 설정
					fontWeight: "bold", // 폰트 굵기 설정
					colors: ["white"], // 각 라벨에 대한 색상 설정
				},
			},
			stroke: {
				width: 0,
				// dashArray: 3,
				color: ["#ff5733", "#ffa07a"],
				// opacity: 0.4,
			},
		},
	};
	return (
		<div
			style={{
				backgroundColor: "#333",

				width: "100%",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: "30%",
					height: "80%",
					display: "flex",
					flexDirection: "column",
					margin: 20,
				}}
			>
				<div
					style={{
						marginBottom: 20,
						border: "none",
						color: "white",
						height: "10%",
						textAlign: "center",
						alignItems: "center",
						display: "flex",
						justifyContent: "center",
						fontSize: 20,
					}}
				>
					{adminData.nickname}님 환영합니다.
				</div>
				<div
					style={{
						backgroundColor: "white",
						height: "90%",
						borderRadius: 10,

						alignItems: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div style={{ margin: 10 }}>심사 진행 현황</div>

					<div id="chart">
						<ReactApexChart
							options={donutData.options}
							series={donutData.series}
							type="donut"
							width="400"
						/>
					</div>
					<div style={{ margin: 20 }}>심사 임박 건수</div>
					<div style={{ fontSize: 30, color: "red" }}>총 {asapJudge}건</div>
				</div>
			</div>
			<div
				style={{
					borderRadius: 10,
					height: "80%",
					width: "50%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: "white",
					margin: 20,
					padding: 10,
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						display: "flex",

						flexDirection: "row",
						alignItems: "center",
						marginLeft: 10,
					}}
				>
					<div style={{ height: 30, margin: 5 }}>
						<BsChatTextFill size={30} />
					</div>
					<div style={{ height: 30, fontSize: 20, margin: 5 }}>
						관리자 게시판
					</div>
				</div>
				{getContent && (
					<div
						style={{
							height: 400,
							overflowY: "auto",

							// backgroundColor: "yellow",
							// display: "flex",
							// justifyContent: "flex-start",
							// alignItems: "flex-start",
						}}
					>
						{getContent.map((c, index) => (
							<div
								key={index}
								style={{
									// height: 100,

									margin: 20,
								}}
							>
								{/* {c.writer} */}
								<div
									style={{
										backgroundColor: "#d3d3d3",
										borderRadius: 10,
										padding: 8,
									}}
								>
									{c.content}
								</div>
								{/* {c.date} */}
								<div
									style={{
										fontSize: 12,
										textAlign: "right",
										color: "gray",
										display: "flex",
										flexDirection: "row",
										justifyContent: "flex-end",
									}}
								>
									<div style={{ marginRight: 10 }}>{c.writer}</div>
									<div style={{ marginRight: 10 }}>{c.date}</div>
									{adminData.nickname === c.writer && (
										<button
											style={{
												border: "none",
												backgroundColor: "transparent",
												fontSize: 12,
												color: "blue",
											}}
											onClick={() => deleteContent(c.num)}
										>
											삭제
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
				<div
					style={{
						padding: 10,
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<textarea
						type="text"
						className="send_Msg_textarea"
						placeholder="Enter your Message..."
						maxLength={70}
						value={boardContent}
						onChange={(e) => {
							setBoardContent(e.target.value);
						}}
					/>
					<button
						style={{
							// width: "10%",
							border: "none",
							padding: 4,
							marginLeft: 5,
							backgroundColor: "transparent",
						}}
						onClick={uploadContent}
					>
						<IoArrowForwardCircleSharp size={30} />
					</button>
				</div>
			</div>
			{/* <div
				style={{
					backgroundColor: "white",
					width: "50%",
					height: "50%",
				}}
			>
				{adminData.nickname}님 환영합니다.
			</div> */}
		</div>
	);
}

export default Dash;
