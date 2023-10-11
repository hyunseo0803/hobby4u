import React from "react";
import { useEffect, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { IoMdRibbon } from "react-icons/io";

import { useNavigate } from "react-router-dom";

function Setting(props) {
	const navigate = useNavigate();

	const [achive, setAchive] = useState([]);

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
				setInputImg(file);
				setImagepreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		getUserData();
		getUserAchiv();
	}, []);

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
				setAchive(achive);
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};

	const handleSave = async () => {
		console.log(inputImg);

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
		setInputCheck(true);
	};

	return (
		<div className="wrap">
			<div style={{ display: "flex", flexDirection: "row", marginBottom: 30 }}>
				<div
					style={{
						justifyContent: "center",
						textAlign: "center",
						position: "relative",
					}}
				>
					<div className="user_img">
						{imagepreview !== "" ? (
							<img
								src={imagepreview}
								style={{
									objectFit: "contain",
									width: "100%",
									height: "100%",
								}}
								alt="preview-img"
							/>
						) : updatedImg ? (
							<img
								src={updatedImg}
								style={{
									objectFit: "contain",
									width: "100%",
									height: "100%",
								}}
								alt=""
							/>
						) : (
							<img
								src={inputImg}
								style={{
									objectFit: "contain",
									width: "100%",
									height: "100%",
								}}
								alt=""
							/>
						)}
					</div>
					{inputCheck && (
						<>
							<label className="component_row_wrapper" htmlFor="ex_file">
								<div className="file-selector-button" width={100}>
									<p
										style={{
											textAlign: "center",
											padding: 3,
										}}
									>
										파일 선택
									</p>
								</div>
							</label>
							<input
								className="profileimg"
								id="ex_file"
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

				<div style={{ margin: 10 }}>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<input
							className="user_nickname"
							value={inputText.nickname}
							onChange={(e) =>
								setInputText({ ...inputText, nickname: e.target.value })
							}
							disabled={!inputCheck}
						/>
					</div>
					<div style={{ width: "80vh", height: 100, position: "relative" }}>
						<input
							className="user_nickname"
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
					borderTop: "1px solid gray",
					width: 1000,
					marginTop: 20,
					opacity: 0.5,
				}}
			></div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					// backgroundColor: "yellow",
					padding: 10,
					position: "relative",
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
						marginLeft: 10,
						padding: 5,
					}}
				>
					<input
						className="user_nickname"
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
					borderTop: "1px solid gray",
					width: 1000,
					// margin: 20,
					opacity: 0.5,
				}}
			></div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					// backgroundColor: "red",
					padding: 10,
					position: "relative",
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
					}}
				>
					<IoMdRibbon size={30} color="#FFD550" />
				</div>
				<div
					style={{
						width: "80vh",
						// backgroundColor: "blue",
						marginLeft: 10,
						padding: 5,
					}}
				>
					{achive.length !== 0 ? (
						achive.map((a, index) => <div key={index}>{a}</div>)
					) : (
						<div>등록된 성과물이 없습니다 ! </div>
					)}

					{inputCheck && <button>등록하기</button>}
				</div>
			</div>

			<div
				style={{
					borderTop: "1px solid gray",
					width: 1000,
					marginBottom: 80,
					opacity: 0.5,
				}}
			></div>
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
	);
}

export default Setting;
