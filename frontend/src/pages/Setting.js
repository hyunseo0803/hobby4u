import React from "react";
import "../styles/Setting.css";
import { useEffect, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { IoMdRibbon } from "react-icons/io";

import { Modal } from "../component/Modal";

import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";

import { BsFillMortarboardFill, BsXCircleFill } from "react-icons/bs";

function Setting(props) {
	const navigate = useNavigate();
	const [loginChck, setLoginChck] = useState(false);
	const [achiveLink, setAchiveLink] = useState([]);
	const [achiveFile, setAchiveFile] = useState([]);

	const [inputLink, setInputLink] = useState([]);
	const [inputFile, setInputFile] = useState([]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [inputText, setInputText] = useState({
		email: "",
		info: "",
		nickname: "",
	});

	const [inputImg, setInputImg] = useState("");
	const [updatedImg, setUpdatedImg] = useState("");

	const [inputCheck, setInputCheck] = useState(false);

	const [imagepreview, setImagepreview] = useState("");

	const uploadProfile = (e) => {
		const file = e;

		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				setUpdatedImg(file);
				setImagepreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		getUserData();
		// getUserAchiv();
	}, []);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setLoginChck(true);
		} else {
			setLoginChck(false);
		}
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
				const userImgUpdate = user.updateprofile;
				setInputText({
					email: user.email,
					// img: user.profileImg,
					nickname: user.nickname,
					info: user.info,
				});
				setInputImg(user.profileImg);
				// setUpdatedImg(user.updateprofile);
				if (userImgUpdate) {
					setUpdatedImg(userImgUpdate.replace("/frontend/public/", "/"));
				} else {
					setInputImg(user.profileImg);
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
	const getUserAchiv = async () => {
		try {
			const token = localStorage.getItem("token");

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
				setAchiveFile(achive.file);
				setAchiveLink(achive.link);
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};

	const handleLinkSave = (link) => {
		if (inputLink.length === 0) {
			setInputLink([link]);
		} else {
			setInputLink([...inputLink, link]); // 입력된 데이터를 부모 페이지의 상태에 추가
		}
	};

	const handleLinkDelete = (index) => {
		const updatedLinks = [...inputLink];
		updatedLinks.splice(index, 1); // 해당 인덱스의 객체를 제거
		setInputLink(updatedLinks);
	};

	const uploadAchive = (e) => {
		const file = e;

		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				setUpdatedImg(file);
				setImagepreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// const replace = (content) => {
	// 	const convertContent = content.replace(urlRegex, function (url) {
	// 	  return '<a href="' + url + '" target="_blank">' + url + '</a>';
	// 	})
	//   }

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleSave = async () => {
		console.log("------------------------" + updatedImg);

		setInputCheck(false);
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Token is not available");
			}
			const dataToSend = {
				nickname: inputText.nickname,
				info: inputText.info,
				email: inputText.email,
			};

			const formdata = new FormData();
			formdata.append("json", JSON.stringify(dataToSend));
			formdata.append("img", inputImg);
			if (updatedImg) {
				formdata.append("updatedimg", updatedImg);
			}

			const response = await fetch(
				"http://localhost:8000/api/user/save_user_info/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formdata,
				}
			);

			if (response.ok) {
				console.log("Data successfully saved!");
				// 성공적으로 저장된 경우의 처리
			} else {
				// 저장 실패한 경우의 처리
				console.error("Failed to save data");
			}
		} catch (error) {
			// 오류 처리
			console.error("Error while saving data:", error);
		}
		getUserData();
		navigate("/myclass");
	};
	const handlechangEdit = () => {
		console.log(updatedImg);

		setInputCheck(true);
	};

	return (
		<div className="setting_wrap">
			{loginChck ? (
				<>
					<div
						style={{
							justifyContent: "center",
							// textAlign: "center",
							display: "flex",
							flexDirection: "row",
							marginBottom: 30,
							// width: "50%",
							// backgroundColor: "red",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								textAlign: "center",
								// backgroundColor: "blue",
								marginRight: 20,
								flexDirection: "column",
								// position: "relative",
							}}
						>
							<div className="user_img">
								{imagepreview !== "" ? (
									<img
										src={imagepreview}
										// style={{
										// 	objectFit: "contain",
										// }}
										width="40"
										height="40"
										alt="preview-img"
									/>
								) : updatedImg ? (
									<img src={updatedImg} width="40" height="40" alt="" />
								) : (
									<img src={inputImg} width="40" height="40" alt="" />
								)}
							</div>
							{inputCheck && (
								<>
									<label htmlFor="setting_file">
										<div className="file-selector-button" width={100}>
											<p
												style={{
													textAlign: "center",
													padding: 3,
												}}
											>
												이미지 수정
											</p>
										</div>
									</label>
									<input
										// className="profileimg"
										id="setting_file"
										accept="image/*"
										type="file"
										onChange={(e) => {
											uploadProfile(e.target.files[0]);
										}}
									/>
								</>
							)}
							{/* </div> */}
						</div>

						<div>
							<div style={{ display: "flex", flexDirection: "row" }}>
								<input
									// className="user_nickname"
									value={inputText.nickname}
									onChange={(e) =>
										setInputText({ ...inputText, nickname: e.target.value })
									}
									disabled={!inputCheck}
								/>
							</div>
							<div style={{ width: "80vh", height: 100 }}>
								<input
									// className="user_nickname"
									style={{
										width: "90%",
									}}
									value={inputText.info}
									onChange={(e) =>
										setInputText({ ...inputText, info: e.target.value })
									}
									disabled={!inputCheck}
								/>
							</div>
						</div>
					</div>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							textAlign: "center",
							borderTop: "1px solid gray",
							width: 1000,
							marginTop: 20,
							margin: "auto",
							opacity: 0.5,
						}}
					></div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							// backgroundColor: "yellow",
							padding: 10,
							// position: "relative",
						}}
					>
						<div
							style={{
								width: 196,
								// backgroundColor: "red",
								height: 35,
								textAlign: "center",
								alignItems: "center",
								justifyContent: "center",
								display: "flex",
							}}
						>
							<IoMailOutline size={28} />
						</div>
						<div
							style={{
								width: "80vh",
								// backgroundColor: "blue",
								alignItems: "center",
								display: "flex",
								marginLeft: 20,
								// padding: 5,
							}}
						>
							<input
								// className="user_nickname"
								value={inputText.email}
								onChange={(e) =>
									setInputText({ ...inputText, email: e.target.value })
								}
								disabled={!inputCheck}
							/>
						</div>
					</div>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							textAlign: "center",
							borderTop: "1px solid gray",
							width: 1000,
							marginTop: 20,
							margin: "auto",
							opacity: 0.5,
						}}
					></div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							// backgroundColor: "red",
							padding: 10,
							// position: "relative",
						}}
					>
						<div
							style={{
								width: 196,
								height: 35,
								textAlign: "center",
								alignItems: "center",
								justifyContent: "center",
								display: "flex",
								// margin: "auto",
							}}
						>
							<BsFillMortarboardFill size={30} color="#FFD550" />
						</div>

						<div
							style={{
								width: "80vh",
								// backgroundColor: "blue",
								// alignItems: "center",
								flexDirection: "column",
								display: "flex",
								marginLeft: 20,
								// padding: 5,
							}}
						>
							{achiveLink.length > 0 ||
							achiveFile.length > 0 ||
							inputLink.length > 0 ||
							inputFile.length > 0 ? (
								<>
									<div>
										{achiveLink.length !== 0 &&
											achiveLink.map((a, index) => <div key={index}>{a}</div>)}
										{achiveFile.length !== 0 &&
											achiveFile.map((a, index) => <div key={index}>{a}</div>)}
									</div>
									{inputLink.length > 0 && (
										<div className="real_link">
											{inputLink.map((slink, index) => (
												<div
													style={{
														display: "flex",
														// height: 20,
														flexDirection: "row",
														// alignItems: "center",
													}}
												>
													<div
														style={{ width: 15, height: 20, marginRight: 12 }}
													>
														<AiOutlineLink size={15} color="black" />
													</div>
													<div
														key={index}
														style={{
															width: "100%",
															marginBottom: 10,
															wordBreak: "break-all",
														}}
													>
														<div
															style={{
																width: "100%",
																display: "flex",
																flexDirection: "row",
																alignItems: "center",
																height: 30,

																// justifyContent: "space-between",
															}}
														>
															<div style={{ fontSize: 16, marginRight: 10 }}>
																{slink.title}
															</div>

															<button
																style={{
																	width: 30,
																	height: 30,
																	justifyContent: "center",
																	display: "flex",
																	alignItems: "center",
																	border: "none",
																	backgroundColor: "transparent",
																}}
																onClick={() => handleLinkDelete(index)}
															>
																<BsXCircleFill size={16} color="red" />
															</button>
														</div>
														<a
															href={slink}
															target="_blank"
															style={{ color: "#1A1A3A", fontSize: 14 }}
															rel="noopener noreferrer"
														>
															{slink.link}
														</a>
													</div>
												</div>
											))}
										</div>
									)}
								</>
							) : (
								<div>등록된 성과물이 없습니다 ! </div>
							)}

							{inputCheck && (
								<div
									style={{
										alignItems: "center",
										marginTop: 20,
										display: "flex",
										flexDirection: "row",
										// backgroundColor: "red",
									}}
								>
									<button
										className="achive-file-selector-button"
										style={{ display: "flex", flexDirection: "row" }}
										onClick={openModal}
									>
										<div
											style={{
												// backgroundColor: "red",
												justifyContent: "center",
												alignItems: "center",
												display: "flex",
												height: 25,
												marginRight: 3,
											}}
										>
											<AiOutlineLink size={20} color="white" />
										</div>
										<div style={{ height: 25 }}>링크 업로드</div>
									</button>
									<Modal
										isOpen={isModalOpen}
										onClose={closeModal}
										onSave={handleLinkSave}
									/>
									<label htmlFor="setting_file">
										<div
											className="achive-file-selector-button"
											style={{ marginLeft: 10 }}
											width={100}
										>
											<p
												style={{
													textAlign: "center",
													padding: 3,
													color: "white",
												}}
											>
												파일 선택
											</p>
										</div>
									</label>
									<input
										// className="profileimg"
										id="setting_file"
										accept="image/*"
										type="file"
										onChange={(e) => {
											uploadAchive(e.target.files[0]);
										}}
									/>
								</div>
							)}
						</div>
					</div>

					<div
						style={{
							justifyContent: "center",
							display: "flex",
							alignItems: "center",
							textAlign: "center",
							borderTop: "1px solid gray",
							width: 1000,
							marginTop: 20,
							margin: "auto",
							opacity: 0.5,
						}}
					></div>
					<div
						style={{
							margin: 100,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						{inputCheck !== true ? (
							<button
								style={{
									border: "1px solid #F26B6B",
									color: "#F26B6B",
									backgroundColor: "transparent",
									width: 120,
									padding: 5,
									marginBottom: 20,
									textAlign: "center",
									borderRadius: 8,
								}}
								onClick={handlechangEdit}
							>
								정보 수정
							</button>
						) : (
							<button
								style={{
									border: "1px solid #F26B6B",
									color: "#F26B6B",
									backgroundColor: "transparent",
									width: 120,
									padding: 5,
									marginBottom: 20,
									textAlign: "center",
									borderRadius: 8,
								}}
								onClick={handleSave}
							>
								저장
							</button>
						)}
						<div
							style={{
								backgroundColor: "#F26B6B",
								color: "white",
								// margin: 50,
								width: 120,
								padding: 5,
								textAlign: "center",
								borderRadius: 8,
							}}
						>
							회원탈퇴
						</div>
					</div>
				</>
			) : (
				<div>로그인 필요함</div>
			)}
		</div>
	);
}

export default Setting;
