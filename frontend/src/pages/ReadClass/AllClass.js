import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/ReadClass.css";

function Allclass() {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [newdata, setNewData] = useState([]);

	//필터 적용 여부 확인
	const [filter, setFilter] = useState({
		money: "",
		option: "",
	});

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
		const { name, value } = e.target;
		setFilter({ ...filter, [name]: value });

		axios
			.get(`http://localhost:8000/api/post/read_filter_data/`, filter)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	};

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
				// console.log(classItem);
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
				console.log(classNewItem);
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
					// marginTop: 70,
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					// margin: 10,
					// backgroundColor: "yellow",
				}}
			>
				{filter.option === "" && filter.money === ""
					? data.map((classItem, index) => (
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
								{calculateDaysLeft(classItem.applyend) > 0 ? (
									<strong>
										{calculateDaysLeft(classItem.applyend)}일 남음
									</strong>
								) : null}
							</div>
					  ))
					: null}
			</div>
		</div>
	);
}

export default Allclass;
