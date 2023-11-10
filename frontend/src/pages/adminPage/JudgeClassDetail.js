// import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/ReadClassDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import moment from "moment";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

function JudgeClassDetail(props) {
	const { adminData } = props;
	const navigate = useNavigate();
	const location = useLocation();
	const ClassDetail = location.state.ClassDetail;
	const DayDetail = location.state.DayDetail;

	const type_offline = ClassDetail["type"] === "offline";
	const money_free = parseInt(ClassDetail["money"]) === 0;

	function calculateDaysLeft(endDate) {
		const today = moment();
		const endDateObj = moment(endDate);
		const timeRemaining = endDateObj.diff(today, "days");
		return timeRemaining;
	}

	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

	const startDate = new Date(ClassDetail["date"]);
	startDate.setDate(startDate.getDate() + 5);
	const currentDate = new Date();

	// 오늘 날짜와 ClassDetail['date']의 차이를 계산합니다.
	const timeDifference = startDate.getTime() - currentDate.getTime();
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

	const ApplyStartdate = daysDifference;

	const { kakao } = window;

	const criteriaList = [
		{
			title: "멘토의 능력과 경험을 고려한 설정",
			description:
				"멘토가 자신의 능력과 경험을 고려하여 클래스의 적정한 수강인원과 수강료를 설정하였는가?",
		},
		{
			title: "클래스 내용 상세 설명",
			description:
				"클래스에 대한 내용을 상세하게 안내하였는가? 수업 커리큘럼, 목표, 필요 장비 등을 명확하게 설명하였는가?",
		},
		{
			title: "전문 지식 클래스의 경우, 멘토의 능력과 신뢰도",
			description:
				"전문 지식을 요구하는 클래스인 경우, 멘토가 해당 분야에 대한 신뢰도와 능력을 보유하고 있는가?",
		},
		{
			title: "적절한 미디어 자료 첨부",
			description:
				"클래스 설명에 사용된 이미지, 영상, 파일 등이 적절하고 부적절한 자료나 미디어의 사용을 피하였는가?",
		},
	];

	useEffect(() => {
		if (ClassDetail["type"] === "offline") {
			const script = document.createElement("script");
			script.src =
				"//dapi.kakao.com/v2/maps/sdk.js?appkey=0d2dd26a75693be6d557948d939a383e";
			document.head.appendChild(script);
			script.onload = () => {
				// Kakao Maps API 로드 완료 후 실행될 콜백 함수
				kakao.maps.load(() => {
					const container = document.querySelector(".map");
					const options = {
						center: new kakao.maps.LatLng(33.450701, 126.570667),
						level: 3,
					};
					const map = new kakao.maps.Map(container, options); // 지도 객체 생성
					console.log("로드됨");
					if (kakao.maps.services) {
						const geocoder = new kakao.maps.services.Geocoder();
						geocoder.addressSearch(ClassDetail["address"], (result, status) => {
							if (status === kakao.maps.services.Status.OK) {
								const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

								new kakao.maps.Marker({
									position: coords,
									map: map,
								});

								map.setCenter(coords);
							}
						});
					}
				});
				return () => {
					document.head.removeChild(script);
				};
			};
		}
	});

	const openPdfPreview = () => {
		window.open(ClassDetail["file"], "_blank");
	};

	const clickJudgeBtn = async (value) => {
		const confirmDelete = window.confirm(`정말로 ${value} 시키겠습니까?`);
		if (confirmDelete) {
			console.log(value, adminData.nickname);
			const response = await axios.post(
				"http://localhost:8000/api/manager/create_judge_result/",
				{
					result: value,
					classid: ClassDetail["class_id"],
					admin: adminData.nickname,
				}
			);
			navigate("/manager/judge/ing/tlatkwnd");
		}
	};

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
			<div style={{ maxWidth: 1000 }}>
				<Accordion>
					<div>
						<div
							style={{
								backgroundColor: "white",
								width: 1000,
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								margin: "auto",
							}}
						>
							<div>{ClassDetail["title"]}</div>

							{isImage(ClassDetail["img"]) ? (
								<img src={ClassDetail["img"]} alt="gg" width={500} />
							) : (
								<video
									className="firstimg"
									src={ClassDetail["img"]}
									alt="gg"
									width={500}
									controls
								/>
							)}
						</div>
						<Accordion.Item eventKey="0">
							<Accordion.Header>클래스 정보</Accordion.Header>
							<Accordion.Body>
								<div
									style={{
										maxWidth: 1000,
										display: "flex",
										flexDirection: "row",
										justifyContent: "center",
									}}
								>
									<div style={{ marginRight: 20 }}>
										활동 방식: {type_offline ? "오프라인" : "온라인"}
									</div>
									<div style={{ marginRight: 20 }}>
										수강료: {ClassDetail["money"]}
									</div>
									<div style={{ marginRight: 20 }}>
										수강인원: {ClassDetail["people"]}명
									</div>
									<div style={{ marginRight: 20 }}>
										심사 마감일: {ApplyStartdate} 일 남음
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="0">
							<Accordion.Header>intro</Accordion.Header>
							<Accordion.Body>{ClassDetail["info"]}</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>클래스 소개(선택)</Accordion.Header>
							<Accordion.Body>
								{Object.values(ClassDetail).some((value) => value !== null) && (
									<div
										style={{
											maxWidth: 1000,
											padding: 30,
										}}
									>
										{[1, 2, 3].map((index) => {
											const infoKey = `info${index}`;
											const imgKey = `infoimg${index}`;
											const infoText = ClassDetail[infoKey];
											const imgSrc =
												ClassDetail[imgKey] === ClassDetail["infoimg1"]
													? ClassDetail["infoimg1"]
													: ClassDetail[imgKey] === ClassDetail["infoimg2"]
													? ClassDetail["infoimg2"]
													: ClassDetail["infoimg3"];

											return (
												<>
													{imgSrc && (
														<div
															style={{
																height: 400,
																width: 500,
																display: "flex",
																margin: "auto",
																justifyContent: "center",
																// alignItems: "center",
															}}
														>
															<img
																style={{ width: "100%", objectFit: "cover" }}
																src={imgSrc}
																alt="gg"
															/>
														</div>
													)}
													{infoText && (
														<div style={{ textAlign: "center", margin: 20 }}>
															{infoText}
														</div>
													)}
												</>
											);
										})}
									</div>
								)}
							</Accordion.Body>
						</Accordion.Item>

						<Accordion.Item eventKey="2">
							<Accordion.Header>활동 소개(필수)</Accordion.Header>
							<Accordion.Body>
								{/* <div style={{ backgroundColor: "red" }}> */}
								{DayDetail.map((Item, index) => {
									// const day_img = Item["day_file"].replace(
									// 	"/frontend/public/",
									// 	"/"
									// );

									return (
										<div
											key={index}
											style={{
												display: "flex",
												flexDirection: "row",
												width: 900,
												padding: 5,
												margin: "auto",
												maxWidth: 1000,
											}}
										>
											<div
												style={{
													width: 500,
													height: 300,
												}}
											>
												{isImage(Item["day_file"]) ? (
													<img
														className="infoimg_img"
														src={Item["day_file"]}
														alt="gg"
														width={100}
													/>
												) : (
													<video
														className="infoimg_img"
														src={Item["day_file"]}
														alt="gg"
														width={100}
														controls
													/>
												)}
											</div>
											<div
												style={{
													width: "70%",
													justifyContent: "center",
													flexDirection: "column",
													display: "flex",
													margin: 20,
													textAlign: "left",
													left: 0,
													padding: 10,
												}}
											>
												<div
													style={{
														fontFamily: "omyu_pretty",
														fontSize: 30,
													}}
												>
													{Item["day_sequence"]}
												</div>
												<div
													style={{
														fontFamily: "omyu_pretty",
														fontSize: 20,
													}}
												>
													{Item["day_title"]}
												</div>
												<div> {Item["day_info"]}</div>
											</div>
										</div>
									);
								})}
								{/* </div> */}
							</Accordion.Body>
						</Accordion.Item>
						{ClassDetail["address"] !== null && (
							<Accordion.Item eventKey="3">
								<Accordion.Header>활동 장소</Accordion.Header>
								<Accordion.Body>
									<>
										<div
											style={{ padding: 15, fontSize: 18, textAlign: "center" }}
										>
											{ClassDetail["address"]}
										</div>

										<div
											style={{
												backgroundColor: "white",
												height: 300,
											}}
										>
											<div
												className="map"
												style={{
													justifyContent: "center",
													width: "90%",
													height: 250,
													margin: "auto",
												}}
											></div>
										</div>
									</>
								</Accordion.Body>
							</Accordion.Item>
						)}
						{ClassDetail["file"] !== null && (
							<Accordion.Item eventKey="4">
								<Accordion.Header>첨부 파일</Accordion.Header>
								<Accordion.Body>
									<>
										<div
											style={{
												margin: 30,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<button
												onClick={openPdfPreview}
												style={{
													border: "none",
													backgroundColor: "transparent",
													color: "blue",
													// padding: 20,
													// borderRadius: 50,
												}}
											>
												활동 파일 다운 받기
											</button>
										</div>
									</>
								</Accordion.Body>
							</Accordion.Item>
						)}
					</div>
				</Accordion>
				<div
					style={{
						backgroundColor: "white",
						padding: 15,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div style={{ padding: 15, fontSize: 18, color: "red" }}>
						아래의 4가지 조건을 모두 만족할 경우만 PASS
					</div>
					<ul style={{ marginTop: 20 }}>
						{criteriaList.map((criteria, index) => (
							<li key={index}>
								<strong>{criteria.title}</strong>
								<p>{criteria.description}</p>
							</li>
						))}
					</ul>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<button
						style={{
							width: "50%",
							height: 40,
							border: "none",
							borderRadius: 5,
							backgroundColor: "green",
							margin: 3,
						}}
						value="P"
						onClick={(e) => clickJudgeBtn(e.target.value)}
					>
						P
					</button>
					<button
						style={{
							width: "50%",
							border: "none",
							borderRadius: 5,
							margin: 3,
							backgroundColor: "red",
						}}
						value="NP"
						onClick={(e) => clickJudgeBtn(e.target.value)}
					>
						NP
					</button>
				</div>
			</div>
		</div>
		// <Background>
		// <div
		// 	style={{
		// 		marginLeft: "18%",
		// 		marginRight: "18%",
		// 		backgroundColor: "white",
		// 	}}
		// >
		// 	<div className="large_coment">{ClassDetail["title"]}</div>
		// 	{/* <div
		// 		className="round_label_container"
		// 		style={{ justifyContent: "space-between" }}
		// 	> */}
		// 	{/* <div className="round_label_container">
		// 			{theme_div.map((theme) => (
		// 				<div className="round_label">{theme}</div>
		// 			))}
		// 		</div> */}
		// 	<div className="round_label_container">
		// 		<div className="round_label">
		// 			{type_offline ? "오프라인" : "온라인"}
		// 		</div>
		// 		<div className="round_label">{money_free ? " 무료" : " 유료"}</div>
		// 	</div>
		// 	{/* </div> */}
		// 	<div className="img">
		// 		{isImage(ClassDetail["img"]) ? (
		// 			<img className="firstimg" src={firstimg} alt="gg" width={50} />
		// 		) : (
		// 			<video
		// 				className="firstimg"
		// 				src={firstimg}
		// 				alt="gg"
		// 				width={50}
		// 				controls
		// 			/>
		// 		)}
		// 	</div>
		// 	<div
		// 		className="row_container"
		// 		style={{ justifyContent: "space-between" }}
		// 	>
		// 		<div className="row_container">
		// 			<div className="info_div">모집 인원 {ClassDetail["people"]}명</div>
		// 			<div className="info_div">수강료 {ClassDetail["money"]}</div>
		// 		</div>

		// 		<div className="row_container">
		// 			{calculateDaysLeft(ClassDetail["applyend"]) > 0 ? (
		// 				<div className="info_div">
		// 					D - {calculateDaysLeft(ClassDetail["applyend"])} 일 남음
		// 				</div>
		// 			) : (
		// 				<div
		// 					className="info_div"
		// 					style={{
		// 						width: 200,
		// 						justifyContent: "center",
		// 						display: "flex",
		// 						alignItems: "center",
		// 					}}
		// 				>
		// 					신청 기간이 아닙니다
		// 				</div>
		// 			)}
		// 		</div>
		// 	</div>
		// 	<div className="info_div">{ClassDetail["info"]}</div>
		// 	{Object.values(ClassDetail).some((value) => value !== null) && (
		// 		<div
		// 			style={{
		// 				padding: 30,
		// 			}}
		// 		>
		// 			{[1, 2, 3].map((index) => {
		// 				const infoKey = `info${index}`;
		// 				const imgKey = `infoimg${index}`;
		// 				const infoText = ClassDetail[infoKey];
		// 				const imgSrc =
		// 					ClassDetail[imgKey] === infoimg1
		// 						? infoimg1
		// 						: ClassDetail[imgKey] === infoimg2
		// 						? infoimg2
		// 						: infoimg3;

		// 				return (
		// 					<>
		// 						{imgSrc && (
		// 							<div className="infoimg_container">
		// 								<img className="infoimg_img" src={imgSrc} alt="gg" />
		// 							</div>
		// 						)}
		// 						{infoText && <div className="info_div">{infoText}</div>}
		// 					</>
		// 				);
		// 			})}
		// 		</div>
		// 	)}
		// 	<div className="info_div">
		// 		{DayDetail.map((Item, index) => {
		// 			const day_img = Item["day_file"].replace("/frontend/public/", "/");

		// 			return (
		// 				<div key={index} className="row_container">
		// 					<div
		// 						style={{
		// 							width: "80%",
		// 							height: 300,
		// 						}}
		// 					>
		// 						{isImage(Item["day_file"]) ? (
		// 							<img
		// 								className="infoimg_img"
		// 								src={day_img}
		// 								alt="gg"
		// 								width={100}
		// 							/>
		// 						) : (
		// 							<video
		// 								className="infoimg_img"
		// 								src={day_img}
		// 								alt="gg"
		// 								width={100}
		// 								controls
		// 							/>
		// 						)}
		// 					</div>
		// 					<div
		// 						style={{
		// 							width: "90%",
		// 							justifyContent: "center",
		// 							flexDirection: "column",
		// 							display: "flex",
		// 							margin: 20,
		// 							textAlign: "left",
		// 							left: 0,
		// 							padding: 10,
		// 						}}
		// 					>
		// 						<div
		// 							style={{
		// 								fontFamily: "omyu_pretty",
		// 								fontSize: 30,
		// 							}}
		// 						>
		// 							{Item["day_sequence"]}
		// 						</div>
		// 						<div
		// 							style={{
		// 								fontFamily: "omyu_pretty",
		// 								fontSize: 20,
		// 							}}
		// 						>
		// 							{Item["day_title"]}
		// 						</div>
		// 						<div> {Item["day_info"]}</div>
		// 					</div>
		// 				</div>
		// 			);
		// 		})}
		// 	</div>
		// 	{ClassDetail["address"] !== null && (
		// 		<>
		// 			<div>{ClassDetail["address"]}</div>

		// 			<div
		// 				style={{
		// 					backgroundColor: "white",

		// 					// color: "white",
		// 					height: 400,
		// 				}}
		// 			>
		// 				<div
		// 					className="map"
		// 					style={{
		// 						justifyContent: "center",
		// 						width: "90%",
		// 						height: 250,
		// 						margin: "auto",
		// 					}}
		// 				></div>
		// 			</div>
		// 		</>
		// 	)}
		// 	{ClassDetail["file"] !== null && (
		// 		<div style={{ margin: 30 }}>
		// 			<button
		// 				onClick={openPdfPreview}
		// 				style={{
		// 					border: "none",
		// 					backgroundColor: "black",
		// 					color: "white",
		// 					padding: 20,
		// 					borderRadius: 50,
		// 				}}
		// 			>
		// 				{pdfFileName}
		// 			</button>
		// 		</div>
		// 	)}
		// </div>
		// </Background>
	);
}

export default JudgeClassDetail;
