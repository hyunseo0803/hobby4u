import React from "react";
import "../styles/Setting.css";
import { useEffect, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { IoMdRibbon } from "react-icons/io";

import { Modal } from "../component/Modal";

import { useNavigate } from "react-router-dom";

function Setting(props) {
	const navigate = useNavigate();

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
	// useEffect(() => {
	// 	console.log(updatedImg);
	// });

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
			throw new Error("Token is not available");
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

	const addAchiveLink = (link) => {
		setAchiveLink([...achiveLink, link]);
	};

	const handleLinkClick = (url) => {
		window.open(url, "_blank");
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
			<div
				style={{
					justifyContent: "center",
					display: "flex",
					flexDirection: "row",
					marginBottom: 30,
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
						// backgroundColor: "yellow",
						display: "flex",
						// margin: "auto",
					}}
				>
					<IoMdRibbon size={30} color="#FFD550" />
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
					{achiveLink.length !== 0 || achiveFile.length !== 0 ? (
						<div>
							{achiveLink.length !== 0 &&
								achiveLink.map((a, index) => <div key={index}>{a}</div>)}
							{achiveFile.length !== 0 &&
								achiveFile.map((a, index) => <div key={index}>{a}</div>)}
						</div>
					) : (
						<>
							{inputLink.length !== 0 || inputFile.length !== 0 ? (
								<>
									{/* <div> */}
									{inputLink.length !== 0 &&
										inputLink.map((slink, index) => (
											<div key={index}>
												<a
													href="https://www.youtube.com/watch?v=hJvjPKXRqCI"
													target="_blank"
													rel="noopener noreferrer"
												>
													{/* <button
														className="achive-file-selector-button"
														onClick={() => handleLinkClick(slink)}
													>
														{slink}
													</button> */}
													{slink}
												</a>
											</div>
										))}
									{/* </div> */}
								</>
							) : (
								<div>등록된 성과물이 없습니다 ! </div>
							)}
						</>
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
								onClick={openModal}
							>
								링크 업로드
							</button>
							<Modal
								isOpen={isModalOpen}
								onClose={closeModal}
								onSave={addAchiveLink}
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
		</div>
	);
}

export default Setting;
