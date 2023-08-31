import React, { useState, useEffect } from "react";

import "../styles/CreateClassDetail.css";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import minus from "../assets/day_class_minus.png";
import add from "../assets/day_class_add.png";
import Skill from "../assets/Skill.png";
import Activity from "../assets/Activity.png";
import Alon from "../assets/Alon.png";
import Craft from "../assets/Craft.png";
import Culture_arts from "../assets/Culture_arts.png";
import Music from "../assets/Music.png";
import Simple from "../assets/Simple.png";
import Trip from "../assets/Trip.png";
import Beauty from "../assets/Beauty.png";
import quiet from "../assets/quiet.png";
import Sports from "../assets/Sports.png";
import Healing from "../assets/Healing.png";

import "react-datepicker/dist/react-datepicker.css";
import DaumPostCode from "react-daum-postcode";
import Place_search_icon from "../assets/place_search_icon.png";
import axios from "axios";

function CreateClassDetail(props) {
	const [selectedTheme, setSelectedTheme] = useState([]);
	const [person, setPerson] = useState("");
	const [money, setMoney] = useState("");
	const [address, setAdress] = useState("");

	const [isOpen, setIsOpen] = useState(false);

	const [applyStartDate, setApplyStartDate] = useState(new Date());
	const [applyEndDate, setApplyEndDate] = useState(null);

	const [toStringApplyStartDate, setToStringApplyStartDate] = useState("");
	const [toStringApplyEndDate, setToStringApplyEndDate] = useState("");

	const [activityStartDate, setActivityStartDate] = useState(new Date());
	const [activityEndDate, setActivityEndDate] = useState(null);

	const [toStringActivityStartDate, setToStringActivityStartDate] =
		useState("");
	const [toStringActivityEndDate, setToStringActivityEndDate] = useState("");

	const { kakao } = window;

	let [inputCount1, setInputCount1] = useState(0);
	let [inputCount2, setInputCount2] = useState(0);
	let [inputCount3, setInputCount3] = useState(0);

	const [days, setDays] = useState([
		{
			id: "day1",
			dayImg: null,
			dayImgpreview: "",
			title: "",
			date: new Date(),
			startTime: "",
			endTime: "",
			content: "",
			preparation: "",
		},
	]);

	const [file, setFile] = useState(null);
	const [fileSrc, setFileSrc] = useState("");

	const [inputInfo1, setInputInfo1] = useState("");
	const [inputImage1, setInputImage1] = useState(null);
	const [inputImage1preview, setInputImage1preview] = useState(null);

	const [inputInfo2, setInputInfo2] = useState("");
	const [inputImage2, setInputImage2] = useState(null);
	const [inputImage2preview, setInputImage2preview] = useState(null);

	const [inputInfo3, setInputInfo3] = useState("");
	const [inputImage3, setInputImage3] = useState(null);
	const [inputImage3preview, setInputImage3preview] = useState(null);

	const [fee, setFee] = useState("pay");

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		if (name === "info1") {
			setInputInfo1(value);
			setInputCount1(e.target.value.length);
		} else if (name === "info2") {
			setInputInfo2(value);
			setInputCount2(e.target.value.length);
		} else if (name === "info3") {
			setInputInfo3(value);
			setInputCount3(e.target.value.length);
		}
	};

	const handleFree = (e) => {
		setFee(e.target.value);
		setMoney("0");
	};

	useEffect(() => {
		console.log("지불:" + fee + "요금:" + money);
	});
	const onChangeApply = (dates) => {
		const [start, end] = dates;

		setApplyStartDate(start);
		const ApplystartDateToString =
			start.getFullYear().toString() +
			`년` +
			(start.getMonth() + 1).toString() +
			`월` +
			start.getDate().toString() +
			`일`;
		setToStringApplyStartDate(ApplystartDateToString);

		if (end) {
			setApplyEndDate(end);
			const ApplyendDateToString =
				end.getFullYear().toString() +
				`년` +
				(end.getMonth() + 1).toString() +
				`월` +
				end.getDate().toString() +
				`일`;
			setToStringApplyEndDate(ApplyendDateToString);
		} else {
			setApplyEndDate(null);
			setToStringApplyEndDate("");
		}
	};
	const onChangeActivity = (dates) => {
		const [start, end] = dates;

		setActivityStartDate(start);
		const ActivitystartDateToString =
			start.getFullYear().toString() +
			`년` +
			(start.getMonth() + 1).toString() +
			`월` +
			start.getDate().toString() +
			`일`;
		setToStringActivityStartDate(ActivitystartDateToString);

		if (end) {
			setActivityEndDate(end);
			const ActivityendDateToString =
				end.getFullYear().toString() +
				`년` +
				(end.getMonth() + 1).toString() +
				`월` +
				end.getDate().toString() +
				`일`;
			setToStringActivityEndDate(ActivityendDateToString);
		} else {
			setActivityEndDate(null);
			setToStringActivityEndDate("");
		}
	};
	const handleComplete = (data) => {
		let fullAddress = `${data.address}`;

		console.log(fullAddress);
		console.log(typeof fullAddress);
		setAdress(fullAddress);

		setIsOpen(false);
		if (fullAddress !== "") {
			loadMap(fullAddress);
		}
	};
	//fullAddress -> 전체 주소반환
	// };

	function handleModal() {
		setIsOpen(true);
	}

	//CreateClass 첫 단계 부분 : 제목, 소개, 온라인/오프라인, 사진 변수 받는 부분
	const location = useLocation();

	const title = location.state.title;
	const info = location.state.info;
	const option = location.state.option;
	const imageSrc = location.state.imageSrc;

	const theme = [
		"# 조용한",
		"# 스포츠",
		"# 여행",
		"# 힐링",
		"# 액티비티",
		"# 혼자",
		"# 간단한",
		"# 음악",
		"# 공예",
		"# 기술",
		"# 뷰티",
		"# 문화예술",
	];
	const themeImages = {
		"# 조용한": quiet,
		"# 스포츠": Sports,
		"# 여행": Trip,
		"# 힐링": Healing,
		"# 액티비티": Activity,
		"# 혼자": Alon,
		"# 간단한": Simple,
		"# 음악": Music,
		"# 공예": Craft,
		"# 기술": Skill,
		"# 뷰티": Beauty,
		"# 문화예술": Culture_arts,
		// ... 다른 테마들에 대한 이미지 경로 추가 ...
	};

	const addTheme = (theme_item) => {
		if (selectedTheme.includes(theme_item)) {
			setSelectedTheme(selectedTheme.filter((t) => t !== theme_item));
		} else {
			setSelectedTheme([...selectedTheme, theme_item]);
		}
	};
	useEffect(() => {
		console.log(selectedTheme);
	}, [selectedTheme]);

	function loadMap(address) {
		// Kakao Maps API 스크립트를 동적으로 로드
		const script = document.createElement("script");
		script.src =
			"//dapi.kakao.com/v2/maps/sdk.js?appkey=0d2dd26a75693be6d557948d939a383e&libraries=services";
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
					geocoder.addressSearch(address, (result, status) => {
						// console.log(address);

						if (status === kakao.maps.services.Status.OK) {
							const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

							// 결과값으로 받은 위치를 마커로 표시합니다
							// const marker = new kakao.maps.Marker({
							// 	position: coords,
							// 	map: map,
							// });

							// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
							map.setCenter(coords);
						}
					});
				}
			});
		};

		return () => {
			document.head.removeChild(script);
		};
	}

	// const encodeFileToBase64 = (fileBlob) => {
	// 	const reader = new FileReader();
	// 	reader.readAsDataURL(fileBlob);

	// 	return new Promise((resolve) => {
	// 		reader.onload = () => {
	// 			setImageSrc(reader.result);
	// 			resolve();
	// 		};
	// 	});
	// };
	const handleAddDay = () => {
		const lastDay = days[days.length - 1];
		const lastDayNumber = parseInt(lastDay.id.replace("day", ""));
		const newDayId = `day${lastDayNumber + 1}`;
		const newDay = {
			id: newDayId,
			title: "",
			dayImg: "",
			dayImgpreview: "",
			date: "",
			startTime: "",
			endTime: "",
			content: "",
			preparation: "",
		};
		setDays((prevDays) => [...prevDays, newDay]);
		console.log(days);
	};

	const handleRemoveDay = (id) => {
		setDays((prevDays) => prevDays.filter((day) => day.id !== id));
	};

	const handleChange = (id, field, value) => {
		const reader = new FileReader();

		reader.readAsDataURL(value);
		reader.onload = () => {
			setDays((prevDays) =>
				prevDays.map((day) =>
					day.id === id
						? { ...day, [field]: value, dayImgpreview: reader.result }
						: day
				)
			);
		};

		return new Promise((resolve) => {
			reader.onloadend = () => {
				resolve();
			};
		});
	};

	// const handleFileChange = (event) => {
	// 	setFile(event.target.files[0]);
	// };

	const handleSubmit = () => {
		const token = localStorage.getItem("token");

		const classAllData = {
			title: title,
			info: info,
			option: option,
			person: person,
			address: address,
			money: money,
			theme: selectedTheme,
			toStringApplyStartDate: toStringApplyStartDate,
			toStringApplyEndDate: toStringApplyEndDate,
			toStringActivityEndDate: toStringActivityEndDate,
			toStringActivityStartDate: toStringActivityStartDate,
			inputInfo1: inputInfo1,
			inputInfo2: inputInfo2,
			inputInfo3: inputInfo3,
			days: days,
			token: token,
		};
		const formData = new FormData();
		formData.append("json", JSON.stringify(classAllData)); // JSON 데이터 추가
		formData.append("imageSrc", imageSrc);
		formData.append("file", file);
		formData.append("inputImage1", inputImage1);
		formData.append("inputImage2", inputImage2);
		formData.append("inputImage3", inputImage3);
		days.forEach((day) => {
			if (day.dayImg !== null) {
				formData.append(`dayImg[${day.id}]`, day.dayImg);
			}
		});
		// days.forEach((day) => {
		// 	formData.append(`dayImg[${day.id}]`, day.dayImg);
		// });

		axios
			.post("http://localhost:8000/api/post/submit_data/", formData, {
				headers: {
					"Content-Type": "multipart/form-data", // Content-Type 설정
				},
			})
			.then((response) => {
				console.log(response.data); // Django에서 보낸 응답을 확인합니다.
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	};

	const onChangeImage1 = (e) => {
		setInputImage1(e);
		const reader = new FileReader();
		reader.readAsDataURL(e);
		return new Promise((resolve) => {
			reader.onload = () => {
				setInputImage1preview(reader.result);
				resolve();
			};
		});
	};
	const onChangeImage2 = (e) => {
		setInputImage2(e);
		const reader = new FileReader();
		reader.readAsDataURL(e);
		return new Promise((resolve) => {
			reader.onload = () => {
				setInputImage2preview(reader.result);
				resolve();
			};
		});
	};
	const onChangeImage3 = (e) => {
		setInputImage3(e);
		const reader = new FileReader();
		reader.readAsDataURL(e);
		return new Promise((resolve) => {
			reader.onload = () => {
				setInputImage3preview(reader.result);
				resolve();
			};
		});
	};
	const onChangefile = (e) => {
		setFile(e);
		setFileSrc(e.name);
	};
	const onChangeImage_day = (value, name) => {
		console.log(value);
		const dayId = name.replace("day_img_", "");
		handleChange(dayId, "dayImg", value);
	};

	// const reader = new FileReader();
	// reader.readAsDataURL(e);

	// return new Promise((resolve) => {
	// 	reader.onload = () => {
	// 		setImagepreview(reader.result);
	// 		resolve();
	// 	};
	// };
	// });
	// console.log(e);
	// };
	return (
		<div className="create_wrap">
			{option === "offline" ? (
				<>
					<div className="theme_wrapper">
						{/* <div className="theme_test"> */}
						<div className="theme_text">클래스의 테마를 선택해 주세요 ! </div>

						{theme.map((item, index) => (
							<button
								className={
									selectedTheme.includes(item)
										? "select_theme_button"
										: "theme_button"
								}
								key={index}
								onClick={() => addTheme(item)}
							>
								{" "}
								<div className="theme_img_wrapper">
									<img src={themeImages[item]} width={100} alt={item} />
									<div className="theme_img_text">{item}</div>
								</div>
							</button>
						))}
					</div>
					{/* </div> */}
					<div className="middle_text">
						<div className="_text">
							수강 인원과 수강료는 합리적이고 효율적인 가격과 인원으로
							자율적으로 책정해주세요.
						</div>
						<div className="_text">
							수강료는 개인 당 수강료가 아닌 전체 수강인원에 대한 수강료입니다.
						</div>
					</div>
					<div className="middle">
						<div className="person_money">
							<img
								className="person_money_icon"
								width="64"
								height="64"
								src="https://img.icons8.com/cotton/64/conference-call.png"
								alt="conference-call"
							/>
							<div className="person_money_label">수강 인원</div>
							<input
								className="person_money_input"
								name="person"
								// placeholder="인원수"
								type="text"
								value={person}
								onChange={(e) => setPerson(e.target.value)}
							></input>{" "}
						</div>
						<div className="person_money">
							<div className="person_money_icon">
								<img
									className="person_money_icon_test"
									width="55"
									height="55"
									src="https://img.icons8.com/ios/64/get-cash--v1.png"
									alt="get-cash--v1"
								/>
							</div>
							<div className="person_money_label">수강료</div>
							<div className="radio_fee">
								<div className="radio_input">
									<input
										type="radio"
										value="pay"
										checked={fee === "pay"}
										onChange={(e) => setFee(e.target.value)}
									></input>
									<div className="radio_label">유료</div>
									<div className="person_money_input_wrapper">
										<input
											className="person_money_input"
											name="money"
											type="number"
											value={money}
											min="1000"
											placeholder="1000원~"
											onChange={(e) => setMoney(e.target.value)}
											disabled={fee === "free"}
										></input>
									</div>
								</div>
								<div className="radio_input">
									<input
										type="radio"
										value="free"
										checked={fee === "free"}
										onChange={handleFree}
									></input>
									<div className="radio_label">무료</div>
								</div>
							</div>
						</div>
					</div>
					<div className="period_place_wrapper">
						<div className="period_place">
							<div className="period_place_title_hint">
								<div className="period_place_label">신청 기간</div>
								<div className="period_place_label_hint">
									클래스 신청 기간을 선택해 주세요.{" "}
								</div>
							</div>
							<div className="period_place_choice">
								<div className="calender-container">
									<div className="calender-box">
										{/* <div className="date">시작날짜</div> */}
										<div className="datepicker">
											<DatePicker
												locale={ko}
												selected={applyStartDate}
												onChange={onChangeApply}
												startDate={applyStartDate}
												endDate={applyEndDate}
												selectsRange
												inline
											/>
										</div>
									</div>
									<div className="selected_result">
										{applyEndDate !== null ? (
											<div className="calender-box">
												신청 기간: {toStringApplyStartDate} -{" "}
												{toStringApplyEndDate}
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>
						<div className="period_place">
							<div className="period_place_title_hint">
								<div className="period_place_label">활동 기간</div>
								<div className="period_place_label_hint">
									클래스 활동 기간을 선택해 주세요.
								</div>
							</div>

							<div className="period_place_choice">
								<div className="datepicker">
									<DatePicker
										locale={ko}
										selected={activityStartDate}
										onChange={onChangeActivity}
										startDate={activityStartDate}
										endDate={activityEndDate}
										selectsRange
										inline
									/>
								</div>
							</div>
							<div className="selected_result">
								{activityEndDate !== null ? (
									<div className="calender-box">
										활동기간: {toStringActivityStartDate} -{" "}
										{toStringActivityEndDate}
									</div>
								) : null}
							</div>
						</div>
						<div className="period_place">
							<div className="period_place_title_hint">
								<div className="period_place_label">활동 장소</div>
								<div className="period_place_label_hint">
									클래스 활동 장소를 선택해 주세요.
								</div>
							</div>
							<div className="period_place_choice">
								{isOpen ? (
									<div className="Address_modal_wrapper">
										<div className="Address_modal_content">
											<DaumPostCode
												setModalOpen={isOpen}
												onComplete={handleComplete}
												className="post-code"
											/>
										</div>
									</div>
								) : null}
								{address ? (
									<>
										<div>{address}</div>
										<div
											className="map"
											style={{ width: 380, height: 250 }}
										></div>
									</>
								) : (
									<div className="place_search_icon_wrapper">
										<img src={Place_search_icon} onClick={handleModal} alt="" />
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="period_place">
						<div className="period_place_title_hint">
							<div className="period_place_label">
								상세 이미지 및 영상 업로드
							</div>
							<div className="period_place_label_hint">
								자신의 클래스의 퀄리티를 선보일만한 간단한 소개
							</div>
						</div>
						<div className="all_intro">
							<div className="intro_detail_simple">
								<div>1. </div>
								{inputImage1preview ? (
									<>
										<div className="editImg">
											<img
												src={inputImage1preview}
												className="day_img_true"
												alt="preview-img"
											/>
											<button
												className="editImg_text"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage1");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												수정하기
											</button>
										</div>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info1"
												value={inputInfo1}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount1}</span>
												<span>/500자</span>
											</div>
											<input
												type="file"
												id="infoimage1"
												name="infoimage1"
												style={{ display: "none" }}
												onChange={(e) => {
													onChangeImage1(e.target.files[0]);
												}}
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<button
												className="uploadImg_behind"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage1");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												<img
													width="50"
													height="50"
													src="https://img.icons8.com/ios/50/image--v1.png"
													alt="--v1"
												/>
											</button>
										</div>
										<input
											type="file"
											id="infoimage1"
											style={{ display: "none" }}
											onChange={(e) => {
												onChangeImage1(e.target.files[0]);
											}}
										/>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info1"
												value={inputInfo1}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount1}</span>
												<span>/500자</span>
											</div>
										</div>
									</>
								)}
							</div>

							<div className="intro_detail_simple">
								<div>2. </div>
								{inputImage2preview ? (
									<>
										<div className="editImg">
											<img
												src={inputImage2preview}
												className="day_img_true"
												alt="preview-img"
											/>
											<button
												className="editImg_text"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage2");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												수정하기
											</button>
										</div>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info2"
												value={inputInfo2}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount2}</span>
												<span>/500자</span>
											</div>

											<input
												type="file"
												id="infoimage2"
												name="infoimage2"
												style={{ display: "none" }}
												onChange={(e) => {
													onChangeImage2(e.target.files[0]);
												}}
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<button
												className="uploadImg_behind"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage2");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												<img
													width="50"
													height="50"
													src="https://img.icons8.com/ios/50/image--v1.png"
													alt="--v1"
												/>
											</button>
										</div>
										<input
											type="file"
											id="infoimage2"
											style={{ display: "none" }}
											onChange={(e) => {
												onChangeImage2(e.target.files[0]);
											}}
										/>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info2"
												value={inputInfo2}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount2}</span>
												<span>/500자</span>
											</div>
										</div>
									</>
								)}
							</div>
							<div className="intro_detail_simple">
								<div>3. </div>
								{inputImage3preview ? (
									<>
										<div className="editImg">
											<img
												src={inputImage3preview}
												className="day_img_true"
												alt="preview-img"
											/>
											<button
												className="editImg_text"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage3");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												수정하기
											</button>
										</div>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info3"
												value={inputInfo3}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount3}</span>
												<span>/500자</span>
											</div>

											<input
												type="file"
												id="infoimage3"
												name="infoimage3"
												style={{ display: "none" }}
												onChange={(e) => {
													onChangeImage3(e.target.files[0]);
												}}
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<button
												className="uploadImg_behind"
												onClick={() => {
													const inputElement =
														document.getElementById("infoimage3");
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												<img
													width="50"
													height="50"
													src="https://img.icons8.com/ios/50/image--v1.png"
													alt="--v1"
												/>
											</button>
										</div>
										<input
											type="file"
											id="infoimage3"
											style={{ display: "none" }}
											onChange={(e) => {
												onChangeImage3(e.target.files[0]);
											}}
										/>
										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name="info3"
												value={inputInfo3}
												placeholder="해당 상세 이미지 및 영상에 대한 설명"
												onChange={onChangeInput}
											/>
											<div className="word_how_many">
												<span>{inputCount3}</span>
												<span>/500자</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
						<div className="period_place_label">활동 계획 및 소개서</div>
						<div>
							활동 계획표에 첨부되는 파일(이미지, 영상)은 클래스 상세소개에
							들어갈 내용으로, 직접적인 활동 내용이 아닌 Day별 수업을 소개하는
							파일(이미지, 영상) 입니다.
						</div>

						<div className="dayclasswrapper">
							<div>
								{days.map((day) => (
									<div key={day.id} className="day_input_box">
										<div className="day_title_label">{day.id}</div>
										<div className="file_input_split">
											{day.dayImgpreview ? (
												<>
													<div className="editImg">
														<img
															src={day.dayImgpreview}
															className="day_img_true"
															alt="preview-img"
														/>
														<button
															className="editImg_text"
															onClick={() => {
																const inputElement = document.getElementById(
																	`day_img_input_${day.id}`
																);
																if (inputElement) {
																	inputElement.click();
																}
															}}
														>
															수정하기
														</button>
														<input
															type="file"
															id={`day_img_input_${day.id}`}
															style={{ display: "none" }}
															onChange={(e) => {
																onChangeImage_day(
																	e.target.files[0],
																	`day_img_${day.id}`
																);
															}}
														/>
													</div>
												</>
											) : (
												<>
													<button
														className="uploadImg_behind"
														onClick={() => {
															const inputElement = document.getElementById(
																`day_img_input_${day.id}`
															);
															if (inputElement) {
																inputElement.click();
															}
														}}
													>
														<img
															width="50"
															height="50"
															src="https://img.icons8.com/ios/50/image--v1.png"
															alt="--v1"
														/>
													</button>
													<input
														type="file"
														id={`day_img_input_${day.id}`}
														style={{ display: "none" }}
														onChange={(e) => {
															onChangeImage_day(
																e.target.files[0],
																`day_img_${day.id}`
															);
														}}
													/>
												</>
											)}

											<div>
												<div className="label_row">
													<input
														className="input_box_long"
														type="text"
														maxLength={50}
														name={`title_${day.id}`}
														placeholder="제목"
														value={day.title}
														onChange={(e) =>
															handleChange(day.id, "title", e.target.value)
														}
													/>
												</div>
												<div className="label_row">
													<input
														className="input_box_middle"
														type="date"
														dateFormat="yyyy-MM-dd"
														name={`date_${day.id}`}
														placeholder="날짜"
														value={day.date}
														onChange={(e) =>
															handleChange(day.id, "date", e.target.value)
														}
													/>

													<input
														className="input_box_short"
														type="time"
														name={`startTime_${day.id}`}
														placeholder="시간"
														value={day.startTime}
														onChange={(e) =>
															handleChange(day.id, "startTime", e.target.value)
														}
													/>
													<div>-</div>
													<input
														className="input_box_short"
														type="time"
														name={`endTime_${day.id}`}
														placeholder="시간"
														value={day.endTime}
														onChange={(e) =>
															handleChange(day.id, "endTime", e.target.value)
														}
													/>
												</div>
												<div className="label_row">
													<input
														className="input_box_middle"
														type="text"
														multiple="false"
														name={`preparation_${day.id}`}
														placeholder="준비물"
														value={day.preparation}
														onChange={(e) =>
															handleChange(
																day.id,
																"preparation",
																e.target.value
															)
														}
													/>
												</div>
												<div className="label_row">
													<textarea
														className="input_box_long"
														type="text"
														multiple="true"
														name={`content_${day.id}`}
														placeholder="내용"
														value={day.content}
														onChange={(e) =>
															handleChange(day.id, "content", e.target.value)
														}
													/>
												</div>
											</div>
										</div>
										<div className="remove_button">
											{days.length > 1 &&
												day.id === days[days.length - 1].id && (
													<button
														className="remove_button"
														onClick={() => handleRemoveDay(day.id)}
													>
														<img src={minus} width={25} alt="minus" />
													</button>
												)}
										</div>
									</div>
								))}
							</div>
						</div>
						<button className="add_button" onClick={handleAddDay}>
							<img src={add} width={25} alt="minus" />
						</button>
					</div>
					<div
						style={{
							width: "100%",
							textAlign: "center",
							borderBottom: "2px solid #f1f3f5 ",
							lineHeight: "0.5em",
							margin: "30px 0 20px",
						}}
					></div>
					<div className="last_row">
						<img
							width="35"
							height="35"
							src="https://img.icons8.com/emoji/48/round-pushpin-emoji.png"
							alt="round-pushpin-emoji"
						/>
						활동 계획서 및 상세 일정 파일 첨부
						<img
							width="35"
							height="35"
							src="https://img.icons8.com/emoji/48/round-pushpin-emoji.png"
							alt="round-pushpin-emoji"
						/>
					</div>
					<div class="filebox">
						<label for="file">파일찾기</label>
						<input
							type="file"
							id="file"
							// name="file"
							onChange={(e) => {
								onChangefile(e.target.files[0]);
							}}
						/>
						<input
							class="upload-name"
							value={fileSrc}
							placeholder="첨부파일"
							readOnly
						/>
					</div>
					<div className="last_text">
						<div className="last_text_row">
							<div className="basic_text">위 파일은</div>
							<div className="important_text">
								(클래스 이름)(작성자)_활동계획서 및 상세일.확장자
							</div>
							<div className="basic_text">이름으로 업로드 해주세요.</div>
						</div>
						<div className="last_text_row">
							<div className="basic_text">파일 안에 꼭 있어야하는 내용</div>
							<div className="important_text">
								클래스 소개 및 일별 상세 활동 소개, 준비물, 연락 가능한 연락망{" "}
							</div>
							<div className="basic_text">
								이 포함되지 않았을 시 클래스 업로드에 제약이 있을 수 있습니다.
							</div>
						</div>
					</div>
					<div className="submit_button_wrapper">
						<button className="submit_button" onClick={handleSubmit}>
							등록하기
						</button>
					</div>
				</>
			) : (
				<>
					<div>온라인</div>
				</>
			)}
		</div>
	);
}
export default CreateClassDetail;
