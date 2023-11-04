import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import "../../styles/CreateClassDetail.css";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import edit from "../../assets/edit.png";
import Swal from "sweetalert2";

import remove from "../../assets/remove.png";
import { DAY_PLAN, PLACE_PERIOD } from "../CreateClass/OfflineClass";
import ONLINE_DAY_PLAN from "../CreateClass/OnlineClass";
import { OfflinFollowbar, OnlineFollowbar } from "../../component/CCFollowbar";
import axios from "axios";
import LoginRequired from "../../common/LoginRequired";

function CreateClassDetail(props) {
	const [selectedTheme, setSelectedTheme] = useState([]);
	const [person, setPerson] = useState("");
	const [money, setMoney] = useState("");
	const [address, setAdress] = useState("");
	const [token, setToken] = useState("");

	const [isOpen, setIsOpen] = useState(false);

	const [applyEndDate, setApplyEndDate] = useState(null);

	const [activityStartDate, setActivityStartDate] = useState(null);
	const [activityEndDate, setActivityEndDate] = useState(null);

	const navigate = useNavigate();

	const { kakao } = window;

	const [inputCount, setInputCount] = useState({
		inputCount1: 0,
		inputCount2: 0,
		inputCount3: 0,
	});

	const [days, setDays] = useState([
		{
			id: "day1",
			dayImg: null,
			dayImgpreview: "",
			dayVideopreview: "",
			title: "",
			date: new Date(),
			content: "",
		},
	]);

	const [file, setFile] = useState(null);
	const [fileSrc, setFileSrc] = useState("");

	const [inputImage, setInputImage] = useState({
		inputImage1: null,
		inputImage2: null,
		inputImage3: null,
	});
	const [inputImagePreview, setInputImagePreview] = useState({
		inputImage1preview: null,
		inputImage2preview: null,
		inputImage3preview: null,
	});
	const [inputInfo, setInputInfo] = useState({
		inputInfo1: "",
		inputInfo2: "",
		inputInfo3: "",
	});

	const intro_map = ["1", "2", "3"];

	const [fee, setFee] = useState("pay");

	const [All_select_theme, setAllselecttheme] = useState(false);
	const [All_person_money, setAllpersonmoney] = useState(false);
	const [All_period_place, setAllperiodplace] = useState(false);
	const [All_day_plan_offline, setAlldayplanoffline] = useState(false);
	const [All_day_plan_online, setAlldayplanonline] = useState(false);
	const [All_plan_file, setAllplanfile] = useState(false);

	const checkList_offline = [
		All_select_theme,
		All_person_money,
		All_period_place,
		All_day_plan_offline,
		All_plan_file,
	];
	const checkList_online = [
		All_select_theme,
		All_person_money,
		All_day_plan_online,
	];

	const listContents_offline = [
		"테마선택",
		"인원 및 수강료",
		"기간 및 장소",
		"Day별 상세 계획",
		"필수 첨부 파일",
	];
	const listContents_online = ["테마선택", "인원 및 수강료", "Day별 상세 계획"];

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

	const Toast = Swal.mixin({
		toast: true,
		position: "center-center",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	const location = useLocation();

	const title = location.state.title;
	const info = location.state.info;
	const option = location.state.option;
	const imageSrc = location.state.imageSrc;
	const imagepreview = location.state.imagepreview;
	const videopreview = location.state.videopreview;

	const [isFirstImage, setIsFirstImage] = useState("");
	const [isImage, setIsImage] = useState("");

	useEffect(() => {
		const localtoken = localStorage.getItem("token");
		if (localtoken) {
			setToken(localtoken);
		} else {
			setToken("");
		}
	});

	const All_submit_Offline =
		!All_select_theme ||
		!All_period_place ||
		!All_person_money ||
		!All_day_plan_offline ||
		!All_plan_file;

	const All_submit_Online =
		!All_select_theme || !All_person_money || !All_day_plan_online;

	const onChangeInput = (e, number) => {
		const { name, value } = e.target;

		setInputInfo((prevInputInfo) => ({
			...prevInputInfo,
			[name]: value,
		}));

		setInputCount((prevInputCount) => ({
			...prevInputCount,
			[`inputCount${number}`]: value.length,
		}));
	};

	const onChangeImage = (e, number) => {
		const newInputImage = { ...inputImage };
		newInputImage[`inputImage${number}`] = e;
		setInputImage(newInputImage);

		const reader = new FileReader();
		reader.readAsDataURL(e);
		return new Promise((resolve) => {
			reader.onload = () => {
				const newInputImagePreview = { ...inputImagePreview };
				newInputImagePreview[`inputImage${number}preview`] = reader.result;
				setInputImagePreview(newInputImagePreview);
				resolve();
			};
		});
	};

	const handleRemoveImg = (number) => {
		Swal.fire({
			title: "정말로 삭제 하시겠습니까?",
			icon: "warning",

			showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
			confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
			cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
			confirmButtonText: "삭제", // confirm 버튼 텍스트 지정
			cancelButtonText: "취소", // cancel 버튼 텍스트 지정
		}).then((result) => {
			// 만약 Promise리턴을 받으면,
			if (result.isConfirmed) {
				setInputImagePreview((prevInputImagePreview) => ({
					...prevInputImagePreview,
					[`inputImage${number}preview`]: null,
				}));
				setInputImage((prevInputImage) => ({
					...prevInputImage,
					[`inputImage${number}`]: null,
				}));
			}
		});
	};

	const handleFree = (e) => {
		setFee(e.target.value);
		setMoney("0");
	};

	const onChangeApply = (dates) => {
		setApplyEndDate(dates);
	};
	const onChangeActivity = (dates) => {
		const [start, end] = dates;

		if (applyEndDate === null) {
			Toast.fire({
				icon: "error",
				title: "신청 기간을 먼저 선택해 주세요",
			});
			setActivityStartDate(null);
			setActivityEndDate(null);
		} else {
			setActivityStartDate(start);

			if (end) {
				setActivityEndDate(end);
			} else {
				setActivityEndDate(null);
			}
		}
	};
	const handleComplete = (data) => {
		let fullAddress = `${data.address}`;

		setAdress(fullAddress);

		setIsOpen(false);
		if (fullAddress !== "") {
			loadMap(fullAddress);
		}
	};

	function handleModal() {
		setIsOpen(true);
	}

	const addTheme = (theme_item) => {
		if (selectedTheme.includes(theme_item)) {
			setSelectedTheme(selectedTheme.filter((t) => t !== theme_item));
		} else {
			setSelectedTheme([...selectedTheme, theme_item]);
		}
	};

	const blank_check = useCallback(() => {
		const isAtLeastOneDayValidoff = days.every(
			(day) => day.title !== "" && day.date !== "" && day.content !== ""
		);
		const isAtLeastOneDayValidon = days.every(
			(day) =>
				day.dayImg !== null &&
				day.title !== "" &&
				day.content !== "" &&
				day.prepare !== ""
		);
		if (isAtLeastOneDayValidoff) {
			setAlldayplanoffline(true);
		} else {
			setAlldayplanoffline(false);
		}
		if (isAtLeastOneDayValidon) {
			setAlldayplanonline(true);
		} else {
			setAlldayplanonline(false);
		}
	}, [days]);

	useEffect(() => {
		blank_check();

		if (imageSrc !== null) {
			if (imageSrc.type.startsWith("image/")) {
				setIsFirstImage(true);
			} else {
				setIsFirstImage(false);
			}
		}
		if (selectedTheme.length !== 0) {
			setAllselecttheme(true);
		} else {
			setAllselecttheme(false);
		}
		if (person && money !== "") {
			setAllpersonmoney(true);
		} else {
			setAllpersonmoney(false);
		}
		if (
			applyEndDate &&
			activityStartDate &&
			activityEndDate &&
			address !== ""
		) {
			setAllperiodplace(true);
		} else {
			setAllperiodplace(false);
		}
		if (file !== null) {
			setAllplanfile(true);
		} else {
			setAllplanfile(false);
		}
	}, [
		imageSrc,
		selectedTheme,
		person,
		money,
		applyEndDate,
		activityEndDate,
		activityStartDate,
		address,
		blank_check,
		days,
		file,
	]);

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
		};

		return () => {
			document.head.removeChild(script);
		};
	}
	const handleAddDay = () => {
		const lastDay = days[days.length - 1];
		const lastDayNumber = parseInt(lastDay.id.replace("day", ""));
		const newDayId = `day${lastDayNumber + 1}`;
		const newDay = {
			id: newDayId,
			title: "",
			dayImg: "",
			dayImgpreview: "",
			dayVideopreview: "",
			date: "",
			content: "",
		};
		setDays((prevDays) => [...prevDays, newDay]);
		console.log(days);
		blank_check();
	};

	const handleRemoveDay = (id) => {
		setDays((prevDays) => prevDays.filter((day) => day.id !== id));
	};

	const handleDayRemoveImg = (id) => {
		Swal.fire({
			title: "정말로 삭제 하시겠습니까?",
			icon: "warning",

			showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
			confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
			cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
			confirmButtonText: "삭제", // confirm 버튼 텍스트 지정
			cancelButtonText: "취소", // cancel 버튼 텍스트 지정
		}).then((result) => {
			if (result.isConfirmed) {
				const updatedDays = [...days];

				const dayIndex = updatedDays.findIndex((day) => day.id === id);

				if (dayIndex !== -1) {
					updatedDays[dayIndex] = {
						...updatedDays[dayIndex],
						dayImg: null,
						dayImgpreview: "",
						dayVideopreview: "",
					};

					setDays(updatedDays);
				}
			}
		});
	};

	//Day별 입력창 변경 이벤트 처리 함수 , id, 필드이름, 입력값
	const handleChange = async (id, field, value) => {
		if (field === "date") {
			// 신청 기간과 활동 기간을 먼저 체크
			if (activityStartDate == null || activityEndDate == null) {
				Toast.fire({
					icon: "error",
					title: "신청 기간과 활동 기간을 먼저 선택해주세요",
				});

				return;
			}

			// 선택한 날짜를 Date 객체로 변환
			const selectedDate = new Date(value);

			// 활동 기간의 시작일과 종료일을 Date 객체로 변환
			const startDate = new Date(activityStartDate);
			const endDate = new Date(activityEndDate);

			// 선택한 날짜가 활동 기간에 속하지 않으면 경고 메시지 표시
			if (selectedDate < startDate || selectedDate > endDate) {
				Toast.fire({
					icon: "error",
					title: "활동 기간 중 날짜를 선택해주세요",
				});
				return;
			}
		}
		//파일 읽기
		const reader = new FileReader();

		//파일 읽기 작업 완료 후 호출, 핸들러 내에서 파일 읽기 결과 처리
		reader.onload = async () => {
			try {
				//Promise.all로 모든 day를 동시에 업데이트
				const updatedDays = await Promise.all(
					days.map(async (day) => {
						//각 day를 확인하고 일치할 경우, 해당 입력값 저장.
						//단, dayImg일 경우 변환된 이미지를 dayImgpreview(미리보기) 필드에 저장
						if (day.id === id) {
							return {
								...day,
								[field]: value,
								dayImgpreview:
									field === "dayImg" && value.type.startsWith("image/")
										? reader.result
										: day.dayImgpreview,
								dayVideopreview:
									field === "dayImg" && value.type.startsWith("video/")
										? reader.result
										: day.dayVideopreview,
							};
						}
						return day;
					})
				);

				//업데이트 된 day목록 updatedDays로 상태 업데이트
				setDays(updatedDays);

				//에러 출력
			} catch (error) {
				console.error(error);
			}
		};
		//필드가 dayImg인 경우 파일 읽기
		if (field === "dayImg") {
			try {
				if (value.type.startsWith("image/")) {
					setIsImage(true);
				} else {
					setIsImage(false);
				}
				reader.readAsDataURL(value);
			} catch (error) {
				console.error(error);
			}
		} else {
			// 다른 필드일 경우, 입력값 직접 업데이트
			setDays((prevDays) =>
				prevDays.map((day) =>
					day.id === id
						? {
								...day,
								[field]: value,
						  }
						: day
				)
			);
		}
	};

	const onChangeImage_day = (value, name) => {
		const dayId = name.replace("day_img_", "");
		handleChange(dayId, "dayImg", value);
	};

	const onChangefile = (e) => {
		setFile(e);
		setFileSrc(e.name);
	};

	const handleSubmit = () => {
		const token = localStorage.getItem("token");
		console.log(inputInfo["inputInfo1"]);

		const classAllData = {
			title: title,
			info: info,
			option: option,
			person: person,
			address: address,
			money: money,
			theme: selectedTheme,
			applyEndDate: moment(applyEndDate).format("YYYY-MM-DD"),
			activityStartDate: moment(activityStartDate).format("YYYY-MM-DD"),
			activityEndDate: moment(activityEndDate).format("YYYY-MM-DD"),
			inputInfo1: inputInfo["inputInfo1"],
			inputInfo2: inputInfo["inputInfo2"],
			inputInfo3: inputInfo["inputInfo3"],
			days: days,
			token: token,
		};
		const formData = new FormData();
		formData.append("json", JSON.stringify(classAllData)); // JSON 데이터 추가
		formData.append("imageSrc", imageSrc);
		formData.append("file", file);
		formData.append("inputImage1", inputImage["inputImage1"]);
		formData.append("inputImage2", inputImage["inputImage2"]);
		formData.append("inputImage3", inputImage["inputImage3"]);
		days.forEach((day) => {
			if (day.dayImg !== null) {
				formData.append(`dayImg[${day.id}]`, day.dayImg);
			}
		});

		axios
			.post("http://localhost:8000/api/post/submit_data/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
		navigate("/readclass");
	};

	return (
		<div className="create_wrap">
			{token ? (
				<>
					{option === "offline" ? (
						<OfflinFollowbar
							checkList_offline={checkList_offline}
							listContents_offline={listContents_offline}
						/>
					) : (
						<OnlineFollowbar
							checkList_online={checkList_online}
							listContents_online={listContents_online}
						/>
					)}
					<div className="flex_center">
						<div
							className="large_label"
							style={{
								width: "60%",
								padding: 10,
								margin: 20,
								fontSize: "10",
								justifyContent: "center",
								textAlign: "center",
							}}
						>
							TITLE : {title}
						</div>

						{imagepreview || videopreview ? (
							<>
								<div className="all_img_wrapper">
									{isFirstImage ? (
										<img
											style={{
												objectFit: "cover",
												width: "75%",
												height: "100%",
												justifyContent: "center",
											}}
											src={imagepreview}
											alt=""
										/>
									) : (
										<video
											style={{
												objectFit: "cover",
												width: "75%",
												height: "100%",
												justifyContent: "center",
											}}
											controls
											src={videopreview}
											alt=""
										/>
									)}
								</div>
							</>
						) : null}

						<div
							style={{
								width: "60%",
								padding: 10,
								margin: 20,
								fontSize: "10",
								justifyContent: "center",
								textAlign: "center",
							}}
						>
							{info}
						</div>
					</div>

					<div className="flex_center" style={{ flexDirection: "column" }}>
						<div className="theme_wrapper">
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
									<div className="theme_text_wrapper">{item}</div>
								</button>
							))}
						</div>
						<div
							className="flex_center"
							style={{
								alignItems: "center",
							}}
						>
							<div className="middle_text">
								<div className="_text">
									수강 인원과 수강료는 합리적이고 효율적인 가격과 인원으로
									자율적으로 책정해주세요.
								</div>
								<div className="_text">
									수강료는 개인 당 수강료가 아닌 전체 수강인원에 대한
									수강료입니다.
								</div>
							</div>
							<div className="flex_center" style={{ margin: 10 }}>
								<div className="person_money">
									<img
										className="flex_center"
										style={{ margin: 10 }}
										width={60}
										height={60}
										src="https://img.icons8.com/cotton/64/conference-call.png"
										alt="conference-call"
									/>
									<div className="person_money_label">최대 수강 인원</div>
									<input
										className="person_money_input"
										name="person"
										type="number"
										value={person}
										onChange={(e) => setPerson(e.target.value)}
									/>
									<div style={{ marginLeft: 10 }}>명</div>
								</div>
								<div className="person_money">
									<div className="person_money_icon">
										<img
											className="flex_center"
											style={{ margin: 10 }}
											width={58}
											height={55}
											src="https://img.icons8.com/ios/64/get-cash--v1.png"
											alt="get-cash--v1"
										/>
									</div>
									<div className="person_money_label">수강료</div>
									<div className="radio_fee">
										<div className="mo_flex_row" style={{ height: 33 }}>
											<input
												type="radio"
												value="pay"
												checked={fee === "pay"}
												onChange={(e) => setFee(e.target.value)}
											></input>
											<div
												style={{
													// backgroundColor: "red",
													display: "flex",
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<div className="radio_label">유료</div>
												<div className="flex_center">
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
										</div>
										<div className="mo_flex_row" style={{ height: 33 }}>
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
						</div>

						<div
							style={{
								width: "70%",
								textAlign: "center",
								borderBottom: "1px solid #adb5bd",
								lineHeight: "0.5em",
								margin: 30,
							}}
						></div>
						{option === "offline" && (
							<PLACE_PERIOD
								// applyStartDate={applyStartDate}
								applyEndDate={applyEndDate}
								onChangeApply={onChangeApply}
								activityStartDate={activityStartDate}
								activityEndDate={activityEndDate}
								onChangeActivity={onChangeActivity}
								isOpen={isOpen}
								handleComplete={handleComplete}
								address={address}
								handleModal={handleModal}
							/>
						)}

						<div style={{ width: "75%" }}>
							<div style={{ marginBottom: 10 }}>
								<div className="large_label">클래스 소개</div>
								<div className="period_place_label_hint">
									자신의 클래스를 사람들이 이끌릴만한 간단한 소개
								</div>
							</div>
							<div style={{}}>
								{intro_map.map((number) => (
									<div
										className="mo_flex_row"
										style={{
											alignItems: "center",
											justifyContent: "center",
											margin: 10,
										}}
									>
										{inputImagePreview[`inputImage${number}preview`] !==
										null ? (
											<>
												<div
													style={{
														position: "relative",
														width: "15%",
														display: "flex",
														flexDirection: "row",
														marginRight: 15,
													}}
												>
													<img
														src={
															inputImagePreview[`inputImage${number}preview`]
														}
														className="day_img_true"
														style={{
															objectFit: "cover",
															width: "72%",
															height: 130,
															justifyContent: "center",
														}}
														alt="preview-img"
													/>

													<button
														className="editImg_text"
														style={{ right: 0 }}
														onClick={() => {
															const inputElement = document.getElementById(
																`infoimage${number}`
															);
															if (inputElement) {
																inputElement.click();
															}
														}}
													>
														<img src={edit} width={15} alt="edit" />
													</button>
													<button
														className="editImg_text"
														style={{ right: 0, top: 25 }}
														onClick={() => handleRemoveImg(number)}
													>
														<img src={remove} width={15} alt="edit" />
													</button>
												</div>

												<input
													type="file"
													accept="image/*"
													id={`infoimage${number}`}
													name={`infoimage${number}`}
													style={{ display: "none" }}
													onChange={(e) => {
														onChangeImage(e.target.files[0], number);
													}}
												/>
											</>
										) : (
											<>
												<div>
													<button
														className="uploadImg_behind"
														onClick={() => {
															const inputElement = document.getElementById(
																`infoimage${number}`
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
												</div>
												<input
													type="file"
													accept="image/*"
													id={`infoimage${number}`}
													style={{ display: "none" }}
													onChange={(e) => {
														onChangeImage(e.target.files[0], number);
													}}
												/>
											</>
										)}

										<div className="word_info">
											<textarea
												className="info_box_long"
												maxLength={500}
												type="text"
												name={`inputInfo${number}`}
												value={inputInfo[`inputInfo${number}`]}
												placeholder="이미지 및 간단한 소개"
												onChange={(e) => onChangeInput(e, number)}
											/>
											<div className="word_how_many">
												<span>{inputCount[`inputCount${number}`]}</span>
												<span>/500자</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						{option === "offline" ? (
							<DAY_PLAN
								days={days}
								isImage={isImage}
								handleDayRemoveImg={handleDayRemoveImg}
								activityEndDate={activityEndDate}
								activityStartDate={activityStartDate}
								onChangeImage_day={onChangeImage_day}
								handleChange={handleChange}
								handleRemoveDay={handleRemoveDay}
								handleAddDay={handleAddDay}
							/>
						) : (
							<ONLINE_DAY_PLAN
								days={days}
								isImage={isImage}
								handleDayRemoveImg={handleDayRemoveImg}
								activityEndDate={activityEndDate}
								activityStartDate={activityStartDate}
								onChangeImage_day={onChangeImage_day}
								handleChange={handleChange}
								handleRemoveDay={handleRemoveDay}
								handleAddDay={handleAddDay}
							/>
						)}
						{option === "offline" && (
							<>
								<div
									style={{
										width: "70%",
										textAlign: "center",
										borderBottom: "1px solid #adb5bd",
										lineHeight: "0.5em",
										margin: 30,
									}}
								></div>
								<div
									className="flex_center"
									style={{ padding: 10, flexDirection: "row" }}
								>
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
								<div
									class="flex_center"
									style={{
										marginTop: 20,
										display: "flex",
										flexDirection: "row",
									}}
								>
									<label for="file">파일찾기</label>
									<input
										type="file"
										accept=".pdf"
										id="file"
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
								<div className="long_text_zip">
									<div className="flex_center" style={{ flexDirection: "row" }}>
										<div className="_text">위 파일은</div>
										<div className="important_text">
											(클래스 이름)(작성자)_활동계획서 및 상세일.pdf
										</div>
										<div className="_text">이름으로 업로드 해주세요.</div>
									</div>
									<div className="last_text_row">
										<div className="_text">파일 안에 꼭 있어야하는 내용</div>
										<div className="important_text">
											클래스 소개 및 일별 상세 활동 소개, 준비물, 연락 가능한
											연락망{" "}
										</div>
										<div className="_text">
											이 포함되지 않았을 시 클래스 업로드에 제약이 있을 수
											있습니다.
										</div>
									</div>
								</div>
							</>
						)}
						<div className="submit_button_wrapper">
							{option === "offline" ? (
								<button
									className={
										!All_submit_Offline ? "submit_ok" : "submit_button"
									}
									onClick={handleSubmit}
									disabled={All_submit_Offline}
								>
									등록하기
								</button>
							) : (
								<button
									className={!All_submit_Online ? "submit_ok" : "submit_button"}
									onClick={handleSubmit}
									disabled={All_submit_Online}
								>
									등록하기
								</button>
							)}
						</div>
					</div>
				</>
			) : (
				<LoginRequired />
			)}
		</div>
	);
}
export default CreateClassDetail;
