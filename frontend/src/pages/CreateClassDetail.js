import React, { useEffect, useState } from "react";

import "../styles/CreateClassDetail.css";
import { useNavigate, useLocation } from "react-router-dom";
import person_img from "../assets/person.png";
import money_img from "../assets/money.png";
import DatePicker from "react-datepicker";

function CreateClassDetail(props) {
	const [person, setPerson] = useState("");
	const [money, setMoney] = useState("");

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

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

	// const MyDatePicker = styled(DatePicker)`
	// 	width: 90%;
	// 	height: 3rem;
	// 	font-size: 1.6rem;
	// 	font-weight: bold;
	// 	background-color: transparent;
	// 	color: white;
	// 	border: 1px solid;
	// `; // styled-components 이용 스타일륑

	// useEffect(() => {
	// 	const TIME_ZONE = 9 * 60 * 60 * 1000;

	// 	let new_date = new Date(Date().now() + TIME_ZONE)
	// 		.toISOString()
	// 		.split("T")[0];

	// 	setStartDate(new_date);
	// 	setEndDate(new_date);
	// }, []);

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
							<div className="period_place_label">신청기간</div>
							<div>클래스 신청 기간을 선택해 주세요. </div>
							<div className="period_place_choice">
								<div className="calender-container">
									<div className="calender-box">
										{/* <div className="date">시작날짜</div> */}
										{/* <div> */}
										<DatePicker
											dateFormat="yyyy.MM.dd" // 날짜 형태
											shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
											minDate={new Date("2000-01-01")} // minDate 이전 날짜 선택 불가
											maxDate={new Date()} // maxDate 이후 날짜 선택 불가
											selected={startDate}
											onChange={(date) => setStartDate(date)}
										/>
										{/* </div> */}
										{/* </div> */}
										{/* <div className="calender-box"> */}
										{/* <div className="date">종료날짜</div> */}
										{/* <div> */}
										<DatePicker
											dateFormat="yyyy.MM.dd" // 날짜 형태
											shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
											minDate={new Date("2000-01-01")} // minDate 이전 날짜 선택 불가
											maxDate={new Date()} // maxDate 이후 날짜 선택 불가
											selected={endDate}
											onChange={(date) => setEndDate(date)}
										/>
										{/* </div> */}
									</div>
								</div>
							</div>
						</div>
						<div className="period_place">
							<div className="period_place_label">신청기간</div>
							<div>클래스 활동 기간을 선택해 주세요. </div>

							<div className="period_place_choice">신청기간 선택</div>
						</div>
						<div className="period_place">
							<div className="period_place_label">신청기간</div>
							<div>클래스 활동 장소를 선택해 주세요. </div>

							<div className="period_place_choice">신청기간 선택</div>
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
