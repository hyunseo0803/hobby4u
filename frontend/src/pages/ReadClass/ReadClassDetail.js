// import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/ReadClassDetail.css";
import Background from "../../component/Background";
import React from "react";
import moment from "moment";
import PaymentButton from "../../component/tossPgBTN";
import axios from "axios";

function ReadClassDetail() {
	const location = useLocation();
	const ClassDetail = location.state.ClassDetail;
	const DayDetail = location.state.DayDetail;
	const userData = location.state.userData;
	const [cashBackList, SetCashBackList] = useState([]);
	const [randomOrederid, setRandomOrederid] = useState("");

	const [activityClassList, setActivityClassList] = useState([]);
	const [isApplyMember, setIsApplyMember] = useState(false);
	const [applyokClassList, setapplyokClassList] = useState([]);
	const theme = ClassDetail["theme"]

		.replace("['", "")
		.replace("']", "")
		.replace("', '", ",")
		.replace("', '", ",");

	useEffect(() => {
		let random = (
			Math.floor(Math.random() * 10000000000) + ClassDetail.class_id
		)
			.toString(36)
			.substr(1, 10);
		while (random.length < 8) {
			random += Math.floor(Math.random() * 10).toString(36);
		}
		let result_random = `${random}_${ClassDetail.class_id}`;
		setRandomOrederid(result_random);
	}, []);

	useEffect(() => {
		getCashbackList();
		check_ApplyMember();
		read_applyclass_list();
		if (ClassDetail.type === "online") {
			read_activityclass_list();
		}
	}, []);

	useEffect(() => {
		console.log(applyokClassList);
	}, []);

	const theme_div = theme.split(",");

	const type_offline = ClassDetail["type"] === "offline";
	const money_free = parseInt(ClassDetail["money"]) === 0;

	function calculateDaysLeft(endDate) {
		const today = moment().format("YYYY-MM-DD");
		const diff = moment(endDate).diff(today, "days");
		const timeRemaining = Math.floor(diff);
		return timeRemaining;
	}

	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();
		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
		return imageEx.includes(extension);
	}

	const today = new Date().toISOString().split("T")[0];

	const getCashbackList = async () => {
		const jwt_token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				"http://localhost:8000/api/user/get_cashback_list/",
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			console.log(response.data.cashlist);
			SetCashBackList(response.data.cashlist);
		} catch (err) {
			console.error(err);
		}
	};

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

	const read_activityclass_list = () => {
		//모든 활동중인 클래스id 리스트 가져오기
		try {
			const response = axios.get(
				"http://localhost:8000/api/post/read_activityclass_list/"
			);
			console.log(response.data.activityClassList);
			setActivityClassList(response.data.activityClassList);
		} catch (e) {
			console.error(e);
		}
	};
	const read_applyclass_list = async () => {
		//모든 활동중인 클래스id 리스트 가져오기
		try {
			const response = await axios.get(
				"http://localhost:8000/api/post/read_applyclass_list/"
			);
			if (response.status === 200) {
				console.log(response.data.applyokclassList);

				setapplyokClassList(response.data.applyokclassList);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const check_ApplyMember = async () => {
		//모든 활동중인 클래스id 리스트 가져오기
		if (userData) {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.post(
					`http://localhost:8000/api/post/check_ApplyMember/`,
					{ token: token, classid: ClassDetail.class_id }
				);
				if (response.status === 200) {
					console.log(response.data.isApplyMember);
					setIsApplyMember(response.data.isApplyMember);
				}
			} catch (e) {
				console.error(e);
			}
		}
	};

	// const isApplyMember =
	//해당 클래스를 신청한 멤버 id 리스트 가져오기
	// 가져온 리스트에 userData의 id 가 있는지 확인
	// 있다면 true 반환

	return (
		<div
			style={{
				marginLeft: "18%",
				marginRight: "18%",
				backgroundColor: "white",
				marginTop: 80,
				textAlign: "center",
			}}
		>
			<div className="large_coment">{ClassDetail["title"]}</div>
			<div className="info_div">{ClassDetail["info"]}</div>

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
				<div
					style={{
						justifyContent: "space-between",
						// backgroundColor: "red",
						display: "flex",
						flexDirection: "row",
						width: "100%",
					}}
				>
					<div className="row_container">
						<div className="info_div">
							모집 인원 <div>{ClassDetail["people"]}명</div>
						</div>
						<div className="info_div">
							수강료 <div>{ClassDetail["money"]}</div>
						</div>
						<div className="info_div">
							{calculateDaysLeft(ClassDetail["applyend"]) > 0 ? (
								<div className="info_div">
									신청 마감
									<div>D - {calculateDaysLeft(ClassDetail["applyend"])}</div>
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
					<div
						style={{
							justifyContent: "center",
							alignItems: "center",
							margin: 10,
							marginTop: "auto",
							marginBottom: "auto",
							display: "flex",
							flexDirection: "row",
						}}
					>
						{/* <div style={{ fontSize: 25, marginRight: 15 }}>
							{ClassDetail.applycnt}/{ClassDetail.people}
						</div> */}
						{userData &&
						userData.nickname !== ClassDetail.id.nickname &&
						applyokClassList.some(
							(obj) => obj.class_id === ClassDetail.class_id
						) &&
						!isApplyMember ? (
							<PaymentButton
								money={ClassDetail["money"]}
								orderid={randomOrederid}
								ordername={ClassDetail["title"]}
								customername={ClassDetail.id.nickname}
								applycnt={ClassDetail.applycnt}
								applypeople={ClassDetail.people}
							/>
						) : (
							<div>
								<div style={{ fontSize: 12, color: "gray" }}>신청 현황</div>
								<div
									style={{
										color: "red",
										fontSize: 20,
									}}
								>
									{ClassDetail.applycnt}/{ClassDetail.people}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
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
					const isActivity = activityClassList.some(
						(obj) => obj.class_id === ClassDetail.class_id
					);
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
								) : ClassDetail.type === "offline" ||
								  (isActivity && isApplyMember && userData) ||
								  userData.id === ClassDetail.id.id ? (
									//재생가능
									<video
										className="infoimg_img"
										src={Item["day_file"]}
										alt="gg"
										width={100}
										controls
									/>
								) : (
									<div style={{ position: "relative" }}>
										<video
											className="infoimg_img"
											src={Item["day_file"]}
											alt="gg"
											width={100}
										/>
										<div
											style={{
												position: "absolute",
												top: "45%",
												left: "25%",
												color: "white",
											}}
										>
											수강 중의 클래스가 아닙니다.
										</div>
									</div>
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
			{ClassDetail["type"] === "offline" && (
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
	);
}

export default ReadClassDetail;
