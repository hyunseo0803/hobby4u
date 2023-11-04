import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import "../../styles/AdminLogin.css";
import HorizonLine from "../../common/HorizonLine";
function AdminLogin(props) {
	const [inputNickname, setInputNickname] = useState("");
	const [inputPw, setInputPw] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { getAdminData } = props;

	const navigate = useNavigate();
	const adminLogin = async () => {
		if (inputNickname === "" || inputPw === "") {
			setErrorMessage("아이디와 비밀번호를 입력해 주세요.");
		} else {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/manager/login_admin/",
					{
						inputNickname: inputNickname,
						inputPw: inputPw,
					}
				);

				if (response.data.jwt_token) {
					localStorage.setItem("manager", response.data.jwt_token);
					await getAdminData();
					navigate("/manager");
				} else {
					setErrorMessage(response.data.message);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const linktoapprove = () => {
		navigate("approve");
	};

	return (
		<div
			style={{
				backgroundColor: "#e8e8e8",
				width: "100%",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: 550,
					height: 500,
					borderRadius: 30,
					paddingRight: 80,
					paddingLeft: 80,
					display: "flex",
					flexDirection: "column",
					// justifyContent: "center",
					alignItems: "center",
					backgroundColor: "white",
				}}
			>
				<div
					style={{
						fontSize: 25,
						margin: 30,
						padding: 10,
					}}
				>
					Admin
				</div>
				{/* <input
						type="text"
						value={inputNickname}
						onChange={(e) => setInputNickname(e.target.value)}
					/> */}
				<div className="input-container">
					<input
						className="input-input"
						type="text"
						id="inputid"
						autocomplete="off"
						required
						value={inputNickname}
						onChange={(e) => setInputNickname(e.target.value)}
					/>
					<label htmlFor="inputid" className="label">
						닉네임
					</label>
					<div className="underline"></div>
				</div>
				{/* <div>
					{" "}
					비밀번호:{" "}
					<input
						type="password"
						value={inputPw}
						onChange={(e) => setInputPw(e.target.value)}
					/>
				</div> */}
				<div className="input-container">
					<input
						className="input-input"
						// style={{ marginBottom: 20 }}
						type="password"
						id="inputpw"
						autocomplete="off"
						required
						value={inputPw}
						onChange={(e) => setInputPw(e.target.value)}
					/>
					<label htmlFor="inputpw" className="label">
						비밀번호
					</label>
					<div className="underline"></div>
				</div>
				{errorMessage && (
					<div style={{ width: 350, fontSize: 13, color: "red" }}>
						{errorMessage}
					</div>
				)}

				<button className="AdminLoginBtn" onClick={adminLogin}>
					Log in
				</button>
				<div style={{ marginTop: 20 }}>
					<HorizonLine text="Or" />
					{/* <div>
					신규 관리자 등록은 <Link to="approve">여기를</Link> 클릭해주세요
				</div> */}
					<button className="AdminApproveBtn" onClick={linktoapprove}>
						신규 관리자 등록
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdminLogin;
