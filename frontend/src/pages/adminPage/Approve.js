import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiArrowLeftCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AdminApprove.css";
function Approve() {
	const [inputcode, setInputcode] = useState("");
	const [inputNickname, setInputNickname] = useState("");
	const [inputEmail, setInputEmail] = useState("");
	const [inputPw, setInputPw] = useState("");
	const [inputPhone, setInputPhone] = useState("");

	const [checkNickname, setCheckNickname] = useState("");
	const [isBlank, setIsBlank] = useState(false);
	const [isClickEmail, setIsClickEmail] = useState(false);

	const [isValidEmail, setIsValidEmail] = useState(false);
	const navigate = useNavigate();

	const emailRegEx =
		/^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
	const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

	// const isEmailForm = emailRegEx.test(inputEmail);
	const isPwForm = inputPw.match(passwordRegEx);

	const handleEmailsend = async () => {
		const isEmailForm = emailRegEx.test(inputEmail);
		if (!isEmailForm) {
			alert("유효한 이메일을 입력해주세요");
			setInputEmail("");
		} else {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/manager/send_identification_code/",
					{ inputEmail: inputEmail }
				);
				console.log(response.data.message);
				localStorage.setItem("email_code", response.data.message);
			} catch (error) {
				console.error("Error registering admin:", error);
			}
		}
	};

	const handleEmailcheck = async () => {
		try {
			const true_email_code = localStorage.getItem("email_code");
			if (true_email_code) {
				const response = await axios.post(
					"http://localhost:8000/api/manager/check_identification_code/",
					{ inputcode: inputcode, true_email_code: true_email_code }
				);
				if (response.data.result === "success") {
					setIsValidEmail(true);
				} else {
					setIsValidEmail(false);
					setInputcode("");
				}
				setIsClickEmail(true);
				console.log(response.data.result);
			}
		} catch (error) {
			console.error("Error registering admin:", error);
		}
	};

	const approveRequest = async () => {
		if (
			isValidEmail &&
			checkNickname === "사용가능한 닉네임 입니다." &&
			inputPhone !== "" &&
			inputPw !== "" &&
			isPwForm
		) {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/manager/request_admin_approve/",
					{
						inputNickname: inputNickname,
						inputPw: inputPw,
						inputEmail: inputEmail,
						inputPhone: inputPhone,
					}
				);

				if (response.data.message === "success") {
					navigate("/manager");
				}
				localStorage.removeItem("email_code");
			} catch (error) {
				console.error("Error registering admin:", error);
			}
		} else {
			setIsBlank(true);
			if (
				checkNickname === "이미 존재하는 닉네임 입니다." ||
				inputNickname.split(" ").join("") === ""
			) {
				setInputNickname("");
			} else if (!isValidEmail) {
				alert("이메일 인증을 완료해주세요.");
			}
		}
	};
	const hipenphon = (e) => {
		const phone = e.replace(/^(\d{3,4})(\d{4,5})(\d{4})$/, `$1-$2-$3`);

		setInputPhone(phone);
	};
	useEffect(() => {
		if (inputNickname.split(" ").join("") !== "") {
			incheckNickname();
		} else {
			setCheckNickname("");
		}
	}, [inputNickname]);

	useEffect(() => {
		console.log(inputNickname);
		console.log(isBlank);
	});

	const incheckNickname = async () => {
		try {
			const nickname = inputNickname.split(" ").join("");
			const response = await axios.post(
				"http://localhost:8000/api/manager/approve_nickname_check/",
				{ inputNickname: nickname }
			);

			if (response.data) {
				const check_result = response.data.message;
				setCheckNickname(check_result);
			}
		} catch (error) {
			console.log(error);
		}
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
					width: 600,
					height: 610,
					borderRadius: 30,
					paddingRight: 80,
					paddingLeft: 80,
					display: "flex",
					flexDirection: "column",
					// justifyContent: "center",
					alignItems: "center",
					backgroundColor: "white",
					position: "relative",
				}}
			>
				<Link to="/manager">
					<RiArrowLeftCircleFill
						size={30}
						style={{ top: 15, left: 15, position: "absolute" }}
					/>
				</Link>
				<div
					style={{
						fontSize: 25,
						margin: 30,
						padding: 10,
					}}
				>
					Admin Approve
				</div>
				<div className="approve_input-container">
					<input
						className="input_input"
						type="text"
						autocomplete="off"
						id="nickname"
						required
						value={inputNickname}
						onChange={(e) => setInputNickname(e.target.value)}
					/>
					<label
						htmlFor="nickname"
						className={isBlank && inputNickname === "" ? "label_red" : "label"}
					>
						닉네임
					</label>
					<div
						className={
							isBlank && inputNickname === ""
								? "underline_red"
								: "underline_black"
						}
					></div>
				</div>
				{/* <input
					type="text"
					name="nickname"
					style={{
						border:
							isBlank && inputNickname === ""
								? "1px solid red"
								: "1px solid black",
					}}
					value={inputNickname}
					onChange={(e) => setInputNickname(e.target.value)}
				/> */}
				{checkNickname !== "" && (
					<div
						style={{
							fontSize: 13,
							color:
								checkNickname === "사용가능한 닉네임 입니다." ? "green" : "red",
						}}
					>
						{checkNickname}
					</div>
				)}
				{/* <div>
					비밀번호:{" "}
					<input
						type="password"
						name="pw"
						style={{
							border:
								isBlank && (inputPw === "" || !isPwForm)
									? "1px solid red"
									: "1px solid black",
						}}
						value={inputPw}
						onChange={(e) => setInputPw(e.target.value)}
					/>
				</div> */}
				<div className="approve_input-container">
					<input
						className="input_input"
						type="password"
						autocomplete="off"
						id="pw"
						// style={{
						// 	borderBottom:
						// 		isBlank && (inputPw === "" || !isPwForm)
						// 			? "1px solid red"
						// 			: "1px solid black",
						// }}
						required
						value={inputPw}
						onChange={(e) => setInputPw(e.target.value)}
					/>
					<label
						htmlFor="pw"
						className={
							isBlank && (inputPw === "" || !isPwForm) ? "label_red" : "label"
						}
					>
						비밀번호
					</label>
					<div
						className={
							isBlank && (inputPw === "" || !isPwForm)
								? "underline_red"
								: "underline_black"
						}
						// style={{
						// 	borderBottom:
						// 		isBlank && (inputPw === "" || !isPwForm)
						// 			? "2px solid red"
						// 			: "2px solid black",
						// }}
					></div>
				</div>
				{inputPw !== "" && (
					<div style={{ fontSize: 13, color: isPwForm ? "green" : "red" }}>
						영문 대소문자, 숫자,특수문자를 혼합하여 8~20자로 입력해주세요
					</div>
				)}
				{/* <div>
					전화번호:{" "}
					<input
						type="text"
						name="phone"
						style={{
							border:
								isBlank && inputPhone === ""
									? "1px solid red"
									: "1px solid black",
						}}
						value={inputPhone}
						onChange={(e) => hipenphon(e.target.value)}
					/>
				</div> */}
				<div className="approve_input-container">
					<input
						className="input_input"
						type="text"
						autocomplete="off"
						id="phone"
						required
						value={inputPhone}
						onChange={(e) => hipenphon(e.target.value)}
					/>
					<label
						htmlFor="phone"
						className={isBlank && inputPhone === "" ? "label_red" : "label"}
					>
						전화번호
					</label>
					<div
						className={
							isBlank && inputPhone === "" ? "underline_red" : "underline_black"
						}
					></div>
				</div>
				<div style={{ display: "flex", flexDirection: "row" }}>
					{/* 이메일:{" "}
					<input
						type="text"
						name="email"
						style={{
							border:
								isBlank && inputEmail === ""
									? "1px solid red"
									: "1px solid black",
						}}
						value={inputEmail}
						onChange={(e) => setInputEmail(e.target.value)}
					/> */}
					<div className="approve_input-container" style={{ width: 250 }}>
						<input
							className="input_input"
							type="text"
							autocomplete="off"
							id="email"
							required
							value={inputEmail}
							onChange={(e) => setInputEmail(e.target.value)}
						/>
						<label
							htmlFor="email"
							className={isBlank && inputEmail === "" ? "label_red" : "label"}
						>
							이메일
						</label>
						<div
							className={
								isBlank && inputEmail === ""
									? "underline_red"
									: "underline_black"
							}
						></div>
					</div>

					<button
						style={{
							borderRadius: 10,
							backgroundColor: "transparent",
							border: "2px solid royalblue",
							width: 85,
							marginLeft: 15,
							marginTop: 33,
							height: 35,
							fontSize: 14,
							color: "royalblue",
						}}
						onClick={handleEmailsend}
					>
						인증 요청
					</button>
				</div>
				<div
					style={{
						width: 350,
						display: "flex",
						flexDirection: "row",
						justifyContent: "end",
						// alignItems: "flex-end",
						// textAlign: "right",
					}}
				>
					{/* <input
						type="text"
						value={inputcode}
						style={{
							border:
								isBlank && !isValidEmail ? "1px solid red" : "1px solid black",
						}}
						onChange={(e) => setInputcode(e.target.value)}
						placeholder="인증 코드"
					/> */}
					<div className="approve_input-container" style={{ width: 200 }}>
						<input
							className="input_input"
							type="text"
							autocomplete="off"
							id="code"
							required
							value={inputcode}
							onChange={(e) => setInputcode(e.target.value)}
						/>
						<label
							htmlFor="code"
							className={isBlank && !isValidEmail ? "label_red" : "label"}
						>
							인증 코드
						</label>
						<div
							className={
								isBlank && !isValidEmail ? "underline_red" : "underline_black"
							}
						></div>
					</div>

					<button
						style={{
							borderRadius: 10,
							backgroundColor: "royalblue",
							border: "none",
							width: 85,
							marginLeft: 15,
							marginTop: 33,
							height: 35,
							fontSize: 14,
							color: "white",
						}}
						onClick={handleEmailcheck}
					>
						확인
					</button>
				</div>
				{isClickEmail && (
					<>
						{isValidEmail ? (
							<div style={{ color: "green", fontSize: 13 }}>
								이메일 인증이 완료되었습니다.{" "}
							</div>
						) : (
							<div style={{ color: "red", fontSize: 13 }}>
								이메일 인증에 실패하였습니다.
							</div>
						)}
					</>
				)}
				<button className="AdminApprove_Btn" onClick={approveRequest}>
					승인 요청
				</button>
			</div>
		</div>
	);
}

export default Approve;
