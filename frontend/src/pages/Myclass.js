import React, { useEffect, useInsertionEffect, useState } from "react";
import "../styles/Myclass.css";
import bad_review from "../assets/bad_review.png";
import good_review from "../assets/good_review.png";
import LoginRequired from "../common/LoginRequired";
import ReadClassOptionLB from "../component/AllReadOptionLB";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function Myclass(props) {
	const { userData, readFirebasefile } = props;

	const navigate = useNavigate();
	const [userNickname, setUserNickname] = useState("");

	const [achiveLink, setAchiveLink] = useState([]);
	const [achiveFile, setAchiveFile] = useState([]);

	const [userImg, setUserImg] = useState("");
	const [updatedImg, setUpdatedImg] = useState("");

	const [userEmail, setUserEmail] = useState("");
	const [userInfo, setUserInfo] = useState("");

	const [good, setGoodReview] = useState(false);
	const [bad, setBadReview] = useState(false);
	const [like_status, setLikeStatus] = useState([]);

	const [myclass, setMyClass] = useState([]);

	const handleLocalFilePreview = (file) => {
		window.open(file, "_blank");
	};
	const getUserAchiv = async () => {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				if (!token) {
					throw new Error("Token is not available");
				}

				const response = await fetch(
					"http://localhost:8000/api/user/get_user_achive/",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
						},
					}
				);
				if (response.ok) {
					const achive = await response.json();
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
				} else {
					// 예외처리
					throw new Error("Failed to fetch user data");
				}
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};

	useEffect(() => {
		readMyClass();
		getUserAchiv();
	}, []);

	async function readMyClass() {
		const jwt_token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				"http://localhost:8000/api/post/read_my_data/",
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			const classMy = response.data.my_data_list;
			const updatedClass_M = await Promise.all(
				classMy.map(async (s) => {
					const classM = { ...s };
					try {
						classM.img = await readFirebasefile("classFile", s.img);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return classM;
				})
			);
			setMyClass(updatedClass_M);
			ReadGoodCount();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	function ReadGoodCount() {
		if (userData) {
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

	useEffect(() => {
		if (good) {
			setBadReview(false);
		} else if (bad) {
			setGoodReview(false);
		}
	}, [good, bad]);

	function GoodreviewEvent() {
		setGoodReview(!good);
		setBadReview(false);
	}

	function BadReviewEvent() {
		setBadReview(!bad);
		setGoodReview(false);
	}

	useEffect(() => {
		getUserData();
	});

	const getUserData = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token is not available");
			}

			const response = await fetch(
				"http://localhost:8000/api/user/get_user_data/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
					},
				}
			);
			if (response.ok) {
				const user = await response.json();
				const nickname = user.nickname;
				const userImg = user.profileImg;
				const userImgUpdate = user.updateprofile;
				const userEmail = user.email;
				const userInfo = user.info;
				setUserNickname(nickname);
				setUserImg(userImg);
				setUserInfo(userInfo);
				setUserEmail(userEmail);
				if (userImgUpdate) {
					const url = await readFirebasefile("userImg", userImgUpdate);
					setUpdatedImg(url);
				} else {
					setUserImg(userImg);
				}
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			if (error.response && error.response.status === 401) {
				// 만료된 토큰 에러 메시지를 저장
				console.log("로그인 필요");
			} else {
				// 다른 에러 메시지를 저장
				console.log("서버 오류가 발생했습니다.");
			}
		}
	};
	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

	return (
		<div className="wrap">
			{userNickname ? (
				<>
					<div className="user_info_box">
						<div
							style={{
								width: 190,
								display: "flex",
								justifyContent: "center",
								textAlign: "center",
								alignItems: "center",
								// marginRight: 20,
								flexDirection: "column",
								// padding: "
								// backgroundColor: "red",
							}}
						>
							<div className="user_img">
								{updatedImg ? (
									<img
										// style={{ borderRadius: "50%", overflow: "hidden" }}
										width="40"
										height="40"
										src={updatedImg}
										alt="user-male-circle--v1"
									/>
								) : (
									<img
										// style={{ borderRadius: 40 }}
										width="40"
										height="40"
										src={userImg}
										alt="user-male-circle--v1"
									/>
								)}
							</div>
						</div>
						<div className="user_info">
							<div className="user_nickname">{userNickname}</div>
							<div className="user_info_text">{userInfo}</div>
							<div className="user_email">{userEmail}</div>
							<div>
								{(achiveLink.length !== 0 || achiveFile.length !== 0) && (
									<>
										{achiveLink.length !== 0 && (
											<>
												{achiveLink.map((a, index) => (
													<div
														key={index}
														style={{
															display: "flex",
															flexDirection: "row",
															// width: "90%",
															// backgroundColor: "red",
														}}
													>
														<div
															key={index}
															style={{
																// width: "100%",
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
																	// backgroundColor: "red",
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
																onClick={() =>
																	handleLocalFilePreview(a.achive_file)
																}
															>
																{a.achive_filename}
															</button>
														</div>
													</div>
												))}
											</>
										)}
									</>
								)}
							</div>
						</div>
					</div>
					<div className="review_wrapper">
						<button
							className={bad ? "review_unclick" : "review"}
							onClick={GoodreviewEvent}
						>
							<img width={40} src={good_review} alt="" />{" "}
							<text>Good_Review</text>
						</button>
						<button
							className={good ? "review_unclick" : "review"}
							onClick={BadReviewEvent}
						>
							<img width={40} src={bad_review} alt="" />
							<text>Bad_Review</text>
						</button>
					</div>
					<div
						style={{
							// backgroundColor: "red",
							justifyContent: "center",
							width: "100%",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						{myclass.map((classItem, index) => {
							// const firstimg = classItem.img.replace("/frontend/public/", "/");

							const handleImageClick = (e) => {
								e.stopPropagation();
								handleReadDetail(classItem.class_id);
							};

							const handleButtonClick = () => {
								handleReadDetail(classItem.class_id);
							};
							const isFree = classItem.money === "0";
							const isOnline = classItem.type === "online";

							const likeStatusItem = like_status
								? like_status.find(
										(item) => item.class_id === classItem.class_id
								  )
								: null;

							return (
								<div key={index} className="class_div_btn">
									<div className="firstimg_container">
										{isImage(classItem.img) ? (
											<img
												className="firstimg"
												src={classItem.img}
												alt="gg"
												onClick={handleImageClick}
											/>
										) : (
											<video
												className="firstimg"
												src={classItem.img}
												alt="gg"
												onClick={handleImageClick}
												controls
											/>
										)}
									</div>
									<div
										className="class_div_MO"
										style={{
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
										<div className="class_GCount">
											<div className="like">좋아요</div>
											<div className="like_text">{classItem.goodCount}</div>
										</div>
									</div>
									<button
										value={classItem.class_id}
										onClick={handleButtonClick}
										className="class_title_btn"
									>
										{classItem.title}
									</button>
								</div>
							);
						})}
					</div>
				</>
			) : (
				<LoginRequired />
			)}
		</div>
	);
}
export default Myclass;
