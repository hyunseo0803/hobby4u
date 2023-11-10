import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import FILTER_BTN from "../../component/FilterbtnRead";

import NEW_CLASS from "./NewClass";
import FILTER_CLASS from "./FilterClass";

import "../../styles/ReadClass.css";
import ALL_CLASS from "./AllClass";

function Allclass(props) {
	const { readFirebasefile, isLoggedIn, userData } = props;
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [newdata, setNewData] = useState([]);
	const [fliteredata, setFliteredata] = useState([]);
	const [like_status, setLikeStatus] = useState([]);

	const [money, setMoney] = useState("");
	const [option, setOption] = useState("");
	const [searchfilterField, setSearchFilterField] = useState("제목");
	const [inputValue, setInputValue] = useState("");
	const [word, setWord] = useState("");
	const [searchClick, setSearchClick] = useState(false);

	// const [themefKO, setThemefKO] = useState("");
	const [themef, setThemef] = useState([]);

	const [loading, setLoading] = useState(true);

	const theme = [
		"조용한",
		"스포츠",
		"여행",
		"힐링",
		"액티비티",
		"혼자",
		"간단한",
		"음악",
		"공예",
		"기술",
		"뷰티",
		"문화예술",
	];
	async function handleReadDetail(value) {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_some_data/?class_id=${value}`
			);
			const classdetail = response.data.class_data;
			const daydetail = response.data.day_data;
			const updatedClassDetail = { ...classdetail };
			const classImg = await readFirebasefile("classFile", classdetail.img);
			const classfile = await readFirebasefile("file", classdetail["file"]);
			if (classdetail["infoimg1"]) {
				const intro1 = await readFirebasefile("intro", classdetail["infoimg1"]);
				updatedClassDetail.infoimg1 = intro1;
			}
			if (classdetail["infoimg2"]) {
				const intro2 = await readFirebasefile("intro", classdetail["infoimg2"]);
				updatedClassDetail.infoimg2 = intro2;
			}
			if (classdetail["infoimg3"]) {
				const intro3 = await readFirebasefile("intro", classdetail["infoimg3"]);
				updatedClassDetail.infoimg3 = intro3;
			}

			updatedClassDetail.img = classImg;
			updatedClassDetail.file = classfile;

			const updatedDayDetail = await Promise.all(
				daydetail.map(async (day) => {
					const updatedDay = { ...day };
					try {
						updatedDay.day_file = await readFirebasefile("day", day.day_file);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedDay;
				})
			);
			navigate("/readClass/classDetail", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
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

	async function readFilter() {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_filter_data/?money=${money}&option=${option}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const fSimple = response.data.filter_data_list;
			const updatedClass_f = await Promise.all(
				fSimple.map(async (s) => {
					const updatedClassf = { ...s };
					try {
						updatedClassf.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedClassf;
				})
			);
			setFliteredata(updatedClass_f);
			ReadGoodCount();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	async function readAll() {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/post/read_all_data/",
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const classSimple = response.data.all_data_list;
			const updatedClass_ = await Promise.all(
				classSimple.map(async (s) => {
					const updatedClass = { ...s };
					try {
						updatedClass.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedClass;
				})
			);
			setData(updatedClass_);
			ReadGoodCount();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	async function readNew() {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/post/read_new_data/",
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const nSimple = response.data.new_date_list;
			const updatedClass_n = await Promise.all(
				nSimple.map(async (s) => {
					const updatedClassn = { ...s };
					try {
						updatedClassn.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedClassn;
				})
			);
			setNewData(updatedClass_n);
			ReadGoodCount();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	async function ReadGoodCount() {
		if (isLoggedIn) {
			const token = localStorage.getItem("token");
			const userData = { token: token };
			if (token) {
				axios
					.post(
						"http://localhost:8000/api/post/read_goodCount_data/",
						userData,
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
					.then((response) => {
						const likeData = response.data.like_data_list;
						setLikeStatus(likeData);
					})
					.catch((error) => {
						console.error("Error submitting data:", error);
					});
			}
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

	function handleSelectTheme(themeFilter) {
		if (themeFilter) {
			const updatedThemes = [...themef];

			const themeIndex = updatedThemes.indexOf(themeFilter);

			if (themeIndex !== -1) {
				updatedThemes.splice(themeIndex, 1);
			} else {
				updatedThemes.push(themeFilter);
			}
			setThemef(updatedThemes);
		}
	}

	async function readThemeFilter(themef) {
		setInputValue("");
		let theme = encodeURI(themef);
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_filter_data/?theme=${theme}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const fSimple = response.data.filter_data_list;
			const updatedClass_f = await Promise.all(
				fSimple.map(async (s) => {
					const updatedClassf = { ...s };
					try {
						updatedClassf.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedClassf;
				})
			);
			setFliteredata(updatedClass_f);
			ReadGoodCount();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
		setLoading(false);
	}
	function handleSelectKeyword(eventKey) {
		if (eventKey === "mentor") {
			setSearchFilterField("멘토");
		} else {
			setSearchFilterField("제목");
		}
	}
	const onchangeWord = (e) => {
		setInputValue(e.target.value);
	};

	const handleWordSearch = async () => {
		setWord(inputValue);
		setThemef("");
		setSearchClick(true);
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_filter_data/?searchfield=${searchfilterField}&word=${word}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const wordFilter = response.data.filter_data_list;
			const wordFilter_ = await Promise.all(
				wordFilter.map(async (s) => {
					const wordf = { ...s };
					try {
						wordf.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return wordf;
				})
			);
			setFliteredata(wordFilter_);
			setLoading(false);
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	};

	const handleKeyPress = (e) => {
		// 엔터 키를 눌렀을 때 검색 수행
		if (e.key === "Enter" && inputValue.trim() !== "") {
			handleWordSearch();
		}
	};
	useEffect(() => {
		if (themef) {
			readThemeFilter(themef);
		}
	}, [themef, loading]);

	return (
		<div className="read_container">
			<div
				className="search_wrapper"
				style={
					{
						// backgroundColor: "red",
					}
				}
			>
				<div
					className="search_flex_row"
					style={{
						height: 40,
						// backgroundColor: "yellow",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					<DropdownButton
						variant="secondary"
						id="dropdown-basic-button"
						title={searchfilterField}
						onSelect={handleSelectKeyword}
					>
						<Dropdown.Item eventKey="title" className="dropdown_btn">
							제목
						</Dropdown.Item>
						<Dropdown.Item eventKey="mentor" className="dropdown_btn">
							멘토
						</Dropdown.Item>
					</DropdownButton>
					<input
						type="text"
						style={{
							width: 400,
							border: "1px solid gray",
							outline: "none",
							marginLeft: 5,
							height: 36,
							letterSpacing: 3,
							padding: 8,
							borderRadius: 3,
						}}
						spellcheck="false"
						onChange={onchangeWord}
						onKeyPress={handleKeyPress}
						value={inputValue}
					/>
					<button
						onClick={handleWordSearch}
						style={{ border: "none", backgroundColor: "transparent" }}
					>
						<IoIosSearch size={20} />
					</button>
				</div>
				{theme.map((t) => (
					<button
						style={{
							// width: 70,
							border: "none",
							backgroundColor: themef.includes(t) ? "royalblue" : "white",
							color: themef.includes(t) ? "white" : "royalblue",
							margin: 10,
							padding: 6,
							borderRadius: 10,
							fontSize: 13,
						}}
						key={t}
						name={t}
						onClick={(e) => handleSelectTheme(e.target.name)}
					>
						# {t}
					</button>
				))}
			</div>

			{themef.length > 0 || searchClick ? (
				loading ? (
					<div style={{ marginTop: 100 }}>로딩중</div>
				) : fliteredata.length !== 0 ? (
					<>
						<div className="result_cnt">
							검색결과 총 {fliteredata.length}건{" "}
						</div>
						{themef && (
							<div
								style={{
									// padding: 40,
									fontSize: 30,
									display: "flex",
									flexDirection: "row",
								}}
							>
								{themef.map((tf, index) => (
									<div
										key={index}
										className="search_flex_row"
										style={{ margin: 10 }}
									>
										# {tf}
									</div>
								))}
							</div>
						)}

						<FILTER_CLASS
							theme={themef}
							word={word}
							goodClick={goodClick}
							like_status={like_status}
							handleReadDetail={handleReadDetail}
							fliteredata={fliteredata}
							ReadGoodCount={ReadGoodCount}
							readFilter={readThemeFilter}
							readWordFilter={handleWordSearch}
						/>
					</>
				) : (
					<div style={{ marginTop: 100 }}>검색결과가 없습니다. </div>
				)
			) : (
				<div style={{ marginTop: 50 }}>
					<div className="center_label">NEW</div>
					<div className="row_center_wrap">
						<NEW_CLASS
							newdata={newdata}
							readNew={readNew}
							handleReadDetail={handleReadDetail}
							like_status={like_status}
							ReadGoodCount={ReadGoodCount}
							goodClick={goodClick}
							isLoggedIn={isLoggedIn}
							userData={userData}
						/>
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
									isLoggedIn={isLoggedIn}
									userData={userData}
								/>
							) : fliteredata.length > 0 ? (
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
									isLoggedIn={isLoggedIn}
									userData={userData}
								/>
							) : (
								<div>필터링 결과가 없습니다. </div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Allclass;
