import React, { useEffect, useInsertionEffect, useState } from "react";
import "../styles/Myclass.css";
import LoginRequired from "../common/LoginRequired";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StopOutlined } from "@ant-design/icons";
import ClassCard from "../component/classCard";

function Myclass(props) {
	const { userData, readFirebasefile } = props;

	const [filter, setFilter] = useState("");
	const [myActivityFilter, setMyAcivityFilter] = useState([]);
	const [applyActivityFilter, setApplyAcivityFilter] = useState([]);

	const [my_delete_ok, setMyDelteOk] = useState([]);
	const [apply_cancle_ok, setApplyCancleOk] = useState([]);
	const [userNickname, setUserNickname] = useState("");

	const [achiveLink, setAchiveLink] = useState([]);
	const [achiveFile, setAchiveFile] = useState([]);

	const [userImg, setUserImg] = useState("");
	const [updatedImg, setUpdatedImg] = useState("");

	const [userEmail, setUserEmail] = useState("");
	const [userInfo, setUserInfo] = useState("");

	const [myclass, setMyClass] = useState([]);
	const [applyClass, setApplyClass] = useState([]);

	const [selectwhat, setSelectWhat] = useState("myclass");

	const [loding, setLoding] = useState(false);
	const handleLocalFilePreview = (file) => {
		window.open(file, "_blank");
	};

	const getUserAchiv = async () => {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				const response = await axios.post(
					"http://localhost:8000/api/user/get_user_achive/",
					{
						token: token,
					}
				);
				const achive = response.data.achive_list;
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
		} catch (error) {
			// 예외처리
			console.error(error);
		}
	};

	useEffect(() => {
		readMyClass();
		getUserAchiv();
		getUserData();
	}, []);

	async function readMyClass() {
		const jwt_token = localStorage.getItem("token");
		setLoding(true);

		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_my_data/?filter=${filter}&selectwhat=${selectwhat}`,
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			const classMy = response.data.my_data_list;
			const myApply = response.data.my_apply_list;
			const my_activity_filter = response.data.my_activity_filter;
			const apply_activity_filter = response.data.apply_activity_filter;
			const my_delete_ok = response.data.my_delete_ok;
			const apply_cancle_ok = response.data.apply_cancle_ok;
			if (classMy && classMy.length > 0) {
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
			} else {
				setMyClass([]);
			}
			if (myApply && myApply.length > 0) {
				const updatedClass_A = await Promise.all(
					myApply.map(async (s) => {
						const classA = { ...s };
						try {
							classA.img = await readFirebasefile("classFile", s.img);
						} catch (error) {
							console.error("Error getting file URL: ", error);
						}
						return classA;
					})
				);
				setApplyClass(updatedClass_A);
				// ReadGoodCount();
			} else {
				setApplyClass([]);
			}
			if (my_activity_filter && my_activity_filter.length > 0) {
				console.log(" 필터링 결과 있음 내 클래스");
				const updatedClass_A = await Promise.all(
					my_activity_filter.map(async (s) => {
						const classA = { ...s };
						try {
							classA.img = await readFirebasefile("classFile", s.img);
						} catch (error) {
							console.error("Error getting file URL: ", error);
						}
						return classA;
					})
				);
				setMyAcivityFilter(updatedClass_A);
				// ReadGoodCount();
			} else {
				setMyAcivityFilter([]);
			}
			if (apply_activity_filter && apply_activity_filter.length > 0) {
				const updatedClass_A = await Promise.all(
					apply_activity_filter.map(async (s) => {
						const classA = { ...s };
						try {
							classA.img = await readFirebasefile("classFile", s.img);
						} catch (error) {
							console.error("Error getting file URL: ", error);
						}
						return classA;
					})
				);
				setApplyAcivityFilter(updatedClass_A);
				// ReadGoodCount();
			} else {
				setApplyAcivityFilter([]);
			}
			if (my_delete_ok && my_delete_ok.length > 0) {
				const updatedClass_A = await Promise.all(
					my_delete_ok.map(async (s) => {
						const classA = { ...s };
						try {
							classA.img = await readFirebasefile("classFile", s.img);
						} catch (error) {
							console.error("Error getting file URL: ", error);
						}
						return classA;
					})
				);
				setMyDelteOk(updatedClass_A);
				// ReadGoodCount();
			} else {
				setMyDelteOk([]);
			}
			if (apply_cancle_ok && apply_cancle_ok.length > 0) {
				const updatedClass_A = await Promise.all(
					apply_cancle_ok.map(async (s) => {
						const classA = { ...s };
						try {
							classA.img = await readFirebasefile("classFile", s.img);
						} catch (error) {
							console.error("Error getting file URL: ", error);
						}
						return classA;
					})
				);
				setApplyCancleOk(updatedClass_A);
				// ReadGoodCount();
			} else {
				setApplyCancleOk([]);
			}
			setLoding(false);
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	const handleMyclassFilter = (f) => {
		if (filter === f) {
			setFilter("");
		} else {
			setFilter(f);
		}
	};
	useEffect(() => {
		readMyClass();
	}, [filter, selectwhat]);

	const getUserData = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"http://localhost:8000/api/user/get_user_data/",
				{
					token: token,
				}
			);
			const user = response.data.response_data;
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
								flexDirection: "column",
							}}
						>
							<div className="user_img">
								{updatedImg ? (
									<img
										width="40"
										height="40"
										src={updatedImg}
										alt="user-male-circle--v1"
									/>
								) : (
									<img
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
									<div style={{ marginTop: 10 }}>
										{achiveLink.length !== 0 && (
											<>
												{achiveLink.map((a, index) => (
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
									</div>
								)}
							</div>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							width: "80%",
							margin: 20,
						}}
					>
						<button
							style={{
								backgroundColor: "transparent",
								height: 30,
								marginRight: 10,
								border: "none",
								borderBottom:
									selectwhat === "myclass" ? "1px solid blue" : "none",
								color: selectwhat === "myclass" ? "royalblue" : "gray",
							}}
							name="myclass"
							onClick={(e) => setSelectWhat(e.target.name)}
						>
							내가 만든 클래스
						</button>
						<button
							style={{
								backgroundColor: "transparent",
								border: "none",
								height: 30,
								borderBottom:
									selectwhat === "applyclass" ? "1px solid blue" : "none",
								color: selectwhat === "applyclass" ? "royalblue" : "gray",
							}}
							name="applyclass"
							onClick={(e) => setSelectWhat(e.target.name)}
						>
							수강하는 클래스
						</button>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							width: "88%",
						}}
					>
						<button
							style={{
								border: "none",
								backgroundColor: "transparent",
								margin: 3,
								fontSize: 14,
								color: filter === "before" ? "royalblue" : "gray",
							}}
							onClick={() => handleMyclassFilter("before")}
						>
							활동 전
						</button>
						<button
							style={{
								border: "none",
								backgroundColor: "transparent",
								margin: 3,
								fontSize: 14,
								color: filter === "ing" ? "royalblue" : "gray",
							}}
							onClick={() => handleMyclassFilter("ing")}
						>
							활동 중
						</button>
						<button
							style={{
								border: "none",
								backgroundColor: "transparent",
								margin: 3,
								fontSize: 14,
								color: filter === "finish" ? "royalblue" : "gray",
							}}
							onClick={() => handleMyclassFilter("finish")}
						>
							활동 완료
						</button>
					</div>
					{selectwhat === "myclass" ? (
						<>
							{loding ? (
								<div style={{ marginTop: 100, marginBottom: 80 }}>
									<div class="loading">
										<span>L</span>
										<span>O</span>
										<span>A</span>
										<span>D</span>
										<span>I</span>
										<span>N</span>
										<span>G</span>
									</div>
								</div>
							) : myclass.length > 0 ? (
								<div
									style={{
										justifyContent: "center",
										width: "100%",
										display: "flex",
										flexDirection: "row",
										flexWrap: "wrap",
										overflowX: "auto",
									}}
								>
									{filter === "" && (
										<ClassCard
											classDiv={myclass}
											readFirebasefile={readFirebasefile}
											userData={userData}
											delete_or_cancle={my_delete_ok}
											readMyClass={readMyClass}
											mypage={true}
											status="삭제"
										/>
									)}
									{(filter === "before" ||
										filter === "ing" ||
										filter === "finish") &&
									myActivityFilter.length > 0 ? (
										<ClassCard
											classDiv={myActivityFilter}
											readFirebasefile={readFirebasefile}
											userData={userData}
											delete_or_cancle={my_delete_ok}
											mypage={true}
											readMyClass={readMyClass}
											status="삭제"
										/>
									) : (
										(filter === "before" ||
											filter === "ing" ||
											filter === "finish") &&
										myActivityFilter.length === 0 && (
											<div
												style={{
													width: "100%",
													height: 200,
													padding: 10,
													textAlign: "center",
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
												}}
											>
												<div style={{ color: "gray", margin: 10 }}>
													<StopOutlined />
												</div>
												<div style={{ color: "#d3d3d3" }}>No Data </div>
											</div>
										)
									)}
								</div>
							) : (
								myclass.length === 0 && (
									<div
										style={{
											width: "100%",
											height: 200,
											padding: 10,
											textAlign: "center",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
										}}
									>
										<div style={{ color: "gray", margin: 10 }}>
											<StopOutlined />
										</div>
										<div style={{ color: "#d3d3d3" }}>No Data </div>
									</div>
								)
							)}
						</>
					) : (
						selectwhat === "applyclass" && (
							<>
								{loding ? (
									<div style={{ marginTop: 100, marginBottom: 80 }}>
										<div class="loading">
											<span>L</span>
											<span>O</span>
											<span>A</span>
											<span>D</span>
											<span>I</span>
											<span>N</span>
											<span>G</span>
										</div>
									</div>
								) : applyClass.length > 0 ? (
									<div
										style={{
											justifyContent: "center",
											width: "100%",
											display: "flex",
											flexDirection: "row",
											flexWrap: "wrap",
											overflowX: "auto",
										}}
									>
										{filter === "" && (
											<ClassCard
												classDiv={applyClass}
												readFirebasefile={readFirebasefile}
												userData={userData}
												readMyClass={readMyClass}
												delete_or_cancle={apply_cancle_ok}
												mypage={true}
												status="수강 취소"
											/>
										)}
										{(filter === "before" ||
											filter === "ing" ||
											filter === "finish") &&
										applyActivityFilter.length > 0 ? (
											<ClassCard
												classDiv={applyActivityFilter}
												readFirebasefile={readFirebasefile}
												userData={userData}
												readMyClass={readMyClass}
												delete_or_cancle={apply_cancle_ok}
												mypage={true}
												status="수강 취소"
											/>
										) : (
											(filter === "before" ||
												filter === "ing" ||
												filter === "finish") &&
											applyActivityFilter.length === 0 && (
												<div
													style={{
														width: "100%",
														height: 200,
														padding: 10,
														textAlign: "center",
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
													}}
												>
													<div style={{ color: "gray", margin: 10 }}>
														<StopOutlined />
													</div>
													<div style={{ color: "#d3d3d3" }}>No Data </div>
												</div>
											)
										)}
									</div>
								) : (
									applyClass.length === 0 && (
										<div
											style={{
												width: "100%",
												height: 200,
												padding: 10,
												textAlign: "center",
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}
										>
											<div style={{ color: "gray", margin: 10 }}>
												<StopOutlined />
											</div>
											<div style={{ color: "#d3d3d3" }}>No Data </div>
										</div>
									)
								)}
							</>
						)
					)}
				</>
			) : (
				<LoginRequired />
			)}
		</div>
	);
}
export default Myclass;
