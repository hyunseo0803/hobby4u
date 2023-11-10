// import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/ReadClassDetail.css";
import Background from "../../component/Background";
import React from "react";
import moment from "moment";

function ReadClassDetail() {
	const location = useLocation();
	const ClassDetail = location.state.ClassDetail;
	const DayDetail = location.state.DayDetail;
	const theme = ClassDetail["theme"]
		.replace("['", "")
		.replace("']", "")
		.replace("', '", ",")
		.replace("', '", ",");

	const theme_div = theme.split(",");

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

	const today = new Date().toISOString().split("T")[0];

	const { kakao } = window;

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

	useEffect(() => {
		console.log(today);
		console.log(ClassDetail["applyend"]);
	});

	return (
		<Background>
			<div
				style={{
					marginLeft: "18%",
					marginRight: "18%",
					backgroundColor: "white",
				}}
			>
				<div className="large_coment">{ClassDetail["title"]}</div>
				<div
					className="round_label_container"
					style={{ justifyContent: "space-between" }}
				>
					<div className="round_label_container">
						{theme_div.map((theme) => (
							<div className="round_label">{theme}</div>
						))}
					</div>
					<div className="round_label_container">
						<div className="round_label">
							{type_offline ? "오프라인" : "온라인"}
						</div>
						<div className="round_label">{money_free ? " 무료" : " 유료"}</div>
					</div>
				</div>
				<div className="img">
					{isImage(ClassDetail["img"]) ? (
						<img
							className="firstimg"
							src={ClassDetail["img"]}
							alt="gg"
							width={100}
						/>
					) : (
						<video
							className="firstimg"
							src={ClassDetail["img"]}
							alt="gg"
							width={100}
							controls
						/>
					)}
				</div>
				<div
					className="row_container"
					style={{ justifyContent: "space-between" }}
				>
					<div className="row_container">
						<div className="info_div">모집 인원 {ClassDetail["people"]}명</div>
						<div className="info_div">수강료 {ClassDetail["money"]}</div>
					</div>

					<div className="row_container">
						{calculateDaysLeft(ClassDetail["applyend"]) > 0 ? (
							<div className="info_div">
								D - {calculateDaysLeft(ClassDetail["applyend"])} 일 남음
							</div>
						) : (
							<div
								className="info_div"
								style={{
									width: 200,
									justifyContent: "center",
									display: "flex",
									alignItems: "center",
								}}
							>
								{ClassDetail["activitystart"] <= today &&
									ClassDetail["activityend"] >= today && (
										<div>활동 기간입니다. </div>
									)}
								{ClassDetail["activityend"] < today && (
									<div>마감된 활동입니다.</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="info_div">{ClassDetail["info"]}</div>
				{Object.values(ClassDetail).some((value) => value !== null) && (
					<div
						style={{
							backgroundColor: "rgb(62, 63, 74)",
							color: "white",
							padding: 30,
						}}
					>
						<div className="large_coment" style={{ padding: 50 }}>
							우리 클래스를 소개할게요
						</div>
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
										<div className="infoimg_container">
											<img className="infoimg_img" src={imgSrc} alt="gg" />
										</div>
									)}
									{infoText && <div className="info_div">{infoText}</div>}
								</>
							);
						})}
					</div>
				)}
				<div className="info_div">
					<div className="large_coment" style={{ padding: 70 }}>
						어떤 활동을 하나요?
					</div>
					{DayDetail.map((Item, index) => {
						// const day_img = Item["day_file"].replace("/frontend/public/", "/");

						return (
							<div key={index} className="row_container">
								<div
									style={{
										width: "80%",
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
										width: "90%",
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
				</div>
				{ClassDetail["address"] !== null && (
					<>
						<div
							style={{
								backgroundColor: "rgb(62, 63, 74)",
								color: "white",
								height: 400,
							}}
						>
							<div className="large_coment">어디서? where?</div>

							<div
								className="map"
								style={{
									justifyContent: "center",
									width: "90%",
									height: 250,
									margin: "auto",
								}}
							></div>
							<div
								style={{
									fontFamily: "omyu_pretty",
									fontSize: 30,
									letterSpacing: 3,
									margin: 10,
								}}
							>
								{ClassDetail["address"]}
							</div>
						</div>
					</>
				)}
				{ClassDetail["file"] !== null && (
					<div style={{ margin: 30 }}>
						<button
							onClick={openPdfPreview}
							style={{
								border: "none",
								backgroundColor: "black",
								color: "white",
								padding: 20,
								borderRadius: 50,
							}}
						>
							활동 파일 다운 받기
						</button>
					</div>
				)}
			</div>
		</Background>
	);
}

export default ReadClassDetail;
