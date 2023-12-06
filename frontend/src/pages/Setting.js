import React from "react";
import "../styles/Setting.css";
import { useEffect, useState } from "react";
import { IoMailOutline, IoCut } from "react-icons/io5";
import { IoMdRibbon } from "react-icons/io";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Modal } from "../component/Modal";

import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLink, AiOutlineFilePdf } from "react-icons/ai";

import { BsFillMortarboardFill, BsXCircleFill } from "react-icons/bs";
import LoginRequired from "../common/LoginRequired";
import axios from "axios";

function Setting(props) {
	const { readFirebasefile } = props;
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
	}, []);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setLoginChck(true);
		} else {
			setLoginChck(false);
		}
	});

	useEffect(() => {
		getUserAchiv();
	}, [inputLink, inputFile]);

	const getUserData = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token is not available");
			}

			const response = await axios.post(
				"http://localhost:8000/api/user/get_user_data/",
				{
					token: token,
				}
			);
			const user = response.data.response_data;
			const userImgUpdate = user.updateprofile;
			setInputText({
				email: user.email,
				nickname: user.nickname,
				info: user.info,
			});
			setInputImg(user.profileImg);
			if (userImgUpdate) {
				const url = await readFirebasefile("userImg", userImgUpdate);
				setUpdatedImg(url);
			} else {
				setInputImg(user.profileImg);
			}
		} catch (error) {
			// 예외처리
			if (error.response && error.response.status === 401) {
				console.log("로그인 필요");
			} else {
				console.log("서버 오류가 발생했습니다.", error);
			}
		}
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
						// 에러 처리
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
	const handleFileDelete = (index) => {
		const updatedFiles = [...inputFile];
		updatedFiles.splice(index, 1); // 해당 인덱스의 객체를 제거
		setInputFile(updatedFiles);
	};

	const achiveLinkDelete = async (type, index) => {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				const achivedata = {
					type: type === "link" ? "link" : "file",
					data:
						type === "link"
							? achiveLink[index].achive_link
							: achiveFile[index].achive_file,
				};
				const achive_formdata = new FormData();
				achive_formdata.append("json", JSON.stringify(achivedata));
				const response = await fetch(
					"http://localhost:8000/api/user/delete_user_achive/",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
						},
						body: achive_formdata,
					}
				);
				if (response.ok) {
					alert("삭제되었습니다.");
				} else {
					// 예외처리
					throw new Error("Failed to fetch user data");
				}
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
		getUserAchiv();
	};

	const uploadAchive = (e) => {
		if (e) {
			if (inputFile.length === 0) {
				setInputFile([{ file: e, fileName: e.name }]);
			} else {
				setInputFile([...inputFile, { file: e, fileName: e.name }]); // 입력된 데이터를 부모 페이지의 상태에 추가
			}
		} else {
			alert("취소되었습니다.");
		}
	};

	const handleFilePreview = (file) => {
		const pdfUrl = URL.createObjectURL(file.file);
		window.open(
			pdfUrl,
			"blob",
			"width:1500, height:1000, resizeable, scrollbars, noopener"
		);
		window.URL.revokeObjectURL(pdfUrl);
	};

	const handleLocalFilePreview = (file) => {
		window.open(file, "_blank");
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleInfoSave = async () => {
		setInputCheck(false);
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Token is not available");
			}
			const dataToSend = {
				nickname: inputText.nickname,
				info: inputText.info,
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
			} else {
				// 저장 실패한 경우의 처리
				console.error("Failed to save data");
			}
		} catch (error) {
			// 오류 처리
			console.error("Error while saving data:", error);
		}
		getUserData();
	};
	const handleAchiveSave = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Token is not available");
			}
			const linkArray = Array.isArray(inputLink) ? inputLink : [inputLink];
			const fileArray = Array.isArray(inputFile) ? inputFile : [inputFile];
			const dataToSend = {
				link: linkArray.map((item) => item.link),
				linkName: linkArray.map((item) => item.title),
				fileName: fileArray.map((item) => item.fileName),
			};

			const formdata = new FormData();
			formdata.append("json", JSON.stringify(dataToSend));
			inputFile.forEach((item, index) => {
				formdata.append(`file${index}`, item.file);
			});
			const response = await fetch(
				"http://localhost:8000/api/user/save_user_achive/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formdata,
				}
			);

			if (response.ok) {
				alert("저장하였습니다.");
				setInputFile([]);
				setInputLink([]);
			} else {
				// 저장 실패한 경우의 처리
				console.error("Failed to save data");
			}
		} catch (error) {
			// 오류 처리
			console.error("Error while saving data:", error);
		}
		getUserData();
	};
	const handlechangEdit = () => {
		setInputCheck(true);
	};
	return (
		<div className="setting_wrap">
			{loginChck ? (
				<>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							flexDirection: "row",
							marginBottom: 30,
						}}
					>
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
								{imagepreview !== "" ? (
									<img
										src={imagepreview}
										width="40"
										height="40"
										alt="preview-img"
									/>
								) : updatedImg ? (
									<img
										src={updatedImg}
										width="40"
										height="40"
										alt=""
										// onError={handleImageError}
									/>
								) : (
									<img src={inputImg} width="40" height="40" alt="" />
								)}
							</div>
							{inputCheck && (
								<div
									style={{
										// backgroundColor: "red",
										display: "flex",
										justifyContent: "center",
									}}
								>
									<div
										class="achive-file-selector-button"
										style={{
											textAlign: "center",
											color: "white",
										}}
									>
										<label for="add_image_file">이미지 선택</label>
										<input
											type="file"
											accept="image/*"
											id="add_image_file"
											onChange={(e) => {
												uploadProfile(e.target.files[0]);
											}}
										/>
									</div>
								</div>
							)}
						</div>

						<div style={{ width: "45%", marginLeft: 20 }}>
							<div
								style={{
									width: 500,
									display: "flex",
									flexDirection: "row",
									marginBottom: 20,
									overflow: "hidden",
								}}
							>
								<input
									value={inputText.nickname}
									type="text"
									onChange={(e) =>
										setInputText({ ...inputText, nickname: e.target.value })
									}
									maxlength="8"
									disabled={!inputCheck}
								/>
							</div>
							<div style={{ height: 100 }}>
								<input
									style={{
										width: "100%",
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
							marginTop: 15,
							marginBottom: 15,
							// padding: 10,
						}}
					>
						<div
							style={{
								// backgroundColor: "yellow",

								width: 190,
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
								// backgroundColor: "gray",
								width: "45%",
								alignItems: "center",
								display: "flex",
								marginLeft: 20,
								// marginTop: 15,
								// marginBottom: 15,
							}}
						>
							{inputText.email}
							{/* <input
								value={inputText.email}
								onChange={(e) =>
									setInputText({ ...inputText, email: e.target.value })
								}
								disabled={!inputCheck}
							/> */}
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
							// padding: 10,
						}}
					>
						<div
							style={{
								width: 190,
								height: 35,
								textAlign: "center",
								alignItems: "center",
								justifyContent: "center",
								display: "flex",
								// backgroundColor: "gainsboro",
							}}
						>
							<BsFillMortarboardFill size={30} color="#FFD550" />
						</div>

						<div
							style={{
								width: "45%",
								flexDirection: "column",
								display: "flex",
								marginLeft: 20,
								// backgroundColor: "yellow",
								marginTop: 15,
								marginBottom: 15,
							}}
						>
							{achiveLink.length > 0 ||
							achiveFile.length > 0 ||
							inputLink.length > 0 ||
							inputFile.length > 0 ? (
								<>
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
																	style={{
																		width: 15,
																		height: 20,
																		marginRight: 12,
																	}}
																>
																	<button
																		onClick={() =>
																			achiveLinkDelete("link", index)
																		}
																		style={{
																			backgroundColor: "transparent",
																			border: "none",
																		}}
																	>
																		<IoCut size={17} color="black" />
																	</button>
																	{/* {inputCheck ? (
																		<button
																			onClick={() =>
																				achiveLinkDelete("link", index)
																			}
																		>
																			<IoCut size={17} color="black" />
																		</button>
																	) : (
																		<AiOutlineLink size={17} color="black" />
																	)} */}
																</div>
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
																			fontSize: 14,
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
																	style={{
																		width: 15,
																		height: 20,
																		marginRight: 12,
																	}}
																>
																	<button
																		onClick={() =>
																			achiveLinkDelete("file", index)
																		}
																		style={{
																			backgroundColor: "transparent",
																			border: "none",
																		}}
																	>
																		<IoCut size={17} color="black" />
																	</button>
																	{/* {inputCheck ? (
																		<button
																			onClick={() =>
																				achiveLinkDelete("file", index)
																			}
																		>
																			<IoCut size={17} color="black" />
																		</button>
																	) : (
																		<AiOutlineFilePdf size={16} color="black" />
																	)} */}
																</div>
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
									{(inputLink.length > 0 || inputFile.length > 0) && (
										<div
											className="real_link"
											// style={{ backgroundColor: "yellow" }}
										>
											{inputLink.length > 0 && (
												<>
													{inputLink.map((slink, index) => (
														<div
															style={{
																display: "flex",
																flexDirection: "row",
																width: "90%",
																// backgroundColor: "red",
															}}
														>
															<div
																style={{
																	width: 15,
																	height: 20,
																	marginRight: 12,
																}}
															>
																<button
																	onClick={() => handleLinkDelete(index)}
																	style={{
																		backgroundColor: "transparent",
																		border: "none",
																	}}
																>
																	<IoCut size={17} color="black" />
																</button>
															</div>
															<div
																key={index}
																style={{
																	width: "100%",
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
																	{slink.title}
																</div>
																<a
																	href={slink}
																	target="_blank"
																	style={{
																		color: "#1A1A3A",
																		fontSize: 14,
																		// backgroundColor: "red",
																	}}
																	rel="noopener noreferrer"
																>
																	{slink.link}
																</a>
															</div>
														</div>
													))}
												</>
											)}
											{inputFile.length > 0 && (
												<>
													{inputFile.map((sfile, index) => (
														<div
															style={{
																display: "flex",
																flexDirection: "row",
															}}
														>
															<div
																style={{
																	width: 15,
																	height: 20,
																	marginRight: 12,
																}}
															>
																<button
																	onClick={() => handleFileDelete(index)}
																	style={{
																		backgroundColor: "transparent",
																		border: "none",
																	}}
																>
																	<IoCut size={17} color="black" />
																</button>
															</div>
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
																	onClick={() => handleFilePreview(sfile)}
																>
																	{sfile.fileName}
																</button>
															</div>
														</div>
													))}
												</>
											)}
										</div>
									)}
								</>
							) : (
								<div>등록된 성과물이 없습니다 ! </div>
							)}

							{/* {inputCheck && ( */}
							<div
								style={{
									alignItems: "center",
									marginTop: 10,
									display: "flex",
									flexDirection: "row",
								}}
							>
								<button
									className="achive-file-selector-button"
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "center",
									}}
									onClick={openModal}
								>
									<div
										style={{
											justifyContent: "center",
											alignItems: "center",
											display: "flex",
											// height: 25,
											marginRight: 3,
										}}
									>
										<AiOutlineLink size={17} color="white" />
									</div>
									<div style={{ textAlign: "center" }}>링크 업로드</div>
								</button>
								<Modal
									isOpen={isModalOpen}
									onClose={closeModal}
									onSave={handleLinkSave}
								/>
								<div
									class="achive-file-selector-button"
									style={{
										marginLeft: 10,
										textAlign: "center",
										display: "flex",
										justifyContent: "center",
										color: "white",
									}}
								>
									<label for="add_file">파일 업로드</label>
									<input
										type="file"
										accept=".pdf"
										id="add_file"
										onChange={(e) => {
											uploadAchive(e.target.files[0]);
										}}
									/>
								</div>
								<button class="achive-file-save-btn" onClick={handleAchiveSave}>
									등록하기
								</button>
							</div>
							{/* )} */}
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
								onClick={handleInfoSave}
							>
								저장
							</button>
						)}
					</div>
				</>
			) : (
				<LoginRequired />
			)}
		</div>
	);
}

export default Setting;
