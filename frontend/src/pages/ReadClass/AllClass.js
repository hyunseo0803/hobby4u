import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import "../../styles/ReadClass.css";

function Allclass() {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [newdata, setNewData] = useState([]);
	const [fliteredata, setFliteredata] = useState([]);

	// const [buttonStates, setButtonStates] = useState({
	// 	fee: false,
	// 	free: false,
	// 	online: false,
	// 	offline: false,
	// });

	const [money, setMoney] = useState(""); // 초기값: 무료
	const [option, setOption] = useState("");
	const [apply_ok, setApply_ok] = useState(false);

	//필터 적용 여부 확인
	// const [filter, setFilter] = useState({
	// 	money: "",
	// 	option: "",
	// });

	function calculateDaysLeft(endDate) {
		const endDateFormatted = parseDate(endDate);
		const today = new Date();
		const endDateObj = new Date(endDateFormatted);
		const timeDiff = endDateObj - today;
		const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초를 일로 변환
		return daysDiff;
	}

	function parseDate(koreanDate) {
		const dateParts = koreanDate.match(/(\d{4})년(\d{1,2})월(\d{1,2})일/);
		if (dateParts) {
			const year = dateParts[1];
			const month = dateParts[2].padStart(2, "0"); // 한 자리 월을 두 자리로 변환
			const day = dateParts[3].padStart(2, "0"); // 한 자리 일을 두 자리로 변환
			return `${year}-${month}-${day}`;
		}
		return null;
	}

	function handleReadDetail(value) {
		axios
			.get(`http://localhost:8000/api/post/read_some_data/?class_id=${value}`)
			.then((response) => {
				// console.log({ classData: response.data.day_data });
				navigate("/readClass/classDetail", {
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

	//필터 적용 및 필터링 기능 함수
	const addFilter = (e) => {
		const { value } = e.target;
		if (money === value) {
			setMoney("");
		} else if (value === "fee") {
			setMoney("fee");
		} else if (value === "free") {
			setMoney("free");
		}

		if (option === value) {
			setOption("");
		} else if (value === "online") {
			setOption("online");
		} else if (value === "offline") {
			setOption("offline");
		}

		if (value === "apply") {
			setApply_ok(!apply_ok);
		}
	};

	useEffect(() => {
		const today = moment(new Date()).format("YYYY-MM-DD");
		console.log(money, option, apply_ok);
		axios
			.get(
				`http://localhost:8000/api/post/read_filter_data/?money=${money}&option=${option}&apply_ok=${apply_ok}&today=${today}`
			)
			.then((response) => {
				console.log(response.data.filter_data_list);
				setFliteredata(response.data.filter_data_list);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}, [money, option, apply_ok]);

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/post/read_all_data/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const classItem = response.data;
				setData(classItem);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});

		axios
			.get("http://localhost:8000/api/post/read_new_data/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const classNewItem = response.data.new_date_list;
				setNewData(classNewItem);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}, []);

	return (
		<div className="read_container">
			<div className="center_label">NEW</div>
			<div
				style={{
					// marginTop: 70,
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					// margin: 10,
					// backgroundColor: "yellow",
				}}
			>
				{/* {newdata && */}
				{newdata.map((newItem, index) => (
					<div
						key={index}
						style={{
							width: 290,
							height: 200,
							margin: 15,
							backgroundColor: "red",
						}}
					>
						<strong>id:</strong>
						<button
							value={newItem.class_id}
							onClick={(e) => handleReadDetail(e.target.value)}
						>
							{newItem.class_id}
						</button>
						<br />
						<strong>Title:</strong> {newItem.title}
						<br />
						<strong>Info:</strong> {newItem.info}
						<br />
						{calculateDaysLeft(newItem.applyend) > 0 ? (
							<strong>신청 마감 디데이:</strong>
						) : (
							<strong>신청 기간이 아닙니다</strong>
						)}
						{calculateDaysLeft(newItem.applyend) > 0 ? (
							<strong>{calculateDaysLeft(newItem.applyend)}일 남음</strong>
						) : null}
					</div>
				))}
			</div>
			<div className="center_label">ALL</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					margin: 10,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						backgroundColor: "yellow",
						padding: 10,
					}}
				>
					<div style={{ marginRight: 20 }}>
						<button
							name="money"
							value="fee"
							onClick={(e) => addFilter(e)}
							style={{
								backgroundColor: money === "fee" ? "pink" : "transparent",
							}}
						>
							유료
						</button>
					</div>
					<div style={{ marginRight: 20 }}>
						<button
							name="money"
							value="free"
							onClick={(e) => addFilter(e)}
							style={{
								backgroundColor: money === "free" ? "pink" : "transparent",
							}}
						>
							무료
						</button>
					</div>
					<div style={{ marginRight: 20 }}>
						<button
							name="option"
							value="offline"
							onClick={(e) => addFilter(e)}
							style={{
								backgroundColor: option === "offline" ? "pink" : "transparent",
							}}
						>
							오프라인
						</button>
					</div>
					<div>
						<button
							name="option"
							value="online"
							onClick={(e) => addFilter(e)}
							style={{
								backgroundColor: option === "online" ? "pink" : "transparent",
							}}
						>
							온라인
						</button>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						backgroundColor: "yellow",
						padding: 10,
					}}
				>
					<button
						value="apply"
						onClick={(e) => addFilter(e)}
						style={{
							backgroundColor: apply_ok ? "pink" : "transparent",
						}}
					>
						신청 가능한 클래스
					</button>
				</div>
			</div>
			<div
				style={{
					// marginTop: 70,
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					// margin: 10,
					// backgroundColor: "yellow",
				}}
			>
				{/* 눌렀고, 신청 기능인 클래스가 있으면 */}
				{option === "" && money === "" && apply_ok === false ? (
					data.map((classItem, index) => (
						<div
							key={index}
							style={{
								width: 290,
								height: 200,
								margin: 15,
								backgroundColor: "red",
							}}
						>
							<strong>id:</strong>{" "}
							<button
								value={classItem.class_id}
								onClick={(e) => handleReadDetail(e.target.value)}
							>
								{" "}
								{classItem.class_id}
							</button>
							<br />
							<strong>Title:</strong> {classItem.title}
							<br />
							<strong>Info:</strong> {classItem.info}
							<br />
							{/* <strong>마감 시작:</strong> {classItem.applystart}
						<br />
						<strong>마감 마감:</strong> {classItem.applyend}
						<br /> */}
							{calculateDaysLeft(classItem.applyend) > 0 ? (
								<strong>신청 마감 디데이:</strong>
							) : (
								<strong>신청 기간이 아닙니다</strong>
							)}
							{calculateDaysLeft(classItem.applyend) > 0 && (
								<strong>{calculateDaysLeft(classItem.applyend)}일 남음</strong>
							)}
						</div>
					))
				) : (
					<div>
						{fliteredata &&
							fliteredata.map((filter, index) => (
								<div
									key={index}
									style={{
										width: 290,
										height: 200,
										margin: 15,
										backgroundColor: "red",
									}}
								>
									<strong>id:</strong>{" "}
									<button
										value={filter.class_id}
										onClick={(e) => handleReadDetail(e.target.value)}
									>
										{" "}
										{filter.class_id}
									</button>
									<br />
									<strong>Title:</strong> {filter.title}
									<br />
									<strong>Info:</strong> {filter.info}
									<br />
									{/* <strong>마감 시작:</strong> {classItem.applystart}
						<br />
						<strong>마감 마감:</strong> {classItem.applyend}
						<br /> */}
									{calculateDaysLeft(filter.applyend) > 0 ? (
										<strong>신청 마감 디데이:</strong>
									) : (
										<strong>신청 기간이 아닙니다</strong>
									)}
									{calculateDaysLeft(filter.applyend) > 0 && (
										<strong>{calculateDaysLeft(filter.applyend)}일 남음</strong>
									)}
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Allclass;
