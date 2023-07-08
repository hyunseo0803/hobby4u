import React, { useState, useEffect } from "react";

import "../styles/CreateClassDetail.css";
import { useLocation } from "react-router-dom";
import person_img from "../assets/person.png";
import money_img from "../assets/money.png";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";

import "react-datepicker/dist/react-datepicker.css";
import DaumPostCode from "react-daum-postcode";
import Place_search_icon from "../assets/place_search_icon.png";
// import { useSelector, shallowEqual } from "react-redux";

function CreateClassDetail(props) {
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

	// const { lat, lon } = useSelector(
	// 	(state) => state.locationReducer,
	// 	shallowEqual
	// );
	const { kakao } = window;

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

	// useEffect(() => {
	// 	if (address) {
	// 		loadMap(address);
	// 	}
	// });

	const location = useLocation();
	const inputValues = location.state;

	const option = inputValues.option;

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
						console.log(address);

						if (status === kakao.maps.services.Status.OK) {
							const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

							// 결과값으로 받은 위치를 마커로 표시합니다
							const marker = new kakao.maps.Marker({
								position: coords,
								map: map,
							});

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

	// 인포윈도우로 장소에 대한 설명을 표시합니다

	// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
	// map.setCenter(coords);

	//위도, 경도로 변환 및 마커표시
	// let markerPosition  = new kakao.maps.LatLng(lat, lon);
	// let marker = new kakao.maps.Marker({
	//     position: markerPosition
	// });
	// marker.setMap(map);

	return (
		<div className="wrap">
			{option === "offline" ? (
				<>
					<div className="theme_wrapper">
						<div className="theme_text">클래스의 테마를 선택해 주세요 ! </div>
						<div>
							{theme.map((theme, index) => (
								<button className="theme_button" key={index}>
									{theme}
								</button>
							))}
						</div>
					</div>
					{/* <div className="middle_wrapper"> */}
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
						<div className="person">
							<img src={person_img} alt=""></img>
							<input
								name="person"
								type="text"
								value={person}
								onChange={(e) => setPerson(e.target.value)}
							></input>{" "}
						</div>
						<div className="money">
							<img src={money_img} alt=""></img>
							<input
								name="money"
								type="text"
								value={money}
								onChange={(e) => setMoney(e.target.value)}
							></input>
						</div>
					</div>
					<div className="period_place_wrapper">
						<div className="period_place">
							<div className="period_place_label">신청 기간</div>
							<div className="period_place_label_hint">
								클래스 신청 기간을 선택해 주세요.{" "}
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
							<div className="period_place_label">활동 기간</div>
							<div className="period_place_label_hint">
								클래스 활동 기간을 선택해 주세요.
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
							<div className="period_place_label">활동 장소</div>
							<div className="period_place_label_hint">
								클래스 활동 장소를 선택해 주세요.
							</div>

							<div className="period_place_choice">
								{/* <button className="place_search_button" onClick={handleModal}>
									장소 찾기
								</button> */}
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
									<div>
										<img src={Place_search_icon} onClick={handleModal} alt="" />
									</div>
								)}
							</div>
						</div>
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
