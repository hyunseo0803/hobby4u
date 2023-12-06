// import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/ReadClassDetail.css";
import Background from "../../component/Background";
import React from "react";
import moment from "moment";
import PaymentButton from "../../component/tossPgBTN";
import axios from "axios";
import HorizonLine from "../../common/HorizonLine";
import { IoIosStar } from "react-icons/io";

function ReadClassDetail(props) {
	const { readFirebasefile } = props;
	const location = useLocation();
	const ClassDetail = location.state.ClassDetail;
	const DayDetail = location.state.DayDetail;
	const userData = location.state.userData;

	const [updatedImg, setUpdatedImg] = useState("");

	const [cashBackList, SetCashBackList] = useState([]);
	const [randomOrederid, setRandomOrederid] = useState("");
	const [achiveLink, setAchiveLink] = useState([]);
	const [achiveFile, setAchiveFile] = useState([]);
	const [activityClassList, setActivityClassList] = useState([]);
	const [isApplyMember, setIsApplyMember] = useState(false);
	const [applyokClassList, setapplyokClassList] = useState([]);
	const theme = ClassDetail["theme"]
		.replace("['", "")
		.replace("']", "")
		.replace("', '", ",")
		.replace("', '", ",");

	const isAllInfoNullOrBlank =
		(ClassDetail.info1 === null || ClassDetail.info1 === "") &&
		(ClassDetail.info2 === null || ClassDetail.info2 === "") &&
		(ClassDetail.info3 === null || ClassDetail.info3 === "") &&
		(ClassDetail.infoimg1 === null || ClassDetail.infoimg1 === "") &&
		(ClassDetail.infoimg2 === null || ClassDetail.infoimg2 === "") &&
		(ClassDetail.infoimg3 === null || ClassDetail.infoimg3 === "");

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
		console.log(Object.keys(ClassDetail));
	}, []);

	useEffect(() => {
		getCashbackList();
		check_ApplyMember();
		read_applyclass_list();
		getUserAchiv();
		if (ClassDetail.type === "online") {
			read_activityclass_list();
		}
		// if (ClassDetail.id.updateprofile) {
		// 	const url = await readFirebasefile("userImg", userImgUpdate);
		// 	setUpdatedImg(url);
		// }
	}, []);

	const handleLocalFilePreview = (file) => {
		window.open(file, "_blank");
	};

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

	const getUserAchiv = async () => {
		if (ClassDetail.id.updateprofile) {
			const url = await readFirebasefile(
				"userImg",
				ClassDetail.id.updateprofile
			);
			setUpdatedImg(url);
		}

		try {
			const response = await axios.post(
				"http://localhost:8000/api/user/get_user_achive/",
				{
					mentor: ClassDetail.id.id,
				}
			);
			const achive = response.data.achive_list;

			console.log(achive);

			const linkdata = achive.filter((item) => item.achive_file === null);
			const filedata = achive.filter((item) => item.achive_file !== null);
			if (filedata.length > 0) {
				try {
					const urlArray = await Promise.all(
						filedata.map((file) => readFirebasefile("userAchiveFile", file))
					);
					setAchiveFile(urlArray);
				} catch (error) {
					console.error("Error fetching achive files: ", error);
				}
			} else {
				setAchiveFile([]);
			}
			if (linkdata.length > 0) {
				setAchiveLink(linkdata);
			} else {
				setAchiveLink([]);
			}
		} catch (error) {
			// 예외처리
			console.error(error);
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

	const read_activityclass_list = async () => {
		//모든 활동중인 클래스id 리스트 가져오기
		try {
			const response = await axios.get(
				"http://localhost:8000/api/post/read_activityclass_list/"
			);
			// console.log(response.data);
			if (response.data.activityClassList) {
				setActivityClassList(response.data.activityClassList);
			} else {
				setActivityClassList([]);
			}
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
			<div className="info_div">
				<div style={{ margin: 20 }}>{ClassDetail["info"]}</div>
			</div>
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
							<div style={{ fontSize: 18 }}>모집 인원 </div>
							<div style={{ fontSize: 17 }}> {ClassDetail["people"]}명</div>
						</div>
						<div className="info_div">
							<div style={{ fontSize: 18 }}>수강료 </div>
							<div style={{ fontSize: 17 }}>{ClassDetail["money"]}</div>
						</div>
						<div className="info_div">
							{calculateDaysLeft(ClassDetail["applyend"]) >= 0 ? (
								<div className="info_div">
									<div style={{ fontSize: 18 }}>신청 마감</div>
									<div style={{ fontSize: 17, color: "red" }}>
										D - {calculateDaysLeft(ClassDetail["applyend"])}
									</div>
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
			{ClassDetail.type === "offline" && (
				<div style={{ padding: 70 }}>
					<div className="large_coment">활동 기간</div>
					<div className="omyu" style={{ margin: 15, fontSize: 25 }}>
						{ClassDetail.activitystart} ~ {ClassDetail.activityend}
					</div>
				</div>
			)}
			{!isAllInfoNullOrBlank && (
				<div
					style={{
						backgroundColor: "rgb(62, 63, 74)",
						color: "white",
						padding: 30,
					}}
				>
					<div className="large_coment" style={{ padding: 50 }}>
						소개할게요
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
								{infoText && (
									<div style={{ padding: 8 }} className="info_div">
										{infoText}
									</div>
								)}
							</>
						);
					})}
				</div>
			)}
			<div className="info_div">
				<div style={{ padding: 70 }}>
					<div className="large_coment">어떤 활동을 하나요?</div>
				</div>
				{DayDetail.map((Item, index) => {
					const isActivity = activityClassList.some(
						(obj) => obj.class_id === ClassDetail.class_id
					);
					return (
						<div key={index} className="row_container">
							<div
								style={{
									// backgroundColor: "red",
									width: "80%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									// height: 300,
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
								  (userData && userData.id === ClassDetail.id.id) ? (
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
										display: "flex",
										flexDirection: "row",
										alignItems: "end",
										// backgroundColor: "red",
									}}
								>
									<div
										style={{
											fontFamily: "omyu_pretty",
											fontSize: 30,
											marginRight: 10,
										}}
									>
										{Item["day_sequence"]}
									</div>
									<div
										style={{
											fontFamily: "omyu_pretty",
											fontSize: 20,
											marginBottom: 5,
										}}
									>
										{Item["day_date"]}
									</div>
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
							// backgroundColor: "rgb(62, 63, 74)",
							// color: "white",
							marginTop: 100,
							height: 400,
						}}
					>
						<div className="large_coment">활동 장소</div>
						<div
							style={{
								fontFamily: "Pretendard",
								fontSize: 20,
								letterSpacing: 3,
								margin: 10,
								background: "none",
							}}
						>
							{ClassDetail["address"]}
						</div>

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
			)}
			{ClassDetail["file"] !== null && (
				<div style={{ margin: 30 }}>
					<div className="large_coment">상세 일정 파일</div>
					<button
						onClick={openPdfPreview}
						style={{
							border: "none",
							backgroundColor: "transparent",
							color: "royalblue",
							padding: 20,
							borderRadius: 50,
						}}
					>
						활동 파일 다운 받기
					</button>
				</div>
			)}
			<div className="large_coment" style={{ padding: 50 }}>
				Mentor
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						width: 160,
						height: 160,
						borderRadius: "50%",
						overflow: "hidden",
						// backgroundColor: "red",
					}}
				>
					{ClassDetail.id.updateprofile === null ? (
						<img
							src={ClassDetail.id.profile}
							alt="profile"
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					) : (
						<img
							src={updatedImg}
							alt="updateprofile"
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					)}
				</div>

				<div className="mentor" style={{ fontSize: 22, margin: 10 }}>
					{ClassDetail.id.nickname}
				</div>
				<div className="mentor_200" style={{ fontSize: 18, margin: 5 }}>
					{ClassDetail.id.info}{" "}
				</div>
				<div className="mentor_200" style={{ margin: 5 }}>
					{ClassDetail.id.email}{" "}
				</div>

				{(achiveLink.length !== 0 || achiveFile.length !== 0) && (
					<div
						style={{
							margin: 10,
							// backgroundColor: "red",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "100%",
								borderBottom: "1px solid #d3d3d3",
								lineHeight: "0.1em",
								margin: "10px 0 20px",
								position: "relative",
							}}
						>
							<div
								style={{
									position: "absolute",
									backgroundColor: "#fff",
									padding: "0 10px",
								}}
							>
								<IoIosStar color="#ffd700" size={18} />
							</div>
						</div>

						{achiveLink.length !== 0 && (
							<>
								{achiveLink.map((a, index) => (
									<div
										key={index}
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "center",
										}}
									>
										<div
											key={index}
											style={{
												marginBottom: 10,
												wordBreak: "break-all",
												padding: 5,
												borderRadius: 5,
												backgroundColor: "blanchedAlmond",
											}}
										>
											<div
												style={{
													fontSize: 15,
													marginRight: 10,
												}}
											>
												{a.achive_linkname}
											</div>
											<a
												href={a.achive_link}
												target="_blank"
												style={{
													color: "#1A1A3A",
													fontSize: 12,
												}}
												rel="noopener noreferrer"
											>
												{a.achive_link}
											</a>
										</div>
									</div>
								))}
							</>
						)}
						{achiveFile.length !== 0 && (
							<>
								{achiveFile.map((a, index) => (
									<div
										key={index}
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "center",
										}}
									>
										<div
											key={index}
											style={{
												width: "100%",
												marginBottom: 10,
												wordBreak: "break-all",
											}}
										>
											<button
												style={{
													color: "#1A1A3A",
													fontSize: 14,
													border: "none",
													padding: 7,
													borderRadius: 5,
													backgroundColor: "blanchedAlmond",
												}}
												onClick={() => handleLocalFilePreview(a.achive_file)}
											>
												{a.achive_filename}
											</button>
										</div>
									</div>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default ReadClassDetail;
