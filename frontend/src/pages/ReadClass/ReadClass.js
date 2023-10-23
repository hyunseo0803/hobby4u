import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import FILTER_BTN from "../../component/FilterbtnRead";

import NEW_CLASS from "./NewClass";
import FILTER_CLASS from "./FilterClass";

import "../../styles/ReadClass.css";
import ALL_CLASS from "./AllClass";

function Allclass() {
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [newdata, setNewData] = useState([]);
	const [fliteredata, setFliteredata] = useState([]);
	const [like_status, setLikeStatus] = useState([]);

	const [token, setToken] = useState("");

	const [money, setMoney] = useState("");
	const [option, setOption] = useState("");

	function handleReadDetail(value) {
		axios
			.get(`http://localhost:8000/api/post/read_some_data/?class_id=${value}`)
			.then((response) => {
				navigate("/readClass/classDetail", {
					state: {
						ClassDetail: response.data.class_data,
						DayDetail: response.data.day_data,
					},
				});
				tokenCheck();
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

		if (value === "reset") {
			setOption("");
			setMoney("");
		}
		readFilter();
	};

	function readFilter() {
		axios
			.get(
				`http://localhost:8000/api/post/read_filter_data/?money=${money}&option=${option}`
			)
			.then((response) => {
				setFliteredata(response.data.filter_data_list);
				tokenCheck();
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	function readAll() {
		axios
			.get("http://localhost:8000/api/post/read_all_data/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const classItem = response.data.all_data_list;
				setData(classItem);
				ReadGoodCount();
				tokenCheck();
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	function readNew() {
		axios
			.get("http://localhost:8000/api/post/read_new_data/", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const classNewItem = response.data.new_date_list;
				setNewData(classNewItem);
				ReadGoodCount();
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	function ReadGoodCount() {
		const token = localStorage.getItem("token");
		const userData = { token: token };
		if (token) {
			axios
				.post("http://localhost:8000/api/post/read_goodCount_data/", userData, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((response) => {
					const likeData = response.data.like_data_list;
					setLikeStatus(likeData);
					tokenCheck();
				})
				.catch((error) => {
					console.error("Error submitting data:", error);
				});
		}
	}

	async function goodClick(classId) {
		const token = localStorage.getItem("token");
		const classidData = { classId: classId, token: token };
		if (token) {
			try {
				await axios.post(
					"http://localhost:8000/api/post/create_goodCount_data/",
					classidData,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				ReadGoodCount();

				readNew();
				if (option === "" && money === "") {
					readAll();
				} else {
					readFilter();
				}
			} catch (error) {
				console.error("Error submitting data:", error);
			}
		}
	}

	useEffect(() => {
		if (option === "" && money === "") {
			readAll();
		} else {
			readFilter();
		}
	}, [money, option]);

	useEffect(() => {
		readAll();
	}, []);

	const tokenCheck = () => {
		const localtoken = localStorage.getItem("token");
		if (localtoken) {
			setToken(localtoken);
		} else {
			setToken("");
		}
		console.log(token);
	};

	return (
		<div className="read_container">
			<div className="new_read_container">
				<div className="center_label">NEW</div>
				<div className="row_center_wrap">
					<NEW_CLASS
						newdata={newdata}
						readNew={readNew}
						handleReadDetail={handleReadDetail}
						like_status={like_status}
						ReadGoodCount={ReadGoodCount}
						goodClick={goodClick}
						token={token}
					/>
				</div>
			</div>
			<div className="new_read_container">
				<div className="center_label">ALL</div>
				<FILTER_BTN addFilter={addFilter} money={money} option={option} />
				<div className="row_center_wrap">
					{/* 필터링 했을 경우 */}
					{option === "" && money === "" ? (
						<ALL_CLASS
							data={data}
							readAll={readAll}
							goodClick={goodClick}
							like_status={like_status}
							handleReadDetail={handleReadDetail}
							ReadGoodCount={ReadGoodCount}
							token={token}
						/>
					) : (
						<FILTER_CLASS
							option={option}
							money={money}
							data={data}
							readAll={readAll}
							goodClick={goodClick}
							like_status={like_status}
							handleReadDetail={handleReadDetail}
							fliteredata={fliteredata}
							ReadGoodCount={ReadGoodCount}
							readFilter={readFilter}
							token={token}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Allclass;
