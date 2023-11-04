import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "../styles/SearchClass.css";
import quiet from "../assets/quiet.png";
import sports from "../assets/Sports.png";
import trip from "../assets/Trip.png";
import healing from "../assets/Healing.png";
import activity from "../assets/Activity.png";
import alon from "../assets/Alon.png";
import simple from "../assets/Simple.png";
import music from "../assets/Music.png";
import craft from "../assets/Craft.png";
import skill from "../assets/Skill.png";
import beauty from "../assets/Beauty.png";
import cultureArt from "../assets/Culture_arts.png";
import FILTER_CLASS from "./ReadClass/FilterClass";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

function SearchClass() {
	const [searchfilterField, setSearchFilterField] = useState("제목");
	const [inputValue, setInputValue] = useState("");

	const [word, setWord] = useState("");
	const [searchClick, setSearchClick] = useState(false);

	const [themefKO, setThemefKO] = useState("");
	const [themef, setThemef] = useState("");
	const [loading, setLoading] = useState(true);

	const [like_status, setLikeStatus] = useState([]);
	const [fliteredata, setFliteredata] = useState([]);

	const navigate = useNavigate();
	const theme = {
		"# 조용한": quiet,
		"# 스포츠": sports,
		"# 여행": trip,
		"# 힐링": healing,
		"# 액티비티": activity,
		"# 혼자": alon,
		"# 간단한": simple,
		"# 음악": music,
		"# 공예": craft,
		"# 기술": skill,
		"# 뷰티": beauty,
		"# 문화예술": cultureArt,
	};
	const themeArray = Object.entries(theme);

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

	const handleWordSearch = () => {
		setWord(inputValue);
		setSearchClick(true);
		axios
			.get(
				`http://localhost:8000/api/post/read_filter_data/?searchfield=${searchfilterField}&word=${word}`
			)
			.then((response) => {
				setFliteredata(response.data.filter_data_list);
				console.log(response.data.filter_data_list);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
				setLoading(false);
			});
	};

	function handleSelectTheme(themeFilter) {
		setThemefKO(themeFilter);
		let newTheme = "";
		if (themeFilter === "# 조용한") {
			newTheme = "quiet"; //
		} else if (themeFilter === "# 스포츠") {
			newTheme = "sports";
		} else if (themeFilter === "# 여행") {
			newTheme = "trip";
		} else if (themeFilter === "# 힐링") {
			newTheme = "healing";
		} else if (themeFilter === "# 액티비티") {
			newTheme = "activity";
		} else if (themeFilter === "# 혼자") {
			newTheme = "alon";
		} else if (themeFilter === "# 간단한") {
			newTheme = "simple";
		} else if (themeFilter === "# 음악") {
			newTheme = "music";
		} else if (themeFilter === "# 공예") {
			newTheme = "craft";
		} else if (themeFilter === "# 기술") {
			newTheme = "skill";
		} else if (themeFilter === "# 뷰티") {
			newTheme = "beauty";
		} else if (themeFilter === "# 문화예술") {
			newTheme = "cultureArt";
		}
		if (newTheme) {
			setThemef(newTheme);
		}
	}

	async function goodClick(classId) {
		const token = localStorage.getItem("token");
		const classidData = { classId: classId, token: token };

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
			if (themef) {
				readThemeFilter(themef);
			}
			if (word) {
				readWordFilter(word);
			}
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}
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
				})
				.catch((error) => {
					console.error("Error submitting data:", error);
				});
		}
	}
	function readThemeFilter(theme) {
		setLoading(true);
		console.log("Reading theme filter...", theme);
		axios
			.get(`http://localhost:8000/api/post/read_filter_data/?theme=${theme}`)
			.then((response) => {
				setFliteredata(response.data.filter_data_list);
				console.log(response.data.filter_data_list);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
		setLoading(false);
	}

	function readWordFilter(word) {
		setLoading(true);
		console.log("Reading word filter...", word);
		axios
			.get(
				`http://localhost:8000/api/post/read_filter_data/?searchfield=${searchfilterField}&word=${word}`
			)
			.then((response) => {
				setFliteredata(response.data.filter_data_list);
				console.log(response.data.filter_data_list);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
		setLoading(false);
	}

	const handleKeyPress = (e) => {
		// 엔터 키를 눌렀을 때 검색 수행
		if (e.key === "Enter" && inputValue.trim() !== "") {
			handleWordSearch();
		}
	};

	useEffect(() => {
		if (themef) {
			axios
				.get(`http://localhost:8000/api/post/read_filter_data/?theme=${themef}`)
				.then((response) => {
					setFliteredata(response.data.filter_data_list);
					console.log(response.data.filter_data_list.length);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error submitting data:", error);
					setLoading(false);
				});
		}
	}, [themef, loading]);

	return (
		<div className="search_wrapper">
			{((!themef && searchClick) || (!themef && !searchClick)) && (
				<div className="search_flex_row" style={{ height: 40, marginTop: 100 }}>
					<DropdownButton
						// className="dropdown_btn"
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
			)}
			{themef || searchClick ? (
				loading ? (
					<div style={{ marginTop: 100 }}>로딩중</div>
				) : fliteredata.length !== 0 ? (
					<>
						{searchClick ? (
							<div className="result_cnt">
								검색결과 총 {fliteredata.length}건{" "}
							</div>
						) : (
							<div
								className="search_flex_row"
								style={{
									padding: 40,
									fontSize: 40,
								}}
							>
								{themefKO}
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
							readWordFilter={readWordFilter}
						/>
					</>
				) : (
					<div style={{ marginTop: 100 }}>검색결과가 없습니다. </div>
				)
			) : (
				<div
					className="search_flex_row"
					style={{ flexWrap: "wrap", marginTop: 80 }}
				>
					{theme.map((t, index) => (
						<button
							key={t}
							name={t}
							onClick={(e) => handleSelectTheme(e.target.name)}
						>
							{t}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default SearchClass;
